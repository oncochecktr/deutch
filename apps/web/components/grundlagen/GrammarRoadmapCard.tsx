"use client";

import Link from "next/link";
import { IconArrowRight, IconCheck } from "@/components/icons";
import { ProgressBar } from "@/components/ProgressBar";
import type { GrammarRuleCard } from "@/lib/grammarRoadmap";

const STATUS_LABEL: Record<GrammarRuleCard["status"], string> = {
  locked: "Kilitli",
  available: "Başla",
  in_progress: "Devam",
  done: "Tamam",
};

const STATUS_STYLE: Record<GrammarRuleCard["status"], string> = {
  locked: "border-sage-100 bg-sage-50 opacity-60",
  available: "border-goethe-gold/40 bg-white hover:border-goethe-gold/70",
  in_progress: "border-goethe-blue/30 bg-goethe-blue/5",
  done: "border-sage-200 bg-sage-50/80",
};

export function GrammarRoadmapCard({ card }: { card: GrammarRuleCard }) {
  const isLink = card.status !== "locked";
  const inner = (
  <>
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            card.status === "done"
              ? "bg-sage-200 text-sage-700"
              : card.status === "in_progress"
                ? "bg-goethe-gold text-goethe-blue"
                : "bg-sage-100 text-sage-500"
          }`}
        >
          {card.status === "done" ? <IconCheck size={16} /> : card.order}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-goethe-blue">
              {card.title}
              {card.titleDe && (
                <span className="ml-1 text-xs font-normal text-sage-400">· {card.titleDe}</span>
              )}
            </h3>
            <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-sage-600">
              {STATUS_LABEL[card.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-sage-600">{card.summary}</p>
          <p className="mt-2 text-sm font-medium text-goethe-blue">{card.exampleDe}</p>
          {card.exampleTr && card.exampleTr !== "Örnek modülde" && (
            <p className="text-xs text-sage-500">{card.exampleTr}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold text-sage-500">
            {card.quizCount > 0 && <span>{card.quizCount} quiz</span>}
            {card.drillCount > 0 && <span>{card.drillCount} drill</span>}
            {card.quizCount === 0 && card.drillCount === 0 && <span>Referans</span>}
          </div>
          {card.completionPct > 0 && card.status !== "done" && (
            <div className="mt-2">
              <ProgressBar value={card.completionPct} size="sm" variant="sage" />
            </div>
          )}
        </div>
      </div>
  </>
  );

  if (!isLink) {
    return (
      <li className={`rounded-xl border-2 p-4 ${STATUS_STYLE[card.status]}`}>{inner}</li>
    );
  }

  return (
    <li>
      <Link
        href={card.href}
        className={`block rounded-xl border-2 p-4 transition ${STATUS_STYLE[card.status]}`}
      >
        {inner}
      </Link>
    </li>
  );
}

export function GrammarRoadmapCardCompact({ card }: { card: GrammarRuleCard }) {
  return (
    <Link
      href={card.href}
      className="flex items-center gap-3 rounded-lg border border-sage-100 bg-white px-3 py-2.5 transition hover:border-goethe-blue/30"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-600">
        {card.status === "done" ? <IconCheck size={12} /> : card.order}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-goethe-blue">{card.title}</p>
        <p className="truncate text-[11px] text-sage-500">{card.summary}</p>
      </div>
      <span className="shrink-0 text-xs tabular-nums text-sage-400">%{card.completionPct}</span>
    </Link>
  );
}
