"use client";

import { getDativTrainer } from "@/lib/grundlagen";
import { ElKitabiReturnBanner } from "@/components/elKitabi/ElKitabiReturnBanner";
import { PageShell } from "@/components/PageShell";
import { DativTrainer } from "@/components/grundlagen/DativTrainer";

export default function DativPage() {
  const data = getDativTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={data.titleTr}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <ElKitabiReturnBanner />
      <DativTrainer data={data} />
    </PageShell>
  );
}
