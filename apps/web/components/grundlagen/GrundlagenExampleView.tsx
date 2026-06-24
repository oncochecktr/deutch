"use client";

import { TrainerExampleCard } from "@/components/grundlagen/TrainerExampleCard";
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
    <TrainerExampleCard index={index} total={total} de={example.de} tr={example.tr}>
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
    </TrainerExampleCard>
  );
}
