"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { IconBreak } from "@/components/icons";
import {
  getBreakMessage,
  getStudyMinutesSinceBreak,
  isActiveStudyRoute,
  shouldShowBreakReminder,
  snoozeBreakReminder,
} from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

export function BreakReminder() {
  const pathname = usePathname();
  const { progress, updateProgress } = useProgress();
  const [visible, setVisible] = useState(false);
  const shownBlockRef = useRef<string | null>(null);

  const blockKey = progress.lastBreakAt ?? progress.sessionStartTime ?? "";

  const dismiss = useCallback(() => {
    setVisible(false);
    updateProgress((p) => snoozeBreakReminder(p));
  }, [updateProgress]);

  useEffect(() => {
    if (!isActiveStudyRoute(pathname)) {
      setVisible(false);
      return;
    }

    if (!shouldShowBreakReminder(progress)) {
      setVisible(false);
      shownBlockRef.current = null;
      return;
    }

    if (shownBlockRef.current === blockKey) return;
    shownBlockRef.current = blockKey;
    setVisible(true);
  }, [pathname, progress, blockKey]);

  useEffect(() => {
    if (!visible || !isActiveStudyRoute(pathname)) return;
    const id = setInterval(() => {
      if (!shouldShowBreakReminder(progress)) {
        setVisible(false);
      }
    }, 60000);
    return () => clearInterval(id);
  }, [visible, pathname, progress]);

  if (!visible) return null;

  const blockMin = getStudyMinutesSinceBreak(progress);

  return (
    <div
      className="fixed z-40 max-w-[min(20rem,calc(100vw-2rem))] bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-4 lg:top-20 lg:translate-x-0"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="rounded-xl border border-goethe-gold/40 bg-cream-50/95 p-3 shadow-lg backdrop-blur-sm">
        <div className="mb-2 flex items-start gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-goethe-gold/20 text-goethe-blue">
            <IconBreak size={16} />
          </span>
          <div className="min-w-0 text-left">
            <p className="text-xs font-semibold text-goethe-blue">Mola Zamanı</p>
            <p className="mt-0.5 text-xs leading-snug text-sage-600">
              {getBreakMessage(blockMin)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary flex-1 py-2 text-xs"
            onClick={() => {
              updateProgress((p) => snoozeBreakReminder(p));
              setVisible(false);
            }}
          >
            {progress.breakMinutes} dk mola
          </button>
          <button type="button" className="btn-secondary flex-1 py-2 text-xs" onClick={dismiss}>
            Devam et
          </button>
        </div>
        <button
          type="button"
          className="mt-2 w-full text-[10px] text-sage-400 hover:text-sage-600"
          onClick={dismiss}
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
