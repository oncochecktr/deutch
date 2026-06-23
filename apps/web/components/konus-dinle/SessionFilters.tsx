"use client";

import {
  LEVEL_OPTIONS,
  LENGTH_FILTER_OPTIONS,
  type KonusDinleLevel,
  type KonusDinleLengthFilter,
} from "@/lib/konusDinlePlaylist";

interface SessionFiltersProps {
  level: KonusDinleLevel;
  lengthFilter: KonusDinleLengthFilter;
  onLevelChange: (level: KonusDinleLevel) => void;
  onLengthChange: (length: KonusDinleLengthFilter) => void;
  disabled?: boolean;
}

export function SessionFilters({
  level,
  lengthFilter,
  onLevelChange,
  onLengthChange,
  disabled,
}: SessionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-1.5 text-xs text-sage-600">
        <span className="font-medium">Seviye</span>
        <select
          value={level}
          disabled={disabled}
          onChange={(e) => onLevelChange(e.target.value as KonusDinleLevel)}
          className="rounded-lg border border-sage-200 bg-white px-2 py-1.5 text-xs font-semibold text-goethe-blue"
        >
          {LEVEL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-1.5 text-xs text-sage-600">
        <span className="font-medium">Uzunluk</span>
        <select
          value={lengthFilter}
          disabled={disabled}
          onChange={(e) => {
            const v = e.target.value;
            onLengthChange(v === "mixed" ? "mixed" : (Number(v) as KonusDinleLengthFilter));
          }}
          className="rounded-lg border border-sage-200 bg-white px-2 py-1.5 text-xs font-semibold text-goethe-blue"
        >
          {LENGTH_FILTER_OPTIONS.map((o) => (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
