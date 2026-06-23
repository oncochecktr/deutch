import { ChatProviderError } from "./types";

interface GeminiResponseLike {
  text?: () => string;
  candidates?: Array<{
    finishReason?: string;
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

/** Gemini yanıt metnini güvenli çıkar */
export function extractGeminiResponseText(response: GeminiResponseLike): {
  text: string;
  finishReason?: string;
  blockReason?: string;
} {
  const candidate = response.candidates?.[0];
  const finishReason = candidate?.finishReason;
  const blockReason = candidate?.finishReason === "SAFETY" ? "SAFETY" : undefined;

  let text = "";
  try {
    text = response.text?.()?.trim() ?? "";
  } catch {
    /* text() bazen boş adayda hata verir */
  }

  if (!text && candidate?.content?.parts) {
    text = candidate.content.parts
      .map((p) => ("text" in p && typeof p.text === "string" ? p.text : ""))
      .join("")
      .trim();
  }

  return { text, finishReason, blockReason };
}

export function geminiEmptyResponseError(
  finishReason?: string,
  modelName?: string
): ChatProviderError {
  const isPro = modelName?.includes("pro");
  let detail = finishReason ? `finishReason=${finishReason}` : "boş candidates";
  let message = "Model yanıt vermedi.";

  if (finishReason === "MAX_TOKENS") {
    message = "Model cevabı token limitinde kesildi — tekrar dene.";
    if (isPro) {
      detail += " Pro düşünme token tüketir; GEMINI_MODEL=gemini-2.5-flash önerilir.";
    }
  } else if (finishReason === "SAFETY") {
    message = "Model güvenlik filtresine takıldı — cümleyi sadeleştir.";
  } else if (isPro) {
    detail += " Pro model bazen boş döner — flash daha kararlı.";
  }

  return new ChatProviderError(message, 502, "gemini", detail);
}
