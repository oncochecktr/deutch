"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ContentTransition } from "@/components/ContentTransition";
import { RewardBurst } from "@/components/RewardBurst";
import { TrainerCorrectFeedback } from "@/components/grundlagen/TrainerCorrectFeedback";
import { TrainerHint } from "@/components/grundlagen/TrainerHint";
import { TrainerWrongFeedback } from "@/components/grundlagen/TrainerWrongFeedback";
import { checkSentenceBuilt } from "@/lib/germanTextCompare";
import type { SentenceExercise } from "@/lib/grundlagen";
import { analyzeSatzMistake } from "@/lib/sentenceBuilderFeedback";
import { markSatzCompleted } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import { pickCorrectReward } from "@/lib/trainerRewards";
import { useSessionStreak } from "@/lib/useSessionStreak";
import type { SlideDirection } from "@/components/ContentTransition";
import type { TrainerReward } from "@/lib/trainerRewards";

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
  const { recordCorrect, recordWrong } = useSessionStreak();
  const [index, setIndex] = useState(0);
  const [slideDir, setSlideDir] = useState<SlideDirection>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const [lastReward, setLastReward] = useState<TrainerReward | null>(null);
  const [popKey, setPopKey] = useState(0);
  const [counterBump, setCounterBump] = useState(false);

  const exercise = exercises[index];
  const completed = progress.grundlagen.satzCompleted;

  const pool = useMemo(() => {
    if (!exercise) return [];
    return shuffle([...exercise.tokens, ...exercise.distractors]);
  }, [exercise]);

  const [available, setAvailable] = useState<string[]>(pool);

  const mistakeAnalysis = useMemo(() => {
    if (!exercise || !checked || isCorrect) return null;
    return analyzeSatzMistake(selected, exercise);
  }, [exercise, selected, checked, isCorrect]);

  const doneCount = completed.length;
  const alreadyDone = exercise ? completed.includes(exercise.id) : false;
  const prevDoneRef = useRef(doneCount);

  useEffect(() => {
    if (prevDoneRef.current !== doneCount) {
      setCounterBump(true);
      const t = setTimeout(() => setCounterBump(false), 400);
      prevDoneRef.current = doneCount;
      return () => clearTimeout(t);
    }
    prevDoneRef.current = doneCount;
  }, [doneCount]);

  const resetExercise = useCallback(
    (nextIndex: number) => {
      const ex = exercises[nextIndex];
      if (!ex) return;
      setSlideDir(nextIndex > index ? 1 : -1);
      setIndex(nextIndex);
      setSelected([]);
      setChecked(false);
      setIsCorrect(false);
      setLastReward(null);
      setAvailable(shuffle([...ex.tokens, ...ex.distractors]));
    },
    [exercises, index]
  );

  const pickToken = (token: string, fromPoolIdx: number) => {
    if (checked) return;
    setPopKey((k) => k + 1);
    setSelected((s) => [...s, token]);
    setAvailable((a) => a.filter((_, i) => i !== fromPoolIdx));
  };

  const removeToken = (tokenIdx: number) => {
    if (checked) return;
    setPopKey((k) => k + 1);
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
      const isFirstEver = !alreadyDone;
      const sessionStreak = recordCorrect();
      const nextTotal = isFirstEver ? doneCount + 1 : doneCount;
      const reward = pickCorrectReward({
        sessionStreak,
        isFirstEver,
        totalCompleted: nextTotal,
      });
      setLastReward(reward);
      if (reward) setRewardTrigger((t) => t + 1);
      updateProgress(markSatzCompleted(progress, exercise.id));
    } else {
      recordWrong();
      setLastReward(null);
    }
  };

  const handleNext = () => {
    const next = (index + 1) % exercises.length;
    resetExercise(next);
  };

  if (!exercise) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-sage-500">
        <span>
          Egzersiz {index + 1} / {exercises.length}
        </span>
        <span
          className={`font-medium text-goethe-blue ${counterBump ? "animate-counter-bump inline-block" : ""}`}
        >
          Tamamlanan: {doneCount} / {exercises.length}
        </span>
      </div>

      <div className="relative">
        <RewardBurst trigger={rewardTrigger} reward={lastReward} />
        <ContentTransition stepKey={exercise.id} direction={slideDir}>
          <div className="space-y-4">
            <div className="card-soft p-5">
              <p className="text-xs font-semibold uppercase text-sage-400">Türkçe anlam</p>
              <p className="mt-2 text-lg font-semibold text-goethe-blue sm:text-xl">
                {exercise.prompt_tr}
              </p>
              {exercise.hint && !checked && <TrainerHint>{exercise.hint}</TrainerHint>}
            </div>

            <div className="card-soft min-h-[72px] p-4">
              <p className="mb-2 text-[10px] font-semibold uppercase text-sage-400">Cümlen</p>
              {selected.length === 0 ? (
                <p className="text-sm italic text-sage-400">Aşağıdaki kelimelere dokun…</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selected.map((token, i) => (
                    <button
                      key={`${token}-${i}-${popKey}`}
                      type="button"
                      onClick={() => removeToken(i)}
                      disabled={checked}
                      className="animate-token-pop rounded-lg bg-goethe-blue px-3 py-1.5 text-sm font-medium text-white disabled:opacity-80"
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
                  key={`${token}-${i}-${available.length}-${popKey}`}
                  type="button"
                  onClick={() => pickToken(token, i)}
                  disabled={checked}
                  className="animate-token-pop rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm font-medium text-goethe-blue transition hover:border-goethe-blue/40 disabled:opacity-50"
                >
                  {token}
                </button>
              ))}
            </div>

            {checked &&
              (isCorrect ? (
                <TrainerCorrectFeedback answer={exercise.answer_de} reward={lastReward} />
              ) : (
                mistakeAnalysis && (
                  <TrainerWrongFeedback
                    correctAnswer={exercise.answer_de}
                    reasons={mistakeAnalysis.reasons}
                    ruleTr={mistakeAnalysis.ruleTr}
                  />
                )
              ))}

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
              <p className="text-center text-xs text-sage-500">
                Bu cümleyi daha önce doğru kurdun.
              </p>
            )}
          </div>
        </ContentTransition>
      </div>
    </div>
  );
}
