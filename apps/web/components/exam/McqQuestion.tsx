"use client";

import { AudioButton } from "@/components/AudioButton";

interface McqQuestionProps {
  index: number;
  total: number;
  questionDe: string;
  questionTr?: string;
  audioText?: string;
  options: string[];
  selected: number | null;
  correctIndex: number | null;
  onSelect: (index: number) => void;
  showResult?: boolean;
}

export function McqQuestion({
  index,
  total,
  questionDe,
  questionTr,
  audioText,
  options,
  selected,
  correctIndex,
  onSelect,
  showResult,
}: McqQuestionProps) {
  return (
    <div className="card-soft p-4">
      <p className="mb-1 text-xs text-sage-400">
        Aufgabe {index + 1} / {total}
      </p>
      <p className="mb-1 font-medium text-goethe-blue">{questionDe}</p>
      {questionTr && <p className="mb-3 text-xs text-sage-400">{questionTr}</p>}
      {audioText && (
        <div className="mb-3">
          <AudioButton text={audioText} label="Anhören — Dinle" />
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt, i) => {
          let cls = "rounded-lg border px-3 py-2 text-left text-sm transition ";
          if (showResult && correctIndex !== null) {
            if (i === correctIndex) cls += "border-sage-400 bg-sage-100 text-sage-700";
            else if (i === selected) cls += "border-red-200 bg-red-50 text-red-700";
            else cls += "border-sage-100 opacity-50";
          } else if (selected === i) {
            cls += "border-sage-400 bg-sage-100 cursor-pointer";
          } else {
            cls += "border-sage-200 hover:bg-sage-50 cursor-pointer";
          }
          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={showResult}
              onClick={() => onSelect(i)}
            >
              {String.fromCharCode(97 + i)}) {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
