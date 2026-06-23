"use client";

import { AudioButton } from "@/components/AudioButton";
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
    <div className="card-soft space-y-4 p-5">
      <p className="text-xs text-sage-500">
        Örnek {index + 1} / {total}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xl font-bold text-goethe-blue">{example.de}</p>
        <AudioButton text={example.de} size="sm" />
      </div>
      <p className="text-sm text-sage-600">{example.tr}</p>
      {example.breakdown.length > 0 && (
        <ul className="space-y-1 border-t border-sage-100 pt-3 text-sm">
          {example.breakdown.map((part) => (
            <li key={part.de} className="flex flex-wrap gap-2">
              <span className="font-medium text-goethe-blue">{part.de}</span>
              <span className="text-sage-500">— {part.tr}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
