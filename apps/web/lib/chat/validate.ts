import type { ChatRequestBody, SpeakInputLanguage, SpeakLevel } from "@/lib/speakTypes";

const LEVELS: SpeakLevel[] = ["A1", "A2", "B1"];
const INPUT_LANGS: SpeakInputLanguage[] = ["de", "tr"];

export function isValidChatBody(body: unknown): body is ChatRequestBody {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  if (typeof b.message !== "string" || !b.message.trim()) return false;
  if (!LEVELS.includes(b.level as SpeakLevel)) return false;
  if (
    b.inputLanguage !== undefined &&
    !INPUT_LANGS.includes(b.inputLanguage as SpeakInputLanguage)
  ) {
    return false;
  }
  if (!Array.isArray(b.history)) return false;
  return b.history.every(
    (h) =>
      h &&
      typeof h === "object" &&
      (h.role === "user" || h.role === "assistant") &&
      typeof h.content === "string"
  );
}
