"use client";

import { AudioButton } from "@/components/AudioButton";
import { TurkishTranslation } from "@/components/TurkishTranslation";
import type { TrainerExample } from "@/lib/grundlagen";

export function GrundlagenExampleView({
  example,
  index,
  total,
}: {
  example: TrainerExample;
  index: number;
  total: number;
}) {
  return (
    <div className="card-soft space-y-4 p-5 sm:p-6">
      <p className="text-sm font-medium tabular-nums text-sage-500">
        Örnek {index + 1} / {total}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-2xl font-bold tracking-tight text-goethe-blue sm:text-3xl">{example.de}</p>
        <AudioButton text={example.de} size="sm" />
      </div>
      <TurkishTranslation text={example.tr} />
      {example.breakdown.length > 0 && (
        <ul className="space-y-2 border-t border-sage-100 pt-4 text-base">
          {example.breakdown.map((part) => (
            <li key={part.de} className="flex flex-wrap gap-2 rounded-lg bg-sage-50/80 px-3 py-2">
              <span className="font-semibold text-goethe-blue">{part.de}</span>
              <span className="text-sage-600">— {part.tr}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
