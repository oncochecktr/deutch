"use client";

import type { KonusDinleGradeResult } from "@/lib/konusDinleGrading";
import { tierLabelTr } from "@/lib/konusDinleGrading";

interface FeedbackPanelProps {
  result: KonusDinleGradeResult;
  xpEarned: number;
  onContinue: () => void;
  onRetry: () => void;
}

const TIER_STYLES: Record<KonusDinleGradeResult["tier"], string> = {
  perfect: "border-goethe-gold/40 bg-amber-50/80",
  great: "border-emerald-300 bg-emerald-50/60",
  good: "border-emerald-200 bg-emerald-50/40",
  retry: "border-amber-200 bg-amber-50/60",
  unclear: "border-sage-200 bg-sage-50/80",
};

export function FeedbackPanel({ result, xpEarned, onContinue, onRetry }: FeedbackPanelProps) {
  const showReward = result.isGood || result.tier === "perfect";
  return (
    <div className={`animate-feedback-in welcome-pop rounded-2xl border-2 p-4 ${TIER_STYLES[result.tier]}`}>
      {showReward && (
        <div className="animate-reward-pop mb-2 inline-flex rounded-lg border border-goethe-gold/50 bg-goethe-gold/15 px-2.5 py-1">
          <span className="text-xs font-bold text-goethe-blue">+{xpEarned} XP</span>
        </div>
      )}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase text-goethe-blue">
          {tierLabelTr(result.tier)}
        </span>
        <span className="text-[10px] text-sage-500">Skor: {result.score}%</span>
        <span className="text-[10px] font-semibold text-goethe-gold">+{xpEarned} XP</span>
      </div>
      <p className="text-sm leading-relaxed text-sage-800">{result.message}</p>
      {result.userHeard !== "—" && result.tier !== "perfect" && (
        <p className="mt-2 text-xs text-sage-500">
          Duyduğum: <span className="italic">{result.userHeard}</span>
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-primary-lg flex-1 sm:flex-none" onClick={onContinue}>
          Devam et →
        </button>
        <button
          type="button"
          className="rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm font-medium text-sage-600 transition hover:bg-sage-50"
          onClick={onRetry}
        >
          Tekrar dene
        </button>
      </div>
    </div>
  );
}
