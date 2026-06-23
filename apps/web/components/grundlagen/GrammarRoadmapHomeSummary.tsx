"use client";

import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { ProgressBar } from "@/components/ProgressBar";
import { GrammarRoadmapCardCompact } from "@/components/grundlagen/GrammarRoadmapCard";
import { buildGrammarRoadmap } from "@/lib/grammarRoadmap";
import { useDashboardReport } from "@/lib/useDashboardReport";

export function GrammarRoadmapHomeSummary() {
  const { progress } = useDashboardReport();
  const roadmap = buildGrammarRoadmap(progress, "A1");
  const active =
    roadmap.cards.find((c) => c.id === roadmap.activeCardId) ??
    roadmap.cards.find((c) => c.status === "available") ??
    roadmap.cards[0];

  const preview = roadmap.cards
    .filter((c) => c.status !== "done")
    .slice(0, 3);

  return (
    <section className="card-soft overflow-hidden border-2 border-goethe-blue/25 shadow-md">
      <div className="bg-gradient-to-br from-goethe-blue to-goethe-blue/90 px-5 py-6 text-white sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-gold">
          Almanca Motoru · Gramer yol haritası
        </p>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">
          {active ? `${active.order}. ${active.title}` : "Gramer yolculuğuna başla"}
        </h1>
        <p className="mt-1 text-sm text-white/85">
          {roadmap.completedCount}/{roadmap.totalCount} A1 kuralı · Der/die/das&apos;tan Perfekt&apos;e
          sıralı ilerleme
        </p>
        <div className="mt-4">
          <ProgressBar value={roadmap.completionPct} size="lg" variant="hero" showPercent />
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            href={roadmap.continueHref}
            className="btn-primary-lg flex flex-1 items-center justify-center gap-2 bg-goethe-gold text-goethe-blue"
          >
            Kaldığın yerden devam
            <IconArrowRight size={18} />
          </Link>
          <Link
            href="/grundlagen/roadmap"
            className="flex flex-1 items-center justify-center rounded-xl border-2 border-white/30 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Tüm haritayı gör
          </Link>
        </div>
      </div>
      {preview.length > 0 && (
        <div className="space-y-2 border-t border-sage-100 bg-cream-50/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sage-400">
            Sıradaki kurallar
          </p>
          {preview.map((card) => (
            <GrammarRoadmapCardCompact key={card.id} card={card} />
          ))}
        </div>
      )}
    </section>
  );
}
