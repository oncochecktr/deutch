"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pickStudyNudge } from "@/lib/studyMotivation";

interface StudyMotivationProps {
  /** Yeni kelime / kart geçişinde tetiklenir */
  trigger?: number;
  /** Masaüstü: periyodik ipucu aralığı (ms). Mobilde kapalı. */
  intervalMs?: number;
}

export function StudyMotivation({ trigger = 0, intervalMs = 120000 }: StudyMotivationProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    hideTimerRef.current = null;
    fadeTimerRef.current = null;
  }, []);

  const dismiss = useCallback(() => {
    clearTimers();
    setFading(true);
    fadeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setFading(false);
    }, 200);
  }, [clearTimers]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const showNudge = useCallback(
    (seed: number) => {
      clearTimers();
      setMessage(pickStudyNudge(seed));
      setFading(false);
      setVisible(true);

      const displayMs = isMobile ? 2200 : 3500;
      const fadeLeadMs = 280;

      hideTimerRef.current = setTimeout(() => {
        setFading(true);
        fadeTimerRef.current = setTimeout(() => {
          setVisible(false);
          setFading(false);
        }, fadeLeadMs);
      }, displayMs - fadeLeadMs);
    },
    [clearTimers, isMobile]
  );

  useEffect(() => {
    if (trigger <= 0) return;
    showNudge(trigger);
    return clearTimers;
  }, [trigger, showNudge, clearTimers]);

  useEffect(() => {
    if (isMobile) return;
    const id = window.setInterval(() => showNudge(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, showNudge, isMobile]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!message || !visible) return null;

  return (
    <button
      type="button"
      onClick={dismiss}
      className={`fixed z-40 max-w-[min(16rem,calc(100vw-2rem))] transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      } ${
        isMobile
          ? "bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2"
          : "right-4 top-20"
      }`}
      style={isMobile ? undefined : { paddingTop: "env(safe-area-inset-top, 0px)" }}
      aria-label="Motivasyon mesajını kapat"
    >
      <div className="rounded-xl border border-goethe-gold/40 bg-goethe-blue/95 px-3 py-2 text-left text-xs font-medium leading-snug text-white shadow-md backdrop-blur-sm">
        <span className="mb-0.5 block text-[9px] font-semibold uppercase tracking-wide text-goethe-gold/90">
          İpucu
        </span>
        {message}
        {isMobile && (
          <span className="mt-1 block text-[9px] text-white/50">Kapatmak için dokun</span>
        )}
      </div>
    </button>
  );
}
