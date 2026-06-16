"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExamAnswerState } from "@/lib/goetheScoring";

const STORAGE_PREFIX = "german-coach-exam-session:";

export interface ExamSessionState {
  examId: string;
  mode: "practice" | "real";
  startedAt: number;
  endsAt: number;
  step: string;
  hoerenIdx: number;
  lesenIdx: number;
  lesenSubStep: "rf" | "match" | "mcq";
  schreibenIdx: number;
  sprechenIdx: number;
  answers: ExamAnswerState;
  audioPlays: Record<string, number>;
  expired: boolean;
}

const emptyAnswers = (): ExamAnswerState => ({
  mcq: {},
  trueFalse: {},
  matching: {},
  schreibenForm: {},
  schreibenLetter: "",
  sprechenAnswers: {},
  sprechenChecklists: {},
  sprechenScores: {},
});

export function useExamSession(examId: string, mode: "practice" | "real", minutes: number) {
  const key = `${STORAGE_PREFIX}${mode}:${examId}`;

  const [session, setSession] = useState<ExamSessionState>(() => ({
    examId,
    mode,
    startedAt: 0,
    endsAt: 0,
    step: "intro",
    hoerenIdx: 0,
    lesenIdx: 0,
    lesenSubStep: "rf",
    schreibenIdx: 0,
    sprechenIdx: 0,
    answers: emptyAnswers(),
    audioPlays: {},
    expired: false,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as ExamSessionState;
        if (parsed.examId === examId && parsed.mode === mode) {
          setSession(parsed);
        }
      }
    } catch {
      /* ignore */
    }
  }, [examId, key, mode]);

  const persist = useCallback(
    (next: ExamSessionState) => {
      setSession(next);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(key, JSON.stringify(next));
      }
    },
    [key]
  );

  const startExam = useCallback(() => {
    const now = Date.now();
    persist({
      ...session,
      startedAt: now,
      endsAt: now + minutes * 60 * 1000,
      step: "hoeren",
      expired: false,
    });
  }, [minutes, persist, session]);

  const clearSession = useCallback(() => {
    if (typeof window !== "undefined") sessionStorage.removeItem(key);
  }, [key]);

  const updateAnswers = useCallback(
    (patch: Partial<ExamAnswerState>) => {
      persist({
        ...session,
        answers: { ...session.answers, ...patch },
      });
    },
    [persist, session]
  );

  const setStep = useCallback(
    (step: string) => persist({ ...session, step }),
    [persist, session]
  );

  const patchSession = useCallback(
    (patch: Partial<ExamSessionState>) => persist({ ...session, ...patch }),
    [persist, session]
  );

  const recordAudioPlay = useCallback(
    (itemId: string, max = 2): boolean => {
      const count = session.audioPlays[itemId] ?? 0;
      if (count >= max) return false;
      persist({
        ...session,
        audioPlays: { ...session.audioPlays, [itemId]: count + 1 },
      });
      return true;
    },
    [persist, session]
  );

  const expireExam = useCallback(() => {
    persist({ ...session, expired: true, step: "result" });
  }, [persist, session]);

  return {
    session,
    startExam,
    clearSession,
    updateAnswers,
    setStep,
    patchSession,
    recordAudioPlay,
    expireExam,
  };
}
