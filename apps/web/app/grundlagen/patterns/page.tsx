"use client";

import { getPatterns, getPatternTrainer } from "@/lib/grundlagen";
import { PageShell } from "@/components/PageShell";
import { PatternTrainer } from "@/components/grundlagen/PatternTrainer";

export default function PatternsPage() {
  const meta = getPatternTrainer();
  const patterns = getPatterns();

  return (
    <PageShell
      title={meta.title}
      subtitle={`${meta.titleTr} — ${meta.description}`}
      backHref="/grundlagen"
      backLabel="A1 çekirdek modüllere dön"
      maxWidth="md"
    >
      <PatternTrainer patterns={patterns} />
    </PageShell>
  );
}
