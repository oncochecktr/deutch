"use client";

import { useState } from "react";
import { IconCheck, IconX } from "@/components/icons";
import type { PatternExample, PatternAnchor } from "@/lib/grundlagen";
import { advancePatternQuizScore } from "@/lib/patternQuizScore";

interface PatternQuizProps {
  questions: PatternExample[];
  anchor?: PatternAnchor;
  onFinish: (correct: number) => void;
}

export function PatternQuiz({ questions, anchor, onFinish }: PatternQuizProps) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  const question = questions[qIdx];
  if (!question) return null;

  const showResult = selected !== null;
  const isCorrect = selected === question.quiz.correct_index;
  const isLast = qIdx >= questions.length - 1;
  const scoreSoFar = advancePatternQuizScore(correct, showResult && isCorrect);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    const thisCorrect = selected === question.quiz.correct_index;
    const runningCorrect = advancePatternQuizScore(correct, thisCorrect);
    if (isLast) {
      onFinish(runningCorrect);
      return;
    }
    setCorrect(runningCorrect);
    setQIdx((i) => i + 1);
    setSelected(null);
  };

  const prompt =
    question.quiz.type === "conjugation"
      ? `${question.quiz.prompt_tr} — boşluğu doldur: "… ${question.quiz.blank} …"`
      : question.quiz.prompt_tr;

  return (
    <div className="card-soft space-y-4 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase text-goethe-blue">Mini quiz</p>
        <span className="text-xs text-sage-500">
          {qIdx + 1} / {questions.length} · {scoreSoFar} doğru
        </span>
      </div>
      <p className="text-base font-medium text-goethe-blue">{prompt}</p>
      <div className="space-y-2">
        {question.quiz.options.map((opt, i) => {
          let cls = "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";
          if (!showResult) {
            cls +=
              selected === i
                ? "border-goethe-blue bg-goethe-blue/5"
                : "border-sage-100 hover:border-sage-300";
          } else if (i === question.quiz.correct_index) {
            cls += "border-sage-500 bg-sage-100 font-medium";
          } else if (i === selected) {
            cls += "border-red-300 bg-red-50";
          } else {
            cls += "border-sage-100 opacity-60";
          }
          return (
            <button
              key={`${opt}-${i}`}
              type="button"
              disabled={showResult}
              className={cls}
              onClick={() => handleAnswer(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div
          className={`flex flex-col gap-2 rounded-lg p-3 text-sm ${
            isCorrect ? "bg-sage-100 text-sage-800" : "bg-red-50 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? <IconCheck size={18} /> : <IconX size={18} />}
            {isCorrect ? "Richtig!" : `Doğrusu: ${question.quiz.options[question.quiz.correct_index]}`}
          </div>
          {!isCorrect && anchor && (
            <p className="text-xs text-sage-600">
              Fiil: <strong>{anchor.infinitive}</strong> ({anchor.tr})
            </p>
          )}
          {!isCorrect && (
            <p className="text-xs text-sage-600">
              Cümle: <strong>{question.de}</strong> — {question.tr}
            </p>
          )}
        </div>
      )}
      {showResult && (
        <button type="button" className="btn-primary-lg w-full" onClick={handleNext}>
          {isLast ? "Quiz bitir" : "Sonraki →"}
        </button>
      )}
    </div>
  );
}
