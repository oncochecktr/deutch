"use client";

import { PageShell } from "@/components/PageShell";
import { ArtikelGame } from "@/components/grundlagen/ArtikelGame";

export default function ArtikelOyunPage() {
  return (
    <PageShell
      title="Artikel Oyunu"
      subtitle="der · die · das — sesle dinle, seç, ezberle"
      backHref="/grundlagen/artikel"
      backLabel="Artikel Trainer"
      maxWidth="md"
    >
      <ArtikelGame />
    </PageShell>
  );
}
