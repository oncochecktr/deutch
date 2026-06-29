"use client";

import { ProgressBar } from "@/components/ProgressBar";

interface CardsDailyGoalProps {
  learnedToday: number;
  goal: number;
  compact?: boolean;
}

export function CardsDailyGoal({ learnedToday, goal, compact }: CardsDailyGoalProps) {
  const pct = goal ? Math.min(100, Math.round((learnedToday / goal) * 100)) : 0;
  const done = learnedToday >= goal;

  return (
    <div className={`card-soft ${compact ? "p-3" : "p-4"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">
          Bugünün hedefi
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold text-goethe-blue">
            {learnedToday}/{goal}
          </span>
          {done ? (
            <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-semibold text-sage-600">
              Tamam
            </span>
          ) : (
            <span className="text-xs text-sage-500">{goal - learnedToday} kaldı</span>
          )}
        </div>
      </div>
      <ProgressBar value={pct} size={compact ? "sm" : "md"} variant="gold" className="mt-2" />
    </div>
  );
}
