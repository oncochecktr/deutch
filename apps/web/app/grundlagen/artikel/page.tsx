"use client";

import { getArtikelTrainer } from "@/lib/grundlagen";
import { PageShell } from "@/components/PageShell";
import { ArtikelTrainer } from "@/components/grundlagen/ArtikelTrainer";

export default function ArtikelPage() {
  const data = getArtikelTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={data.titleTr}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <ArtikelTrainer data={data} />
    </PageShell>
  );
}
