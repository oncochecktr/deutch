"use client";

import { SetTrainer } from "@/components/grundlagen/SetTrainer";
import type { SetTrainerData } from "@/lib/grundlagen";
import { markDativCompleted, DATIV_PASS_SCORE } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

export function DativTrainer({ data }: { data: SetTrainerData }) {
  const { progress, updateProgress } = useProgress();
  return (
    <SetTrainer
      data={data}
      completed={progress.grundlagen.dativCompleted}
      scores={progress.grundlagen.dativScores}
      passScore={DATIV_PASS_SCORE}
      drillLabel="Dativ drill"
      showRules
      onComplete={(id, score) => updateProgress(markDativCompleted(progress, id, score))}
    />
  );
}
