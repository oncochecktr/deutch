"use client";

import { useMemo } from "react";
import { PageShell } from "@/components/PageShell";
import { LearningMapTree } from "@/components/LearningMapTree";
import { computeLearningMap } from "@/lib/learningMap";
import { useDashboardReport } from "@/lib/useDashboardReport";

export default function HaritaPage() {
  const { progress, report } = useDashboardReport();
  const map = useMemo(() => computeLearningMap(progress, report), [progress, report]);

  return (
    <PageShell
      title="Öğrenme haritası"
      subtitle="Kök → dal → meyve · A1'den B1'e nerede olduğunu gör"
      backHref="/"
      maxWidth="lg"
    >
      <LearningMapTree map={map} />
    </PageShell>
  );
}
