"use client";

import { useMemo, useState } from "react";
import { RewardBurst } from "@/components/RewardBurst";
import { TrainerCorrectFeedback } from "@/components/grundlagen/TrainerCorrectFeedback";
import { TrainerHint } from "@/components/grundlagen/TrainerHint";
import { TrainerWrongFeedback } from "@/components/grundlagen/TrainerWrongFeedback";
import { checkSentenceBuilt } from "@/lib/germanTextCompare";
import type { WordOrderExercise } from "@/lib/grundlagen";
import { analyzeSatzMistake } from "@/lib/sentenceBuilderFeedback";
import { pickSessionReward } from "@/lib/trainerRewards";
import { useSessionStreak } from "@/lib/useSessionStreak";
import type { TrainerReward } from "@/lib/trainerRewards";

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
  const { recordCorrect, recordWrong } = useSessionStreak();
  const pool = useMemo(
    () => shuffle([...(exercise.tokens ?? []), ...(exercise.distractors ?? [])], exercise.id.length),
    [exercise]
  );
  const [available, setAvailable] = useState(pool);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [popKey, setPopKey] = useState(0);
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const [lastReward, setLastReward] = useState<TrainerReward | null>(null);

  const mistakeAnalysis = useMemo(() => {
    if (!checked || isCorrect || !exercise.answer_de) return null;
    return analyzeSatzMistake(selected, {
      tokens: exercise.tokens ?? [],
      distractors: exercise.distractors,
      answer_de: exercise.answer_de,
      hint_tr: exercise.hint_tr,
      explanation_tr: exercise.explanation_tr,
    });
  }, [checked, isCorrect, exercise, selected]);

  const pickToken = (token: string, idx: number) => {
    if (checked) return;
    setPopKey((k) => k + 1);
    setSelected((s) => [...s, token]);
    setAvailable((a) => a.filter((_, i) => i !== idx));
  };

  const removeToken = (idx: number) => {
    if (checked) return;
    setPopKey((k) => k + 1);
    const token = selected[idx];
    setSelected((s) => s.filter((_, i) => i !== idx));
    setAvailable((a) => [...a, token]);
  };

  const handleCheck = () => {
    if (!exercise.answer_de || selected.length === 0) return;
    const ok = checkSentenceBuilt(selected, exercise.answer_de);
    setChecked(true);
    setIsCorrect(ok);
    if (ok) {
      const streak = recordCorrect();
      const reward = pickSessionReward(streak, true);
      setLastReward(reward);
      if (reward) setRewardTrigger((t) => t + 1);
    } else {
      recordWrong();
      setLastReward(null);
    }
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="relative card-soft space-y-4 p-5">
      <RewardBurst trigger={rewardTrigger} reward={lastReward} />
      {exercise.statement_de && (
        <p className="rounded-lg bg-sage-50 p-3 text-sm">
          <span className="text-xs font-semibold uppercase text-sage-400">Cümle · </span>
          <span className="font-medium text-goethe-blue">{exercise.statement_de}</span>
        </p>
      )}
      <p className="text-base font-medium text-goethe-blue">{exercise.prompt_tr}</p>
      {exercise.hint_tr && !checked && <TrainerHint>{exercise.hint_tr}</TrainerHint>}

      <div className="min-h-[48px] rounded-xl border-2 border-dashed border-goethe-blue/30 bg-goethe-blue/5 p-3">
        {selected.length === 0 ? (
          <p className="text-center text-sm text-sage-400">Kelimeye dokun</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map((t, i) => (
              <button
                key={`${t}-${i}-${popKey}`}
                type="button"
                disabled={checked}
                className="animate-token-pop rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-goethe-blue shadow-sm"
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
            key={`${t}-${i}-${popKey}`}
            type="button"
            disabled={checked}
            className="animate-token-pop rounded-lg border border-sage-200 bg-white px-3 py-1.5 text-sm text-sage-700 hover:border-goethe-blue/40"
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
          {isCorrect && exercise.answer_de ? (
            <TrainerCorrectFeedback answer={exercise.answer_de} reward={lastReward} />
          ) : (
            mistakeAnalysis &&
            exercise.answer_de && (
              <TrainerWrongFeedback
                correctAnswer={exercise.answer_de}
                reasons={mistakeAnalysis.reasons}
                ruleTr={mistakeAnalysis.ruleTr}
              />
            )
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
  const { recordCorrect, recordWrong } = useSessionStreak();
  const [selected, setSelected] = useState<number | null>(null);
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const [lastReward, setLastReward] = useState<TrainerReward | null>(null);

  const isCompare = exercise.type === "compare";
  const showResult = selected !== null;
  const isCorrect = selected === exercise.correct_index;
  const correctOption = exercise.options?.[exercise.correct_index ?? 0] ?? "";

  const handleSelect = (i: number) => {
    if (showResult) return;
    setSelected(i);
    const ok = i === exercise.correct_index;
    if (ok) {
      const streak = recordCorrect();
      const reward = pickSessionReward(streak, true);
      setLastReward(reward);
      if (reward) setRewardTrigger((t) => t + 1);
    } else {
      recordWrong();
      setLastReward(null);
    }
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <div className="relative card-soft space-y-4 p-5">
      <RewardBurst trigger={rewardTrigger} reward={lastReward} />
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
      {exercise.hint_tr && !showResult && <TrainerHint>{exercise.hint_tr}</TrainerHint>}
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
              onClick={() => handleSelect(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="space-y-3">
          {isCorrect ? (
            <TrainerCorrectFeedback answer={correctOption} reward={lastReward} />
          ) : (
            <TrainerWrongFeedback
              correctAnswer={correctOption}
              reasons={exercise.explanation_tr ? [exercise.explanation_tr] : []}
              ruleTr={exercise.hint_tr ?? null}
            />
          )}
          <button type="button" className="btn-primary-lg w-full" onClick={handleNext}>
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
