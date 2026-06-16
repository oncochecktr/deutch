"use client";

import type { LesenMatching } from "@german-coach/exams";

interface MatchingQuestionProps {
  item: LesenMatching;
  selected: number[];
  onChange: (indices: number[]) => void;
}

export function MatchingQuestion({ item, selected, onChange }: MatchingQuestionProps) {
  return (
    <div className="card-soft space-y-4 p-4">
      <div>
        <p className="font-medium text-goethe-blue">{item.title_de}</p>
        <p className="text-xs text-sage-400">{item.title_tr}</p>
      </div>
      <div className="space-y-3">
        {item.prompts.map((prompt, i) => (
          <div key={prompt.id} className="rounded-lg border border-sage-100 p-3">
            <p className="text-sm font-medium text-goethe-blue">{prompt.text_de}</p>
            <p className="mb-2 text-xs text-sage-400">{prompt.text_tr}</p>
            <select
              className="w-full rounded-lg border border-sage-200 px-3 py-2 text-sm"
              value={selected[i] ?? ""}
              onChange={(e) => {
                const next = [...selected];
                next[i] = parseInt(e.target.value, 10);
                onChange(next);
              }}
            >
              <option value="" disabled>
                — Seç / wählen —
              </option>
              {item.options.map((opt, oi) => (
                <option key={opt} value={oi}>
                  {String.fromCharCode(65 + oi)}) {opt}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
