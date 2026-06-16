"use client";

import { PageShell } from "@/components/PageShell";
import { GrundlagenItemList } from "@/components/grundlagen/GrundlagenItemList";
import { getA1Core } from "@/lib/grundlagen";

export default function ZeitPage() {
  const { zeit } = getA1Core();

  return (
    <PageShell
      title={`${zeit.title} — ${zeit.titleTr}`}
      subtitle="Günün zamanları, hafta, aylar, saat söyleme"
      backHref="/grundlagen"
      backLabel="Temel modüllere dön"
      maxWidth="md"
    >
      <GrundlagenItemList sections={zeit.sections} />
    </PageShell>
  );
}
