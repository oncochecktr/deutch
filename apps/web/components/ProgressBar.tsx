"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  value: number;
  /** Hedef çizgisi (0–100), örn. geçme eşiği */
  target?: number;
  size?: "sm" | "md" | "lg";
  variant?: "gold" | "sage" | "hero";
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  target,
  size = "md",
  variant = "gold",
  label,
  showPercent = false,
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [pct]);

  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-3.5" };
  const fills = {
    gold: "bg-goethe-gold progress-bar-shine",
    sage: "bg-sage-400",
    hero: "bg-goethe-gold progress-bar-shine",
  };
  const tracks = {
    gold: "bg-sage-100",
    sage: "bg-sage-100",
    hero: "bg-white/25",
  };

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="mb-1 flex justify-between text-xs">
          {label && <span className="font-medium text-sage-600">{label}</span>}
          {showPercent && (
            <span className="tabular-nums text-sage-500">
              %{pct}
              {target !== undefined && (
                <span className="text-sage-300"> / {target}</span>
              )}
            </span>
          )}
        </div>
      )}
      <div
        className={`relative overflow-hidden rounded-full ${heights[size]} ${tracks[variant]}`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {target !== undefined && target > 0 && target < 100 && (
          <span
            className="absolute top-0 z-10 h-full w-0.5 bg-goethe-blue/40"
            style={{ left: `${target}%` }}
            aria-hidden
          />
        )}
        <div
          className={`relative h-full rounded-full transition-[width] duration-1000 ease-out ${fills[variant]} ${
            mounted ? "" : "w-0"
          }`}
          style={{ width: mounted ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
}
