import Anthropic from "@anthropic-ai/sdk";
import { estimateTokensFromText } from "@/lib/speakApiUsage";
import { getLessonById } from "@/lib/speakCurriculum";
import { buildLessonContext, getSpeakSystemPrompt, parseChatResponse } from "@/lib/speakPrompts";
import type { ApiUsageInfo } from "@/lib/speakTypes";
import { CHAT_HISTORY_LIMIT, ChatProviderError, type ChatAuthOverride, type ChatCompletionInput, type ChatProviderConfig } from "./types";
import { resolveApiKeyForProvider } from "./auth";

function resolveLessonContext(input: ChatCompletionInput): string | null {
  if (!input.lessonId) return null;
  const lesson = getLessonById(input.lessonId);
  if (!lesson) return null;
  return buildLessonContext(lesson, input.lessonStepIndex ?? 0);
}

export function getAnthropicConfig(auth?: ChatAuthOverride): ChatProviderConfig {
  const apiKey = resolveApiKeyForProvider("anthropic", auth);
  if (!apiKey) {
    throw new ChatProviderError(
      "ANTHROPIC_API_KEY yapılandırılmamış.",
      503,
      "anthropic"
    );
  }
  return {
    id: "anthropic",
    model: process.env.CLAUDE_MODEL?.trim() || "claude-sonnet-4-6",
  };
}

export async function completeWithAnthropic(input: ChatCompletionInput, auth?: ChatAuthOverride) {
  const apiKey = resolveApiKeyForProvider("anthropic", auth);
  if (!apiKey) {
    throw new ChatProviderError("ANTHROPIC_API_KEY yapılandırılmamış.", 503, "anthropic");
  }

  const model = process.env.CLAUDE_MODEL?.trim() || "claude-sonnet-4-6";
  const history = input.history.slice(-CHAT_HISTORY_LIMIT);
  const anthropic = new Anthropic({ apiKey });

  const messages = [
    ...history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user" as const, content: input.message.trim() },
  ];

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      system: getSpeakSystemPrompt(
        input.level,
        input.inputLanguage,
        resolveLessonContext(input),
        input.studentProfile
      ),
      messages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new ChatProviderError("Model yanıt vermedi.", 502, "anthropic");
    }

    const parsed = parseChatResponse(textBlock.text);
    const usage: ApiUsageInfo = {
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      estimatedCostUsd: estimateTokensFromText(
        model,
        input.message,
        textBlock.text,
        "anthropic"
      ).estimatedCostUsd,
      model,
    };
    return { ...parsed, usage };
  } catch (err) {
    if (err instanceof ChatProviderError) throw err;

    const status = err instanceof Anthropic.APIError ? err.status : undefined;

    if (status === 429) {
      throw new ChatProviderError(
        "Rate limit aşıldı. Biraz bekleyip tekrar deneyin.",
        429,
        "anthropic"
      );
    }
    if (status === 401) {
      throw new ChatProviderError("API anahtarı geçersiz.", 503, "anthropic");
    }
    if (
      err instanceof Anthropic.APIError &&
      typeof err.message === "string" &&
      err.message.toLowerCase().includes("credit balance")
    ) {
      throw new ChatProviderError(
        "Anthropic hesabında yeterli kredi yok. Billing sayfasından kredi ekleyin.",
        503,
        "anthropic"
      );
    }
    if (err instanceof SyntaxError) {
      throw new ChatProviderError("Model yanıtı işlenemedi.", 502, "anthropic");
    }

    console.error("Anthropic chat hata:", err);
    throw new ChatProviderError("Konuşma partneri şu an kullanılamıyor.", 500, "anthropic");
  }
}
