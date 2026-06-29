"use client";

import { A1_WORD_TIERS, type A1WordTierId } from "@/lib/wordTiers";
import { isDailyLifePreset } from "@/lib/cardsSettings";

const TIER_ORDER: (A1WordTierId | "all")[] = ["easy", "medium", "hard", "all"];

interface CardsTierPickerProps {
  tier: A1WordTierId | "all";
  category: string | null;
  categories: readonly string[];
  onTierChange: (tier: A1WordTierId | "all") => void;
  onCategoryChange: (category: string | null) => void;
  onDailyLifePreset: () => void;
  playlistSize: number;
}

export function CardsTierPicker({
  tier,
  category,
  categories,
  onTierChange,
  onCategoryChange,
  onDailyLifePreset,
  playlistSize,
}: CardsTierPickerProps) {
  const dailyLifeActive = isDailyLifePreset({ filterTier: tier, filterCategory: category });

  return (
    <div className="card-soft space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">
          Grup · hedefli öğrenme
        </p>
        <span className="text-xs text-sage-500">{playlistSize} kelime bu grupta</span>
      </div>

      <button
        type="button"
        onClick={onDailyLifePreset}
        className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
          dailyLifeActive
            ? "bg-goethe-gold/20 text-goethe-blue ring-2 ring-goethe-gold/50"
            : "border border-goethe-gold/40 bg-goethe-gold/10 text-goethe-blue hover:bg-goethe-gold/15"
        }`}
      >
        Günlük hayat
        <span className="mt-0.5 block text-xs font-normal text-sage-500">
          Market · ulaşım · restoran · saat
        </span>
      </button>

      <div className="flex flex-wrap gap-1.5">
        {TIER_ORDER.map((id) => {
          const label =
            id === "all"
              ? "Tümü"
              : `${A1_WORD_TIERS[id].labelTr} · ${A1_WORD_TIERS[id].label}`;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTierChange(id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                tier === id
                  ? "bg-goethe-blue text-white"
                  : "bg-sage-100 text-sage-600 hover:bg-sage-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tier !== "all" && categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-sage-100 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                category === cat
                  ? "border-2 border-goethe-gold bg-goethe-gold/15 text-goethe-blue"
                  : "border border-sage-200 bg-white text-sage-600 hover:border-goethe-blue/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
