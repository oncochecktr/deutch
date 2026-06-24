"use client";

import { AudioButton } from "@/components/AudioButton";
import { ExamQuestionMeta, trueFalseHint } from "@/components/exam/examUi";

interface TrueFalseQuestionProps {
  index: number;
  total: number;
  statementDe: string;
  statementTr?: string;
  contextDe?: string;
  contextTitle?: string;
  audioText?: string;
  selected: boolean | null;
  onSelect: (value: boolean) => void;
  maxPlays?: number;
  playCount?: number;
  onPlay?: () => boolean;
}

export function TrueFalseQuestion({
  index,
  total,
  statementDe,
  statementTr,
  contextDe,
  contextTitle,
  audioText,
  selected,
  onSelect,
  maxPlays,
  playCount,
  onPlay,
}: TrueFalseQuestionProps) {
  const hint = trueFalseHint(statementDe, statementTr, !!contextDe);

  return (
    <div className="card-soft p-4">
      <ExamQuestionMeta index={index} total={total} tag={contextTitle} />
      {contextDe ? (
        <div className="mb-4 rounded-xl border-2 border-sage-200 bg-white p-4 text-center">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-sage-400">
            Metin / Tabela
          </p>
          <p className="whitespace-pre-line text-base font-bold leading-relaxed text-goethe-blue sm:text-lg">
            {contextDe}
          </p>
        </div>
      ) : null}
      {audioText ? (
        <div className="mb-4">
          <AudioButton
            text={audioText}
            label="Dinle — Anhören"
            maxPlays={maxPlays}
            playsUsed={playCount}
            onPlay={onPlay}
          />
        </div>
      ) : null}
      <p className="text-sm font-medium text-sage-600">{hint}</p>
      <p className="mt-2 text-base font-semibold leading-snug text-goethe-blue sm:text-lg">
        „{statementDe}"
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {(
          [
            [true, "Richtig", "Doğru"],
            [false, "Falsch", "Yanlış"],
          ] as const
        ).map(([val, de, tr]) => {
          const isSelected = selected === val;
          return (
            <button
              key={String(val)}
              type="button"
              onClick={() => onSelect(val)}
              className={`relative rounded-xl border-2 px-4 py-5 text-center transition active:scale-[0.98] ${
                isSelected
                  ? "border-goethe-blue bg-goethe-blue/10 shadow-sm"
                  : "border-sage-200 hover:border-goethe-blue/40 hover:bg-sage-50"
              }`}
            >
              {isSelected ? (
                <span className="absolute right-2 top-2 text-sm font-bold text-goethe-blue">✓</span>
              ) : null}
              <span className={`block text-lg font-bold ${isSelected ? "text-goethe-blue" : "text-goethe-blue/90"}`}>
                {de}
              </span>
              <span className="mt-0.5 block text-sm text-sage-600">{tr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
