"use client";

import { useState } from "react";
import { AudioButton } from "@/components/AudioButton";
import { TurkishTranslation } from "@/components/TurkishTranslation";
import type { PossessiveExample } from "@/lib/grundlagen";

interface PossessiveExampleViewProps {
  example: PossessiveExample;
  index: number;
  total: number;
}

export function PossessiveExampleView({ example, index, total }: PossessiveExampleViewProps) {
  const [showBreakdown, setShowBreakdown] = useState(true);

  return (
    <div className="card-soft space-y-4 p-5">
      <p className="text-xs text-sage-400">
        Örnek {index + 1} / {total}
      </p>
      <p className="text-2xl font-bold text-goethe-blue sm:text-3xl">{example.de}</p>
      <TurkishTranslation text={example.tr} className="mt-2" />
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-goethe-gold/20 px-2 py-0.5 font-medium text-goethe-blue">
          {example.article} {example.noun}
        </span>
        <span className="rounded-full bg-goethe-blue/10 px-2 py-0.5 font-medium text-goethe-blue">
          → {example.possessive_form}
        </span>
      </div>
      <AudioButton text={example.de} label="Cümleyi dinle" />
      <button
        type="button"
        className="text-xs font-medium text-goethe-blue underline"
        onClick={() => setShowBreakdown((v) => !v)}
      >
        {showBreakdown ? "Parçalamayı gizle" : "Kelime kelime göster"}
      </button>
      {showBreakdown && (
        <div className="rounded-xl border border-sage-100 bg-sage-50/80 p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sage-500">
            Kelime kelime
          </p>
          <div className="space-y-1.5">
            {example.breakdown.map((p, i) => (
              <div
                key={`${p.de}-${i}`}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
                  p.role === "possessive"
                    ? "bg-goethe-gold/20 font-medium"
                    : p.role === "verb"
                      ? "bg-goethe-blue/10"
                      : "bg-white"
                }`}
              >
                <span className="font-semibold text-goethe-blue">{p.de}</span>
                <span className="text-sage-600">= {p.tr}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
