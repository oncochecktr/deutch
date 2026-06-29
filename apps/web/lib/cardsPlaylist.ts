import type { VocabularyWord } from "@german-coach/vocabulary";
import { getTierForCategory } from "@/lib/wordTiers";
import {
  type CardsListenSettings,
  getTierCategories,
} from "@/lib/cardsSettings";
import { A1_WORD_TIERS, type A1WordTierId } from "@/lib/wordTiers";

const TIER_ORDER: A1WordTierId[] = ["easy", "medium", "hard"];

/** Grup icinde mantikli sira: once kolay kategoriler, sonra orta, zor */
export function buildCardsPlaylist(
  words: VocabularyWord[],
  tier: CardsListenSettings["filterTier"],
  category: string | null
): VocabularyWord[] {
  let list = words;

  if (tier !== "all") {
    const cats = new Set(getTierCategories(tier));
    list = list.filter((w) => cats.has(w.category));
  }

  if (category) {
    list = list.filter((w) => w.category === category);
    return list;
  }

  if (tier === "all") {
    return sortByTierOrder(list);
  }

  return list;
}

function sortByTierOrder(words: VocabularyWord[]): VocabularyWord[] {
  const tierRank = (cat: string): number => {
    const t = getTierForCategory(cat);
    if (!t) return 99;
    return TIER_ORDER.indexOf(t);
  };
  const catOrder = (cat: string): number => {
    const t = getTierForCategory(cat);
    if (!t) return 999;
    const cats = A1_WORD_TIERS[t].categories as readonly string[];
    const idx = cats.indexOf(cat);
    return idx === -1 ? 998 : idx;
  };
  return [...words].sort((a, b) => {
    const tr = tierRank(a.category) - tierRank(b.category);
    if (tr !== 0) return tr;
    return catOrder(a.category) - catOrder(b.category);
  });
}

export function playlistLabel(
  tier: CardsListenSettings["filterTier"],
  category: string | null
): string {
  if (category) return category;
  if (tier === "all") return "Tum A1";
  return A1_WORD_TIERS[tier].label;
}
