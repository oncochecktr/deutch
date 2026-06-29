"use client";

import { getNegationTrainer } from "@/lib/grundlagen";
import { ElKitabiReturnBanner } from "@/components/elKitabi/ElKitabiReturnBanner";
import { PageShell } from "@/components/PageShell";
import { NegationTrainer } from "@/components/grundlagen/NegationTrainer";

export default function NegationPage() {
  const data = getNegationTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={data.titleTr}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <ElKitabiReturnBanner />
      <NegationTrainer data={data} />
    </PageShell>
  );
}
