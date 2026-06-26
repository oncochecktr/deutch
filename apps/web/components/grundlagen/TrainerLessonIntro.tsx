"use client";

import type { ReactNode } from "react";

export interface TrainerLessonSection {
  id: string;
  title: string;
  body: string;
  variant?: "default" | "callout" | "tip";
}

export interface TrainerLessonRule {
  label: string;
  tr: string;
}

export function TrainerLessonIntro({
  badge,
  title,
  summary,
  sections,
  rules,
  rulesTitle = "Kurallar",
  children,
}: {
  badge?: string;
  title: string;
  summary?: string;
  sections?: TrainerLessonSection[];
  rules?: TrainerLessonRule[];
  rulesTitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="card-soft border border-goethe-blue/20 p-4">
        {badge && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-sage-500">{badge}</p>
        )}
        <p className={`font-bold text-goethe-blue ${badge ? "mt-1 text-lg" : "text-lg"}`}>
          {title}
        </p>
        {summary && <p className="mt-2 text-sm text-sage-700">{summary}</p>}
      </div>

      {sections?.map((s) => (
        <LessonSection key={s.id} section={s} />
      ))}

      {children}

      {rules && rules.length > 0 && <TrainerLessonRulesTable title={rulesTitle} rules={rules} />}
    </div>
  );
}

function LessonSection({ section }: { section: TrainerLessonSection }) {
  const variant = section.variant ?? "default";

  if (variant === "callout") {
    return (
      <div className="card-soft border-2 border-goethe-gold/40 bg-goethe-gold/10 p-4">
        <p className="text-sm font-bold text-goethe-blue">{section.title}</p>
        <p className="mt-1 text-sm text-sage-700">{section.body}</p>
      </div>
    );
  }

  if (variant === "tip") {
    return (
      <div className="rounded-xl border border-sage-200 bg-sage-50/80 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-sage-500">{section.title}</p>
        <p className="mt-1 text-sm text-sage-700">{section.body}</p>
      </div>
    );
  }

  return (
    <div className="card-soft border border-sage-100 p-4">
      <p className="text-sm font-semibold text-goethe-blue">{section.title}</p>
      <p className="mt-1 text-sm text-sage-700">{section.body}</p>
    </div>
  );
}

export function TrainerLessonRulesTable({
  title = "Kurallar",
  rules,
}: {
  title?: string;
  rules: TrainerLessonRule[];
}) {
  return (
    <div className="card-soft overflow-x-auto p-4">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sage-500">{title}</p>
      <table className="w-full text-sm">
        <tbody>
          {rules.map((r) => (
            <tr key={r.label} className="border-b border-sage-50">
              <td className="py-2 pr-3 font-semibold text-goethe-blue">{r.label}</td>
              <td className="py-2 text-sage-600">{r.tr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TrainerLessonCompare({
  title,
  left,
  right,
}: {
  title: string;
  left: { label: string; de: string; tr: string };
  right: { label: string; de: string; tr: string };
}) {
  return (
    <div className="card-soft border border-goethe-gold/30 p-4">
      <p className="text-sm font-bold text-goethe-blue">{title}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <CompareCard {...left} />
        <CompareCard {...right} />
      </div>
    </div>
  );
}

function CompareCard({ label, de, tr }: { label: string; de: string; tr: string }) {
  return (
    <div className="rounded-xl border border-sage-100 bg-sage-50/80 p-3">
      <p className="text-[10px] font-bold uppercase text-sage-500">{label}</p>
      <p className="mt-1 font-semibold text-goethe-blue">{de}</p>
      <p className="mt-1 text-xs text-sage-600">{tr}</p>
    </div>
  );
}
