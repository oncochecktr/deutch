"use client";

import { useState } from "react";
import { IconCheck, IconX } from "@/components/icons";
import type { TrainerDrill } from "@/lib/grundlagen";

interface GrundlagenDrillProps {
  drills: TrainerDrill[];
  onFinish: (correct: number) => void;
  label?: string;
}

export function GrundlagenDrillPanel({ drills, onFinish, label = "Drill" }: GrundlagenDrillProps) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const question = drills[qIdx];
  if (!question) return null;

  const showResult = selected !== null;
  const isCorrect = selected === question.correct_index;
  const isLast = qIdx >= drills.length - 1;

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const thisCorrect = selected === question.correct_index;
    const running = correct + (thisCorrect ? 1 : 0);
    if (isLast) {
      onFinish(running);
      return;
    }
    setCorrect(running);
    setQIdx((i) => i + 1);
    setSelected(null);
  };

  return (
    <div className="card-soft space-y-4 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase text-goethe-blue">{label}</p>
        <span className="text-xs text-sage-500">
          {qIdx + 1} / {drills.length} · {correct} doğru
        </span>
      </div>
      <p className="text-base font-medium text-goethe-blue">{question.prompt_tr}</p>
      <p className="text-lg font-bold text-goethe-blue">{question.context_de}</p>
      <div className="space-y-2">
        {question.options.map((opt, i) => {
          let cls = "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";
          if (!showResult) {
            cls +=
              selected === i
                ? "border-goethe-blue bg-goethe-blue/5"
                : "border-sage-100 hover:border-sage-300";
          } else if (i === question.correct_index) {
            cls += "border-sage-500 bg-sage-100 font-medium";
          } else if (i === selected) {
            cls += "border-red-300 bg-red-50";
          } else {
            cls += "border-sage-100 opacity-60";
          }
          return (
            <button
              key={`${opt}-${i}`}
              type="button"
              disabled={showResult}
              className={cls}
              onClick={() => handleAnswer(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div
          className={`flex flex-col gap-2 rounded-lg p-3 text-sm ${
            isCorrect ? "bg-sage-100 text-sage-800" : "bg-red-50 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? <IconCheck size={18} /> : <IconX size={18} />}
            {isCorrect
              ? "Richtig!"
              : `Doğrusu: ${question.options[question.correct_index]}`}
          </div>
          {!isCorrect && question.explanation_tr && (
            <p className="text-xs text-sage-600">{question.explanation_tr}</p>
          )}
        </div>
      )}
      {showResult && (
        <button type="button" className="btn-primary-lg w-full" onClick={handleNext}>
          {isLast ? "Drill bitir" : "Sonraki →"}
        </button>
      )}
    </div>
  );
}
