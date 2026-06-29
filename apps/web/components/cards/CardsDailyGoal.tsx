"use client";

import { ProgressBar } from "@/components/ProgressBar";

interface CardsDailyGoalProps {
  learnedToday: number;
  goal: number;
}

export function CardsDailyGoal({ learnedToday, goal }: CardsDailyGoalProps) {
  const pct = goal ? Math.min(100, Math.round((learnedToday / goal) * 100)) : 0;
  const done = learnedToday >= goal;

  return (
    <div className="card-soft p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">
            Bugünün hedefi
          </p>
          <p className="mt-1 text-lg font-bold text-goethe-blue">
            {learnedToday} / {goal} kelime
          </p>
        </div>
        {done ? (
          <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-600">
            Hedef tamam
          </span>
        ) : (
          <span className="text-xs text-sage-500">{goal - learnedToday} kaldı</span>
        )}
      </div>
      <ProgressBar value={pct} size="md" variant="gold" className="mt-3" />
    </div>
  );
}
