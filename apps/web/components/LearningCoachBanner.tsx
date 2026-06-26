"use client";

import Link from "next/link";
import { IconArrowRight, IconCheck } from "@/components/icons";
import type { LearningCoachState, MethodStepState } from "@/lib/learningCoach";

interface LearningCoachBannerProps {
  coach: LearningCoachState;
  /** Oturum içi kutlama (kart sayfası) */
  variant?: "session" | "home";
  sessionTitle?: string;
  sessionBody?: string;
  sessionHref?: string;
  sessionCta?: string;
}

export function LearningCoachBanner({
  coach,
  variant = "home",
  sessionTitle,
  sessionBody,
  sessionHref,
  sessionCta,
}: LearningCoachBannerProps) {
  if (variant === "session" && sessionTitle && sessionHref) {
    return (
      <div className="animate-fade-in-up rounded-xl border-2 border-goethe-gold/50 bg-goethe-gold/10 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          Sıradaki adım
        </p>
        <p className="mt-1 text-base font-bold text-goethe-blue">{sessionTitle}</p>
        {sessionBody && <p className="mt-1 text-sm text-sage-600">{sessionBody}</p>}
        <Link
          href={sessionHref}
          className="btn-primary mt-3 inline-flex items-center gap-2 text-sm"
        >
          {sessionCta ?? "Devam et"}
          <IconArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <section className="card-soft overflow-hidden border border-goethe-blue/15">
      <div className="bg-goethe-blue/5 px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          Öğrenme koçu
        </p>
        <h2 className="mt-1 text-lg font-bold text-goethe-blue">{coach.headline}</h2>
        <p className="mt-1 text-sm text-sage-600">{coach.advice}</p>
        <Link
          href={coach.activeStep.href}
          className="btn-primary mt-3 inline-flex items-center gap-2 text-sm"
        >
          {coach.activeStep.cta}
          <IconArrowRight size={16} />
        </Link>
      </div>
      <ol className="divide-y divide-sage-100 px-2 py-2 sm:px-3">
        {coach.steps.map((step) => (
          <MethodStepRow key={step.id} step={step} />
        ))}
      </ol>
    </section>
  );
}

function MethodStepRow({ step }: { step: MethodStepState }) {
  const isActive = step.status === "active";
  const isDone = step.status === "done";

  const inner = (
    <>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isDone
            ? "bg-sage-200 text-sage-600"
            : isActive
              ? "bg-goethe-gold text-goethe-blue"
              : "bg-sage-100 text-sage-400"
        }`}
      >
        {isDone ? <IconCheck size={14} /> : step.order}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold ${
            isActive ? "text-goethe-blue" : isDone ? "text-sage-500" : "text-sage-400"
          }`}
        >
          {step.title}
          {isActive && (
            <span className="ml-2 text-[10px] font-bold uppercase text-goethe-gold">Şimdi</span>
          )}
        </p>
        <p className="text-xs text-sage-500">{step.progressLabel}</p>
      </div>
    </>
  );

  if (isDone) {
    return <li className="flex items-center gap-3 rounded-lg px-2 py-2 opacity-80">{inner}</li>;
  }

  return (
    <li>
      <Link
        href={step.href}
        className={`flex items-center gap-3 rounded-lg px-2 py-2 transition ${
          isActive ? "bg-goethe-gold/10 hover:bg-goethe-gold/15" : "hover:bg-sage-50"
        }`}
      >
        {inner}
        {!isActive && <IconArrowRight size={14} className="shrink-0 text-sage-300" />}
      </Link>
    </li>
  );
}
