"use client";

import Link from "next/link";
import { IconArrowRight, IconCheck } from "@/components/icons";
import type { LearningPathState, LearningStage } from "@/lib/learningPath";

interface LearningPathHubProps {
  path: LearningPathState;
  overallPercent: number;
}

export function LearningPathHub({ path, overallPercent }: LearningPathHubProps) {
  return (
    <section className="card-soft overflow-hidden border-2 border-goethe-blue/20">
      <div className="bg-goethe-blue px-5 py-6 text-white sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              A1 öğrenme yolu · Adım {path.stages.find((s) => s.status === "active")?.step ?? 4}/4
            </p>
            <h1 className="mt-2 text-xl font-bold sm:text-2xl">{path.headline}</h1>
            <p className="mt-1 text-sm text-white/80">{path.subline}</p>
          </div>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold">
            %{overallPercent}
          </div>
        </div>

        <Link
          href={path.primaryHref}
          className="btn-primary-lg mt-5 flex w-full items-center justify-center gap-2 bg-goethe-gold text-goethe-blue shadow-md hover:brightness-105"
        >
          {path.primaryCta}
          <IconArrowRight size={20} />
        </Link>
      </div>

      <div className="p-4 sm:p-5">
        <ol className="space-y-2">
          {path.stages.map((stage) => (
            <StageRow key={stage.id} stage={stage} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function StageRow({ stage }: { stage: LearningStage }) {
  const isActive = stage.status === "active";
  const isDone = stage.status === "done";
  const isLocked = stage.status === "locked";

  const content = (
    <>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          isDone
            ? "bg-sage-200 text-sage-600"
            : isActive
              ? "bg-goethe-gold text-goethe-blue ring-2 ring-goethe-gold/40"
              : "bg-sage-100 text-sage-400"
        }`}
      >
        {isDone ? <IconCheck size={16} /> : stage.step}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold ${
            isLocked ? "text-sage-400" : isActive ? "text-goethe-blue" : "text-sage-600"
          }`}
        >
          {stage.title}
        </p>
        <p className={`text-xs ${isLocked ? "text-sage-300" : "text-sage-500"}`}>
          {stage.tagline}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs font-medium tabular-nums text-sage-500">%{stage.progress}</p>
        {isActive && (
          <span className="mt-0.5 block text-[10px] font-semibold uppercase text-goethe-gold">
            Devam
          </span>
        )}
      </div>
    </>
  );

  if (isLocked) {
    return (
      <li className="flex items-center gap-3 rounded-xl border border-sage-100 bg-sage-50/50 px-3 py-3 opacity-70">
        {content}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={stage.href}
        className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${
          isActive
            ? "border-2 border-goethe-gold bg-goethe-gold/10"
            : "border border-sage-100 hover:border-sage-300 hover:bg-sage-50"
        }`}
      >
        {content}
      </Link>
    </li>
  );
}
