"use client";

import { useCallback, useMemo, useState } from "react";
import { AudioButton } from "@/components/AudioButton";
import { ContentTransition } from "@/components/ContentTransition";
import { RewardBurst } from "@/components/RewardBurst";
import { recordZeitQuizScore } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import { pickSessionReward } from "@/lib/trainerRewards";
import { useSessionStreak } from "@/lib/useSessionStreak";
import type { TrainerReward } from "@/lib/trainerRewards";

type Mode = "clock" | "weekday" | "date";

const WEEKDAYS = [
  { de: "Montag", tr: "Pazartesi" },
  { de: "Dienstag", tr: "Salı" },
  { de: "Mittwoch", tr: "Çarşamba" },
  { de: "Donnerstag", tr: "Perşembe" },
  { de: "Freitag", tr: "Cuma" },
  { de: "Samstag", tr: "Cumartesi" },
  { de: "Sonntag", tr: "Pazar" },
];

const MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clockAnswer(h: number, m: number): string {
  if (m === 0) return `Es ist ${h} Uhr.`;
  if (m === 15) return `Es ist Viertel nach ${h}.`;
  if (m === 30) return `Es ist halb ${h === 12 ? 1 : h + 1}.`;
  if (m === 45) return `Es ist Viertel vor ${h === 12 ? 1 : h + 1}.`;
  return `Es ist ${h}:${String(m).padStart(2, "0")} Uhr.`;
}

export function ZeitQuiz() {
  const { progress, updateProgress } = useProgress();
  const { recordCorrect, recordWrong } = useSessionStreak();
  const [mode, setMode] = useState<Mode>("clock");
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [rewardTrigger, setRewardTrigger] = useState(0);
  const [lastReward, setLastReward] = useState<TrainerReward | null>(null);

  const question = useMemo(() => {
    void refreshKey;
    if (mode === "clock") {
      const h = randomInt(1, 12);
      const m = [0, 15, 30, 45][randomInt(0, 3)];
      const display =
        m === 0
          ? `${String(h).padStart(2, "0")}:00`
          : m === 30
            ? `${String(h).padStart(2, "0")}:30`
            : m === 15
              ? `${String(h).padStart(2, "0")}:15`
              : `${String(h).padStart(2, "0")}:45`;
      return { prompt: display, answer: clockAnswer(h, m), label: "Saat kaç? (Almanca söyle)" };
    }
    if (mode === "weekday") {
      const day = WEEKDAYS[randomInt(0, WEEKDAYS.length - 1)];
      return {
        prompt: day.tr,
        answer: day.de,
        label: "Bu gün Almanca ne?",
      };
    }
    const d = randomInt(1, 28);
    const m = randomInt(0, 11);
    const y = 2026;
    return {
      prompt: `${String(d).padStart(2, "0")}.${String(m + 1).padStart(2, "0")}.${y}`,
      answer: `${d}. ${MONTHS[m]} ${y}`,
      label: "Tarihi Almanca oku",
    };
  }, [mode, refreshKey]);

  const next = useCallback(() => {
    setShowAnswer(false);
    setTotal((t) => t + 1);
    setRefreshKey((k) => k + 1);
    setLastReward(null);
  }, []);

  const markCorrect = useCallback(() => {
    const newCorrect = correct + 1;
    setCorrect(newCorrect);
    const streak = recordCorrect();
    const reward = pickSessionReward(streak, true);
    setLastReward(reward);
    if (reward) setRewardTrigger((t) => t + 1);
    const pct = total > 0 ? Math.round((newCorrect / (total + 1)) * 100) : 100;
    updateProgress(recordZeitQuizScore(progress, pct));
    next();
  }, [correct, total, progress, updateProgress, next, recordCorrect]);

  const markWrong = useCallback(() => {
    recordWrong();
    setLastReward(null);
    const pct = total > 0 ? Math.round((correct / (total + 1)) * 100) : 0;
    updateProgress(recordZeitQuizScore(progress, pct));
    next();
  }, [correct, total, progress, updateProgress, next, recordWrong]);

  return (
    <div className="relative card-soft space-y-4 p-5">
      <RewardBurst trigger={rewardTrigger} reward={lastReward} />
      <p className="text-sm text-sage-600">
        <strong className="text-goethe-blue">Zeit Alıştırma:</strong> Soruyu oku → cevabı düşün → kontrol et.
      </p>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["clock", "Saat"],
            ["weekday", "Gün"],
            ["date", "Tarih"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setMode(id);
              setShowAnswer(false);
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              mode === id ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ContentTransition stepKey={`${mode}-${refreshKey}`} direction={1}>
        <div className="rounded-xl border-2 border-goethe-blue/15 bg-goethe-blue/5 py-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-sage-500">{question.label}</p>
          <p className="mt-3 text-4xl font-bold text-goethe-blue">{question.prompt}</p>
        </div>
      </ContentTransition>
      {!showAnswer ? (
        <button type="button" className="btn-primary-lg w-full" onClick={() => setShowAnswer(true)}>
          Cevabı göster
        </button>
      ) : (
        <div className="animate-feedback-in space-y-3">
          <div className="flex items-center justify-center gap-2 rounded-lg bg-sage-100 p-4">
            <p className="text-lg font-bold text-goethe-blue">{question.answer}</p>
            <AudioButton text={question.answer} size="sm" />
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn-secondary flex-1" onClick={markWrong}>
              Yanlıştı
            </button>
            <button type="button" className="btn-primary flex-1" onClick={markCorrect}>
              Doğruydu
            </button>
          </div>
        </div>
      )}
      <p className="text-center text-xs text-sage-500">
        {correct} / {total} doğru · En iyi: {progress.grundlagen.zeitQuizBest}%
      </p>
    </div>
  );
}
