"use client";

import { getPrepositionsTrainer } from "@/lib/grundlagen";
import { PageShell } from "@/components/PageShell";
import { PrepositionsTrainer } from "@/components/grundlagen/PrepositionsTrainer";

export default function PrepositionsPage() {
  const data = getPrepositionsTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={data.titleTr}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <PrepositionsTrainer data={data} />
    </PageShell>
  );
}
