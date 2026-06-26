import { getA1Vocabulary } from "@german-coach/vocabulary";
import type { UserProgress } from "./progress";

export const A1_WORD_TIERS = {
  easy: {
    id: "words-easy",
    label: "Kolay kelimeler",
    labelTr: "Stufe 1",
    categories: ["Selamlama", "Tanışma", "Aile", "Ev"] as const,
    unlockFromPrevPct: 0,
  },
  medium: {
    id: "words-medium",
    label: "Orta kelimeler",
    labelTr: "Stufe 2",
    categories: ["Market", "İş", "Ulaşım", "Saat", "Tarih", "Restoran", "Telefon"] as const,
    unlockFromPrevPct: 40,
  },
  hard: {
    id: "words-hard",
    label: "İleri kelimeler",
    labelTr: "Stufe 3",
    categories: ["Doktor", "Form doldurma", "Günlük ihtiyaçlar", "Basit yön tarifleri"] as const,
    unlockFromPrevPct: 30,
  },
} as const;

export type A1WordTierId = keyof typeof A1_WORD_TIERS;

const TIER_ORDER: A1WordTierId[] = ["easy", "medium", "hard"];

function studiedIds(progress: UserProgress, prefix: string): Set<string> {
  const ids = new Set<string>();
  for (const id of progress.knownWordIds) {
    if (id.startsWith(prefix)) ids.add(id);
  }
  for (const id of Object.keys(progress.wordProgress)) {
    if (id.startsWith(prefix)) ids.add(id);
  }
  for (const id of Object.keys(progress.srsRecords)) {
    if (id.startsWith(prefix)) ids.add(id);
  }
  return ids;
}

function pct(done: number, total: number): number {
  return total ? Math.min(100, Math.round((done / total) * 100)) : 0;
}

export function getTierForCategory(category: string): A1WordTierId | null {
  for (const id of TIER_ORDER) {
    if ((A1_WORD_TIERS[id].categories as readonly string[]).includes(category)) {
      return id;
    }
  }
  return null;
}

export function getTierCategories(tierId: A1WordTierId): readonly string[] {
  return A1_WORD_TIERS[tierId].categories;
}

export function getNextCategoryInTier(category: string): string | null {
  const tierId = getTierForCategory(category);
  if (!tierId) return null;
  const cats = A1_WORD_TIERS[tierId].categories as readonly string[];
  const idx = cats.indexOf(category);
  if (idx === -1 || idx >= cats.length - 1) return null;
  return cats[idx + 1] ?? null;
}

export function getFirstCategoryOfNextTier(category: string): string | null {
  const tierId = getTierForCategory(category);
  if (!tierId) return null;
  const tierIdx = TIER_ORDER.indexOf(tierId);
  if (tierIdx === -1 || tierIdx >= TIER_ORDER.length - 1) return null;
  return A1_WORD_TIERS[TIER_ORDER[tierIdx + 1]!].categories[0] ?? null;
}

export function tierProgressPct(progress: UserProgress, tierId: A1WordTierId): number {
  const vocab = getA1Vocabulary();
  const studied = studiedIds(progress, "a1_");
  let total = 0;
  let known = 0;
  for (const cat of A1_WORD_TIERS[tierId].categories) {
    const inCat = vocab.words.filter((w) => w.category === cat);
    total += inCat.length;
    known += inCat.filter((w) => studied.has(w.id)).length;
  }
  return pct(known, total);
}

export function categoryProgressPct(progress: UserProgress, category: string): number {
  const vocab = getA1Vocabulary();
  const studied = studiedIds(progress, "a1_");
  const inCat = vocab.words.filter((w) => w.category === category);
  const known = inCat.filter((w) => studied.has(w.id)).length;
  return pct(known, inCat.length);
}

export function categoryStudiedCounts(
  progress: UserProgress,
  category: string
): { known: number; total: number } {
  const vocab = getA1Vocabulary();
  const studied = studiedIds(progress, "a1_");
  const inCat = vocab.words.filter((w) => w.category === category);
  return {
    known: inCat.filter((w) => studied.has(w.id)).length,
    total: inCat.length,
  };
}

export function isTierUnlocked(tierId: A1WordTierId, progress: UserProgress): boolean {
  if (tierId === "easy") return true;
  const prevIdx = TIER_ORDER.indexOf(tierId) - 1;
  if (prevIdx < 0) return true;
  const prevTier = TIER_ORDER[prevIdx]!;
  return tierProgressPct(progress, prevTier) >= A1_WORD_TIERS[tierId].unlockFromPrevPct;
}

export interface WordsListNextStep {
  href: string;
  label: string;
  hint?: string;
  locked?: boolean;
}

export function resolveWordsListNextStep(
  category: string | null,
  progress: UserProgress
): WordsListNextStep {
  if (!category) {
    return { href: "/words?category=Selamlama", label: "Kolay kelimeler: Selamlama" };
  }

  const nextInTier = getNextCategoryInTier(category);
  if (nextInTier) {
    return {
      href: `/words?category=${encodeURIComponent(nextInTier)}`,
      label: `Sonraki kategori: ${nextInTier}`,
    };
  }

  const nextTierFirst = getFirstCategoryOfNextTier(category);
  if (nextTierFirst) {
    const nextTierId = getTierForCategory(nextTierFirst)!;
    const tierMeta = A1_WORD_TIERS[nextTierId];
    const unlocked = isTierUnlocked(nextTierId, progress);
    if (!unlocked) {
      const prevTierId = TIER_ORDER[TIER_ORDER.indexOf(nextTierId) - 1]!;
      const need = tierMeta.unlockFromPrevPct;
      return {
        href: "/cards",
        label: "Önce kartlarla kolay kelimeleri pekiştir",
        hint: `${A1_WORD_TIERS[prevTierId].label} %${need} olunca ${tierMeta.label} açılır`,
        locked: true,
      };
    }
    return {
      href: `/words?category=${encodeURIComponent(nextTierFirst)}`,
      label: `${tierMeta.label}: ${nextTierFirst}`,
    };
  }

  return {
    href: "/review",
    label: "SRS tekrar motoru",
    hint: "Kelime havuzunu uzun süreli hafızaya al",
  };
}
