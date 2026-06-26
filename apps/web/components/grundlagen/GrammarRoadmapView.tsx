"use client";

import Link from "next/link";
import { useState } from "react";
import { IconArrowRight } from "@/components/icons";
import { ProgressBar } from "@/components/ProgressBar";
import { GrammarRoadmapCard } from "@/components/grundlagen/GrammarRoadmapCard";
import { MotorJourneyPanel } from "@/components/grundlagen/MotorJourneyPanel";
import { buildGrammarRoadmap, type RoadmapLevel } from "@/lib/grammarRoadmap";
import { useDashboardReport } from "@/lib/useDashboardReport";

const LEVELS: { id: RoadmapLevel; label: string; note?: string }[] = [
  { id: "A1", label: "A1" },
  { id: "A2", label: "A2" },
  { id: "B1", label: "B1", note: "Yakında" },
];

export function GrammarRoadmapView() {
  const { progress } = useDashboardReport();
  const [level, setLevel] = useState<RoadmapLevel>("A1");

  if (level === "B1") {
    return (
      <div className="space-y-4">
        <LevelTabs level={level} onChange={setLevel} />
        <div className="card-soft border-2 border-dashed border-sage-200 p-8 text-center">
          <p className="text-lg font-bold text-goethe-blue">B1 — Yakında</p>
          <p className="mt-2 text-sm text-sage-600">
            Relativsätze ve B1 gramer yakında.
          </p>
        </div>
      </div>
    );
  }

  const roadmap = buildGrammarRoadmap(progress, level);

  return (
    <div className="space-y-4">
      <LevelTabs level={level} onChange={setLevel} />
      {level === "A1" && <MotorJourneyPanel progress={progress} />}
      <div className="card-soft border-2 border-goethe-blue/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
              Almanca Motoru · {level}
            </p>
            <p className="mt-1 text-sm text-sage-600">
              {roadmap.completedCount}/{roadmap.totalCount} kural
            </p>
          </div>
          <span className="text-2xl font-bold tabular-nums text-goethe-blue">
            %{roadmap.completionPct}
          </span>
        </div>
        <ProgressBar value={roadmap.completionPct} size="md" variant="gold" className="mt-3" />
        <Link
          href={roadmap.continueHref}
          className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
        >
          Devam et
          <IconArrowRight size={18} />
        </Link>
      </div>
      <ol className="space-y-3">
        {roadmap.cards.map((card) => (
          <GrammarRoadmapCard key={card.id} card={card} />
        ))}
      </ol>
    </div>
  );
}

function LevelTabs({
  level,
  onChange,
}: {
  level: RoadmapLevel;
  onChange: (l: RoadmapLevel) => void;
}) {
  return (
    <div className="flex gap-2">
      {LEVELS.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onChange(l.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            level === l.id
              ? "bg-goethe-blue text-white"
              : "bg-sage-100 text-sage-600 hover:bg-sage-200"
          }`}
        >
          {l.label}
          {l.note && <span className="ml-1 text-[10px] opacity-70">({l.note})</span>}
        </button>
      ))}
    </div>
  );
}
