import { normalizeAnswer } from "@/lib/speakExercise";
import { isWrittenAnswerMessage } from "@/lib/speakTypes";

export function stripUserMessage(message: string): string {
  if (isWrittenAnswerMessage(message)) {
    return message.replace(/^\[YAZILI CEVAP\]\s*/i, "").trim();
  }
  return message.replace(/\n\n\[SISTEM:[\s\S]*$/, "").trim();
}

export function hasAny(norm: string, ...parts: string[]): boolean {
  return parts.some((p) => norm.includes(normalizeAnswer(p)));
}

export function acceptsReady(norm: string): boolean {
  return hasAny(
    norm,
    "hazirim",
    "hazırım",
    "tamam",
    "ok",
    "bereit",
    "ich bin bereit",
    "ja",
    "evet"
  );
}
