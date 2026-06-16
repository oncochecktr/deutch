"use client";

import { useMemo, useState } from "react";
import { IconCheck, IconX } from "@/components/icons";
import { checkSentenceBuilt } from "@/lib/germanTextCompare";
import type { WordOrderExercise } from "@/lib/grundlagen";

function shuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface WordOrderReorderProps {
  exercise: WordOrderExercise;
  onAnswer: (correct: boolean) => void;
}

export function WordOrderReorder({ exercise, onAnswer }: WordOrderReorderProps) {
  const pool = useMemo(
    () => shuffle([...(exercise.tokens ?? []), ...(exercise.distractors ?? [])], exercise.id.length),
    [exercise]
  );
  const [available, setAvailable] = useState(pool);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const pickToken = (token: string, idx: number) => {
    if (checked) return;
    setSelected((s) => [...s, token]);
    setAvailable((a) => a.filter((_, i) => i !== idx));
  };

  const removeToken = (idx: number) => {
    if (checked) return;
    const token = selected[idx];
    setSelected((s) => s.filter((_, i) => i !== idx));
    setAvailable((a) => [...a, token]);
  };

  const handleCheck = () => {
    if (!exercise.answer_de || selected.length === 0) return;
    const ok = checkSentenceBuilt(selected, exercise.answer_de);
    setChecked(true);
    setIsCorrect(ok);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="card-soft space-y-4 p-5">
      {exercise.statement_de && (
        <p className="rounded-lg bg-sage-50 p-3 text-sm">
          <span className="text-xs font-semibold uppercase text-sage-400">Cümle · </span>
          <span className="font-medium text-goethe-blue">{exercise.statement_de}</span>
        </p>
      )}
      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>
      {exercise.hint_tr && !checked && (
        <p className="text-xs text-sage-500">{exercise.hint_tr}</p>
      )}

      <div className="min-h-[48px] rounded-xl border-2 border-dashed border-goethe-blue/30 bg-goethe-blue/5 p-3">
        {selected.length === 0 ? (
          <p className="text-center text-sm text-sage-400">Kelimeye dokun</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((t, i) => (
              <button
                key={`${t}-${i}`}
                type="button"
                disabled={checked}
                className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-goethe-blue shadow-sm"
                onClick={() => removeToken(i)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {available.map((t, i) => (
          <button
            key={`${t}-${i}`}
            type="button"
            disabled={checked}
            className="rounded-lg border border-sage-200 bg-white px-3 py-1.5 text-sm text-sage-700 hover:border-goethe-blue/40"
            onClick={() => pickToken(t, i)}
          >
            {t}
          </button>
        ))}
      </div>

      {!checked ? (
        <button
          type="button"
          className="btn-primary-lg w-full"
          disabled={selected.length === 0}
          onClick={handleCheck}
        >
          Kontrol et
        </button>
      ) : (
        <div className="space-y-3">
          <div
            className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
              isCorrect ? "bg-sage-100 text-sage-800" : "bg-red-50 text-red-900"
            }`}
          >
            {isCorrect ? <IconCheck size={18} /> : <IconX size={18} />}
            {isCorrect ? "Richtig!" : `Doğrusu: ${exercise.answer_de}`}
          </div>
          {!isCorrect && exercise.hint_tr && (
            <p className="text-xs text-sage-600">{exercise.hint_tr}</p>
          )}
          <button type="button" className="btn-primary-lg w-full" onClick={handleNext}>
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}

interface WordOrderMcqProps {
  exercise: WordOrderExercise;
  onAnswer: (correct: boolean) => void;
}

export function WordOrderMcq({ exercise, onAnswer }: WordOrderMcqProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const isCompare = exercise.type === "compare";
  const showResult = selected !== null;
  const isCorrect = selected === exercise.correct_index;

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="card-soft space-y-4 p-5">
      {isCompare && exercise.statement_de && exercise.question_de && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-sage-100 bg-sage-50 p-3 text-sm">
            <p className="text-[10px] font-bold uppercase text-sage-400">Düz cümle</p>
            <p className="font-medium text-goethe-blue">{exercise.statement_de}</p>
          </div>
          <div className="rounded-lg border border-goethe-gold/30 bg-goethe-gold/10 p-3 text-sm">
            <p className="text-[10px] font-bold uppercase text-goethe-blue">Soru</p>
            <p className="font-medium text-goethe-blue">{exercise.question_de}</p>
          </div>
        </div>
      )}
      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>
      {!isCompare && exercise.context_de && (
        <p className="text-lg font-bold text-goethe-blue">{exercise.context_de}</p>
      )}
      <div className="space-y-2">
        {(exercise.options ?? []).map((opt, i) => {
          let cls = "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";
          if (!showResult) {
            cls +=
              selected === i
                ? "border-goethe-blue bg-goethe-blue/5"
                : "border-sage-100 hover:border-sage-300";
          } else if (i === exercise.correct_index) {
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
              onClick={() => setSelected(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="space-y-3">
          <div
            className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
              isCorrect ? "bg-sage-100 text-sage-800" : "bg-red-50 text-red-900"
            }`}
          >
            {isCorrect ? <IconCheck size={18} /> : <IconX size={18} />}
            {isCorrect
              ? "Richtig!"
              : `Doğrusu: ${exercise.options?.[exercise.correct_index ?? 0]}`}
          </div>
          {!isCorrect && exercise.explanation_tr && (
            <p className="text-xs text-sage-600">{exercise.explanation_tr}</p>
          )}
          <button type="button" className="btn-primary-lg w-full" onClick={handleNext}>
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
