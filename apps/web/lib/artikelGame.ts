import { getA1Vocabulary, type Article, type VocabularyWord } from "@german-coach/vocabulary";

export const ARTIKEL_OPTIONS: readonly Article[] = ["der", "die", "das"];
export const ARTIKEL_SESSION_SIZE = 15;

export function getArtikelNouns(): VocabularyWord[] {
  return getA1Vocabulary().words.filter(
    (w) => w.article === "der" || w.article === "die" || w.article === "das"
  );
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(((seed + i * 17) % 997) / 997 * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** cursor'dan başlayarak count isim seç; oturum içi karıştır */
export function pickArtikelSession(count: number, cursor: number): VocabularyWord[] {
  const pool = getArtikelNouns();
  if (pool.length === 0) return [];
  const start = ((cursor % pool.length) + pool.length) % pool.length;
  const slice: VocabularyWord[] = [];
  for (let i = 0; i < count; i++) {
    slice.push(pool[(start + i) % pool.length]);
  }
  return shuffleWithSeed(slice, cursor);
}

export function articleOptionIndex(article: Article): number {
  return ARTIKEL_OPTIONS.indexOf(article);
}

export function parseArtikelKey(key: string): Article | null {
  const k = key.toLowerCase();
  if (k === "1" || k === "d") return "der";
  if (k === "2" || k === "i") return "die";
  if (k === "3" || k === "a") return "das";
  return null;
}
