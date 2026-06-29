"use client";

import { getWordOrderTrainer } from "@/lib/grundlagen";
import { ElKitabiReturnBanner } from "@/components/elKitabi/ElKitabiReturnBanner";
import { PageShell } from "@/components/PageShell";
import { WordOrderTrainer } from "@/components/grundlagen/WordOrderTrainer";

export default function WordOrderPage() {
  const data = getWordOrderTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={data.titleTr}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <ElKitabiReturnBanner />
      <WordOrderTrainer data={data} />
    </PageShell>
  );
}
