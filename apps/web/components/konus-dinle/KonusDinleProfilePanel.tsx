"use client";

import { IconStar } from "@/components/icons";
import { ProgressBar } from "@/components/ProgressBar";
import {
  buildKonusDinleGoalTree,
  overallKonusDinlePercent,
  suggestNextBranch,
} from "@/lib/konusDinleTree";
import type { KonusDinleProgress } from "@/lib/konusDinleStorage";
import { ensureTodayTurns, setDailyGoalTurns } from "@/lib/konusDinleStorage";
import { lengthLabelTr } from "@/components/konus-dinle/SessionHeader";

const GOAL_PRESETS = [10, 15, 20, 30];

interface KonusDinleProfilePanelProps {
  progress: KonusDinleProgress;
  onUpdate: (next: KonusDinleProgress) => void;
  onJumpToSuggested?: () => void;
}

export function KonusDinleProfilePanel({
  progress,
  onUpdate,
  onJumpToSuggested,
}: KonusDinleProfilePanelProps) {
  const p = ensureTodayTurns(progress);
  const tree = buildKonusDinleGoalTree(p);
  const overall = overallKonusDinlePercent(tree);
  const suggested = suggestNextBranch(p);
  const dailyPct = p.dailyGoalTurns
    ? Math.min(100, Math.round((p.todayTurns / p.dailyGoalTurns) * 100))
    : 0;

  const handleGoalChange = (value: number) => {
    onUpdate(setDailyGoalTurns(p, value));
  };

  return (
    <div className="card-soft space-y-4 border-2 border-goethe-blue/10 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
            Antrenman profilin
          </p>
          <p className="mt-0.5 text-xs text-sage-500">Sınav hazırlığı · acele yok</p>
        </div>
        <span className="rounded-full bg-goethe-blue px-2 py-0.5 text-[10px] font-bold text-white">
          A1→B1
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-goethe-gold/10 px-2 py-2">
          <p className="text-[10px] text-sage-500">XP</p>
          <p className="flex items-center justify-center gap-0.5 text-sm font-bold text-goethe-blue">
            <IconStar size={12} />
            {p.totalXp}
          </p>
        </div>
        <div className="rounded-xl bg-emerald-50 px-2 py-2">
          <p className="text-[10px] text-sage-500">Bugün</p>
          <p className="text-sm font-bold text-emerald-800">
            {p.todayTurns}/{p.dailyGoalTurns}
          </p>
        </div>
        <div className="rounded-xl bg-sage-50 px-2 py-2">
          <p className="text-[10px] text-sage-500">Seri</p>
          <p className="text-sm font-bold text-orange-600">{p.streak > 0 ? `🔥 ${p.streak}` : "—"}</p>
        </div>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-[10px] text-sage-500">
          <span>Tüm ağaç</span>
          <span>%{overall}</span>
        </div>
        <ProgressBar value={overall} size="sm" />
      </div>

      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3">
        <p className="mb-2 text-xs font-semibold text-emerald-900">Günlük hedef (tur)</p>
        <ProgressBar value={dailyPct} size="sm" variant="hero" />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {GOAL_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleGoalChange(n)}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                p.dailyGoalTurns === n
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        {p.todayTurns >= p.dailyGoalTurns && (
          <p className="mt-2 text-[10px] font-medium text-emerald-800">
            Hedef tamam — istersen devam et.
          </p>
        )}
      </div>

      {suggested && onJumpToSuggested && (
        <button
          type="button"
          onClick={onJumpToSuggested}
          className="w-full rounded-xl border border-goethe-gold/40 bg-goethe-gold/10 px-3 py-2.5 text-left text-xs transition hover:bg-goethe-gold/20"
        >
          <span className="font-bold text-goethe-blue">Sıradaki öneri →</span>
          <span className="mt-0.5 block text-sage-600">
            {suggested.level} · {lengthLabelTr(suggested.lengthFilter)} ({suggested.completed}/
            {suggested.total})
          </span>
        </button>
      )}

      <div className="grid grid-cols-3 gap-1 border-t border-sage-100 pt-3 text-center text-[10px]">
        {tree.map((lv) => (
          <div key={lv.level}>
            <p className="font-bold text-goethe-blue">{lv.level}</p>
            <p className="text-sage-500">{lv.total} ifade</p>
            <p className="text-sage-400">%{lv.percent}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
