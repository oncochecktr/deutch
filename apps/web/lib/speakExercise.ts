import {
  getA1Vocabulary,
  getA2Vocabulary,
  getDistractors,
  type VocabularyWord,
} from "@german-coach/vocabulary";
import { SPEAK_LESSONS } from "./speakCurriculum";
import type { SpeakLevel } from "./speakTypes";

export type ExerciseType =
  | "vocab_mcq"
  | "fill_blank"
  | "short_write"
  | "speak_prompt"
  | "true_false";

export type ExerciseScore = "poor" | "ok" | "good" | "excellent";

export interface ExerciseOption {
  id: string;
  label: string;
}

export interface SpeakExercise {
  id: string;
  type: ExerciseType;
  level: SpeakLevel;
  index: number;
  total: number;
  promptDe: string;
  promptTr?: string;
  expectedAnswer?: string;
  options?: ExerciseOption[];
  correctOptionId?: string;
  statementDe?: string;
  correctTrueFalse?: boolean;
  blankWord?: string;
  sentenceWithBlank?: string;
  audioText?: string;
  wordHint?: string;
  b1Note?: string;
}

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  vocab_mcq: "Kelime seç",
  fill_blank: "Boşluk doldur",
  short_write: "Yaz",
  speak_prompt: "Konuş",
  true_false: "Doğru / Yanlış",
};

const EXERCISE_TYPES: ExerciseType[] = [
  "vocab_mcq",
  "fill_blank",
  "short_write",
  "speak_prompt",
  "true_false",
];

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

function pickWord(words: VocabularyWord[], rand: () => number, index: number): VocabularyWord {
  if (!words.length) throw new Error("No vocabulary words");
  return words[Math.floor(rand() * words.length)] ?? words[index % words.length];
}

function formatWord(w: VocabularyWord): string {
  return w.article ? `${w.article} ${w.word}` : w.word;
}

function wordsForLevel(level: SpeakLevel): VocabularyWord[] {
  if (level === "A1") return getA1Vocabulary().words;
  if (level === "A2") return getA2Vocabulary().words;
  return [...getA2Vocabulary().words].sort((a, b) => b.word.length - a.word.length).slice(0, 80);
}

function phrasesForLevel(level: SpeakLevel): string[] {
  const lessons = SPEAK_LESSONS.filter((l) => l.level === level || (level === "B1" && l.level === "A2"));
  return lessons.flatMap((l) => l.phrases);
}

function makeBlankSentence(exampleDe: string, word: string): { sentence: string; blank: string } | null {
  const lower = exampleDe.toLowerCase();
  const target = word.toLowerCase();
  const idx = lower.indexOf(target);
  if (idx < 0) return null;
  const before = exampleDe.slice(0, idx);
  const after = exampleDe.slice(idx + word.length);
  return { sentence: `${before}_____${after}`, blank: word };
}

function buildVocabMcq(
  word: VocabularyWord,
  level: SpeakLevel,
  index: number,
  total: number,
  id: string
): SpeakExercise {
  const distractors = getDistractorsForLevel(word, level, 3);
  const options: ExerciseOption[] = [word, ...distractors]
    .sort(() => Math.random() - 0.5)
    .map((w) => ({ id: w.id, label: w.translation_tr }));
  return {
    id,
    type: "vocab_mcq",
    level,
    index,
    total,
    promptDe: `"${formatWord(word)}" kelimesinin Türkçe karşılığı hangisi?`,
    promptTr: level === "A1" ? "Almanca kelimeyi Türkçe seçeneklerle eşleştir." : undefined,
    expectedAnswer: word.translation_tr,
    options,
    correctOptionId: word.id,
    audioText: formatWord(word),
    wordHint: word.example_de,
  };
}

function getDistractorsForLevel(word: VocabularyWord, level: SpeakLevel, count: number) {
  if (level === "A2" || level === "B1") {
    const pool = getA2Vocabulary().words.filter(
      (w) => w.id !== word.id && w.category === word.category
    );
    if (pool.length >= count) {
      return pool.sort(() => Math.random() - 0.5).slice(0, count);
    }
    const fallback = getA2Vocabulary().words.filter((w) => w.id !== word.id);
    return fallback.sort(() => Math.random() - 0.5).slice(0, count);
  }
  return getDistractors(word, count);
}

function buildFillBlank(
  word: VocabularyWord,
  level: SpeakLevel,
  index: number,
  total: number,
  id: string
): SpeakExercise {
  const blank = makeBlankSentence(word.example_de, word.word);
  const sentence = blank?.sentence ?? `Ich kaufe _____. (${word.translation_tr})`;
  const answer = blank?.blank ?? word.word;
  return {
    id,
    type: "fill_blank",
    level,
    index,
    total,
    promptDe: "Boşluğu doğru kelimeyle doldur:",
    promptTr: word.translation_tr,
    sentenceWithBlank: sentence,
    blankWord: answer,
    expectedAnswer: answer,
    audioText: word.example_de,
    wordHint: formatWord(word),
  };
}

function buildShortWrite(
  word: VocabularyWord,
  level: SpeakLevel,
  index: number,
  total: number,
  id: string
): SpeakExercise {
  const prompts: Record<SpeakLevel, string> = {
    A1: `Almanca yaz: "${word.translation_tr}" anlamına gelen bir cümle kur. (En az 4 kelime)`,
    A2: `Kısa bir cümle yaz — konu: ${word.category}. "${formatWord(word)}" kelimesini kullan.`,
    B1: `Bir görüş cümlesi yaz — "${formatWord(word)}" geçsin; en az 8 kelime.`,
  };
  return {
    id,
    type: "short_write",
    level,
    index,
    total,
    promptDe: prompts[level],
    promptTr: `Örnek kelime: ${word.translation_tr}`,
    expectedAnswer: word.example_de,
    audioText: word.example_de,
    wordHint: formatWord(word),
  };
}

function buildSpeakPrompt(
  phrases: string[],
  level: SpeakLevel,
  index: number,
  total: number,
  id: string,
  rand: () => number
): SpeakExercise {
  const phrase = phrases[Math.floor(rand() * phrases.length)] ?? "Guten Tag";
  const prompts: Record<SpeakLevel, string> = {
    A1: `Bu ifadeyi kullanarak kendini tanıt: "${phrase}"`,
    A2: `Mini diyalog — şu ifadeyle başla: "${phrase}" (en az 2 cümle)`,
    B1: `Konuş: "${phrase}" ile başla; neden/sebep ekle (weil/denn).`,
  };
  return {
    id,
    type: "speak_prompt",
    level,
    index,
    total,
    promptDe: prompts[level],
    expectedAnswer: phrase,
    audioText: phrase,
  };
}

function buildTrueFalse(
  word: VocabularyWord,
  level: SpeakLevel,
  index: number,
  total: number,
  id: string,
  rand: () => number
): SpeakExercise {
  const isTrue = rand() > 0.45;
  const wrongWord = pickWord(wordsForLevel(level), rand, index + 3);
  const statementDe = isTrue
    ? `"${formatWord(word)}" = ${word.translation_tr}`
    : `"${formatWord(word)}" = ${wrongWord.translation_tr}`;
  return {
    id,
    type: "true_false",
    level,
    index,
    total,
    promptDe: "Bu ifade doğru mu?",
    statementDe,
    correctTrueFalse: isTrue,
    expectedAnswer: isTrue ? "true" : "false",
    wordHint: isTrue ? undefined : `Doğrusu: ${word.translation_tr}`,
  };
}

export function buildDailyExerciseSet(level: SpeakLevel, dayKey?: string): SpeakExercise[] {
  const day = dayKey ?? new Date().toISOString().slice(0, 10);
  const rand = seededRandom(`${day}-${level}-exercises`);
  const words = wordsForLevel(level);
  const phrases = phrasesForLevel(level);
  const total = EXERCISE_TYPES.length;
  const b1Note = level === "B1" ? "B1 kelime paketi genişletiliyor — şimdilik A2+ müfredat." : undefined;

  return EXERCISE_TYPES.map((type, index) => {
    const word = pickWord(words, rand, index);
    const id = `${day}-${level}-${type}`;
    switch (type) {
      case "vocab_mcq":
        return { ...buildVocabMcq(word, level, index, total, id), b1Note: index === 0 ? b1Note : undefined };
      case "fill_blank":
        return buildFillBlank(word, level, index, total, id);
      case "short_write":
        return buildShortWrite(word, level, index, total, id);
      case "speak_prompt":
        return buildSpeakPrompt(phrases, level, index, total, id, rand);
      case "true_false":
        return buildTrueFalse(word, level, index, total, id, rand);
    }
  });
}

export function getExerciseForIndex(
  level: SpeakLevel,
  index: number,
  dayKey?: string
): SpeakExercise | null {
  const set = buildDailyExerciseSet(level, dayKey);
  return set[index] ?? null;
}

export function normalizeAnswer(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

export function gradeExerciseLocally(
  exercise: SpeakExercise,
  studentAnswer: string
): { isCorrect: boolean; score: ExerciseScore } | null {
  const norm = normalizeAnswer(studentAnswer);

  if (exercise.type === "vocab_mcq") {
    const correct = studentAnswer === exercise.correctOptionId;
    return { isCorrect: correct, score: correct ? "good" : "poor" };
  }

  if (exercise.type === "true_false") {
    const expected = exercise.correctTrueFalse ? "true" : "false";
    const normalized =
      norm === "true" || norm === "dogru" || norm === "doğru" || norm === "ja" || norm === "evet"
        ? "true"
        : norm === "false" || norm === "yanlis" || norm === "yanlış" || norm === "nein" || norm === "hayir" || norm === "hayır"
          ? "false"
          : norm;
    const correct = normalized === expected;
    return { isCorrect: correct, score: correct ? "good" : "poor" };
  }

  if (exercise.type === "fill_blank") {
    const blank = normalizeAnswer(exercise.blankWord ?? "");
    const correct = norm === blank || norm.includes(blank);
    return { isCorrect: correct, score: correct ? "good" : "poor" };
  }

  return null;
}

export function hintForExercise(
  exercise: SpeakExercise,
  hintLevel: 1 | 2 | 3
): { turkish?: string; partial?: string } {
  if (hintLevel === 1) {
    return {
      turkish: exercise.promptTr ?? exercise.wordHint,
      partial: exercise.expectedAnswer,
    };
  }
  if (hintLevel === 2) {
    const first = exercise.blankWord?.[0] ?? exercise.expectedAnswer?.[0] ?? "?";
    return { partial: `İlk harf: ${first}…` };
  }
  return {};
}
