"use client";

import { PageShell } from "@/components/PageShell";
import { AdjektivLegoTrainer } from "@/components/grundlagen/AdjektivLegoTrainer";

export default function AdjektivEnginePage() {
  return (
    <PageShell
      title="Adjective Engine"
      subtitle="Pattern 02 · Artikel + Sıfat + İsim"
      backHref="/grundlagen/sentence-engine"
      backLabel="Sentence Engine"
      maxWidth="md"
    >
      <AdjektivLegoTrainer />
    </PageShell>
  );
}
