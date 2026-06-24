"use client";

import { useState } from "react";
import type { SlideDirection } from "@/components/ContentTransition";
import { ContentTransition } from "@/components/ContentTransition";
import type { WordOrderExercise } from "@/lib/grundlagen";
import { WordOrderMcq, WordOrderReorder } from "@/components/grundlagen/WordOrderExercise";
import { WordOrderSpotVerb } from "@/components/grundlagen/WordOrderSpotVerb";

interface WordOrderDrillPanelProps {
  exercises: WordOrderExercise[];
  onFinish: (correct: number) => void;
}

export function WordOrderDrillPanel({ exercises, onFinish }: WordOrderDrillPanelProps) {
  const [qIdx, setQIdx] = useState(0);
  const [slideDir, setSlideDir] = useState<SlideDirection>(1);
  const [correct, setCorrect] = useState(0);

  const question = exercises[qIdx];
  if (!question) return null;

  const handleAnswer = (wasCorrect: boolean) => {
    const running = correct + (wasCorrect ? 1 : 0);
    if (qIdx >= exercises.length - 1) {
      onFinish(running);
      return;
    }
    setCorrect(running);
    setSlideDir(1);
    setQIdx((i) => i + 1);
  };

  const isReorder = question.type === "reorder" || question.type === "transform";
  const isSpotVerb = question.type === "spot_verb";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-sage-500">
        <span className="font-semibold uppercase text-goethe-blue">Drill</span>
        <span>
          {qIdx + 1} / {exercises.length} · {correct} doğru
        </span>
      </div>
      <ContentTransition stepKey={question.id} direction={slideDir}>
        {isSpotVerb ? (
          <WordOrderSpotVerb exercise={question} onAnswer={handleAnswer} />
        ) : isReorder ? (
          <WordOrderReorder exercise={question} onAnswer={handleAnswer} />
        ) : (
          <WordOrderMcq exercise={question} onAnswer={handleAnswer} />
        )}
      </ContentTransition>
    </div>
  );
}
