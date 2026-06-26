"use client";

import Link from "next/link";
import type { MotorDrillGroup } from "@/lib/motorDrills";

interface MotorDrillPanelProps {
  groups: MotorDrillGroup[];
  /** Tüm bankaya link göster */
  showAllLink?: boolean;
}

export function MotorDrillPanel({ groups, showAllLink = false }: MotorDrillPanelProps) {
  if (groups.length === 0) return null;

  return (
    <section className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="card-soft space-y-3 border border-goethe-gold/25 bg-goethe-gold/5 p-4"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
              Motor cümle
            </p>
            <h3 className="font-semibold text-goethe-blue">{group.title}</h3>
            <p className="text-xs text-sage-500">{group.titleTr}</p>
          </div>

          <ul className="space-y-3">
            {group.lines.map((line, i) =>
              line.type === "dialogue" ? (
                <li key={i} className="space-y-1.5 rounded-xl border border-sage-100 bg-white p-3">
                  <DrillLine de={line.question_de} tr={line.question_tr} variant="question" />
                  <DrillLine de={line.answer_de} tr={line.answer_tr} variant="answer" />
                </li>
              ) : (
                <li key={i} className="rounded-xl border border-sage-100 bg-white p-3">
                  <DrillLine de={line.de} tr={line.tr} />
                </li>
              )
            )}
          </ul>
        </div>
      ))}

      {showAllLink && (
        <Link
          href="/grundlagen/motor-cumleler"
          className="block text-center text-sm font-medium text-goethe-blue hover:underline"
        >
          Tüm motor cümle bankası →
        </Link>
      )}
    </section>
  );
}

function DrillLine({
  de,
  tr,
  variant,
}: {
  de: string;
  tr: string;
  variant?: "question" | "answer";
}) {
  const badge =
    variant === "question" ? "S" : variant === "answer" ? "C" : null;

  return (
    <div className="flex gap-2">
      {badge && (
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
            variant === "question"
              ? "bg-goethe-blue/15 text-goethe-blue"
              : "bg-sage-100 text-sage-600"
          }`}
        >
          {badge}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-goethe-blue">{de}</p>
        <p className="text-xs text-sage-500">{tr}</p>
      </div>
    </div>
  );
}
