"use client";

import { getDativTrainer } from "@/lib/grundlagen";
import { PageShell } from "@/components/PageShell";
import { DativTrainer } from "@/components/grundlagen/DativTrainer";

export default function DativPage() {
  const data = getDativTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={`${data.titleTr} — ${data.description}`}
      backHref="/grundlagen"
      backLabel="A1 çekirdek modüllere dön"
      maxWidth="md"
    >
      <DativTrainer data={data} />
    </PageShell>
  );
}
