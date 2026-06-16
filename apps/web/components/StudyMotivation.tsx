"use client";

import { useCallback, useEffect, useState } from "react";
import { pickStudyNudge } from "@/lib/studyMotivation";

interface StudyMotivationProps {
  /** Yeni kelime / kart geçişinde tetiklenir */
  trigger?: number;
  intervalMs?: number;
}

export function StudyMotivation({ trigger = 0, intervalMs = 45000 }: StudyMotivationProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const showNudge = useCallback((seed: number) => {
    setMessage(pickStudyNudge(seed));
    setVisible(true);
    const hide = window.setTimeout(() => setVisible(false), 7000);
    return () => window.clearTimeout(hide);
  }, []);

  useEffect(() => {
    if (trigger <= 0) return;
    const cleanup = showNudge(trigger);
    return cleanup;
  }, [trigger, showNudge]);

  useEffect(() => {
    const id = window.setInterval(() => {
      showNudge(Date.now());
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, showNudge]);

  if (!message || !visible) return null;

  return (
    <div
      className="pointer-events-none fixed right-3 top-20 z-40 max-w-[min(18rem,calc(100vw-1.5rem))] animate-[slideIn_0.35s_ease-out] sm:right-4"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      role="status"
      aria-live="polite"
    >
      <div className="rounded-2xl border border-goethe-gold/50 bg-goethe-blue px-4 py-3 text-sm font-medium leading-snug text-white shadow-lg">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-goethe-gold">
          Motivasyon
        </span>
        {message}
      </div>
    </div>
  );
}
