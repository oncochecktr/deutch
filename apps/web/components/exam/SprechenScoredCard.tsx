"use client";

import { useState } from "react";
import type { SprechenCard } from "@german-coach/exams";
import { AudioButton } from "@/components/AudioButton";
import { IconCheck } from "@/components/icons";
import { checkDictation } from "@/lib/germanTextCompare";
import { sprechenCardScore } from "@/lib/goetheScoring";

interface SprechenScoredCardProps {
  card: SprechenCard;
  examMode?: boolean;
  onComplete: (score: number, userAnswer: string, checklist: boolean[]) => void;
}

export function SprechenScoredCard({ card, examMode = false, onComplete }: SprechenScoredCardProps) {
  const [phase, setPhase] = useState<"prompt" | "answer" | "review" | "score">("prompt");
  const [userAnswer, setUserAnswer] = useState("");
  const [checklist, setChecklist] = useState<boolean[]>(card.checklist.map(() => false));
  const [finalScore, setFinalScore] = useState(0);

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    setPhase("review");
  };

  const finishCard = () => {
    const dict = checkDictation(userAnswer, card.example_de, { minScore: 50 });
    const score = sprechenCardScore(userAnswer, card.example_de, checklist, dict.score);
    setFinalScore(score);
    setPhase("score");
    onComplete(score, userAnswer, checklist);
  };

  if (phase === "prompt") {
    return (
      <div className="card-soft space-y-4 p-5">
        <span className="goethe-badge">Teil {card.part}</span>
        <p className="font-medium text-goethe-blue">{card.prompt_de}</p>
        <p className="text-sm text-sage-500">{card.prompt_tr}</p>
        <p className="text-xs text-sage-400">Yüksek sesle Almanca cevapla, sonra yaz.</p>
        <button type="button" className="btn-primary-lg w-full" onClick={() => setPhase("answer")}>
          Cevabımı yazacağım →
        </button>
      </div>
    );
  }

  if (phase === "answer") {
    return (
      <div className="card-soft space-y-4 p-5">
        <p className="text-sm font-medium text-goethe-blue">{card.prompt_de}</p>
        <textarea
          className="w-full rounded-xl border border-sage-200 px-4 py-3 text-sm"
          rows={5}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Ne söyledin? (Almanca yaz)"
        />
        <button
          type="button"
          className="btn-primary-lg w-full"
          disabled={!userAnswer.trim()}
          onClick={submitAnswer}
        >
          Örnek cevabı gör →
        </button>
      </div>
    );
  }

  if (phase === "review") {
    return (
      <div className="card-soft space-y-4 p-5">
        <div className="rounded-lg bg-sage-50 p-3">
          <p className="text-xs text-sage-400">Senin cevabın</p>
          <p className="text-sm italic">{userAnswer}</p>
        </div>
        <div className="rounded-lg border-2 border-goethe-gold/30 p-3">
          <p className="text-xs text-goethe-gold">Örnek cevap</p>
          <p className="font-medium text-goethe-blue">{card.example_de}</p>
          <p className="text-sm text-sage-500">{card.example_tr}</p>
          <div className="mt-2">
            <AudioButton text={card.example_de} label="Örnek dinle" size="sm" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-sage-400">Kendini değerlendir</p>
          {card.checklist.map((item, i) => (
            <label key={item} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={checklist[i]}
                onChange={(e) => {
                  const next = [...checklist];
                  next[i] = e.target.checked;
                  setChecklist(next);
                }}
              />
              {item}
            </label>
          ))}
        </div>
        <button type="button" className="btn-primary-lg w-full" onClick={finishCard}>
          Puanı hesapla
        </button>
      </div>
    );
  }

  return (
    <div className="card-soft space-y-3 p-5 text-center">
      <IconCheck size={24} className="mx-auto text-sage-600" />
      <p className="text-3xl font-bold text-goethe-gold">{finalScore}/100</p>
      {!examMode && (
        <p className="text-xs text-sage-500">Benzerlik + checklist birleşik puan</p>
      )}
    </div>
  );
}
