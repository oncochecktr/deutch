"use client";

import { getConjugationMatrix } from "@/lib/grundlagen";
import { PageShell } from "@/components/PageShell";
import { ConjugationMatrix } from "@/components/grundlagen/ConjugationMatrix";

export default function ConjugationPage() {
  const data = getConjugationMatrix();

  return (
    <PageShell
      title={data.title}
      subtitle={`${data.titleTr} — ${data.description}`}
      backHref="/grundlagen"
      backLabel="A1 çekirdek modüllere dön"
      maxWidth="md"
    >
      <ConjugationMatrix data={data} />
    </PageShell>
  );
}
