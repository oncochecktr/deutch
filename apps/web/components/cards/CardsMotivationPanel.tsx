"use client";

import { ProgressBar } from "@/components/ProgressBar";

interface ProgressRowProps {
  label: string;
  studied: number;
  total: number;
  variant: "gold" | "sage";
}

function ProgressRow({ label, studied, total, variant }: ProgressRowProps) {
  const pct = total ? Math.min(100, Math.round((studied / total) * 100)) : 0;
  const left = Math.max(0, total - studied);
  const done = studied >= total && total > 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">{label}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold tabular-nums text-goethe-blue">
            {studied}/{total}
          </span>
          {done ? (
            <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-semibold text-sage-600">
              Tamam
            </span>
          ) : (
            <span className="text-xs tabular-nums text-sage-500">{left} kaldı</span>
          )}
        </div>
      </div>
      <ProgressBar value={pct} size="sm" variant={variant} className="mt-1.5" />
    </div>
  );
}

interface CardsMotivationPanelProps {
  learnedToday: number;
  dailyGoal: number;
  poolStudied: number;
  poolTotal: number;
  groupStudied: number;
  groupTotal: number;
  groupLabel: string;
  showGroup?: boolean;
}

export function CardsMotivationPanel({
  learnedToday,
  dailyGoal,
  poolStudied,
  poolTotal,
  groupStudied,
  groupTotal,
  groupLabel,
  showGroup = true,
}: CardsMotivationPanelProps) {
  const dailyPct = dailyGoal ? Math.min(100, Math.round((learnedToday / dailyGoal) * 100)) : 0;
  const dailyDone = learnedToday >= dailyGoal;
  const dailyLeft = Math.max(0, dailyGoal - learnedToday);

  return (
    <div className="card-soft space-y-3 p-3">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">
            Bugünün hedefi
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold tabular-nums text-goethe-blue">
              {learnedToday}/{dailyGoal}
            </span>
            {dailyDone ? (
              <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs font-semibold text-sage-600">
                Tamam
              </span>
            ) : (
              <span className="text-xs tabular-nums text-sage-500">{dailyLeft} kaldı</span>
            )}
          </div>
        </div>
        <ProgressBar value={dailyPct} size="sm" variant="gold" className="mt-1.5" />
      </div>

      <ProgressRow
        label="A1 kelime havuzu"
        studied={poolStudied}
        total={poolTotal}
        variant="sage"
      />

      {showGroup && groupTotal > 0 && groupTotal !== poolTotal && (
        <ProgressRow
          label={groupLabel}
          studied={groupStudied}
          total={groupTotal}
          variant="gold"
        />
      )}
    </div>
  );
}
