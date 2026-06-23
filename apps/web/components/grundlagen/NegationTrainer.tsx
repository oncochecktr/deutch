"use client";

import { SetTrainer } from "@/components/grundlagen/SetTrainer";
import type { SetTrainerData } from "@/lib/grundlagen";
import { markNegationCompleted, NEGATION_PASS_SCORE } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

export function NegationTrainer({ data }: { data: SetTrainerData }) {
  const { progress, updateProgress } = useProgress();
  return (
    <SetTrainer
      data={data}
      completed={progress.grundlagen.negationCompleted}
      scores={progress.grundlagen.negationScores}
      passScore={NEGATION_PASS_SCORE}
      drillLabel="Negation drill"
      showRules
      onComplete={(id, score) => updateProgress(markNegationCompleted(progress, id, score))}
    />
  );
}
