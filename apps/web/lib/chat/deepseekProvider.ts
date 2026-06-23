import { estimateTokenCostUsd, estimateTokensFromText } from "@/lib/speakApiUsage";
import { getLessonById } from "@/lib/speakCurriculum";
import { buildLessonContext, getSpeakSystemPrompt, parseChatResponse } from "@/lib/speakPrompts";
import type { ApiUsageInfo } from "@/lib/speakTypes";
import { CHAT_HISTORY_LIMIT, ChatProviderError, type ChatAuthOverride, type ChatCompletionInput, type ChatProviderConfig } from "./types";
import { resolveApiKeyForProvider } from "./auth";
import {
  PROFESSOR_CONNECTION_ERROR,
  PROFESSOR_INVALID_API_KEY,
  PROFESSOR_MISSING_API_KEY,
  PROFESSOR_QUOTA_EXCEEDED,
  PROFESSOR_RATE_LIMIT,
  PROFESSOR_RESPONSE_ERROR,
  PROFESSOR_UNAVAILABLE,
} from "@/lib/professorMessages";

const DEFAULT_MODEL = "deepseek-chat";
const API_BASE = "https://api.deepseek.com";
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1200;
const JSON_RETRY_NOTE =
  "\n\n[ZORUNLU: Yanıtın YALNIZCA geçerli JSON object olsun — markdown, yıldız (*), düz metin YASAK.]";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveLessonContext(input: ChatCompletionInput): string | null {
  if (!input.lessonId) return null;
  const lesson = getLessonById(input.lessonId);
  if (!lesson) return null;
  return buildLessonContext(lesson, input.lessonStepIndex ?? 0);
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function getDeepseekConfig(auth?: ChatAuthOverride): ChatProviderConfig {
  const apiKey = resolveApiKeyForProvider("deepseek", auth);
  if (!apiKey) {
    throw new ChatProviderError(PROFESSOR_MISSING_API_KEY, 503, "deepseek");
  }
  return {
    id: "deepseek",
    model: process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL,
  };
}

interface DeepseekChatResponse {
  choices?: Array<{
    message?: { content?: string | null; reasoning_content?: string };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: { message?: string; type?: string };
}

function extractDeepseekText(data: DeepseekChatResponse): string {
  const message = data.choices?.[0]?.message;
  return (message?.content ?? message?.reasoning_content ?? "").trim();
}

async function callDeepseekChat(
  apiKey: string,
  baseUrl: string,
  model: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  temperature: number
): Promise<{ data: DeepseekChatResponse; response: Response }> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: { type: "json_object" },
      max_tokens: 2048,
      temperature,
    }),
  });

  let data: DeepseekChatResponse;
  try {
    data = (await response.json()) as DeepseekChatResponse;
  } catch {
    throw new ChatProviderError(PROFESSOR_RESPONSE_ERROR, 502, "deepseek");
  }

  return { data, response };
}

function buildUsage(
  model: string,
  data: DeepseekChatResponse,
  input: ChatCompletionInput,
  history: ChatCompletionInput["history"],
  text: string
): ApiUsageInfo {
  const promptTokens = data.usage?.prompt_tokens ?? 0;
  const completionTokens = data.usage?.completion_tokens ?? 0;
  const usage: ApiUsageInfo = {
    promptTokens,
    completionTokens,
    totalTokens: data.usage?.total_tokens ?? promptTokens + completionTokens,
    estimatedCostUsd: estimateTokenCostUsd(model, promptTokens, completionTokens),
    model,
  };

  if (!usage.totalTokens) {
    const est = estimateTokensFromText(model, input.message + JSON.stringify(history), text, "deepseek");
    usage.promptTokens = est.promptTokens;
    usage.completionTokens = est.completionTokens;
    usage.totalTokens = est.totalTokens;
    usage.estimatedCostUsd = est.estimatedCostUsd;
  }

  return usage;
}

export async function completeWithDeepseek(input: ChatCompletionInput, auth?: ChatAuthOverride) {
  const apiKey = resolveApiKeyForProvider("deepseek", auth);
  if (!apiKey) {
    throw new ChatProviderError(PROFESSOR_MISSING_API_KEY, 503, "deepseek");
  }

  const model = process.env.DEEPSEEK_MODEL?.trim() || DEFAULT_MODEL;
  const history = input.history.slice(-CHAT_HISTORY_LIMIT);
  const baseUrl = process.env.DEEPSEEK_API_BASE?.trim() || API_BASE;

  const systemPrompt = getSpeakSystemPrompt(
    input.level,
    input.inputLanguage,
    resolveLessonContext(input),
    input.studentProfile
  );

  const baseMessages = [
    ...history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user" as const, content: input.message.trim() },
  ];

  let lastParseDetail = "DeepSeek yanıtı işlenemedi.";

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const temperature = attempt === 0 ? 0.7 : 0.3;
    const userSuffix = attempt > 0 ? JSON_RETRY_NOTE : "";
    const messages = [
      {
        role: "system" as const,
        content: attempt > 0 ? `${systemPrompt}${JSON_RETRY_NOTE}` : systemPrompt,
      },
      ...baseMessages.slice(0, -1),
      {
        role: "user" as const,
        content: `${input.message.trim()}${userSuffix}`,
      },
    ];

    let data: DeepseekChatResponse;
    let response: Response;
    try {
      ({ data, response } = await callDeepseekChat(apiKey, baseUrl, model, messages, temperature));
    } catch (err) {
      if (err instanceof ChatProviderError) throw err;
      throw new ChatProviderError(
        PROFESSOR_CONNECTION_ERROR,
        503,
        "deepseek",
        errorText(err).slice(0, 200)
      );
    }

    const apiMessage = data.error?.message ?? "";
    if (response.status === 429) {
      throw new ChatProviderError(PROFESSOR_RATE_LIMIT, 429, "deepseek", apiMessage.slice(0, 300));
    }
    if (response.status === 401 || response.status === 403) {
      throw new ChatProviderError(PROFESSOR_INVALID_API_KEY, 503, "deepseek", apiMessage.slice(0, 200));
    }
    if (response.status === 402 || apiMessage.toLowerCase().includes("insufficient balance")) {
      throw new ChatProviderError(
        PROFESSOR_QUOTA_EXCEEDED,
        503,
        "deepseek",
        apiMessage.slice(0, 300)
      );
    }
    if (!response.ok) {
      throw new ChatProviderError(PROFESSOR_UNAVAILABLE, 502, "deepseek", apiMessage.slice(0, 300) || `HTTP ${response.status}`);
    }

    const finishReason = data.choices?.[0]?.finish_reason ?? "unknown";
    const text = extractDeepseekText(data);
    if (!text) {
      lastParseDetail = `finish_reason=${finishReason}, tokens=${data.usage?.total_tokens ?? "?"}`;
      console.warn(`[chat] DeepSeek empty content, attempt ${attempt + 1}/${MAX_ATTEMPTS}`, lastParseDetail);
      if (attempt < MAX_ATTEMPTS - 1) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
      throw new ChatProviderError(PROFESSOR_RESPONSE_ERROR, 502, "deepseek", lastParseDetail);
    }

    try {
      const parsed = parseChatResponse(text);
      return { ...parsed, usage: buildUsage(model, data, input, history, text) };
    } catch (err) {
      lastParseDetail = text.slice(0, 200);
      if (err instanceof SyntaxError || err instanceof Error) {
        console.warn(`[chat] DeepSeek parse failed, attempt ${attempt + 1}/${MAX_ATTEMPTS}`);
        if (attempt < MAX_ATTEMPTS - 1) {
          await sleep(RETRY_DELAY_MS * (attempt + 1));
          continue;
        }
      }
      throw new ChatProviderError(PROFESSOR_RESPONSE_ERROR, 502, "deepseek", lastParseDetail);
    }
  }

  throw new ChatProviderError(PROFESSOR_RESPONSE_ERROR, 502, "deepseek", lastParseDetail);
}
