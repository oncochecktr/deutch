"use client";

import { useMemo } from "react";
import { PageShell } from "@/components/PageShell";
import { LearningMapTree } from "@/components/LearningMapTree";
import { computeLearningMap } from "@/lib/learningMap";
import { useDashboardReport } from "@/lib/useDashboardReport";

export default function HaritaPage() {
  const { progress, report, hydrated } = useDashboardReport();
  const map = useMemo(
    () => (hydrated ? computeLearningMap(progress, report) : null),
    [progress, report, hydrated]
  );

  if (!hydrated || !map) {
    return (
      <PageShell title="Öğrenme haritası" subtitle="Yükleniyor…" maxWidth="lg">
        <div className="card-soft p-8 text-center text-sm text-sage-500">Harita hazırlanıyor…</div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Öğrenme haritası"
      subtitle="Kök → dal → meyve · A1’den B1’e nerede olduğunu gör"
      backHref="/"
      maxWidth="lg"
    >
      <LearningMapTree map={map} />
    </PageShell>
  );
}
