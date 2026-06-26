"use client";

import { PageShell } from "@/components/PageShell";
import { DasIstPossessiveLegoTrainer } from "@/components/grundlagen/DasIstPossessiveLegoTrainer";

export default function DasIstMeinPage() {
  return (
    <PageShell
      title="Das ist mein … → Er / Es / Sie"
      subtitle="benim · senin · bizim · onların"
      backHref="/grundlagen/sentence-engine"
      backLabel="Sentence Engine"
      maxWidth="md"
    >
      <DasIstPossessiveLegoTrainer />
    </PageShell>
  );
}
