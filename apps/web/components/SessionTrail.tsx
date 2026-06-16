"use client";

import { getWordById } from "@german-coach/vocabulary";
import { formatWord } from "@/lib/audio";

interface SessionTrailProps {
  wordIds: string[];
  currentIndex: number;
  onSelect: (index: number) => void;
  label?: string;
  maxVisible?: number;
}

export function SessionTrail({
  wordIds,
  currentIndex,
  onSelect,
  label = "Oturum hafızası — az önce gördüklerin",
  maxVisible = 20,
}: SessionTrailProps) {
  if (wordIds.length <= 1) return null;

  const capped = wordIds.length > maxVisible;
  const displayIds = capped ? wordIds.slice(-maxVisible) : wordIds;
  const offset = capped ? wordIds.length - displayIds.length : 0;

  return (
    <section className="card-soft p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-sage-400">
        {label}
        {capped && (
          <span className="ml-2 font-normal normal-case text-sage-400">
            (son {maxVisible} kelime)
          </span>
        )}
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pl-1 [-webkit-overflow-scrolling:touch]">
        {displayIds.map((id, i) => {
          const w = getWordById(id);
          if (!w) return null;
          const realIndex = offset + i;
          const active = realIndex === currentIndex;
          const seen = realIndex < currentIndex;
          return (
            <button
              key={`${id}-${realIndex}`}
              type="button"
              onClick={() => onSelect(realIndex)}
              className={`shrink-0 touch-manipulation rounded-xl border px-3 py-2 text-left transition ${
                active
                  ? "border-goethe-gold bg-goethe-gold/15 ring-2 ring-goethe-gold/30"
                  : seen
                    ? "border-sage-200 bg-white text-sage-600 hover:border-sage-300"
                    : "border-sage-100 bg-sage-50 text-sage-400"
              }`}
            >
              <span className="block text-[10px] tabular-nums text-sage-400">{realIndex + 1}</span>
              <span
                className={`block max-w-[88px] truncate text-sm font-semibold ${active ? "text-goethe-blue" : ""}`}
              >
                {formatWord(w.word, w.article)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-sage-400">
        Chip&apos;e tıklayarak önceki kelimelere dön — son {maxVisible} kelime oturum boyunca burada kalır.
      </p>
    </section>
  );
}
