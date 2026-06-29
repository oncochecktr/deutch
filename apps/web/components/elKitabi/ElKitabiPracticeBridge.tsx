"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconCheck, IconX } from "@/components/icons";
import { scrollElKitabiToHash } from "@/components/elKitabi/ElKitabiHashSync";
import type { ElKitabiPractice } from "@/lib/elKitabi/types";
import { elKitabiModuleHref } from "@/lib/elKitabi/practice";
import {
  recordElKitabiModuleVisit,
  recordElKitabiQuiz,
  recordElKitabiRead,
} from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

type Mode = "choose" | "quiz" | "done";

interface ElKitabiPracticeBridgeProps {
  subsectionId: string;
  practice: ElKitabiPractice;
  nextSubsectionId?: string;
  nextSubsectionLabel?: string;
}

export function ElKitabiPracticeBridge({
  subsectionId,
  practice,
  nextSubsectionId,
  nextSubsectionLabel,
}: ElKitabiPracticeBridgeProps) {
  const router = useRouter();
  const { progress, updateProgress } = useProgress();
  const saved = progress.elKitabi.subsections[subsectionId];
  const quiz = practice.quiz ?? [];
  const quizTotal = quiz.length;

  const [mode, setMode] = useState<Mode>("choose");
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  const question = quiz[qIdx];
  const moduleUrl = elKitabiModuleHref(practice.moduleHref, subsectionId);

  const handleMarkRead = () => {
    updateProgress(recordElKitabiRead(progress, subsectionId));
  };

  const handleGoModule = () => {
    updateProgress(recordElKitabiModuleVisit(progress, subsectionId));
    router.push(moduleUrl);
  };

  const handleStartQuiz = () => {
    if (quizTotal === 0) return;
    setMode("quiz");
    setQIdx(0);
    setSelected(null);
    setSessionCorrect(0);
    setFinalScore(0);
  };

  const handleAnswer = (optionIdx: number) => {
    if (selected !== null || !question) return;
    setSelected(optionIdx);
    if (optionIdx === question.correct_index) {
      setSessionCorrect((c) => c + 1);
    }
  };

  const finishQuiz = (correct: number) => {
    updateProgress(recordElKitabiQuiz(progress, subsectionId, correct, quizTotal));
    setFinalScore(correct);
    setMode("done");
  };

  const handleNextQuestion = () => {
    if (!question || selected === null) return;
    const isLast = qIdx >= quizTotal - 1;
    const running = sessionCorrect;
    if (isLast) {
      finishQuiz(running);
      return;
    }
    setQIdx((i) => i + 1);
    setSelected(null);
  };

  const handleRetryQuiz = () => {
    setMode("quiz");
    setQIdx(0);
    setSelected(null);
    setSessionCorrect(0);
    setFinalScore(0);
  };

  const statusBits: string[] = [];
  if (saved?.read) statusBits.push("Okundu");
  if (saved?.quizBest !== undefined && quizTotal > 0) {
    statusBits.push(`Test ${saved.quizBest}/${quizTotal}`);
  }
  if (saved?.moduleVisited) statusBits.push("Modül");

  if (mode === "done") {
    const weak = finalScore < quizTotal;
    const tip = weak ? practice.weakTip : practice.strongTip;
    return (
      <div className="mt-4 rounded-xl border border-sage-200 bg-sage-50/80 p-4">
        <p className="text-sm font-semibold text-goethe-blue">Mini test tamamlandı</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-goethe-blue">
          {finalScore} / {quizTotal}
        </p>
        {tip && <p className="mt-2 text-sm text-sage-700">{tip}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {weak && (
            <button type="button" className="btn-primary text-sm" onClick={handleGoModule}>
              {practice.moduleLabel} →
            </button>
          )}
          {nextSubsectionId && (
            <Link
              href={`#${nextSubsectionId}`}
              className="btn-secondary text-sm"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, "", `#${nextSubsectionId}`);
                scrollElKitabiToHash(`#${nextSubsectionId}`);
              }}
            >
              {nextSubsectionLabel ? `Sonraki: ${nextSubsectionLabel}` : "Sonraki bölüm"}
            </Link>
          )}
          <button type="button" className="btn-secondary text-sm" onClick={handleRetryQuiz}>
            Tekrar çöz
          </button>
        </div>
      </div>
    );
  }

  if (mode === "quiz" && question) {
    const showResult = selected !== null;
    const isCorrect = selected === question.correct_index;

    return (
      <div className="mt-4 rounded-xl border border-goethe-blue/20 bg-white p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase text-goethe-blue">Mini test</p>
          <span className="text-xs text-sage-500">
            {qIdx + 1} / {quizTotal}
          </span>
        </div>
        <p className="text-sm font-medium text-sage-800">{question.question_tr}</p>
        {question.context_de && (
          <p className="mt-1 text-base font-semibold text-goethe-blue">{question.context_de}</p>
        )}
        <div className="mt-3 space-y-2">
          {question.options.map((opt, i) => {
            let cls =
              "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ";
            if (!showResult) {
              cls +=
                selected === i
                  ? "border-goethe-blue bg-goethe-blue/5"
                  : "border-sage-200 hover:border-sage-300";
            } else if (i === question.correct_index) {
              cls += "border-sage-500 bg-sage-100 font-medium";
            } else if (i === selected) {
              cls += "border-red-300 bg-red-50";
            } else {
              cls += "border-sage-100 opacity-60";
            }
            return (
              <button
                key={opt}
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
          <div className="mt-3 space-y-2">
            <p
              className={`flex items-center gap-2 text-sm font-medium ${
                isCorrect ? "text-sage-600" : "text-goethe-red"
              }`}
            >
              {isCorrect ? <IconCheck size={16} /> : <IconX size={16} />}
              {isCorrect ? "Doğru" : "Yanlış"}
            </p>
            {!isCorrect && question.explanation_tr && (
              <p className="text-xs text-sage-600">{question.explanation_tr}</p>
            )}
            <button type="button" className="btn-primary w-full text-sm" onClick={handleNextQuestion}>
              {qIdx >= quizTotal - 1 ? "Sonucu gör" : "Sonraki soru"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-goethe-gold/30 bg-goethe-gold/5 p-4">
      <p className="text-sm font-semibold text-goethe-blue">Ne yapmak istersin?</p>
      {statusBits.length > 0 && (
        <p className="mt-1 text-xs text-sage-500">{statusBits.join(" · ")}</p>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        {quizTotal > 0 && (
          <button type="button" className="btn-primary flex-1 text-sm" onClick={handleStartQuiz}>
            Kendini test et
          </button>
        )}
        <button type="button" className="btn-secondary flex-1 text-sm" onClick={handleGoModule}>
          Örnekleri modülde gör →
        </button>
      </div>
      <button
        type="button"
        className="mt-2 text-xs text-sage-500 underline hover:text-goethe-blue"
        onClick={handleMarkRead}
      >
        Okudum, işaretle
      </button>
    </div>
  );
}
