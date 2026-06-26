"use client";

import { useMemo } from "react";
import { getA1Vocabulary } from "@german-coach/vocabulary";
import { useProgress } from "@/lib/ProgressContext";
import type { SpiegelDisplay } from "@/lib/wordSpiegel";

interface WordSpiegelListProps {
  items: SpiegelDisplay[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function WordSpiegelList({ items, selectedId, onSelect }: WordSpiegelListProps) {
  const { progress } = useProgress();
  const vocab = useMemo(() => getA1Vocabulary(), []);
  const wordMap = useMemo(() => new Map(vocab.words.map((w) => [w.id, w])), [vocab.words]);
  const seen = progress.grundlagen.cumleMotoruSeenCards;

  return (
    <ul className="divide-y divide-sage-50 rounded-xl border border-sage-100 bg-white">
      {items.map((item) => {
        const w = wordMap.get(item.id);
        if (!w) return null;
        const active = item.id === selectedId;
        const touched = seen.includes(item.id);
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                active ? "bg-goethe-blue/5" : "hover:bg-sage-50"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  touched ? "bg-sage-200 text-sage-600" : "bg-goethe-blue/10 text-goethe-blue"
                }`}
              >
                {touched ? "✓" : "·"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-goethe-blue">
                  {item.wordLabel ?? w.word}
                </p>
                <p className="truncate text-xs text-sage-500">{w.translation_tr}</p>
              </div>
              <span className="shrink-0 text-[10px] text-sage-300">{w.category}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
