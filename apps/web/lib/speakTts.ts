import { TTS_MAX_CHARS, TTS_MAX_CHARS_TR } from "./ttsConfig";

export type TtsSanitizeLang = "de" | "tr";

/** Markdown, emoji ve tahta kalıntılarını TTS için temizle */
export function sanitizeForTts(text: string, lang: TtsSanitizeLang = "tr"): string {
  let s = text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[-•*]\s+/gm, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  if (lang === "tr") {
    s = s
      .replace(/\([^)]*[äöüßÄÖÜ][^)]*\)/g, "")
      .replace(/"[^"]*[äöüßÄÖÜ][^"]*"/g, "")
      .replace(/\s+[-–—]\s+/g, ". ");
  }

  return s;
}

/** İlk N cümleyi al — TTS için doğal uzunluk */
export function takeSentences(text: string, maxSentences: number): string {
  const cleaned = sanitizeForTts(text);
  const parts = cleaned.match(/[^.!?…]+[.!?…]?/g)?.map((p) => p.trim()).filter(Boolean);
  if (!parts?.length) return cleaned;
  return parts.slice(0, maxSentences).join(" ").trim();
}

/** Seslendirme metnini kısalt — uzun tahta metni robotik duyulur */
export function trimForTts(text: string, max = TTS_MAX_CHARS, lang: TtsSanitizeLang = "de"): string {
  const cleaned = sanitizeForTts(text, lang);
  if (cleaned.length <= max) return cleaned;

  const sentences = cleaned.match(/[^.!?…]+[.!?…]?/g) ?? [cleaned];
  let out = "";
  for (const s of sentences) {
    const next = (out + s).trim();
    if (next.length > max) break;
    out = next;
  }
  if (out.length >= 40) return out;

  return `${cleaned.slice(0, max - 1).trim()}…`;
}

/** Tahta metninden Almanca parçayı ayır (TTS için) */
export function stripGermanFromTurkishReply(reply: string): string {
  const lines = reply.split(/\n+/).filter(Boolean);
  const trLines = lines.filter((line) => {
    const words = line.split(/\s+/).length;
    const deHits =
      (line.match(/\b(der|die|das|ich|du|und|ist|nicht|hallo|guten|mir|dir|wie|geht)\b/gi) ?? [])
        .length +
      (line.match(/[äöüßÄÖÜ]/g) ?? []).length;
    return deHits / Math.max(1, words) < 0.25;
  });
  return trLines.join(" ").trim() || reply;
}

export function buildTeacherSpeakText(
  reply: string,
  speakText: string | null | undefined,
  inputLanguage: "de" | "tr"
): string {
  const max = inputLanguage === "tr" ? TTS_MAX_CHARS_TR : TTS_MAX_CHARS;
  const lang: TtsSanitizeLang = inputLanguage;

  if (speakText?.trim()) {
    return trimForTts(takeSentences(speakText.trim(), 2), max, lang);
  }

  const base =
    inputLanguage === "tr" ? stripGermanFromTurkishReply(reply) : reply;
  return trimForTts(takeSentences(base, 2), max, lang);
}

/** Almanca profesör turu — selamlama + soru birleşimi */
export function trimGermanProfessorText(text: string): string {
  return trimForTts(text, TTS_MAX_CHARS, "de");
}
