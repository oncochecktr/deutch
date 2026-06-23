"use client";

import { IconStar } from "@/components/icons";

interface SessionHeaderProps {
  totalXp: number;
  sessionXp: number;
  streak: number;
  currentIndex: number;
  total: number;
  todayTurns?: number;
  dailyGoalTurns?: number;
  levelLabel?: string;
  lengthLabel?: string;
}

export function SessionHeader({
  totalXp,
  sessionXp,
  streak,
  currentIndex,
  total,
  todayTurns,
  dailyGoalTurns,
  levelLabel,
  lengthLabel,
}: SessionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sage-100 bg-white/80 px-3 py-2">
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1 font-semibold text-goethe-gold">
          <IconStar size={14} />
          {totalXp} XP
        </span>
        {sessionXp > 0 && <span className="text-sage-500">Oturum: +{sessionXp}</span>}
        {streak > 0 && <span className="font-medium text-orange-600">🔥 {streak} seri</span>}
        {todayTurns !== undefined && dailyGoalTurns !== undefined && (
          <span className="text-emerald-700">
            Bugün: {todayTurns}/{dailyGoalTurns}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-sage-500">
        {levelLabel && lengthLabel && (
          <span className="rounded-full bg-sage-100 px-2 py-0.5 font-medium text-goethe-blue">
            {levelLabel} · {lengthLabel}
          </span>
        )}
        <span className="tabular-nums">
          {total > 0 ? `${Math.min(currentIndex + 1, total)}/${total}` : "—"}
        </span>
      </div>
    </div>
  );
}

function lengthLabelTr(length: import("@/lib/konusDinlePlaylist").KonusDinleLengthFilter): string {
  if (length === "mixed") return "Karışık";
  return `${length} kelime`;
}

export { lengthLabelTr };
