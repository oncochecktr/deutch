"use client";

import type { KonusDinleLevel, KonusDinleLengthFilter } from "@/lib/konusDinlePlaylist";
import { lengthLabelTr } from "@/components/konus-dinle/SessionHeader";

const LEVELS: KonusDinleLevel[] = ["A1", "A2", "B1"];
const LENGTHS: KonusDinleLengthFilter[] = [1, 2, 3, 4, 5, 6, "mixed"];

interface KonusDinleQuickPickProps {
  level: KonusDinleLevel;
  lengthFilter: KonusDinleLengthFilter;
  disabled?: boolean;
  onSelect: (level: KonusDinleLevel, length: KonusDinleLengthFilter) => void;
}

export function KonusDinleQuickPick({
  level,
  lengthFilter,
  disabled,
  onSelect,
}: KonusDinleQuickPickProps) {
  return (
    <div className="card-soft space-y-3 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-sage-500">
        Hızlı seçim
      </p>
      <div>
        <p className="mb-1.5 text-[10px] font-medium text-sage-400">Seviye</p>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((lv) => (
            <button
              key={lv}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(lv, lengthFilter)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                level === lv
                  ? "bg-goethe-blue text-white shadow-md"
                  : "border border-sage-200 bg-white text-goethe-blue hover:bg-sage-50"
              } ${disabled ? "opacity-50" : ""}`}
            >
              {lv}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[10px] font-medium text-sage-400">Uzunluk</p>
        <div className="flex flex-wrap gap-1.5">
          {LENGTHS.map((len) => (
            <button
              key={String(len)}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(level, len)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                lengthFilter === len
                  ? "bg-goethe-gold text-goethe-blue ring-2 ring-goethe-gold/40"
                  : "border border-sage-100 bg-white text-sage-600 hover:border-sage-300"
              } ${disabled ? "opacity-50" : ""}`}
            >
              {lengthLabelTr(len)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
