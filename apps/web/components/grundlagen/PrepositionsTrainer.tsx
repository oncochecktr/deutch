"use client";

import { SetTrainer } from "@/components/grundlagen/SetTrainer";
import type { SetTrainerData } from "@/lib/grundlagen";
import { markPrepositionCompleted, PREPOSITION_PASS_SCORE } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

export function PrepositionsTrainer({ data }: { data: SetTrainerData }) {
  const { progress, updateProgress } = useProgress();
  return (
    <SetTrainer
      data={data}
      completed={progress.grundlagen.prepositionsCompleted}
      scores={progress.grundlagen.prepositionScores}
      passScore={PREPOSITION_PASS_SCORE}
      drillLabel="Edat drill"
      showRules
      onComplete={(id, score) => updateProgress(markPrepositionCompleted(progress, id, score))}
    />
  );
}
