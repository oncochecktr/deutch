import {
  getA1Vocabulary,
  getA2Vocabulary,
  type CEFRLevel,
  type VocabularyWord,
} from "@german-coach/vocabulary";
import { SPEAK_LESSONS } from "@/lib/speakCurriculum";
import { splitExamples } from "@/lib/vocabMeta";
import b1PhrasesData from "../../../data/konus-dinle/b1-phrases.json";

export type KonusDinleLevel = "A1" | "A2" | "B1";
export type KonusDinleWordCount = 1 | 2 | 3 | 4 | 5 | 6;
export type KonusDinleLengthFilter = KonusDinleWordCount | "mixed";

export interface KonusDinleItem {
  id: string;
  level: KonusDinleLevel;
  wordCount: KonusDinleWordCount;
  textDe: string;
  textTr: string;
  audioSrc?: string;
}

export const LENGTH_FILTER_OPTIONS: { value: KonusDinleLengthFilter; label: string }[] = [
  { value: 1, label: "1 kelime" },
  { value: 2, label: "2 kelime" },
  { value: 3, label: "3 kelime" },
  { value: 4, label: "4 kelime" },
  { value: 5, label: "5 kelime" },
  { value: 6, label: "6 kelime" },
  { value: "mixed", label: "Karışık" },
];

export const LEVEL_OPTIONS: { value: KonusDinleLevel; label: string }[] = [
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
];

function countGermanWords(text: string): number {
  const cleaned = text
    .trim()
    .replace(/[.,!?;:"„""''«»()…]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(" ").filter(Boolean).length;
}

function formatWord(w: VocabularyWord): string {
  return w.article ? `${w.article} ${w.word}` : w.word;
}

function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithRand<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function cleanPhrase(phrase: string): string | null {
  const trimmed = phrase.replace(/…/g, "").trim();
  if (!trimmed || trimmed.includes("…")) return null;
  return trimmed;
}

function itemsFromVocabulary(level: KonusDinleLevel): KonusDinleItem[] {
  const words =
    level === "A1"
      ? getA1Vocabulary().words
      : level === "A2"
        ? getA2Vocabulary().words
        : getA2Vocabulary().words;

  const items: KonusDinleItem[] = [];
  const seen = new Set<string>();

  for (const w of words) {
    const wordDe = formatWord(w);
    const wordKey = `${level}-w-${wordDe.toLowerCase()}`;
    if (!seen.has(wordKey)) {
      seen.add(wordKey);
      items.push({
        id: `${w.id}-word`,
        level,
        wordCount: 1,
        textDe: wordDe,
        textTr: w.translation_tr,
        audioSrc: w.audio_word || undefined,
      });
    }

    for (const ex of splitExamples(w.example_de, w.example_tr)) {
      const de = ex.de.trim();
      if (!de || de === "—") continue;
      const wc = countGermanWords(de);
      if (wc < 1 || wc > 6) continue;
      const key = `${level}-s-${de.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        id: `${w.id}-ex-${wc}`,
        level,
        wordCount: wc as KonusDinleWordCount,
        textDe: de,
        textTr: ex.tr || w.translation_tr,
        audioSrc: wc <= 4 ? w.audio_example || undefined : undefined,
      });
    }
  }

  return items;
}

function itemsFromSpeakLessons(level: KonusDinleLevel): KonusDinleItem[] {
  const lessons = SPEAK_LESSONS.filter(
    (l) => l.level === level || (level === "B1" && l.level === "A2")
  );
  const items: KonusDinleItem[] = [];
  const seen = new Set<string>();

  for (const lesson of lessons) {
    for (const raw of lesson.phrases) {
      const de = cleanPhrase(raw);
      if (!de) continue;
      const wc = countGermanWords(de);
      if (wc < 1 || wc > 6) continue;
      const key = de.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        id: `lesson-${lesson.id}-${items.length}`,
        level,
        wordCount: wc as KonusDinleWordCount,
        textDe: de,
        textTr: lesson.title,
      });
    }
  }

  return items;
}

function itemsFromB1Phrases(): KonusDinleItem[] {
  const phrases = (b1PhrasesData as { phrases: { id: string; textDe: string; textTr: string }[] })
    .phrases;
  return phrases.map((p) => ({
    id: p.id,
    level: "B1" as const,
    wordCount: Math.min(6, Math.max(1, countGermanWords(p.textDe))) as KonusDinleWordCount,
    textDe: p.textDe,
    textTr: p.textTr,
  }));
}

function buildPoolForLevel(level: KonusDinleLevel): KonusDinleItem[] {
  const vocab = itemsFromVocabulary(level);
  const lessons = itemsFromSpeakLessons(level);
  const b1extra = level === "B1" ? itemsFromB1Phrases() : [];

  const seen = new Set<string>();
  const merged: KonusDinleItem[] = [];
  for (const item of [...vocab, ...lessons, ...b1extra]) {
    const key = item.textDe.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged;
}

export function filterKey(level: KonusDinleLevel, length: KonusDinleLengthFilter): string {
  return `${level}-${length}`;
}

export interface BuildPlaylistOptions {
  level: KonusDinleLevel;
  lengthFilter: KonusDinleLengthFilter;
  shuffle?: boolean;
  seed?: string;
}

export function buildKonusDinlePlaylist(options: BuildPlaylistOptions): KonusDinleItem[] {
  const { level, lengthFilter, shuffle = true, seed } = options;
  let pool = buildPoolForLevel(level);

  if (lengthFilter !== "mixed") {
    pool = pool.filter((item) => item.wordCount === lengthFilter);
  }

  pool.sort((a, b) => a.wordCount - b.wordCount || a.textDe.localeCompare(b.textDe));

  if (shuffle) {
    const daySeed = seed ?? `${new Date().toISOString().slice(0, 10)}-${level}-${lengthFilter}`;
    pool = shuffleWithRand(pool, seededRandom(daySeed));
  }

  return pool;
}

export function countByWordCount(level: KonusDinleLevel): Record<KonusDinleWordCount | "total", number> {
  const pool = buildPoolForLevel(level);
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const item of pool) {
    counts[item.wordCount] = (counts[item.wordCount] ?? 0) + 1;
  }
  return {
    1: counts[1] ?? 0,
    2: counts[2] ?? 0,
    3: counts[3] ?? 0,
    4: counts[4] ?? 0,
    5: counts[5] ?? 0,
    6: counts[6] ?? 0,
    total: pool.length,
  };
}

export function levelToCefr(level: KonusDinleLevel): CEFRLevel {
  return level;
}
