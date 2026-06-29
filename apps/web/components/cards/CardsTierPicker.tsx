"use client";

import { A1_WORD_TIERS, type A1WordTierId } from "@/lib/wordTiers";

const TIER_ORDER: (A1WordTierId | "all")[] = ["easy", "medium", "hard", "all"];

interface CardsTierPickerProps {
  tier: A1WordTierId | "all";
  category: string | null;
  categories: readonly string[];
  onTierChange: (tier: A1WordTierId | "all") => void;
  onCategoryChange: (category: string | null) => void;
  playlistSize: number;
}

export function CardsTierPicker({
  tier,
  category,
  categories,
  onTierChange,
  onCategoryChange,
  playlistSize,
}: CardsTierPickerProps) {
  return (
    <div className="card-soft space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">
          Grup · hedefli öğrenme
        </p>
        <span className="text-xs text-sage-500">{playlistSize} kelime bu grupta</span>
      </div>

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
