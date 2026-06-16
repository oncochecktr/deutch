"use client";

import type { PatternBreakdownPart } from "@/lib/grundlagen";

interface WordBreakdownProps {
  parts: PatternBreakdownPart[];
  expanded?: boolean;
}

export function WordBreakdown({ parts, expanded = true }: WordBreakdownProps) {
  if (!expanded) return null;

  return (
    <div className="rounded-xl border border-sage-100 bg-sage-50/80 p-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sage-500">
        Kelime kelime
      </p>
      <div className="space-y-1.5">
        {parts.map((p, i) => (
          <div
            key={`${p.de}-${i}`}
            className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
              p.role === "verb"
                ? "bg-goethe-blue/10 font-medium"
                : p.role === "question"
                  ? "bg-goethe-gold/15"
                  : "bg-white"
            }`}
          >
            <span className="font-semibold text-goethe-blue">{p.de}</span>
            <span className="text-sage-600">= {p.tr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
