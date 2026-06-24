"use client";

import { getA1Core, getSentenceExercises } from "@/lib/grundlagen";
import { PageShell } from "@/components/PageShell";
import { SentenceBuilder } from "@/components/grundlagen/SentenceBuilder";

export default function SatzPage() {
  const core = getA1Core();
  const exercises = getSentenceExercises();

  return (
    <PageShell
      title={core.sentenceBuilder.title}
      subtitle={`${core.sentenceBuilder.titleTr} — kelime parçalarından A1 cümlesi`}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <SentenceBuilder exercises={exercises} />
    </PageShell>
  );
}
