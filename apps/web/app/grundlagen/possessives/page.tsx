"use client";

import { getPossessiveTrainer } from "@/lib/grundlagen";
import { ElKitabiReturnBanner } from "@/components/elKitabi/ElKitabiReturnBanner";
import { PageShell } from "@/components/PageShell";
import { PossessiveTrainer } from "@/components/grundlagen/PossessiveTrainer";

export default function PossessivesPage() {
  const data = getPossessiveTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={data.titleTr}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <ElKitabiReturnBanner />
      <PossessiveTrainer data={data} />
    </PageShell>
  );
}
