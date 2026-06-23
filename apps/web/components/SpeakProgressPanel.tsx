"use client";



import type { LevelProgress } from "@/lib/speakProgress";

import type { SpeakApiUsageTotals } from "@/lib/speakApiUsage";

import { formatCostUsd, formatTokenCount } from "@/lib/speakApiUsage";

import type { SpeakDailySteps } from "@/lib/speakDailySteps";

import { formatDailyStepLabel, formatJourneyLabel } from "@/lib/speakDailySteps";

import type { SpeakDailyExercises } from "@/lib/speakExerciseDaily";

import { formatDailyExerciseLabel } from "@/lib/speakExerciseDaily";



interface SpeakProgressPanelProps {

  progress: LevelProgress;

  professorAdvice: string | null;

  dailySteps?: SpeakDailySteps | null;

  dailyExercises?: SpeakDailyExercises | null;

}



export function SpeakProgressPanel({

  progress,

  professorAdvice,

  dailySteps,

  dailyExercises,

}: SpeakProgressPanelProps) {

  return (

    <div className="card-soft flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="min-w-0 flex-1">

        <p className="text-xs font-medium uppercase tracking-wider text-sage-400">

          {progress.level} yol haritası

        </p>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">

          <span className="text-2xl font-bold text-goethe-blue">%{progress.completedPercent}</span>

          {progress.completedPercent === 0 && progress.completedLessons === 0 ? (

            <span className="text-sm text-sage-500">

              Yeni başlangıç · {progress.totalLessons} ders · {progress.totalSteps} adım

            </span>

          ) : (

            <span className="text-sm text-sage-500">

              %{progress.remainingPercent} kaldı · {progress.completedLessons}/

              {progress.totalLessons} ders · {progress.completedSteps}/{progress.totalSteps} adım

            </span>

          )}

        </div>

        <div className="mt-2 h-2 max-w-md overflow-hidden rounded-full bg-sage-100">

          <div

            className="h-full rounded-full bg-goethe-blue transition-all duration-500"

            style={{ width: `${progress.completedPercent}%` }}

          />

        </div>

        <p className="mt-1 text-xs text-goethe-blue">{progress.nextMilestone}</p>

        {dailySteps && (

          <div className="mt-2 space-y-0.5 text-xs text-sage-600">

            <p className={dailySteps.completed >= dailySteps.goal ? "text-emerald-700" : "text-amber-800"}>

              {formatDailyStepLabel(dailySteps)}

              {dailySteps.streakDays > 0 ? ` · ${dailySteps.streakDays} gün seri` : ""}

            </p>

            <p className="text-sage-500">{formatJourneyLabel(dailySteps)}</p>

          </div>

        )}

        {dailyExercises && (

          <p className="mt-1 text-xs text-emerald-800">{formatDailyExerciseLabel(dailyExercises)}</p>

        )}

      </div>

      {professorAdvice && (

        <div className="max-w-sm shrink-0 rounded-lg bg-indigo-50 px-3 py-2 text-xs leading-snug text-indigo-900 sm:max-w-xs">

          <span className="font-semibold">Tavsiye: </span>

          {professorAdvice}

        </div>

      )}

    </div>

  );

}



interface SpeakApiUsagePanelProps {

  usage: SpeakApiUsageTotals;

  compact?: boolean;

}



export function SpeakApiUsagePanel({ usage, compact = false }: SpeakApiUsagePanelProps) {

  return (

    <div className={compact ? "text-[11px]" : "card-soft flex h-full min-w-[10rem] flex-col justify-center p-4"}>

      {!compact && (

        <p className="text-xs font-medium uppercase tracking-wider text-sage-400">

          API kullanımı

        </p>

      )}

      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">

        <div>

          <p className="text-sage-400">Bugün</p>

          <p className="font-semibold text-goethe-blue">

            {usage.dayRequests} istek · {formatCostUsd(usage.dayCostUsd)}

          </p>

        </div>

        <div>

          <p className="text-sage-400">Toplam</p>

          <p className="font-semibold text-goethe-blue">

            {usage.totalRequests} istek · {formatCostUsd(usage.estimatedCostUsd)}

          </p>

        </div>

        <div className="col-span-2">

          <p className="text-sage-400">Token</p>

          <p className="text-goethe-blue">

            {formatTokenCount(usage.totalPromptTokens)} girdi +{" "}

            {formatTokenCount(usage.totalCompletionTokens)} çıktı

          </p>

        </div>

      </div>

      <p className="mt-2 text-[10px] italic text-sage-400">

        Tahmini maliyet. “Derse devam” API harcamaz; tekrar mesaj engellenir.

      </p>

    </div>

  );

}

