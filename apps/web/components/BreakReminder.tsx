"use client";

import { useEffect, useState } from "react";
import { IconBreak } from "@/components/icons";
import { getBreakMessage, shouldShowBreakReminder } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

export function BreakReminder() {
  const { progress, updateProgress } = useProgress();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      if (shouldShowBreakReminder(progress) && !dismissed) {
        setVisible(true);
      }
    };
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, [progress, dismissed]);

  if (!visible) return null;

  const mins = progress.dailyStats.minutesStudied;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="card-soft max-w-md p-6 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-goethe-gold/20 text-goethe-blue">
          <IconBreak size={28} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-goethe-blue">Mola Zamanı</h3>
        <p className="mb-4 text-sm text-sage-500">{getBreakMessage(mins)}</p>
        <p className="mb-6 text-xs text-sage-400">
          Goethe sınavına 12 saat disiplinli çalışma hedefin var — ama dinlenmeden verim düşer.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              updateProgress({
                lastBreakAt: new Date().toISOString(),
                sessionStartTime: new Date().toISOString(),
              });
              setVisible(false);
              setDismissed(true);
              setTimeout(() => setDismissed(false), progress.breakMinutes * 60000);
            }}
          >
            {progress.breakMinutes} dk mola başlat
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setVisible(false);
              setDismissed(true);
              setTimeout(() => setDismissed(false), 5 * 60000);
            }}
          >
            5 dk daha devam
          </button>
        </div>
      </div>
    </div>
  );
}
