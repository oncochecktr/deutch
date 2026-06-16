"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageShell } from "@/components/PageShell";
import { GRUNDLAGEN_MODULES } from "@/lib/grundlagen";
import { computeLearningPath } from "@/lib/learningPath";
import { useDashboardReport } from "@/lib/useDashboardReport";
import { IconCheck } from "@/components/icons";

export default function GrundlagenPage() {
  const { progress, report } = useDashboardReport();
  const path = useMemo(() => computeLearningPath(progress, report), [progress, report]);
  const grammarStage = path.stages.find((s) => s.id === "grammar")!;

  return (
    <PageShell
      title="Gramer temeli"
      subtitle="Adım 2 · Satz · Matrix · Possessive · Sıra · Pattern · Grammar Pack"
      backHref="/"
      maxWidth="lg"
    >
      <div className="card-soft border-2 border-goethe-blue/20 p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          Öğrenme yolu — Adım 2
        </p>
        <h2 className="mt-1 text-lg font-bold text-goethe-blue">Kelimeden cümleye, cümleden sınav metnine</h2>
        <p className="mt-2 text-sm text-sage-600">
          Sırayla ilerle. Her modül kısa — tek seferde bir tane bitir.
        </p>
        <Link
          href={grammarStage.href}
          className="btn-primary mt-4 inline-flex items-center gap-2"
        >
          Kaldığın yerden devam →
        </Link>
      </div>

      <ol className="space-y-3">
        {GRUNDLAGEN_MODULES.map((m, i) => (
          <GrammarModuleRow key={m.id} module={m} index={i + 1} progress={progress} />
        ))}
      </ol>
    </PageShell>
  );
}

function GrammarModuleRow({
  module: m,
  index,
  progress,
}: {
  module: (typeof GRUNDLAGEN_MODULES)[number];
  index: number;
  progress: ReturnType<typeof useDashboardReport>["progress"];
}) {
  let done = false;
  let progressLabel = "";

  if (m.id === "satz") {
    const n = progress.grundlagen.satzCompleted.length;
    done = n >= m.sections * 0.8;
    progressLabel = `${n}/${m.sections}`;
  } else if (m.id === "patterns") {
    const n = progress.grundlagen.patternsCompleted.length;
    done = n >= m.sections;
    progressLabel = `${n}/${m.sections}`;
  } else if (m.id === "conjugation") {
    const n = progress.grundlagen.conjugationCompleted.length;
    done = n >= m.sections;
    progressLabel = `${n}/${m.sections}`;
  } else if (m.id === "possessives") {
    const n = progress.grundlagen.possessivesCompleted.length;
    done = n >= m.sections;
    progressLabel = `${n}/${m.sections}`;
  } else if (m.id === "word-order") {
    const n = progress.grundlagen.wordOrderCompleted.length;
    done = n >= m.sections;
    progressLabel = `${n}/${m.sections}`;
  } else if (m.id === "grammar-pack") {
    const n = Object.keys(progress.grundlagen.grammarPack).length;
    done = n >= m.sections;
    progressLabel = `${n}/${m.sections}`;
  } else {
    progressLabel = "—";
  }

  return (
    <li>
      <Link
        href={m.href}
        className="card-soft flex items-center gap-4 border border-sage-100 p-4 transition hover:border-goethe-blue/30"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            done ? "bg-sage-200 text-sage-600" : "bg-goethe-blue/10 text-goethe-blue"
          }`}
        >
          {done ? <IconCheck size={18} /> : index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-goethe-blue">
            {m.de}
            <span className="ml-2 text-sm font-normal text-sage-500">{m.tr}</span>
          </p>
          <p className="mt-0.5 text-sm text-sage-600">{m.desc}</p>
        </div>
        {progressLabel !== "—" && (
          <span className="shrink-0 text-xs tabular-nums text-sage-400">{progressLabel}</span>
        )}
      </Link>
    </li>
  );
}
