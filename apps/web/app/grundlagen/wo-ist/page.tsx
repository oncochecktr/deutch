"use client";

import { PageShell } from "@/components/PageShell";
import { WoIstLegoTrainer } from "@/components/grundlagen/WoIstLegoTrainer";

export default function WoIstPage() {
  return (
    <PageShell
      title="Wo ist …?"
      subtitle="Lego kalıp · der/die/das · W-Frage"
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <WoIstLegoTrainer />
    </PageShell>
  );
}
