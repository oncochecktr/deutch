"use client";

import type { ReactNode } from "react";

export type SlideDirection = 1 | -1;

interface ContentTransitionProps {
  /** Değişince animasyon tetiklenir */
  stepKey: string | number;
  direction?: SlideDirection;
  children: ReactNode;
  className?: string;
}

/** Kart / örnek geçişlerinde hafif kayma + fade (hızlı, ~220ms) */
export function ContentTransition({
  stepKey,
  direction = 1,
  children,
  className = "",
}: ContentTransitionProps) {
  return (
    <div
      key={stepKey}
      className={`content-transition ${direction > 0 ? "content-transition-forward" : "content-transition-back"} ${className}`}
    >
      {children}
    </div>
  );
}
