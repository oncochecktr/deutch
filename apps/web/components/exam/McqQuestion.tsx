"use client";

import { AudioButton } from "@/components/AudioButton";
import { ExamQuestionMeta } from "@/components/exam/examUi";

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
  maxPlays?: number;
  playsUsed?: number;
  onPlay?: () => boolean;
  compact?: boolean;
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
  maxPlays,
  playsUsed,
  onPlay,
  compact,
}: McqQuestionProps) {
  return (
    <div className={`card-soft ${compact ? "p-3" : "p-4"}`}>
      <ExamQuestionMeta index={index} total={total} />
      <p className="text-base font-semibold leading-snug text-goethe-blue sm:text-lg">{questionDe}</p>
      {questionTr ? (
        <p className="mb-3 mt-1 text-sm leading-relaxed text-sage-600">{questionTr}</p>
      ) : (
        <div className="mb-3" />
      )}
      {audioText ? (
        <div className="mb-4">
          <AudioButton
            text={audioText}
            label="Dinle — Anhören"
            maxPlays={maxPlays}
            playsUsed={playsUsed}
            onPlay={onPlay}
          />
        </div>
      ) : null}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = showResult && correctIndex !== null && i === correctIndex;
          const isWrong = showResult && correctIndex !== null && isSelected && i !== correctIndex;

          let cls =
            "relative rounded-xl border-2 px-3 py-3 text-left text-sm transition active:scale-[0.98] sm:text-base ";
          if (isCorrect) cls += "border-sage-500 bg-sage-100 font-medium text-sage-800";
          else if (isWrong) cls += "border-red-300 bg-red-50 text-red-800";
          else if (showResult) cls += "border-sage-100 opacity-45";
          else if (isSelected)
            cls += "border-goethe-blue bg-goethe-blue/10 font-semibold text-goethe-blue shadow-sm";
          else cls += "border-sage-200 hover:border-goethe-blue/30 hover:bg-sage-50 cursor-pointer";

          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={showResult}
              onClick={() => onSelect(i)}
            >
              {isSelected && !showResult ? (
                <span className="absolute right-2 top-2 text-xs font-bold text-goethe-blue">✓</span>
              ) : null}
              <span className="font-medium text-sage-500">{String.fromCharCode(97 + i)})</span> {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
