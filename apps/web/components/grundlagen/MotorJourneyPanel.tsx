"use client";

import Link from "next/link";
import { IconArrowRight, IconCheck, IconLock } from "@/components/icons";
import { ProgressBar } from "@/components/ProgressBar";
import type { UserProgress } from "@/lib/progress";
import {
  A1_MOTOR_JOURNEY,
  A1_READINESS_MILESTONE,
  motorJourneyState,
} from "@/lib/motorJourney";

export function MotorJourneyPanel({ progress }: { progress: UserProgress }) {
  const { steps, doneCount, total, pct, active, readyFeel } = motorJourneyState(progress);

  return (
    <div className="space-y-4">
      <div className="card-soft border-2 border-goethe-gold/35 bg-goethe-gold/5 p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          A1 Motor Yolu · Gramer hack
        </p>
        <p className="mt-2 text-sm text-sage-700">
          Kursa para ödemeden önce aynı motoru burada kur. Adım adım — kafa karışmadan.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs tabular-nums text-sage-500">
            {doneCount}/{total} adım · durum:{" "}
            <span className="font-semibold text-goethe-blue">{readyFeel}</span>
          </p>
          <span className="text-lg font-bold tabular-nums text-goethe-gold">%{pct}</span>
        </div>
        <ProgressBar value={pct} size="sm" variant="gold" className="mt-2" />
        <Link
          href={active.href}
          className="btn-primary mt-4 flex w-full items-center justify-center gap-2"
        >
          Adım {active.step}: devam et
          <IconArrowRight size={18} />
        </Link>
      </div>

      <ol className="space-y-2">
        {steps.map((s) => (
          <li key={s.step}>
            <Link
              href={s.href}
              className={`card-soft flex items-start gap-3 border p-4 transition hover:border-goethe-blue/30 ${
                s.done ? "border-sage-100 bg-sage-50/50" : s.step === active.step ? "border-goethe-blue/30" : "border-sage-100"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  s.done
                    ? "bg-sage-200 text-sage-700"
                    : s.step === active.step
                      ? "bg-goethe-blue text-white"
                      : "bg-sage-100 text-sage-500"
                }`}
              >
                {s.done ? <IconCheck size={16} /> : s.step}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-goethe-blue">
                  {s.step}. {s.titleTr}
                </p>
                <p className="text-xs text-sage-500">{s.formula}</p>
                <p className="mt-1 text-sm text-sage-600">{s.hackTr}</p>
                <p className="mt-1 text-[10px] uppercase text-sage-400">{s.weekHint}</p>
              </div>
              {!s.done && s.step > active.step && (
                <IconLock size={14} className="mt-1 shrink-0 text-sage-300" />
              )}
            </Link>
          </li>
        ))}
      </ol>

      <div className="card-soft border border-goethe-blue/20 p-4">
        <p className="text-sm font-bold text-goethe-blue">{A1_READINESS_MILESTONE.title}</p>
        <p className="mt-1 text-sm text-sage-600">{A1_READINESS_MILESTONE.summary}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-sage-700">
          {A1_READINESS_MILESTONE.signals.map((sig) => (
            <li key={sig} className="flex gap-2">
              <span className="text-goethe-gold">·</span>
              {sig}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs font-medium text-goethe-blue">
          Tipik süre: {A1_READINESS_MILESTONE.typicalWeeks} (günde 30–45 dk)
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={A1_READINESS_MILESTONE.examHref} className="btn-secondary text-sm">
            Sınav modülü
          </Link>
          <Link href={A1_READINESS_MILESTONE.wordsHref} className="btn-secondary text-sm">
            Kelimeler
          </Link>
        </div>
      </div>
    </div>
  );
}
