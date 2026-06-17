"use client";

import { useMemo } from "react";
import { getA1Vocabulary, getTimurVocabulary } from "@german-coach/vocabulary";
import { useProgress } from "@/lib/ProgressContext";
import { computeA1Readiness } from "@/lib/readinessEngine";
import { getSRSStats } from "@/lib/srs";

export function useDashboardReport() {
  const { progress, hydrated } = useProgress();
  const a1 = getA1Vocabulary();
  const mesleki = getTimurVocabulary();
  const allIds = useMemo(
    () => [...a1.words.map((w) => w.id), ...mesleki.words.map((w) => w.id)],
    [a1.words, mesleki.words]
  );

  const report = useMemo(
    () => computeA1Readiness(progress, allIds),
    [progress, allIds]
  );

  const srs = useMemo(
    () => getSRSStats(allIds, progress.srsRecords),
    [allIds, progress.srsRecords]
  );

  return { progress, report, srs, a1, mesleki, allIds, hydrated };
}
