"use client";

import { getConjugationMatrix } from "@/lib/grundlagen";
import { ElKitabiReturnBanner } from "@/components/elKitabi/ElKitabiReturnBanner";
import { PageShell } from "@/components/PageShell";
import { ConjugationMatrix } from "@/components/grundlagen/ConjugationMatrix";

export default function ConjugationPage() {
  const data = getConjugationMatrix();

  return (
    <PageShell
      title={data.title}
      subtitle={data.titleTr}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <ElKitabiReturnBanner />
      <ConjugationMatrix data={data} />
    </PageShell>
  );
}
