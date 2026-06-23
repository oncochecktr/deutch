import Anthropic from "@anthropic-ai/sdk";
import { estimateTokensFromText } from "@/lib/speakApiUsage";
import { getLessonById } from "@/lib/speakCurriculum";
import { buildLessonContext, getSpeakSystemPrompt, parseChatResponse } from "@/lib/speakPrompts";
import type { ApiUsageInfo } from "@/lib/speakTypes";
import { CHAT_HISTORY_LIMIT, ChatProviderError, type ChatAuthOverride, type ChatCompletionInput, type ChatProviderConfig } from "./types";
import { resolveApiKeyForProvider } from "./auth";
import {
  PROFESSOR_INVALID_API_KEY,
  PROFESSOR_MISSING_API_KEY,
  PROFESSOR_QUOTA_EXCEEDED,
  PROFESSOR_RATE_LIMIT,
  PROFESSOR_RESPONSE_ERROR,
  PROFESSOR_UNAVAILABLE,
} from "@/lib/professorMessages";

function resolveLessonContext(input: ChatCompletionInput): string | null {
  if (!input.lessonId) return null;
  const lesson = getLessonById(input.lessonId);
  if (!lesson) return null;
  return buildLessonContext(lesson, input.lessonStepIndex ?? 0);
}

export function getAnthropicConfig(auth?: ChatAuthOverride): ChatProviderConfig {
  const apiKey = resolveApiKeyForProvider("anthropic", auth);
  if (!apiKey) {
    throw new ChatProviderError(PROFESSOR_MISSING_API_KEY, 503, "anthropic");
  }
  return {
    id: "anthropic",
    model: process.env.CLAUDE_MODEL?.trim() || "claude-sonnet-4-6",
  };
}

export async function completeWithAnthropic(input: ChatCompletionInput, auth?: ChatAuthOverride) {
  const apiKey = resolveApiKeyForProvider("anthropic", auth);
  if (!apiKey) {
    throw new ChatProviderError(PROFESSOR_MISSING_API_KEY, 503, "anthropic");
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
      throw new ChatProviderError(PROFESSOR_RESPONSE_ERROR, 502, "anthropic");
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
      throw new ChatProviderError(PROFESSOR_RATE_LIMIT, 429, "anthropic");
    }
    if (status === 401) {
      throw new ChatProviderError(PROFESSOR_INVALID_API_KEY, 503, "anthropic");
    }
    if (
      err instanceof Anthropic.APIError &&
      typeof err.message === "string" &&
      err.message.toLowerCase().includes("credit balance")
    ) {
      throw new ChatProviderError(PROFESSOR_QUOTA_EXCEEDED, 503, "anthropic");
    }
    if (err instanceof SyntaxError) {
      throw new ChatProviderError(PROFESSOR_RESPONSE_ERROR, 502, "anthropic");
    }

    console.error("Anthropic chat hata:", err);
    throw new ChatProviderError(PROFESSOR_UNAVAILABLE, 500, "anthropic");
  }
}
