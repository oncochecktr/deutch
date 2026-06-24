"use client";

import { useEffect, useRef, useState } from "react";
import type { TrainerReward } from "@/lib/trainerRewards";

interface RewardBurstProps {
  /** Her doğru cevapta artır — animasyonu tetikler */
  trigger: number;
  reward: TrainerReward | null;
  className?: string;
}

export function RewardBurst({ trigger, reward, className = "" }: RewardBurstProps) {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (trigger <= 0 || !reward) return;

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

    setFading(false);
    setVisible(true);

    hideTimerRef.current = setTimeout(() => {
      setFading(true);
      fadeTimerRef.current = setTimeout(() => {
        setVisible(false);
        setFading(false);
      }, 280);
    }, 1200);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [trigger, reward]);

  if (!reward || !visible) return null;

  return (
    <div
      className={`pointer-events-none absolute right-0 top-0 z-10 transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      } ${className}`}
      aria-live="polite"
    >
      <div className="animate-reward-pop rounded-xl border-2 border-goethe-gold/50 bg-goethe-gold/15 px-3 py-2 shadow-md backdrop-blur-sm">
        <p className="text-sm font-bold text-goethe-blue">{reward.title}</p>
        {reward.subtitle && (
          <p className="text-xs font-medium text-sage-600">{reward.subtitle}</p>
        )}
      </div>
    </div>
  );
}
