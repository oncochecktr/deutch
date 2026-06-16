export type {
  VocabularyWord,
  VocabularyPack,
  CEFRLevel,
  Article,
  A1Category,
  A2Category,
  TimurCategory,
} from "./types";
export { CATEGORIES_A1, CATEGORIES_A2, CATEGORIES_TIMUR } from "./types";

import type { VocabularyPack, VocabularyWord } from "./types";
import a1Data from "../../../data/a1/vocabulary.json";
import a2Data from "../../../data/a2/vocabulary.json";
import timurData from "../../../data/timur/vocabulary.json";

export function getA1Vocabulary(): VocabularyPack {
  return a1Data as VocabularyPack;
}

export function getA2Vocabulary(): VocabularyPack {
  return a2Data as VocabularyPack;
}

export function getTimurVocabulary(): VocabularyPack {
  return timurData as VocabularyPack;
}

/** Mesleki Almanca paketi (iş & kariyer kelimeleri) */
export function getMeslekiVocabulary(): VocabularyPack {
  return getTimurVocabulary();
}

export function getWorkVocabulary(): VocabularyWord[] {
  const a1Work = getA1Vocabulary().words.filter(
    (w) => w.tags.includes("work") || w.tags.includes("logistics")
  );
  return [...getTimurVocabulary().words, ...a1Work];
}

export function getWordsByCategory(category: string, pack: "a1" | "a2" | "timur" = "a1") {
  const vocab =
    pack === "timur"
      ? getTimurVocabulary()
      : pack === "a2"
        ? getA2Vocabulary()
        : getA1Vocabulary();
  return vocab.words.filter((w) => w.category === category);
}

export function getWordById(id: string) {
  return (
    getA1Vocabulary().words.find((w) => w.id === id) ??
    getA2Vocabulary().words.find((w) => w.id === id) ??
    getTimurVocabulary().words.find((w) => w.id === id)
  );
}

export function getRandomWords(count: number, excludeIds: string[] = [], pack: "a1" | "timur" = "a1") {
  const vocab = pack === "timur" ? getTimurVocabulary() : getA1Vocabulary();
  const pool = vocab.words.filter((w) => !excludeIds.includes(w.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getDistractors(correctWord: VocabularyWord, count = 3) {
  const timur = getTimurVocabulary().words;
  const a1 = getA1Vocabulary().words;
  const all = [...timur, ...a1];
  const others = all.filter(
    (w) => w.id !== correctWord.id && w.category === correctWord.category
  );
  if (others.length >= count) {
    return others.sort(() => Math.random() - 0.5).slice(0, count);
  }
  const fallback = all.filter((w) => w.id !== correctWord.id);
  return fallback.sort(() => Math.random() - 0.5).slice(0, count);
}
