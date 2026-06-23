"use client";

import { SetTrainer } from "@/components/grundlagen/SetTrainer";
import type { SetTrainerData } from "@/lib/grundlagen";
import { markArtikelCompleted, ARTIKEL_PASS_SCORE } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

export function ArtikelTrainer({ data }: { data: SetTrainerData }) {
  const { progress, updateProgress } = useProgress();
  return (
    <SetTrainer
      data={data}
      completed={progress.grundlagen.articlesCompleted}
      scores={progress.grundlagen.articleScores}
      passScore={ARTIKEL_PASS_SCORE}
      drillLabel="Artikel drill"
      showRules
      onComplete={(id, score) => updateProgress(markArtikelCompleted(progress, id, score))}
    />
  );
}
