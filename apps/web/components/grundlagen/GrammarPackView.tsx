"use client";

import Link from "next/link";
import { useState } from "react";
import { IconCheck, IconX } from "@/components/icons";
import type { GrammarPackSection } from "@/lib/grundlagen";
import { recordGrammarPackScore } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";

interface GrammarPackViewProps {
  sections: GrammarPackSection[];
}

export function GrammarPackView({ sections }: GrammarPackViewProps) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const section = sections[sectionIdx];

  if (!section) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {sections.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSectionIdx(i)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              i === sectionIdx
                ? "bg-goethe-blue text-white"
                : "bg-sage-100 text-sage-600 hover:bg-sage-200"
            }`}
          >
            {s.titleTr}
          </button>
        ))}
      </div>

      <SectionPanel key={section.id} section={section} />

      <p className="text-center text-xs text-sage-500">
        Statik referans için{" "}
        <Link href="/grundlagen/grammar" className="font-medium text-goethe-blue underline">
          Grammar A1
        </Link>{" "}
        sayfasına bak.
      </p>
    </div>
  );
}

function SectionPanel({ section }: { section: GrammarPackSection }) {
  const { progress, updateProgress } = useProgress();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const question = section.quiz[qIdx];
  const savedCorrect = progress.grundlagen.grammarPack[section.id] ?? 0;

  const handleAnswer = (optionIdx: number) => {
    if (selected !== null || !question) return;
    setSelected(optionIdx);
    if (optionIdx === question.correct_index) {
      setSessionCorrect((c) => c + 1);
    }
  };

  const finishSection = (correct: number) => {
    const best = Math.max(savedCorrect, correct);
    updateProgress(recordGrammarPackScore(progress, section.id, best));
    setFinalScore(best);
    setFinished(true);
  };

  const handleNext = () => {
    if (!question || selected === null) return;
    const isLast = qIdx >= section.quiz.length - 1;
    if (isLast) {
      finishSection(sessionCorrect);
      return;
    }
    setQIdx((i) => i + 1);
    setSelected(null);
  };

  const restartSection = () => {
    setQIdx(0);
    setSelected(null);
    setSessionCorrect(0);
    setFinished(false);
    setFinalScore(0);
  };

  if (finished) {
    return (
      <div className="card-soft space-y-4 p-6 text-center">
        <p className="text-lg font-bold text-goethe-blue">{section.titleTr} tamamlandı</p>
        <p className="text-3xl font-bold text-goethe-gold">
          {finalScore} / {section.quiz.length}
        </p>
        <p className="text-sm text-sage-600">Kayıtlı en iyi skor</p>
        <button type="button" className="btn-primary" onClick={restartSection}>
          Tekrar çöz
        </button>
      </div>
    );
  }

  if (!question) return null;

  const showResult = selected !== null;
  const isCorrect = selected === question.correct_index;
  const bestSoFar = Math.max(savedCorrect, sessionCorrect);

  return (
    <div className="space-y-4">
      <div className="card-soft p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase text-goethe-blue">
            {section.title} · {section.titleTr}
          </h2>
          <span className="text-xs text-sage-500">
            {bestSoFar} / {section.quiz.length} doğru
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {section.reference.items.map((item) => (
            <div
              key={item.de}
              className="flex items-center justify-between rounded-lg bg-sage-50 px-3 py-2 text-sm"
            >
              <span className="font-semibold text-goethe-blue">{item.de}</span>
              <span className="text-sage-600">{item.tr}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-soft p-5">
        <p className="text-xs text-sage-400">
          Soru {qIdx + 1} / {section.quiz.length}
        </p>
        <p className="mt-2 text-base font-medium text-goethe-blue">{question.question_tr}</p>
        <div className="mt-4 space-y-2">
          {question.options.map((opt, i) => {
            let cls =
              "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";
            if (!showResult) {
              cls +=
                selected === i
                  ? "border-goethe-blue bg-goethe-blue/5"
                  : "border-sage-100 hover:border-sage-300";
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
                <span className="mr-2 font-bold text-sage-400">{String.fromCharCode(97 + i)}.</span>
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div
            className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
              isCorrect ? "bg-sage-100 text-sage-800" : "bg-red-50 text-red-900"
            }`}
          >
            {isCorrect ? <IconCheck size={18} /> : <IconX size={18} />}
            {isCorrect ? "Richtig!" : "Falsch — devam edebilirsin."}
          </div>
        )}

        {showResult && (
          <button type="button" className="btn-primary-lg mt-4 w-full" onClick={handleNext}>
            {qIdx >= section.quiz.length - 1 ? "Bölümü bitir" : "Sonraki soru →"}
          </button>
        )}
      </div>
    </div>
  );
}
