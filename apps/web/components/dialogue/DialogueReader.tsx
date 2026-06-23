"use client";

import { useCallback, useMemo, useState } from "react";
import type { DialogueStory } from "@/lib/dialogueTypes";
import { DialogueLineRow } from "./DialogueLine";

interface DialogueReaderProps {
  story: DialogueStory;
  onComplete?: () => void;
}

export function DialogueReader({ story, onComplete }: DialogueReaderProps) {
  const [showAllTr, setShowAllTr] = useState(false);
  const [revealedLines, setRevealedLines] = useState<Set<string>>(() => new Set());
  const [readLines, setReadLines] = useState<Set<string>>(() => new Set());
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizDone, setQuizDone] = useState(false);

  const toggleLine = useCallback((lineId: string) => {
    setRevealedLines((prev) => {
      const next = new Set(prev);
      if (next.has(lineId)) next.delete(lineId);
      else next.add(lineId);
      return next;
    });
  }, []);

  const markRead = useCallback((lineId: string) => {
    setReadLines((prev) => new Set(prev).add(lineId));
  }, []);

  const progress = useMemo(() => {
    const total = story.lines.length;
    const read = readLines.size;
    return { read, total, pct: total ? Math.round((read / total) * 100) : 0 };
  }, [story.lines.length, readLines.size]);

  const quizScore = useMemo(() => {
    let correct = 0;
    for (const q of story.comprehension) {
      if (answers[q.id] === q.correct_index) correct++;
    }
    return correct;
  }, [story.comprehension, answers]);

  const allQuizAnswered = story.comprehension.every((q) => answers[q.id] !== undefined);

  const handleFinishQuiz = () => {
    setQuizDone(true);
    onComplete?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sage-400">{story.theme}</p>
          <h2 className="text-xl font-bold text-goethe-blue">{story.title_de}</h2>
          <p className="text-sm text-sage-500">{story.title_tr}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-goethe-blue px-2 py-0.5 text-xs font-bold text-white">
            {story.level}
          </span>
          {story.source === "ai" && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800">
              AI
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-sage-50 px-3 py-2 text-xs text-sage-600">
        <span>
          Okunan satır: {progress.read}/{progress.total} (%{progress.pct})
        </span>
        <button
          type="button"
          onClick={() => {
            setShowAllTr((v) => !v);
            if (!showAllTr) {
              setRevealedLines(new Set(story.lines.map((l) => l.id)));
            } else {
              setRevealedLines(new Set());
            }
          }}
          className="rounded-md border border-sage-200 bg-white px-2 py-1 font-medium hover:border-goethe-blue/30"
        >
          {showAllTr ? "Tüm çevirileri gizle" : "Tüm çevirileri göster"}
        </button>
      </div>

      <div className="space-y-2">
        {story.lines.map((line) => (
          <DialogueLineRow
            key={line.id}
            line={line}
            showTranslation={showAllTr || revealedLines.has(line.id)}
            onToggleTranslation={() => toggleLine(line.id)}
            onMarkRead={() => markRead(line.id)}
          />
        ))}
      </div>

      {story.comprehension.length > 0 && (
        <div className="space-y-3 border-t border-sage-200 pt-4">
          <h3 className="text-sm font-semibold text-goethe-blue">Anlama soruları</h3>
          {story.comprehension.map((q, qi) => (
            <div key={q.id} className="card-soft p-4">
              <p className="mb-2 text-sm font-medium text-sage-800">
                {qi + 1}. {q.prompt_tr}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options_tr.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  const showResult = quizDone || answers[q.id] !== undefined;
                  const isCorrect = oi === q.correct_index;
                  let cls = "rounded-lg border px-3 py-2 text-left text-sm transition ";
                  if (showResult && quizDone) {
                    if (isCorrect) cls += "border-emerald-400 bg-emerald-50 text-emerald-900";
                    else if (selected) cls += "border-red-200 bg-red-50 text-red-800";
                    else cls += "border-sage-100 opacity-60";
                  } else if (selected) {
                    cls += "border-goethe-blue bg-goethe-blue/10";
                  } else {
                    cls += "border-sage-200 hover:border-goethe-blue/30 cursor-pointer";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={quizDone}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={cls}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizDone && q.explanation_tr && (
                <p className="mt-2 text-xs text-sage-500">{q.explanation_tr}</p>
              )}
            </div>
          ))}

          {!quizDone && (
            <button
              type="button"
              disabled={!allQuizAnswered}
              onClick={handleFinishQuiz}
              className="btn-primary w-full py-3 disabled:opacity-40"
            >
              Bitir — sonuçları gör
            </button>
          )}

          {quizDone && (
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-900">
              {quizScore}/{story.comprehension.length} doğru —{" "}
              {quizScore === story.comprehension.length ? "Mükemmel!" : "Tekrar oku ve dene."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
