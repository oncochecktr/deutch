"use client";

import { Suspense } from "react";
import { GrammarPackView } from "@/components/grundlagen/GrammarPackView";
import { PageShell } from "@/components/PageShell";
import { getA1Core, getGrammarPackSections } from "@/lib/grundlagen";

export default function GrammarPackPage() {
  const core = getA1Core();
  const sections = getGrammarPackSections();

  return (
    <PageShell
      title={core.grammarPack.title}
      subtitle={`${core.grammarPack.titleTr} — ${sections.length} bölüm, referans + mini quiz`}
      backHref="/grundlagen"
      backLabel="A1 çekirdek modüllere dön"
      maxWidth="md"
    >
      <Suspense fallback={<p className="text-sm text-sage-500">Yükleniyor…</p>}>
        <GrammarPackView sections={sections} />
      </Suspense>
    </PageShell>
  );
}
