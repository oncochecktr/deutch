"use client";

import { summarizeElKitabiProgress } from "@/lib/elKitabi/practice";
import { useProgress } from "@/lib/ProgressContext";

export function ElKitabiProgressSummary() {
  const { progress } = useProgress();
  const stats = summarizeElKitabiProgress(progress.elKitabi.subsections);

  if (stats.total === 0) return null;

  return (
    <div className="card-soft flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-sage-400">
        Pratik ilerleme
      </p>
      <p className="text-sage-700">
        <span className="font-semibold text-goethe-blue">{stats.read}</span>/{stats.total} okundu
        <span className="mx-2 text-sage-300">·</span>
        <span className="font-semibold text-goethe-blue">{stats.tested}</span> test geçti
        <span className="mx-2 text-sage-300">·</span>
        <span className="font-semibold text-goethe-blue">{stats.moduleVisited}</span> modül
      </p>
    </div>
  );
}
