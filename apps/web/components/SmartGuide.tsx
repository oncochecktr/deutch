"use client";

import Link from "next/link";
import type { A1ReadinessReport } from "@/lib/readinessEngine";
import { getTodayFocusSuggestion } from "@/lib/errorEngine";
import { useProgress } from "@/lib/ProgressContext";
import { ResetSRSButton } from "@/components/ResetSRSButton";
import { IconArrowRight, IconCheck } from "@/components/icons";

interface SmartGuideProps {
  report: A1ReadinessReport;
}

function DailyStepRow({
  step,
  isCurrent,
  isDone,
}: {
  step: A1ReadinessReport["dailyPlan"][0];
  isCurrent: boolean;
  isDone: boolean;
}) {
  return (
    <Link
      href={step.href}
      className={`flex gap-3 rounded-lg px-3 py-3 transition ${
        isCurrent
          ? "border-2 border-goethe-gold bg-goethe-gold/10"
          : isDone
            ? "bg-sage-50 text-sage-400 line-through"
            : "border border-sage-100 hover:border-sage-300"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isCurrent
            ? "bg-goethe-gold text-goethe-blue"
            : isDone
              ? "bg-sage-200 text-sage-500"
              : "bg-sage-100 text-sage-500"
        }`}
      >
        {isDone ? <IconCheck size={14} /> : step.order}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${isCurrent ? "text-goethe-blue" : "text-sage-700"}`}>
          {step.title}
        </p>
        {step.subtitle && (
          <p className={`mt-0.5 text-xs leading-relaxed ${isDone ? "text-sage-300" : "text-sage-500"}`}>
            {step.subtitle}
          </p>
        )}
      </div>
      <span className="shrink-0 self-start rounded-full bg-white px-2 py-1 text-xs font-medium tabular-nums text-sage-500">
        {step.progress}
      </span>
    </Link>
  );
}

export function SmartGuide({ report }: SmartGuideProps) {
  const { progress } = useProgress();
  const weakFocus = getTodayFocusSuggestion(progress);
  const next = report.nextStep;
  if (!next) return null;

  const remaining = report.dailyPlan.filter((s) => !s.done && s.id !== "rest").length;

  return (
    <section className="card-soft overflow-hidden border-2 border-goethe-gold/60 shadow-md">
      <div className="bg-gradient-to-r from-goethe-gold/20 to-goethe-gold/5 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
              Akıllı rehber — Adım {next.order}
              {remaining > 1 ? ` / ${report.dailyPlan.length} görev kaldı` : ""}
            </p>
            <h2 className="mt-1 text-lg font-bold text-goethe-blue">
              {next.id === "rest" ? "Bugün bitti" : "Şimdi ne yapacaksın?"}
            </h2>
            {next.subtitle && (
              <p className="mt-1 text-sm font-medium text-sage-600">{next.title}</p>
            )}
            <p className="mt-1 max-w-xl text-sm text-sage-600">{next.instruction}</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-sage-500">
            ~{next.estMinutes} dk
          </span>
        </div>

        {next.href === "/review" ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href={next.href}
              className="btn-primary-lg flex flex-1 items-center justify-center gap-2 bg-goethe-gold text-goethe-blue shadow-sm hover:brightness-105"
            >
              {next.cta}
              <IconArrowRight size={20} />
            </Link>
            <ResetSRSButton className="btn-secondary-lg flex flex-1 border-goethe-blue/20 text-goethe-blue sm:max-w-[11rem]" />
          </div>
        ) : (
          <Link
            href={next.href}
            className="btn-primary-lg mt-4 flex w-full items-center justify-center gap-2 bg-goethe-gold text-goethe-blue shadow-sm hover:brightness-105"
          >
            {next.cta}
            <IconArrowRight size={20} />
          </Link>
        )}
        <p className="mt-2 text-center text-xs text-sage-500">
          İlerleme: <strong>{next.progress}</strong>
        </p>
      </div>

      {weakFocus && (
        <div className="border-t border-sage-100 bg-sage-50 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
            Zayıf konu — akıllı yönlendirme
          </p>
          <p className="mt-1 text-sm text-sage-700">{weakFocus.reason}</p>
          <Link
            href={weakFocus.href}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-goethe-blue hover:underline"
          >
            {weakFocus.cta}
            <IconArrowRight size={16} />
          </Link>
        </div>
      )}

      {report.dailyPlan.length > 1 && (
        <div className="border-t border-sage-100 bg-white p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sage-400">
            Bugünün sırası
          </p>
          <p className="mb-3 text-xs text-sage-500">
            Goethe bölümleri Almanca adıyla — parantez içinde Türkçe anlamı.
          </p>
          <ol className="space-y-2">
            {report.dailyPlan.map((step) => {
              const isCurrent = step.id === next.id && !step.done;
              const isDone = step.done || step.id === "rest";
              return (
                <li key={step.id}>
                  <DailyStepRow step={step} isCurrent={isCurrent} isDone={isDone} />
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}

export function getHighlightedHref(report: A1ReadinessReport): string | null {
  if (report.nextStep?.id === "rest") return null;
  return report.nextStep?.href ?? null;
}
