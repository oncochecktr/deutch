"use client";

import { PageShell } from "@/components/PageShell";
import { GrammarRoadmapView } from "@/components/grundlagen/GrammarRoadmapView";
import { StorageWarningBanner } from "@/components/StorageWarningBanner";

export default function GrammarRoadmapPage() {
  return (
    <PageShell
      title="Gramer yol haritası"
      subtitle="A1 motor yolu + çekirdek kurallar"
      backHref="/"
      backLabel="Panele dön"
      maxWidth="lg"
    >
      <StorageWarningBanner className="mb-4" />
      <GrammarRoadmapView />
    </PageShell>
  );
}
