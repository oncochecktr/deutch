import { getA1Vocabulary, type VocabularyWord } from "@german-coach/vocabulary";
import { formatWord } from "@/lib/audio";
import { approxGermanIpa } from "@/lib/germanIpa";

export interface SpiegelDisplay {
  id: string;
  tr: string;
  de: string;
  ipa: string;
  /** Küçük etiket — kategori veya aspect */
  tag?: string;
  wordLabel?: string;
  variations?: { tr: string; de: string }[];
}

export function wordToSpiegel(w: VocabularyWord): SpiegelDisplay {
  const display = formatWord(w.word, w.article);
  const de = w.example_de?.trim() || display;
  const tr = w.example_tr?.trim() || w.translation_tr;
  const variations: SpiegelDisplay["variations"] =
    display && de !== display ? [{ de: display, tr: w.translation_tr }] : undefined;

  return {
    id: w.id,
    tr,
    de: de.endsWith(".") || de.endsWith("?") ? de : `${de}.`,
    ipa: approxGermanIpa(de),
    tag: w.category,
    wordLabel: display,
    variations,
  };
}

export function getAllWordSpiegel(): SpiegelDisplay[] {
  return getA1Vocabulary().words.map(wordToSpiegel);
}

export function getWordSpiegelById(id: string): SpiegelDisplay | null {
  const w = getA1Vocabulary().words.find((x) => x.id === id);
  return w ? wordToSpiegel(w) : null;
}

export function filterWordSpiegel(
  items: SpiegelDisplay[],
  query: string,
  category?: string | null
): SpiegelDisplay[] {
  let list = items;
  if (category) {
    const vocab = getA1Vocabulary();
    const ids = new Set(vocab.words.filter((w) => w.category === category).map((w) => w.id));
    list = list.filter((x) => ids.has(x.id));
  }
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((x) => {
    const w = getA1Vocabulary().words.find((v) => v.id === x.id);
    if (!w) return false;
    return (
      w.word.toLowerCase().includes(q) ||
      w.translation_tr.toLowerCase().includes(q) ||
      x.de.toLowerCase().includes(q) ||
      x.tr.toLowerCase().includes(q)
    );
  });
}

export type SeenFilter = "unseen" | "seen" | "all";

export function filterWordSpiegelBySeen(
  items: SpiegelDisplay[],
  seenIds: readonly string[],
  filter: SeenFilter
): SpiegelDisplay[] {
  if (filter === "all") return items;
  const seen = new Set(seenIds);
  if (filter === "unseen") return items.filter((x) => !seen.has(x.id));
  return items.filter((x) => seen.has(x.id));
}

export function getA1CategoryCounts(): Map<string, number> {
  const counts = new Map<string, number>();
  for (const w of getA1Vocabulary().words) {
    counts.set(w.category, (counts.get(w.category) ?? 0) + 1);
  }
  return counts;
}

export interface WordQuiz {
  id: string;
  prompt_tr: string;
  options: string[];
  /** Her Almanca seçenek için Türkçe karşılık */
  optionTranslations: string[];
  correctIndex: number;
  wordId: string;
}

export function generateWordQuizzes(count = 10, seed = Date.now()): WordQuiz[] {
  const words = getA1Vocabulary().words.filter((w) => w.example_de?.trim());
  const quizzes: WordQuiz[] = [];
  let s = seed;

  for (let i = 0; i < count && words.length >= 4; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const idx = s % words.length;
    const target = words[idx];
    const correct = target.example_de.replace(/\.$/, "");
    const correctTr = exampleLineTr(target);
    const wrongPool = words.filter((w) => w.id !== target.id);
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const wrongWords = shufflePick(wrongPool, 3, s);
    const wrong = wrongWords.map((w) => w.example_de.replace(/\.$/, ""));
    const wrongTr = wrongWords.map(exampleLineTr);
    const optionPairs = shufflePick(
      [
        { de: correct, tr: correctTr },
        ...wrong.map((de, j) => ({ de, tr: wrongTr[j] })),
      ],
      4,
      s + i
    );
    quizzes.push({
      id: `wq-${target.id}-${i}`,
      prompt_tr: target.example_tr || target.translation_tr,
      options: optionPairs.map((p) => p.de),
      optionTranslations: optionPairs.map((p) => p.tr),
      correctIndex: optionPairs.findIndex((p) => p.de === correct),
      wordId: target.id,
    });
  }
  return quizzes;
}

function exampleLineTr(w: VocabularyWord): string {
  const tr = w.example_tr?.trim();
  if (tr) return tr.replace(/\.$/, "");
  return w.translation_tr;
}

function shufflePick<T>(arr: T[], n: number, seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
