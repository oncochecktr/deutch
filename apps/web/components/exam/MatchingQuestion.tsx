"use client";

import type { LesenMatching } from "@german-coach/exams";
import { ExamInstructionBanner } from "@/components/exam/examUi";

interface MatchingQuestionProps {
  item: LesenMatching;
  selected: number[];
  onChange: (indices: number[]) => void;
}

export function MatchingQuestion({ item, selected, onChange }: MatchingQuestionProps) {
  const done = item.prompts.filter((_, i) => selected[i] !== undefined && !Number.isNaN(selected[i])).length;

  return (
    <div className="card-soft space-y-4 p-4">
      <div>
        <p className="text-lg font-bold text-goethe-blue">{item.title_de}</p>
        <p className="mt-1 text-sm text-sage-600">{item.title_tr}</p>
      </div>
      <ExamInstructionBanner>
        Her cümleyi doğru seçenekle eşleştir. {done}/{item.prompts.length} tamamlandı.
      </ExamInstructionBanner>
      <div className="space-y-3">
        {item.prompts.map((prompt, i) => {
          const picked = selected[i];
          const hasPick = picked !== undefined && !Number.isNaN(picked);
          return (
            <div
              key={prompt.id}
              className={`rounded-xl border-2 p-4 transition ${
                hasPick ? "border-goethe-blue/30 bg-goethe-blue/5" : "border-sage-100 bg-white"
              }`}
            >
              <p className="text-base font-semibold text-goethe-blue">{prompt.text_de}</p>
              <p className="mb-3 text-sm text-sage-600">{prompt.text_tr}</p>
              <select
                className="w-full rounded-xl border-2 border-sage-200 bg-white px-4 py-3 text-base text-goethe-blue focus:border-goethe-blue focus:outline-none"
                value={hasPick ? picked : ""}
                onChange={(e) => {
                  const next = [...selected];
                  next[i] = parseInt(e.target.value, 10);
                  onChange(next);
                }}
              >
                <option value="" disabled>
                  Seçenek seç — wählen
                </option>
                {item.options.map((opt, oi) => (
                  <option key={opt} value={oi}>
                    {String.fromCharCode(65 + oi)}) {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
