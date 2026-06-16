"use client";

import { useCallback, useMemo, useState } from "react";
import { AudioButton } from "@/components/AudioButton";
import { IconCheck, IconX } from "@/components/icons";
import { checkSentenceBuilt } from "@/lib/germanTextCompare";
import type { SentenceExercise } from "@/lib/grundlagen";
import { markSatzCompleted } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface SentenceBuilderProps {
  exercises: SentenceExercise[];
}

export function SentenceBuilder({ exercises }: SentenceBuilderProps) {
  const { progress, updateProgress } = useProgress();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const exercise = exercises[index];
  const completed = progress.grundlagen.satzCompleted;

  const pool = useMemo(() => {
    if (!exercise) return [];
    return shuffle([...exercise.tokens, ...exercise.distractors]);
  }, [exercise]);

  const [available, setAvailable] = useState<string[]>(pool);

  const resetExercise = useCallback(
    (nextIndex: number) => {
      const ex = exercises[nextIndex];
      if (!ex) return;
      setIndex(nextIndex);
      setSelected([]);
      setChecked(false);
      setIsCorrect(false);
      setAvailable(shuffle([...ex.tokens, ...ex.distractors]));
    },
    [exercises]
  );

  const pickToken = (token: string, fromPoolIdx: number) => {
    if (checked) return;
    setSelected((s) => [...s, token]);
    setAvailable((a) => a.filter((_, i) => i !== fromPoolIdx));
  };

  const removeToken = (tokenIdx: number) => {
    if (checked) return;
    const token = selected[tokenIdx];
    setSelected((s) => s.filter((_, i) => i !== tokenIdx));
    setAvailable((a) => [...a, token]);
  };

  const handleCheck = () => {
    if (!exercise || selected.length === 0) return;
    const ok = checkSentenceBuilt(selected, exercise.answer_de);
    setChecked(true);
    setIsCorrect(ok);
    if (ok) {
      updateProgress(markSatzCompleted(progress, exercise.id));
    }
  };

  const handleNext = () => {
    const next = (index + 1) % exercises.length;
    resetExercise(next);
  };

  if (!exercise) return null;

  const doneCount = completed.length;
  const alreadyDone = completed.includes(exercise.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-sage-500">
        <span>
          Egzersiz {index + 1} / {exercises.length}
        </span>
        <span className="font-medium text-goethe-blue">
          Tamamlanan: {doneCount} / {exercises.length}
        </span>
      </div>

      <div className="card-soft p-5">
        <p className="text-xs font-semibold uppercase text-sage-400">Türkçe anlam</p>
        <p className="mt-2 text-lg font-semibold text-goethe-blue">{exercise.prompt_tr}</p>
        {exercise.hint && (
          <p className="mt-2 text-xs text-sage-500">İpucu: {exercise.hint}</p>
        )}
      </div>

      <div className="card-soft min-h-[72px] p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase text-sage-400">Cümlen</p>
        {selected.length === 0 ? (
          <p className="text-sm italic text-sage-400">Aşağıdaki kelimelere dokun…</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((token, i) => (
              <button
                key={`${token}-${i}`}
                type="button"
                onClick={() => removeToken(i)}
                className="rounded-lg bg-goethe-blue px-3 py-1.5 text-sm font-medium text-white"
              >
                {token}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {available.map((token, i) => (
          <button
            key={`${token}-${i}-${available.length}`}
            type="button"
            onClick={() => pickToken(token, i)}
            disabled={checked}
            className="rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm font-medium text-goethe-blue transition hover:border-goethe-blue/40 disabled:opacity-50"
          >
            {token}
          </button>
        ))}
      </div>

      {checked && (
        <div
          className={`rounded-xl p-4 text-sm ${
            isCorrect ? "bg-sage-100 text-sage-800" : "bg-red-50 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {isCorrect ? (
              <>
                <IconCheck size={18} /> Richtig!
              </>
            ) : (
              <>
                <IconX size={18} /> Falsch
              </>
            )}
          </div>
          {!isCorrect && (
            <p className="mt-2">
              Doğru: <strong>{exercise.answer_de}</strong>
            </p>
          )}
          {isCorrect && (
            <div className="mt-3 flex justify-center">
              <AudioButton text={exercise.answer_de} label="Cümleyi dinle" />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {!checked ? (
          <>
            <button
              type="button"
              className="btn-primary-lg flex-1"
              disabled={selected.length === 0}
              onClick={handleCheck}
            >
              Kontrol et
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => resetExercise(index)}
            >
              Sıfırla
            </button>
          </>
        ) : (
          <button type="button" className="btn-primary-lg w-full" onClick={handleNext}>
            Sonraki cümle →
          </button>
        )}
      </div>

      {alreadyDone && !checked && (
        <p className="text-center text-xs text-sage-500">Bu cümleyi daha önce doğru kurdun.</p>
      )}
    </div>
  );
}
