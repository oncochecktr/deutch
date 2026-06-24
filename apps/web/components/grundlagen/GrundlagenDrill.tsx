"use client";

import { useState } from "react";
import { ContentTransition } from "@/components/ContentTransition";
import { RewardBurst } from "@/components/RewardBurst";
import { TrainerCorrectFeedback } from "@/components/grundlagen/TrainerCorrectFeedback";
import { TrainerWrongFeedback } from "@/components/grundlagen/TrainerWrongFeedback";
import type { TrainerDrill } from "@/lib/grundlagen";
import type { SlideDirection } from "@/components/ContentTransition";
import { pickSessionReward } from "@/lib/trainerRewards";
import { useSessionStreak } from "@/lib/useSessionStreak";
import type { TrainerReward } from "@/lib/trainerRewards";

interface GrundlagenDrillProps {
  drills: TrainerDrill[];
  onFinish: (correct: number) => void;
  label?: string;
}

export function GrundlagenDrillPanel({ drills, onFinish, label = "Drill" }: GrundlagenDrillProps) {
  const { recordCorrect, recordWrong } = useSessionStreak();
  const [qIdx, setQIdx] = useState(0);
  const [slideDir, setSlideDir] = useState<SlideDirection>(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const [lastReward, setLastReward] = useState<TrainerReward | null>(null);

  const question = drills[qIdx];
  if (!question) return null;

  const showResult = selected !== null;
  const isCorrect = selected === question.correct_index;
  const isLast = qIdx >= drills.length - 1;
  const correctAnswer = question.options[question.correct_index];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const ok = idx === question.correct_index;
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
    if (selected === null) return;
    const thisCorrect = selected === question.correct_index;
    const running = correct + (thisCorrect ? 1 : 0);
    if (isLast) {
      onFinish(running);
      return;
    }
    setCorrect(running);
    setSlideDir(1);
    setQIdx((i) => i + 1);
    setSelected(null);
    setLastReward(null);
  };

  return (
    <ContentTransition stepKey={`drill-${qIdx}`} direction={slideDir}>
      <div className="relative card-soft space-y-4 p-5">
        <RewardBurst trigger={rewardTrigger} reward={lastReward} />
        <div className="flex items-center justify-between">
          <p className="text-label font-semibold uppercase text-goethe-blue">{label}</p>
          <span className="text-sm text-sage-500">
            {qIdx + 1} / {drills.length} · {correct} doğru
          </span>
        </div>
        <p className="text-base font-medium text-goethe-blue">{question.prompt_tr}</p>
        <p className="text-lg font-bold text-goethe-blue">{question.context_de}</p>
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            let cls = "w-full rounded-xl border px-4 py-3.5 text-left text-base transition ";
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
        {showResult &&
          (isCorrect ? (
            <TrainerCorrectFeedback answer={correctAnswer} reward={lastReward} />
          ) : (
            <TrainerWrongFeedback
              correctAnswer={correctAnswer}
              reasons={question.explanation_tr ? [question.explanation_tr] : []}
            />
          ))}
        {showResult && (
          <button type="button" className="btn-primary-lg w-full" onClick={handleNext}>
            {isLast ? "Drill bitir" : "Sonraki →"}
          </button>
        )}
      </div>
    </ContentTransition>
  );
}
