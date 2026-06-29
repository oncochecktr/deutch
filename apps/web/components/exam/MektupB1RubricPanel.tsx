"use client";

import { scoreB1Rubric } from "@/lib/mektupB1";

export function MektupB1RubricPanel({
  text,
  bulletsOk,
  minWords,
}: {
  text: string;
  bulletsOk: boolean;
  minWords: number;
}) {
  const { total, items } = scoreB1Rubric(text, bulletsOk, minWords);

  return (
    <div className="card-soft border border-goethe-blue/15 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-sage-400">Tahmini puan</p>
        <p
          className={`text-2xl font-bold tabular-nums ${
            total >= 75 ? "text-sage-600" : total >= 50 ? "text-amber-700" : "text-goethe-red"
          }`}
        >
          {total}
          <span className="text-sm font-medium text-sage-400">/100</span>
        </p>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <div className="flex justify-between text-xs text-sage-600">
              <span>{item.label}</span>
              <span className="tabular-nums">{item.pct}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sage-100">
              <div
                className="h-full rounded-full bg-goethe-blue transition-all"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
