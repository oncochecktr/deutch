"use client";

import Link from "next/link";
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
      <Link
        href="/rehber/el-kitabi"
        className="card-soft mb-4 flex items-center justify-between gap-3 border-2 border-goethe-gold/40 bg-goethe-gold/5 p-4 transition hover:border-goethe-gold/60"
      >
        <div>
          <p className="text-xs font-semibold uppercase text-goethe-gold">Rehber</p>
          <p className="mt-1 text-sm font-bold text-goethe-blue">A1–B1 El Kitabı</p>
          <p className="mt-0.5 text-xs text-sage-600">
            Detaylı dilbilgisi rehberi — 11 bölüm, tablolar ve sınav kalıpları
          </p>
        </div>
        <span className="shrink-0 text-goethe-blue">→</span>
      </Link>
      <LearningMapTree map={map} />
    </PageShell>
  );
}
