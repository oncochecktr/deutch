"use client";

import { useMemo, useState } from "react";
import { ContentTransition } from "@/components/ContentTransition";
import { TrainerExampleCard } from "@/components/grundlagen/TrainerExampleCard";
import { IconCheck } from "@/components/icons";
import { PatternQuiz } from "@/components/grundlagen/PatternQuiz";
import { WordBreakdown } from "@/components/grundlagen/WordBreakdown";
import type { A1Pattern } from "@/lib/grundlagen";
import { markPatternCompleted } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import { useStepDirection } from "@/lib/useStepDirection";

function shuffleExamples<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Phase = "list" | "learn" | "quiz" | "done";

interface PatternTrainerProps {
  patterns: A1Pattern[];
}

export function PatternTrainer({ patterns }: PatternTrainerProps) {
  const { progress, updateProgress } = useProgress();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("list");
  const { index: exampleIdx, direction, goNext, goPrev, reset: resetExample } = useStepDirection(0);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [quizScore, setQuizScore] = useState(0);

  const completed = progress.grundlagen.patternsCompleted;
  const scores = progress.grundlagen.patternScores;

  const active = patterns.find((p) => p.id === activeId) ?? null;

  const quizQuestions = useMemo(() => {
    if (!active) return [];
    return shuffleExamples(active.examples, active.order * 17).slice(0, 5);
  }, [active]);

  const openPattern = (id: string) => {
    setActiveId(id);
    setPhase("learn");
    resetExample(0);
    setShowBreakdown(true);
    setQuizScore(0);
  };

  const backToList = () => {
    setActiveId(null);
    setPhase("list");
  };

  if (phase === "list" || !active) {
    return (
      <div className="space-y-4">
        <div className="card-soft border border-goethe-blue/20 p-4">
          <p className="text-sm text-sage-600">
            20 örnek + quiz (4/5 geç).
          </p>
          <p className="mt-2 text-xs tabular-nums text-sage-500">
            {completed.length} / {patterns.length} kalıp tamam
          </p>
        </div>
        <ol className="space-y-2">
          {patterns.map((p) => {
            const done = completed.includes(p.id);
            const score = scores[p.id];
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => openPattern(p.id)}
                  className="card-soft flex w-full items-center gap-3 border border-sage-100 p-4 text-left transition hover:border-goethe-blue/30"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      done ? "bg-sage-200 text-sage-700" : "bg-goethe-blue/10 text-goethe-blue"
                    }`}
                  >
                    {done ? <IconCheck size={16} /> : p.order}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-goethe-blue">{p.template_de}</p>
                    <p className="text-sm text-sage-600">{p.template_tr}</p>
                  </div>
                  {score !== undefined && (
                    <span className="shrink-0 text-xs text-sage-400">{score}/5</span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  if (phase === "done") {
    const passed = quizScore >= 4;
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">{active.template_de}</p>
        <p className="text-3xl font-bold text-goethe-gold">
          {quizScore} / 5
        </p>
        <p className="text-sm text-sage-600">
          {passed ? "Kalıp tamam!" : "4/5 lazım — tekrar dene."}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" className="btn-secondary" onClick={backToList}>
            Kalıp listesi
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setPhase("learn");
              resetExample(0);
              setQuizScore(0);
            }}
          >
            Tekrar çalış
          </button>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div className="space-y-4">
        <PatternHeader pattern={active} onBack={backToList} />
        <PatternQuiz
          questions={quizQuestions}
          anchor={active.anchor}
          onFinish={(correct) => {
            setQuizScore(correct);
            updateProgress(markPatternCompleted(progress, active.id, correct));
            setPhase("done");
          }}
        />
      </div>
    );
  }

  const example = active.examples[exampleIdx];
  const atEnd = exampleIdx >= active.examples.length - 1;

  return (
    <div className="space-y-4">
      <PatternHeader pattern={active} onBack={backToList} />

      {active.anchor && (
        <div className="card-soft p-4">
          <p className="text-xs font-semibold uppercase text-goethe-blue">
            {active.anchor.infinitive} · {active.anchor.tr}
          </p>
          <div className="mt-2 grid gap-1 sm:grid-cols-2">
            {active.anchor.conjugation.map((c) => (
              <div
                key={c.de}
                className="flex justify-between rounded-lg bg-sage-50 px-3 py-1.5 text-sm"
              >
                <span className="font-medium text-goethe-blue">{c.de}</span>
                <span className="text-sage-600">{c.tr}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <ContentTransition stepKey={`${active.id}-ex-${exampleIdx}`} direction={direction}>
        <TrainerExampleCard
          index={exampleIdx}
          total={active.examples.length}
          de={example.de}
          tr={example.tr}
        >
          <button
            type="button"
            className="text-sm font-medium text-goethe-blue underline"
            onClick={() => setShowBreakdown((v) => !v)}
          >
            {showBreakdown ? "Parçalamayı gizle" : "Kelime kelime göster"}
          </button>
          <WordBreakdown parts={example.breakdown} expanded={showBreakdown} />
        </TrainerExampleCard>
      </ContentTransition>

      <div className="flex gap-2">
        <button
          type="button"
          className="btn-secondary flex-1 transition active:scale-[0.98]"
          disabled={exampleIdx === 0}
          onClick={() => goPrev()}
        >
          ← Önceki
        </button>
        <button
          type="button"
          className="btn-primary flex-1 transition active:scale-[0.98]"
          onClick={() => {
            if (atEnd) setPhase("quiz");
            else goNext();
          }}
        >
          {atEnd ? "Quiz'e geç →" : "Sonraki →"}
        </button>
      </div>
    </div>
  );
}

function PatternHeader({ pattern, onBack }: { pattern: A1Pattern; onBack: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <button type="button" className="text-xs text-sage-500 underline" onClick={onBack}>
          ← Tüm kalıplar
        </button>
        <h2 className="mt-1 text-lg font-bold text-goethe-blue">{pattern.template_de}</h2>
        <p className="text-sm text-sage-600">{pattern.template_tr}</p>
      </div>
    </div>
  );
}
