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
      subtitle="6 modül"
      backHref="/"
      maxWidth="lg"
    >
      <Link
        href="/grundlagen/motor-cumleler"
        className="card-soft mb-4 flex items-center justify-between gap-3 border-2 border-goethe-blue/25 bg-goethe-blue/5 p-5 transition hover:border-goethe-blue/45"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
            Ezber kalıpları
          </p>
          <h2 className="mt-1 text-lg font-bold text-goethe-blue">A1 Motor Cümleleri</h2>
          <p className="mt-1 text-sm text-sage-600">
            Hast du …? · Ich brauche … · Wo ist …? · Das ist …
          </p>
        </div>
        <span className="shrink-0 text-goethe-blue">→</span>
      </Link>

      <Link
        href="/grundlagen/sentence-engine"
        className="card-soft mb-4 flex items-center justify-between gap-3 border-2 border-goethe-gold/50 bg-goethe-gold/10 p-5 transition hover:border-goethe-gold/70"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
            Cümle motoru
          </p>
          <h2 className="mt-1 text-lg font-bold text-goethe-blue">Sentence Engine</h2>
          <p className="mt-1 text-sm text-sage-600">
            Pattern 01–10 · Adjective Engine · Lego
          </p>
        </div>
        <span className="shrink-0 text-goethe-blue">→</span>
      </Link>

      <Link
        href="/grundlagen/wo-ist"
        className="card-soft mb-4 flex items-center justify-between gap-3 border-2 border-goethe-blue/30 bg-goethe-blue/5 p-5 transition hover:border-goethe-blue/50"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
            Lego gramer
          </p>
          <h2 className="mt-1 text-lg font-bold text-goethe-blue">Wo ist …?</h2>
          <p className="mt-1 text-sm text-sage-600">
            Wo · ist · Artikel · ? — Bahnhof, Park, Café …
          </p>
        </div>
        <span className="shrink-0 text-goethe-blue">→</span>
      </Link>

      <Link
        href="/grundlagen/cumle-motoru"
        className="card-soft mb-4 flex items-center justify-between gap-3 border-2 border-goethe-gold/40 bg-goethe-gold/5 p-5 transition hover:border-goethe-gold/60"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
            İletişim omurgası
          </p>
          <h2 className="mt-1 text-lg font-bold text-goethe-blue">Kelime Oyunu</h2>
          <p className="mt-1 text-sm text-sage-600">
            852 kelime · cümle hafızası · puan
          </p>
        </div>
        <span className="shrink-0 text-goethe-blue">→</span>
      </Link>

      <Link
        href="/grundlagen/roadmap"
        className="card-soft mb-4 flex items-center justify-between gap-3 border-2 border-sage-100 p-5 transition hover:border-goethe-gold/40"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
            Almanca Motoru
          </p>
          <h2 className="mt-1 text-lg font-bold text-goethe-blue">Gramer yol haritası</h2>
          <p className="mt-1 text-sm text-sage-600">24 A1 kuralı</p>
        </div>
        <span className="shrink-0 text-goethe-blue">→</span>
      </Link>

      <Link
        href="/rehber/el-kitabi"
        className="card-soft mb-4 flex items-center justify-between gap-3 border-2 border-goethe-gold/30 bg-goethe-gold/5 p-5 transition hover:border-goethe-gold/50"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-gold">
            Rehber
          </p>
          <h2 className="mt-1 text-lg font-bold text-goethe-blue">A1–B1 El Kitabı</h2>
          <p className="mt-1 text-sm text-sage-600">
            Dilbilgisi rehberi · kasus, zamanlar, edatlar, yazma kalıpları
          </p>
        </div>
        <span className="shrink-0 text-goethe-blue">→</span>
      </Link>

      <div className="card-soft border-2 border-goethe-blue/20 p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          Öğrenme yolu — Adım 2
        </p>
        <h2 className="mt-1 text-lg font-bold text-goethe-blue">Gramer modülleri</h2>
        <p className="mt-2 text-sm text-sage-600">Sırayla ilerle.</p>
        <Link
          href={grammarStage.href}
          className="btn-primary mt-4 inline-flex items-center gap-2"
        >
          Devam et →
        </Link>
      </div>

      <Link
        href="/grundlagen/word-order"
        className="card-soft flex items-start gap-4 border-2 border-goethe-gold/40 bg-goethe-gold/5 p-5 transition hover:border-goethe-gold/60"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-goethe-blue text-lg font-bold text-white">
          1
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
            Satzstellung · Kelime sırası
          </p>
          <h2 className="mt-1 text-lg font-bold text-goethe-blue">Kelime sırası</h2>
          <p className="mt-1 text-sm text-sage-600">SVO · Ja/Nein · W-Fragen</p>
          <p className="mt-2 text-xs font-medium text-goethe-blue">
            {progress.grundlagen.wordOrderCompleted.length} /{" "}
            {GRUNDLAGEN_MODULES.find((m) => m.id === "word-order")?.sections ?? 6} bölüm tamam →
          </p>
        </div>
      </Link>

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
  } else if (m.id === "artikel") {
    const n = progress.grundlagen.articlesCompleted.length;
    done = n >= m.sections;
    progressLabel = `${n}/${m.sections}`;
  } else if (m.id === "dativ") {
    const n = progress.grundlagen.dativCompleted.length;
    done = n >= m.sections;
    progressLabel = `${n}/${m.sections}`;
  } else if (m.id === "negation") {
    const n = progress.grundlagen.negationCompleted.length;
    done = n >= m.sections;
    progressLabel = `${n}/${m.sections}`;
  } else if (m.id === "prepositions") {
    const n = progress.grundlagen.prepositionsCompleted.length;
    done = n >= m.sections;
    progressLabel = `${n}/${m.sections}`;
  } else if (m.id === "zeit") {
    done = progress.grundlagen.zeitQuizBest >= 50;
    progressLabel = `${progress.grundlagen.zeitQuizBest}%`;
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
