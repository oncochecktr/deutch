"use client";

import { getWordOrderTrainer } from "@/lib/grundlagen";
import { PageShell } from "@/components/PageShell";
import { WordOrderTrainer } from "@/components/grundlagen/WordOrderTrainer";

export default function WordOrderPage() {
  const data = getWordOrderTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={`${data.titleTr} — ${data.description}`}
      backHref="/grundlagen"
      backLabel="A1 çekirdek modüllere dön"
      maxWidth="md"
    >
      <WordOrderTrainer data={data} />
    </PageShell>
  );
}
