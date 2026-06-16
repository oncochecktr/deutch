"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { GrammarView } from "@/components/grundlagen/GrammarView";
import { getA1Core } from "@/lib/grundlagen";

export default function GrammarPage() {
  const { grammar, fragewoerter } = getA1Core();

  return (
    <PageShell
      title={`${grammar.title} — ${grammar.titleTr}`}
      subtitle="Referans: sein, haben, Ja/Nein, Akkusativ, trennbar fiiller"
      backHref="/grundlagen"
      backLabel="Temel modüllere dön"
      maxWidth="lg"
    >
      <Link
        href="/grundlagen/grammar-pack"
        className="mb-4 block rounded-xl border-2 border-goethe-gold/40 bg-goethe-gold/10 p-4 text-sm transition hover:border-goethe-gold"
      >
        <span className="font-semibold text-goethe-blue">Grammar Pack — interaktif quiz →</span>
        <p className="mt-1 text-xs text-sage-600">6 bölüm, mini testler</p>
      </Link>
      <GrammarView grammar={grammar} fragewoerter={fragewoerter} />
    </PageShell>
  );
}
