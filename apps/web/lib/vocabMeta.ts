import type { VocabularyWord } from "@german-coach/vocabulary";

/** Goethe A1 çekirdek — yüksek öncelikli kelimeler */
export const A1_CRITICAL_WORDS = new Set([
  "Hallo",
  "Tschüss",
  "Tschüs",
  "Bitte",
  "Danke",
  "Ja",
  "Nein",
  "Entschuldigung",
  "Guten Morgen",
  "Guten Tag",
  "Guten Abend",
  "Gute Nacht",
  "Auf Wiedersehen",
  "Wie geht es Ihnen?",
  "Wie geht es dir?",
  "Freut mich",
]);

export function isCriticalWord(word: VocabularyWord): boolean {
  const tags = word.tags ?? [];
  return A1_CRITICAL_WORDS.has(word.word) || tags.includes("core");
}

export function getWordKindLabel(word: VocabularyWord): string {
  const tags = word.tags ?? [];
  if (word.article) return "İsim";
  if (tags.includes("greeting") || word.category === "Selamlama") return "İfade";
  if (tags.includes("verb")) return "Fiil";
  if (tags.includes("adjective")) return "Sıfat";
  return "Kelime";
}

/** "lütfen / rica ederim" → ayrı satırlar */
export function splitMeanings(text: string | undefined | null): string[] {
  if (!text) return ["—"];
  return text
    .split(/\s*[\/|]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** "Bitte schön! · Danke!" → çoklu örnek */
export function splitExamples(de: string | undefined | null, tr: string | undefined | null): { de: string; tr: string }[] {
  const deText = de ?? "";
  const trText = tr ?? "";
  const deParts = deText.split(/\s*·\s*|\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
  const trParts = trText.split(/\s*·\s*|\s*\|\s*/).map((s) => s.trim()).filter(Boolean);
  if (deParts.length <= 1) {
    return [{ de: deText || "—", tr: trText }];
  }
  return deParts.map((part, i) => ({
    de: part,
    tr: trParts[i] ?? trParts[trParts.length - 1] ?? "",
  }));
}
