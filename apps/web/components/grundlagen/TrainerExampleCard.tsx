"use client";

import type { ReactNode } from "react";
import { AudioButton } from "@/components/AudioButton";
import { TurkishTranslation } from "@/components/TurkishTranslation";

interface TrainerExampleCardProps {
  index: number;
  total: number;
  de: string;
  tr: string;
  /** Varsayılan: de (→ sonrası kesilir) */
  audioText?: string;
  children?: ReactNode;
  className?: string;
}

/** Gramer örnekleri: Almanca üstte + sağda dinle, Türkçe altta tam genişlik */
export function TrainerExampleCard({
  index,
  total,
  de,
  tr,
  audioText,
  children,
  className = "",
}: TrainerExampleCardProps) {
  const speech = (audioText ?? de).replace(/→.*/, "").trim();

  return (
    <div className={`card-soft space-y-4 p-5 sm:space-y-5 sm:p-6 ${className}`}>
      <p className="text-sm font-medium tabular-nums text-sage-500">
        Örnek {index + 1} / {total}
      </p>

      <div className="flex items-start gap-3 rounded-xl border border-sage-100 bg-white/90 px-4 py-4 shadow-sm sm:gap-4 sm:px-5 sm:py-5">
        <p className="min-w-0 flex-1 text-2xl font-bold leading-tight tracking-tight text-goethe-blue sm:text-3xl">
          {de}
        </p>
        <AudioButton
          text={speech}
          label="Dinle"
          size="sm"
          className="mt-0.5 shrink-0"
        />
      </div>

      <TurkishTranslation text={tr} />

      {children}
    </div>
  );
}
