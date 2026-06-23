import { GoogleGenerativeAI } from "@google/generative-ai";

import { estimateTokenCostUsd, estimateTokensFromText } from "@/lib/speakApiUsage";

import { getLessonById } from "@/lib/speakCurriculum";

import { buildLessonContext, getSpeakSystemPrompt, parseChatResponse } from "@/lib/speakPrompts";

import type { ApiUsageInfo } from "@/lib/speakTypes";

import { extractGeminiResponseText, geminiEmptyResponseError } from "./geminiExtract";

import { CHAT_HISTORY_LIMIT, ChatProviderError, type ChatAuthOverride, type ChatCompletionInput, type ChatProviderConfig } from "./types";
import { resolveApiKeyForProvider } from "./auth";



const FALLBACK_MODEL = "gemini-2.5-flash";

const MAX_ATTEMPTS_PER_MODEL = 2;

const RETRY_DELAY_MS = 2000;



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



function isTransientGeminiError(err: unknown): boolean {

  const lower = errorText(err).toLowerCase();

  return (

    lower.includes("fetch failed") ||

    lower.includes("failed to fetch") ||

    lower.includes("network") ||

    lower.includes("econnreset") ||

    lower.includes("etimedout") ||

    lower.includes("socket hang up") ||

    lower.includes("503") ||

    lower.includes("502") ||

    lower.includes("unavailable") ||

    lower.includes("deadline exceeded")

  );

}



function isRateLimitError(err: unknown): boolean {
  const lower = errorText(err).toLowerCase();
  return (
    lower.includes("429") ||
    lower.includes("resource_exhausted") ||
    lower.includes("quota")
  );
}



function mapGeminiError(err: unknown, modelTried?: string): ChatProviderError {

  const text = errorText(err);

  const lower = text.toLowerCase();

  const modelHint = modelTried ? ` (model: ${modelTried})` : "";



  if (
    lower.includes("429") ||
    lower.includes("resource_exhausted") ||
    lower.includes("quota")
  ) {
    const isRpm =
      lower.includes("requests") ||
      lower.includes("rpm") ||
      lower.includes("rate");
    return new ChatProviderError(
      isRpm
        ? "Dakikalık istek limiti (RPM) aşıldı — birkaç saniye bekleyip tekrar deneyin."
        : "Gemini API kotası/limiti doldu. AI Studio’da Billing ve Usage Tier kontrol edin.",
      429,
      "gemini",
      text.slice(0, 400)
    );
  }

  if (lower.includes("404") && lower.includes("model")) {

    return new ChatProviderError(

      "Model bulunamadı. .env.local içinde GEMINI_MODEL=gemini-2.5-flash yapın ve stop.bat → start.bat --rebuild.",

      503,

      "gemini",

      text.slice(0, 300)

    );

  }

  if (

    lower.includes("401") ||

    lower.includes("403") ||

    lower.includes("api key not valid") ||

    lower.includes("api_key_invalid") ||

    (lower.includes("api key") && lower.includes("invalid"))

  ) {

    return new ChatProviderError("API anahtarı geçersiz veya yetkisiz.", 503, "gemini", text);

  }

  if (lower.includes("400") || lower.includes("bad request")) {

    return new ChatProviderError(

      "Gemini isteği reddedildi — model ayarı veya parametre hatası.",

      502,

      "gemini",

      text.slice(0, 300)

    );

  }

  if (isTransientGeminiError(err)) {

    return new ChatProviderError(

      "Google API'ye bağlanılamadı (ağ kesintisi veya zaman aşımı). Tekrar dene; devam ederse GEMINI_MODEL=gemini-2.5-flash kullan.",

      503,

      "gemini",

      `${text.slice(0, 180)}${modelHint}`

    );

  }

  return new ChatProviderError(

    "Konuşma partneri şu an kullanılamıyor.",

    500,

    "gemini",

    `${text.slice(0, 180)}${modelHint}`

  );

}



export function getGeminiConfig(auth?: ChatAuthOverride): ChatProviderConfig {

  const apiKey = resolveApiKeyForProvider("gemini", auth);

  if (!apiKey) {

    throw new ChatProviderError(

      "GEMINI_API_KEY yapılandırılmamış.",

      503,

      "gemini"

    );

  }

  return {

    id: "gemini",

    model: process.env.GEMINI_MODEL?.trim() || FALLBACK_MODEL,

  };

}



async function runGeminiChat(modelName: string, input: ChatCompletionInput, auth?: ChatAuthOverride) {

  const apiKey = resolveApiKeyForProvider("gemini", auth);

  if (!apiKey) {

    throw new ChatProviderError("GEMINI_API_KEY yapılandırılmamış.", 503, "gemini");

  }



  const history = input.history.slice(-CHAT_HISTORY_LIMIT);

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({

    model: modelName,

    systemInstruction: getSpeakSystemPrompt(

      input.level,

      input.inputLanguage,

      resolveLessonContext(input),

      input.studentProfile

    ),

    generationConfig: {

      responseMimeType: "application/json",

      maxOutputTokens: modelName.includes("pro") ? 4096 : 2048,

    },

  });



  const geminiHistory = history.map((h) => ({

    role: h.role === "assistant" ? ("model" as const) : ("user" as const),

    parts: [{ text: h.content }],

  }));



  const chat = model.startChat({ history: geminiHistory });

  const result = await chat.sendMessage(input.message.trim());

  const { text, finishReason } = extractGeminiResponseText(result.response);



  if (!text) {

    throw geminiEmptyResponseError(finishReason, modelName);

  }



  const parsed = parseChatResponse(text);

  const meta = result.response.usageMetadata;

  const promptTokens = meta?.promptTokenCount ?? 0;

  const completionTokens = meta?.candidatesTokenCount ?? 0;

  const usage: ApiUsageInfo = {

    promptTokens,

    completionTokens,

    totalTokens: promptTokens + completionTokens,

    estimatedCostUsd: estimateTokenCostUsd(modelName, promptTokens, completionTokens),

    model: modelName,

  };



  if (!usage.totalTokens) {

    const est = estimateTokensFromText(

      modelName,

      input.message + JSON.stringify(history),

      text,

      "gemini"

    );

    usage.promptTokens = est.promptTokens;

    usage.completionTokens = est.completionTokens;

    usage.totalTokens = est.totalTokens;

    usage.estimatedCostUsd = est.estimatedCostUsd;

  }



  return { ...parsed, usage };

}



export async function completeWithGemini(input: ChatCompletionInput, auth?: ChatAuthOverride) {

  const primary = process.env.GEMINI_MODEL?.trim() || FALLBACK_MODEL;

  const models =

    primary === FALLBACK_MODEL || primary === "gemini-2.5-flash"

      ? [primary]

      : [primary, FALLBACK_MODEL];



  let lastError: unknown = new Error("Gemini isteği başarısız.");



  for (const modelName of models) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_MODEL; attempt++) {
      try {
        if (modelName !== primary) {
          console.warn(`[chat] fallback model: ${modelName}`);
        }
        return await runGeminiChat(modelName, input, auth);

      } catch (err) {
        lastError = err;

        if (err instanceof ChatProviderError) {
          if (err.status === 503 && err.message.includes("API anahtarı")) throw err;
        }

        if (isRateLimitError(err) || (err instanceof ChatProviderError && err.status === 429)) {
          lastError = err instanceof ChatProviderError ? err : mapGeminiError(err, modelName);
          console.warn(`[chat] rate limit on ${modelName}, attempt ${attempt + 1}/${MAX_ATTEMPTS_PER_MODEL}`);
          if (attempt < MAX_ATTEMPTS_PER_MODEL - 1) {
            await sleep(RETRY_DELAY_MS * (attempt + 2) * 2);
            continue;
          }
          break;
        }

        if (err instanceof SyntaxError) {

          throw new ChatProviderError(

            "Model yanıtı işlenemedi (JSON).",

            502,

            "gemini",

            err.message

          );

        }

        const retryable =

          isTransientGeminiError(err) ||

          (err instanceof ChatProviderError && err.status === 502);

        if (retryable && attempt < MAX_ATTEMPTS_PER_MODEL - 1) {

          await sleep(RETRY_DELAY_MS * (attempt + 1));

          continue;

        }

        break;

      }

    }

  }



  if (lastError instanceof ChatProviderError) throw lastError;

  throw mapGeminiError(lastError, models.join(" → "));

}


