"use client";

import { A1_WORD_TIERS, type A1WordTierId } from "./wordTiers";
import { DAILY_COACH } from "./dailyGoals";

export const CARDS_SETTINGS_KEY = "german-coach-cards-settings";

export type CardsSpeechSpeed = "normal" | "slow" | "slower";

export interface CardsListenSettings {
  speechSpeed: CardsSpeechSpeed;
  repeatCount: number;
  playTranslation: boolean;
  /** Kelime + anlam sonrasi ornek cumle (DE + TR) */
  playContext: boolean;
  dailyGoal: number;
  filterTier: A1WordTierId | "all";
  filterCategory: string | null;
  /** filterKey → index within filtered playlist */
  filterIndices: Record<string, number>;
}

export const DAILY_LIFE_PRESET = {
  filterTier: "medium" as const,
  filterCategory: null,
};

export function isDailyLifePreset(
  settings: Pick<CardsListenSettings, "filterTier" | "filterCategory">
): boolean {
  return settings.filterTier === DAILY_LIFE_PRESET.filterTier && settings.filterCategory === null;
}

export const DEFAULT_CARDS_LISTEN_SETTINGS: CardsListenSettings = {
  speechSpeed: "normal",
  repeatCount: 2,
  playTranslation: true,
  playContext: true,
  dailyGoal: DAILY_COACH.newWords,
  filterTier: DAILY_LIFE_PRESET.filterTier,
  filterCategory: DAILY_LIFE_PRESET.filterCategory,
  filterIndices: {},
};

export const SPEECH_RATE: Record<CardsSpeechSpeed, number> = {
  normal: 1,
  slow: 0.78,
  slower: 0.62,
};

export const SPEECH_LABEL: Record<CardsSpeechSpeed, string> = {
  normal: "Normal",
  slow: "Yavaş",
  slower: "Çok yavaş",
};

export function filterKey(tier: A1WordTierId | "all", category: string | null): string {
  return `${tier}|${category ?? "*"}`;
}

export function getTierCategories(tier: A1WordTierId | "all"): readonly string[] {
  if (tier === "all") {
    const all = new Set<string>();
    for (const t of Object.keys(A1_WORD_TIERS) as A1WordTierId[]) {
      for (const c of A1_WORD_TIERS[t].categories) all.add(c);
    }
    return [...all];
  }
  return A1_WORD_TIERS[tier].categories;
}

export function loadCardsListenSettings(): CardsListenSettings {
  if (typeof window === "undefined") return { ...DEFAULT_CARDS_LISTEN_SETTINGS };
  try {
    const raw = localStorage.getItem(CARDS_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_CARDS_LISTEN_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<CardsListenSettings>;
    return {
      ...DEFAULT_CARDS_LISTEN_SETTINGS,
      ...parsed,
      repeatCount: clamp(parsed.repeatCount ?? 2, 1, 5),
      dailyGoal: clamp(parsed.dailyGoal ?? 50, 10, 200),
      filterIndices: parsed.filterIndices ?? {},
    };
  } catch {
    return { ...DEFAULT_CARDS_LISTEN_SETTINGS };
  }
}

export function saveCardsListenSettings(settings: CardsListenSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CARDS_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}
