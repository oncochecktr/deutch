import { getA1Vocabulary, getTimurVocabulary } from "@german-coach/vocabulary";
import { normalizeGermanText } from "./germanTextCompare";

function tokenize(text: string): string[] {
  return normalizeGermanText(text)
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function buildVocabIndex(): Map<string, string> {
  const index = new Map<string, string>();
  const allWords = [
    ...getA1Vocabulary().words,
    ...getTimurVocabulary().words,
  ];

  for (const w of allWords) {
    const normalized = normalizeGermanText(w.word);
    if (normalized && !index.has(normalized)) {
      index.set(normalized, w.id);
    }
    const withArticle = w.article
      ? normalizeGermanText(`${w.article} ${w.word}`)
      : "";
    if (withArticle && !index.has(withArticle)) {
      index.set(withArticle, w.id);
    }
  }
  return index;
}

let vocabIndex: Map<string, string> | null = null;

function getVocabIndex(): Map<string, string> {
  if (!vocabIndex) vocabIndex = buildVocabIndex();
  return vocabIndex;
}

/**
 * Konuşma düzeltmesini veya kullanıcı mesajını A1/mesleki kelime listesindeki
 * bir wordId ile eşleştir. Eşleşme yoksa null döner.
 */
export function mapSpeechCorrectionToWordId(
  correction: string | null,
  userMessage: string
): string | null {
  const index = getVocabIndex();
  const sources = [correction, userMessage].filter(Boolean) as string[];

  for (const source of sources) {
    const tokens = tokenize(source);
    let bestMatch: { id: string; len: number } | null = null;

    for (const token of tokens) {
      const id = index.get(token);
      if (id && (!bestMatch || token.length > bestMatch.len)) {
        bestMatch = { id, len: token.length };
      }
    }

    const fullNorm = normalizeGermanText(source);
    const fullId = index.get(fullNorm);
    if (fullId) return fullId;

    if (bestMatch) return bestMatch.id;
  }

  return null;
}
