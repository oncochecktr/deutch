"use client";

import { PageShell } from "@/components/PageShell";
import { DasIstLegoTrainer } from "@/components/grundlagen/DasIstLegoTrainer";

export default function DasIstPage() {
  return (
    <PageShell
      title="Das ist … → Er / Es / Sie"
      subtitle="Tanıştır · yorum · iki satır"
      backHref="/grundlagen/sentence-engine"
      backLabel="Sentence Engine"
      maxWidth="md"
    >
      <DasIstLegoTrainer />
    </PageShell>
  );
}
