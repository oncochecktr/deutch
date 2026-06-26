"use client";

import { PageShell } from "@/components/PageShell";
import { SentenceEngineHub } from "@/components/grundlagen/SentenceEngineHub";

export default function SentenceEnginePage() {
  return (
    <PageShell
      title="Sentence Engine"
      subtitle="20 cümle kalıbı — kelime değil, motor"
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <SentenceEngineHub />
    </PageShell>
  );
}
