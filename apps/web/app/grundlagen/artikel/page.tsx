"use client";

import { getArtikelTrainer } from "@/lib/grundlagen";
import { PageShell } from "@/components/PageShell";
import { ArtikelTrainer } from "@/components/grundlagen/ArtikelTrainer";

export default function ArtikelPage() {
  const data = getArtikelTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={`${data.titleTr} — ${data.description}`}
      backHref="/grundlagen"
      backLabel="A1 çekirdek modüllere dön"
      maxWidth="md"
    >
      <ArtikelTrainer data={data} />
    </PageShell>
  );
}
