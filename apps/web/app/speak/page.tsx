"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { SpeakBoard } from "@/components/SpeakBoard";
import { SpeakExercisePanel } from "@/components/SpeakExercisePanel";
import { SpeakSessionLogPanel } from "@/components/SpeakSessionLogPanel";
import { ScriptProfessorBanner } from "@/components/speak/ScriptProfessorBanner";
import { SpeakLessonShelf } from "@/components/SpeakLessonShelf";
import { getNextLesson, resolveCurrentLesson } from "@/lib/speakCurriculum";
import { SpeakApiUsagePanel, SpeakProgressPanel } from "@/components/SpeakProgressPanel";
import { playProfessorTurn, stopAudio } from "@/lib/audio";
import {
  loadProfessorAudioEnabled,
  saveProfessorAudioEnabled,
} from "@/lib/speakAudioPrefs";
import { mapSpeechCorrectionToWordId } from "@/lib/mapSpeechCorrectionToWordId";
import {
  isProfessorMissingApiKeyError,
  isProfessorQuotaError,
  isProfessorRateLimitError,
  PROFESSOR_TIMEOUT,
  PROFESSOR_UNAVAILABLE,
  sanitizeProfessorErrorForUser,
} from "@/lib/professorMessages";
import { recordSRSReview } from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import type { ChatHistoryItem, ChatResponse, SpeakInputLanguage, BoardPhase, TeachingExample } from "@/lib/speakTypes";
import { formatWrittenAnswer, isWrittenAnswerMessage } from "@/lib/speakTypes";
import {
  appendTeacherNotes,
  completeLesson,
  formatSpeakResumeMessage,
  loadSpeakMemory,
  mergeWeaknesses,
  patchSpeakMemory,
  resetProfessorLesson,
  saveSpeakMemory,
  recordSpeakDailyStep,
  recordSpeakDailyExercise,
  type SpeakMemoryStore,
} from "@/lib/speakStorage";
import {
  buildDailyExerciseSet,
  getExerciseForIndex,
  type SpeakExercise,
} from "@/lib/speakExercise";
import type { ExerciseCheckResponse } from "@/lib/speakExercisePrompts";
import type { SpeakDailyExercises } from "@/lib/speakExerciseDaily";
import {
  recordApiUsage,
  shouldBlockChatRequest,
  type SpeakApiUsageTotals,
} from "@/lib/speakApiUsage";
import {
  appendSessionLogs,
  createLogEntry,
  type SessionLogEntry,
} from "@/lib/speakSessionLog";
import {
  computeOverallCurriculumProgress,
  getLocalProfessorAdvice,
} from "@/lib/speakProgress";
import {
  HINT_LEVEL_STREAK,
  hintLevelLabel,
  inferAnswerOutcome,
  updateHintSupport,
} from "@/lib/speakHintLevel";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import { clientChatAuthPayload, hasUserApiKey } from "@/lib/userApiKeys";
import { runScriptProfessor, shouldUseScriptProfessor } from "@/lib/speakScript";
import {
  buildReadyPracticeHint,
  coercePracticeIfReady,
  coerceStepCompleteIfAnswered,
} from "@/lib/speakLessonFlow";

const FOCUS_MODE_KEY = "german-coach-speak-focus";

interface BoardSnapshot {
  reply: string | null;
  correction: string | null;
  correctionExplanation: string | null;
  germanQuestion: string | null;
  turkishTranslation: string | null;
  partialHint: string | null;
  praise: string | null;
  boardPhase: BoardPhase | null;
  teachingIntro: string | null;
  teachingTopicGerman: string | null;
  teachingTopicTurkish: string | null;
  teachingExamples: TeachingExample[];
}

const INPUT_LANGUAGES: { id: SpeakInputLanguage; label: string; hint: string }[] = [
  { id: "tr", label: "Türkçe", hint: "Not al" },
  { id: "de", label: "Almanca", hint: "Doğrudan konuşma pratiği" },
];

const LESSON_START_MESSAGE =
  "Merhaba profesörüm. Sınıfa geldim. Bugünkü konuyu sıfırdan öğret — önce anlat ve örnek ver, sonra sor.";

function applyMemory(store: SpeakMemoryStore) {
  return {
    history: store.session.history,
    inputLanguage: store.session.inputLanguage,
    reply: store.session.lastReply,
    correction: store.session.lastCorrection,
    correctionExplanation: store.session.lastCorrectionExplanation,
    germanQuestion: store.session.lastGermanQuestion,
    turkishTranslation: store.session.lastTurkishTranslation,
    partialHint: store.session.lastPartialHint,
    praise: store.session.lastPraise,
    boardPhase: store.session.lastBoardPhase,
    teachingIntro: store.session.lastTeachingIntro,
    teachingTopicGerman: store.session.lastTeachingTopicGerman,
    teachingTopicTurkish: store.session.lastTeachingTopicTurkish,
    teachingExamples: store.session.lastTeachingExamples,
    professor: store.professor,
  };
}

export default function SpeakPage() {
  const { updateProgress, hydrated } = useProgress();
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [reply, setReply] = useState<string | null>(null);
  const [correction, setCorrection] = useState<string | null>(null);
  const [correctionExplanation, setCorrectionExplanation] = useState<string | null>(null);
  const [germanQuestion, setGermanQuestion] = useState<string | null>(null);
  const [turkishTranslation, setTurkishTranslation] = useState<string | null>(null);
  const [partialHint, setPartialHint] = useState<string | null>(null);
  const [praise, setPraise] = useState<string | null>(null);
  const [boardPhase, setBoardPhase] = useState<BoardPhase | null>(null);
  const [teachingIntro, setTeachingIntro] = useState<string | null>(null);
  const [teachingTopicGerman, setTeachingTopicGerman] = useState<string | null>(null);
  const [teachingTopicTurkish, setTeachingTopicTurkish] = useState<string | null>(null);
  const [teachingExamples, setTeachingExamples] = useState<TeachingExample[]>([]);
  const [focusMode, setFocusMode] = useState(true);
  const [professorAudio, setProfessorAudio] = useState(true);
  const [latestNotes, setLatestNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlow, setLoadingSlow] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [inputLanguage, setInputLanguage] = useState<SpeakInputLanguage>("tr");
  const [memoryReady, setMemoryReady] = useState(false);
  const [professor, setProfessor] = useState(loadSpeakMemory().professor);
  const [writtenText, setWrittenText] = useState("");
  const [inputMode, setInputMode] = useState<"voice" | "write">("voice");
  const [apiUsage, setApiUsage] = useState<SpeakApiUsageTotals>(loadSpeakMemory().apiUsage);
  const [professorAdvice, setProfessorAdvice] = useState<string | null>(
    loadSpeakMemory().professor.lastProfessorAdvice
  );
  const [sessionLogs, setSessionLogs] = useState<SessionLogEntry[]>([]);
  const [dailySteps, setDailySteps] = useState(loadSpeakMemory().dailySteps);
  const [dailyExercises, setDailyExercises] = useState<SpeakDailyExercises>(
    loadSpeakMemory().dailyExercises
  );
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [exerciseLoading, setExerciseLoading] = useState(false);
  const [exerciseResult, setExerciseResult] = useState<ExerciseCheckResponse | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(
    loadSpeakMemory().dailyExercises.currentIndex
  );

  const memoryRef = useRef<SpeakMemoryStore>(loadSpeakMemory());
  const lessonBoardSnapshotRef = useRef<BoardSnapshot | null>(null);
  const pendingSendRef = useRef(false);
  const lastRequestAtRef = useRef<number | null>(null);
  const inFlightMessageRef = useRef<string | null>(null);
  const writtenInputRef = useRef<HTMLTextAreaElement>(null);

  const currentLesson = resolveCurrentLesson(professor.currentLessonId);
  const scriptModeActive = shouldUseScriptProfessor(professor.currentLessonId, hasUserApiKey());
  const curriculumProgress = computeOverallCurriculumProgress(professor);
  const fallbackAdvice = getLocalProfessorAdvice(curriculumProgress, professor.weaknesses);

  const {
    supported,
    listening,
    interimTranscript,
    finalTranscript,
    error: sttError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition(inputLanguage);

  const persist = useCallback((patch: Parameters<typeof patchSpeakMemory>[1]) => {
    memoryRef.current = patchSpeakMemory(memoryRef.current, patch);
    saveSpeakMemory(memoryRef.current);
    if (patch.professor) setProfessor({ ...memoryRef.current.professor });
  }, []);

  const addLog = useCallback((level: SessionLogEntry["level"], message: string, detail?: string) => {
    setSessionLogs((prev) => appendSessionLogs(prev, createLogEntry(level, message, detail)));
  }, []);

  useEffect(() => {
    if (!hydrated || memoryReady) return;
    const stored = loadSpeakMemory();
    memoryRef.current = stored;
    const applied = applyMemory(stored);
    setHistory(applied.history);
    setInputLanguage(applied.inputLanguage);
    setReply(applied.reply);
    setCorrection(applied.correction);
    setCorrectionExplanation(applied.correctionExplanation);
    setGermanQuestion(applied.germanQuestion);
    setTurkishTranslation(applied.turkishTranslation);
    setPartialHint(applied.partialHint);
    setPraise(applied.praise);
    setBoardPhase(applied.boardPhase);
    setTeachingIntro(applied.teachingIntro);
    setTeachingTopicGerman(applied.teachingTopicGerman);
    setTeachingTopicTurkish(applied.teachingTopicTurkish);
    setTeachingExamples(applied.teachingExamples);
    setProfessor(applied.professor);
    setApiUsage(stored.apiUsage);
    setProfessorAdvice(applied.professor.lastProfessorAdvice);
    setDailyExercises(stored.dailyExercises);
    setExerciseIndex(stored.dailyExercises.currentIndex);
    if (applied.professor.expectsWrittenAnswer) setInputMode("write");
    if (applied.history.length) {
      setInfoMessage(formatSpeakResumeMessage(stored, currentLesson.title));
    }
    setMemoryReady(true);
    try {
      const storedFocus = localStorage.getItem(FOCUS_MODE_KEY);
      if (storedFocus === "0") setFocusMode(false);
      setProfessorAudio(loadProfessorAudioEnabled());
    } catch {
      /* ignore */
    }
  }, [hydrated, memoryReady, currentLesson.title]);

  useEffect(() => {
    if (!memoryReady) return;
    persist({
      session: {
        history,
        inputLanguage,
        lastReply: reply,
        lastCorrection: correction,
        lastCorrectionExplanation: correctionExplanation,
        lastGermanQuestion: germanQuestion,
        lastTurkishTranslation: turkishTranslation,
        lastPartialHint: partialHint,
        lastPraise: praise,
        lastTeachingIntro: teachingIntro,
        lastTeachingTopicGerman: teachingTopicGerman,
        lastTeachingTopicTurkish: teachingTopicTurkish,
        lastTeachingExamples: teachingExamples,
        lastBoardPhase: boardPhase,
      },
    });
  }, [
    memoryReady,
    history,
    inputLanguage,
    reply,
    correction,
    correctionExplanation,
    germanQuestion,
    turkishTranslation,
    partialHint,
    praise,
    boardPhase,
    teachingIntro,
    teachingTopicGerman,
    teachingTopicTurkish,
    teachingExamples,
    persist,
  ]);

  const applyTeacherMeta = useCallback(
    (chatData: ChatResponse, lessonId: string, wasWritten: boolean) => {
      let store = memoryRef.current;

      if (chatData.lessonNotes?.length) {
        store = appendTeacherNotes(store, chatData.lessonNotes, lessonId);
        setLatestNotes(chatData.lessonNotes);
      }

      if (chatData.weaknesses?.length) {
        store = mergeWeaknesses(store, chatData.weaknesses);
      }

      const nextAssignment = chatData.assignment ?? null;
      const expectsWritten = chatData.expectsWrittenAnswer === true;
      const outcome = inferAnswerOutcome(chatData, wasWritten);
      const prevLevel = store.professor.hintSupport.level;
      const hintSupport = updateHintSupport(store.professor.hintSupport, outcome);

      let stepConceptReady = store.professor.stepConceptReady;
      if (chatData.conceptIntroduced) {
        stepConceptReady = true;
      } else if (chatData.boardPhase === "teach" && !chatData.germanQuestion) {
        const examplesShown =
          (chatData.teachingExamples?.length ?? 0) > 0 || Boolean(chatData.teachingTopicGerman);
        stepConceptReady = examplesShown;
      }

      store = patchSpeakMemory(store, {
        professor: {
          currentAssignment: wasWritten && !expectsWritten ? null : nextAssignment,
          expectsWrittenAnswer: expectsWritten,
          lastProfessorAdvice: chatData.professorAdvice ?? store.professor.lastProfessorAdvice,
          hintSupport,
          stepConceptReady,
        },
        session: {
          lastGermanQuestion: chatData.germanQuestion ?? null,
          lastTurkishTranslation: chatData.turkishTranslation ?? null,
          lastPartialHint: chatData.partialHint ?? null,
          lastPraise: chatData.praise ?? null,
          lastTeachingIntro: chatData.teachingIntro ?? null,
          lastTeachingTopicGerman: chatData.teachingTopicGerman ?? null,
          lastTeachingTopicTurkish: chatData.teachingTopicTurkish ?? null,
          lastTeachingExamples: chatData.teachingExamples ?? [],
          lastBoardPhase: chatData.boardPhase ?? null,
        },
      });

      if (hintSupport.level !== prevLevel) {
        setInfoMessage(
          hintSupport.level > prevLevel
            ? `Destek seviyesi ${hintSupport.level}: ${hintLevelLabel(hintSupport.level)}`
            : `Türkçe destek geri geldi — seviye ${hintSupport.level}.`
        );
      } else if (outcome === "correct" && hintSupport.consecutiveCorrect > 0) {
        const left = HINT_LEVEL_STREAK - hintSupport.consecutiveCorrect;
        if (left > 0 && hintSupport.level < 3) {
          setInfoMessage(`${left} doğru cevap daha → destek azalır.`);
        }
      }

      if (chatData.professorAdvice) setProfessorAdvice(chatData.professorAdvice);

      memoryRef.current = store;
      saveSpeakMemory(store);
      setProfessor({ ...store.professor });

      if (expectsWritten) setInputMode("write");
    },
    []
  );

  const handleLessonProgress = useCallback(
    (chatData: ChatResponse) => {
      let nextProfessor = { ...memoryRef.current.professor };

      if (chatData.assessedLevel) {
        nextProfessor.assessedLevel = chatData.assessedLevel;
      }

      if (chatData.stepComplete) {
        const lesson = resolveCurrentLesson(nextProfessor.currentLessonId);
        nextProfessor.currentStepIndex = Math.min(
          nextProfessor.currentStepIndex + 1,
          lesson.steps.length - 1
        );
        nextProfessor.stepConceptReady = false;
        memoryRef.current = recordSpeakDailyStep(memoryRef.current);
        setDailySteps(memoryRef.current.dailySteps);
        saveSpeakMemory(memoryRef.current);
        updateProgress((p) => ({
          dailyStats: {
            ...p.dailyStats,
            speakSteps: (p.dailyStats.speakSteps ?? 0) + 1,
          },
        }));
      }

      if (chatData.lessonComplete) {
        const lesson = resolveCurrentLesson(nextProfessor.currentLessonId);
        const next = getNextLesson(lesson.id);
        const a1ToA2 = lesson.level === "A1" && next?.level === "A2";
        memoryRef.current = completeLesson(
          memoryRef.current,
          {
            lessonId: lesson.id,
            title: lesson.title,
            level: lesson.level,
            completedAt: new Date().toISOString(),
          },
          next?.id ?? lesson.id
        );
        if (a1ToA2) {
          memoryRef.current = patchSpeakMemory(memoryRef.current, {
            professor: { assessedLevel: "A2" },
          });
        }
        setProfessor({ ...memoryRef.current.professor });
        setDailySteps(memoryRef.current.dailySteps);
        saveSpeakMemory(memoryRef.current);
        setInfoMessage(
          a1ToA2
            ? `"${lesson.title}" bitti! A1 tamam — A2 konuşma başlıyor: "${next!.title}".`
            : next
              ? `“${lesson.title}” bitti! Sırada: “${next.title}”.`
              : `“${lesson.title}” tamamlandı — tebrikler!`
        );
        return;
      }

      persist({ professor: nextProfessor });
    },
    [persist, updateProgress]
  );

  const focusWrittenInput = useCallback(() => {
    requestAnimationFrame(() => {
      writtenInputRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (!loading && inputMode === "write") {
      focusWrittenInput();
    }
  }, [loading, inputMode, focusWrittenInput, germanQuestion]);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!trimmed || loading) return;

      if (inFlightMessageRef.current === trimmed) return;

      const guard = shouldBlockChatRequest(lastRequestAtRef.current);
      if (guard.blocked) {
        setInfoMessage(guard.reason ?? "Bekle…");
        addLog("warn", "İstek engellendi", guard.reason);
        return;
      }

      const wasWritten = isWrittenAnswerMessage(trimmed);
      inFlightMessageRef.current = trimmed;
      setLoading(true);
      setLoadingSlow(false);
      setChatError(null);
      setInfoMessage(null);
      const slowTimer = window.setTimeout(() => setLoadingSlow(true), 8000);
      // Tahtayı temizleme — hata olursa son cevap kalır

      addLog("info", wasWritten ? "Yazılı cevap gönderildi" : "Mesaj gönderildi", trimmed.slice(0, 80));

      const prof = memoryRef.current.professor;
      const progress = computeOverallCurriculumProgress(prof);
      const readyHint = buildReadyPracticeHint(prof.stepConceptReady, trimmed);
      const apiMessage = readyHint ? `${trimmed}\n\n${readyHint}` : trimmed;
      const useScript = shouldUseScriptProfessor(prof.currentLessonId, Boolean(clientChatAuthPayload().userApiKey));

      try {
        let chatDataRaw: ChatResponse;

        if (useScript) {
          await new Promise((r) => setTimeout(r, 350));
          chatDataRaw = runScriptProfessor({
            lessonId: prof.currentLessonId,
            stepIndex: prof.currentStepIndex,
            stepConceptReady: prof.stepConceptReady,
            userMessage: trimmed,
            lastGermanQuestion:
              germanQuestion ?? memoryRef.current.session.lastGermanQuestion,
            lastBoardPhase: boardPhase ?? memoryRef.current.session.lastBoardPhase,
          });
          addLog("ok", "Profesör modu yanıtı", `Adım ${prof.currentStepIndex + 1}`);
        } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: apiMessage,
            level: prof.assessedLevel,
            history,
            inputLanguage,
            lessonId: prof.currentLessonId,
            lessonStepIndex: prof.currentStepIndex,
            ...clientChatAuthPayload(),
            studentProfile: {
              weaknesses: prof.weaknesses,
              currentAssignment: prof.currentAssignment,
              recentNotes: prof.notes.slice(-6).map((n) => n.text),
              levelProgressPercent: progress.completedPercent,
              levelRemainingPercent: progress.remainingPercent,
              nextMilestone: progress.nextMilestone,
              hintLevel: prof.hintSupport.level,
              consecutiveCorrect: prof.hintSupport.consecutiveCorrect,
              stepConceptReady: prof.stepConceptReady,
            },
          }),
          signal: AbortSignal.timeout(120_000),
        });

        let data: ChatResponse | { error: string; detail?: string; code?: string };
        try {
          data = (await res.json()) as ChatResponse | { error: string; detail?: string; code?: string };
        } catch {
          const msg = res.ok ? "Sunucu yanıtı okunamadı." : PROFESSOR_UNAVAILABLE;
          setChatError(msg);
          addLog("error", "JSON okunamadı", `HTTP ${res.status}`);
          return;
        }

        if (!res.ok) {
          const errMsg = "error" in data ? data.error : "Bir hata oluştu.";
          const detail = "detail" in data && data.detail ? data.detail : null;
          setChatError(sanitizeProfessorErrorForUser(errMsg));
          addLog("error", errMsg, detail ?? `HTTP ${res.status}`);
          return;
        }

        chatDataRaw = data as ChatResponse;
        }

        const lesson = resolveCurrentLesson(prof.currentLessonId);
        const isLastStep = prof.currentStepIndex >= lesson.steps.length - 1;
        let chatData = coercePracticeIfReady(
          chatDataRaw,
          trimmed,
          prof.stepConceptReady,
          teachingTopicGerman ?? memoryRef.current.session.lastTeachingTopicGerman,
          teachingExamples.length > 0
            ? teachingExamples
            : memoryRef.current.session.lastTeachingExamples
        );
        chatData = coerceStepCompleteIfAnswered(
          chatData,
          trimmed,
          germanQuestion ?? memoryRef.current.session.lastGermanQuestion,
          boardPhase ?? memoryRef.current.session.lastBoardPhase,
          isLastStep
        );
        if (chatData.germanQuestion && !chatDataRaw.germanQuestion) {
          addLog("ok", "Alıştırmaya geçildi", chatData.germanQuestion);
        }
        if (chatData.stepComplete && !chatDataRaw.stepComplete) {
          addLog("ok", "Adım otomatik tamamlandı", lesson.steps[prof.currentStepIndex]?.title ?? "");
        }
        setLatestNotes([]);
        setReply(chatData.reply);
        setCorrection(chatData.correction);
        setCorrectionExplanation(chatData.correctionExplanation);
        setGermanQuestion(chatData.germanQuestion ?? null);
        setTurkishTranslation(chatData.turkishTranslation ?? null);
        setPartialHint(chatData.partialHint ?? null);
        setPraise(chatData.praise ?? null);
        setBoardPhase(chatData.boardPhase ?? null);
        setTeachingIntro(chatData.teachingIntro ?? null);
        setTeachingTopicGerman(chatData.teachingTopicGerman ?? null);
        setTeachingTopicTurkish(chatData.teachingTopicTurkish ?? null);
        setTeachingExamples(chatData.teachingExamples ?? []);

        setHistory((prev) => [
          ...prev,
          { role: "user", content: trimmed },
          { role: "assistant", content: chatData.reply },
        ]);

        applyTeacherMeta(chatData, prof.currentLessonId, wasWritten);
        handleLessonProgress(chatData);

        if (chatData.stepComplete) {
          addLog("ok", "Adım tamamlandı", `Adım ${prof.currentStepIndex + 1}`);
        }
        if (chatData.lessonComplete) {
          addLog("ok", "Ders tamamlandı", prof.currentLessonId);
        }

        if (chatData.usage) {
          const nextUsage = recordApiUsage(memoryRef.current.apiUsage, {
            ...chatData.usage,
            provider: chatData.provider ?? "gemini",
          });
          memoryRef.current = patchSpeakMemory(memoryRef.current, { apiUsage: nextUsage });
          saveSpeakMemory(memoryRef.current);
          setApiUsage(nextUsage);
          addLog(
            "ok",
            "API yanıt alındı",
            `${chatData.usage.totalTokens} token · ${chatData.usage.model}`
          );
        } else if (!useScript) {
          addLog("ok", "API yanıt alındı");
        }

        lastRequestAtRef.current = Date.now();

        if (wasWritten) {
          setWrittenText("");
          focusWrittenInput();
        }

        if (chatData.correction) {
          const wordId = mapSpeechCorrectionToWordId(chatData.correction, trimmed);
          if (wordId) {
            updateProgress((p) => recordSRSReview(p, wordId, false));
          }
        }

        if (professorAudio) {
          void playProfessorTurn({
            speakTextGerman: chatData.speakTextGerman,
            germanQuestion: chatData.germanQuestion,
            teachingTopicGerman: chatData.teachingTopicGerman,
            teachingTopicTurkish: chatData.teachingTopicTurkish,
            turkishTranslation: chatData.turkishTranslation,
            speakText: chatData.speakText,
            reply: chatData.reply,
            correction: chatData.correction,
            praise: chatData.praise,
            inputLanguage,
            boardPhase: chatData.boardPhase ?? null,
          });
        }
      } catch (err) {
        const isTimeout = err instanceof Error && err.name === "TimeoutError";
        const msg = isTimeout ? PROFESSOR_TIMEOUT : "Bağlantı hatası. Tekrar deneyin.";
        setChatError(msg);
        addLog("error", "İstek başarısız", err instanceof Error ? err.message : String(err));
      } finally {
        inFlightMessageRef.current = null;
        window.clearTimeout(slowTimer);
        setLoadingSlow(false);
        setLoading(false);
      }
    },
    [history, loading, updateProgress, inputLanguage, handleLessonProgress, applyTeacherMeta, addLog, professorAudio, focusWrittenInput, teachingTopicGerman, teachingExamples, germanQuestion, boardPhase]
  );

  const hintLevel = professor.hintSupport.level;
  const activeLoading = loading || exerciseLoading;
  const currentExercise: SpeakExercise | null = exerciseOpen
    ? getExerciseForIndex(professor.assessedLevel, exerciseIndex) ??
      buildDailyExerciseSet(professor.assessedLevel)[0] ??
      null
    : null;

  const saveBoardSnapshot = useCallback(() => {
    lessonBoardSnapshotRef.current = {
      reply,
      correction,
      correctionExplanation,
      germanQuestion,
      turkishTranslation,
      partialHint,
      praise,
      boardPhase,
      teachingIntro,
      teachingTopicGerman,
      teachingTopicTurkish,
      teachingExamples,
    };
  }, [
    reply,
    correction,
    correctionExplanation,
    germanQuestion,
    turkishTranslation,
    partialHint,
    praise,
    boardPhase,
    teachingIntro,
    teachingTopicGerman,
    teachingTopicTurkish,
    teachingExamples,
  ]);

  const restoreBoardSnapshot = useCallback(() => {
    const snap = lessonBoardSnapshotRef.current;
    if (!snap) return;
    setReply(snap.reply);
    setCorrection(snap.correction);
    setCorrectionExplanation(snap.correctionExplanation);
    setGermanQuestion(snap.germanQuestion);
    setTurkishTranslation(snap.turkishTranslation);
    setPartialHint(snap.partialHint);
    setPraise(snap.praise);
    setBoardPhase(snap.boardPhase);
    setTeachingIntro(snap.teachingIntro);
    setTeachingTopicGerman(snap.teachingTopicGerman);
    setTeachingTopicTurkish(snap.teachingTopicTurkish);
    setTeachingExamples(snap.teachingExamples);
  }, []);

  const applyExerciseFeedback = useCallback((result: ExerciseCheckResponse) => {
    setReply(result.boardReply);
    setPraise(result.praise);
    setCorrection(result.correction);
    setCorrectionExplanation(result.correctionExplanation);
    setPartialHint(result.tip);
    setGermanQuestion(null);
    setTeachingIntro(null);
    setTeachingExamples([]);
    setBoardPhase(null);
  }, []);

  const toggleExercisePanel = useCallback(() => {
    setExerciseOpen((prev) => {
      const next = !prev;
      if (next) {
        saveBoardSnapshot();
        setExerciseResult(null);
        if (focusMode) setFocusMode(false);
        setInfoMessage("Egzersiz modu.");
      } else {
        restoreBoardSnapshot();
        setExerciseResult(null);
        setInfoMessage("Derse döndün.");
      }
      return next;
    });
  }, [saveBoardSnapshot, restoreBoardSnapshot, focusMode]);

  const submitExerciseAnswer = useCallback(
    async (studentAnswer: string) => {
      if (!currentExercise || exerciseLoading) return;
      setExerciseLoading(true);
      setExerciseResult(null);
      setChatError(null);

      try {
        const res = await fetch("/api/exercise/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            level: professor.assessedLevel,
            exerciseType: currentExercise.type,
            promptDe: currentExercise.promptDe,
            expectedHint: currentExercise.expectedAnswer ?? currentExercise.blankWord ?? null,
            studentAnswer,
            hintLevel: professor.hintSupport.level,
            weaknesses: professor.weaknesses,
            correctOptionId: currentExercise.correctOptionId,
            correctTrueFalse: currentExercise.correctTrueFalse,
            blankWord: currentExercise.blankWord,
            ...clientChatAuthPayload(),
          }),
          signal: AbortSignal.timeout(60_000),
        });

        const data = (await res.json()) as ExerciseCheckResponse & { error?: string; detail?: string };
        if (!res.ok) {
          setChatError(sanitizeProfessorErrorForUser(data.error ?? "Egzersiz kontrolü başarısız."));
          return;
        }

        setExerciseResult(data);
        applyExerciseFeedback(data);

        const outcome = data.isCorrect ? "correct" : "wrong";
        const hintSupport = updateHintSupport(professor.hintSupport, outcome);
        let store = memoryRef.current;
        if (data.weaknesses?.length) {
          store = mergeWeaknesses(store, data.weaknesses);
        }
        store = patchSpeakMemory(store, { professor: { hintSupport } });
        memoryRef.current = store;
        saveSpeakMemory(store);
        setProfessor({ ...store.professor });

        if (professorAudio) {
          void playProfessorTurn({
            speakText: data.speakText,
            speakTextGerman: data.speakTextGerman ?? data.correction ?? data.praise,
            reply: data.boardReply,
            correction: data.correction,
            praise: data.praise,
            inputLanguage,
            boardPhase: null,
          });
        }
      } catch (err) {
        setChatError("Egzersiz bağlantı hatası.");
      } finally {
        setExerciseLoading(false);
      }
    },
    [
      currentExercise,
      exerciseLoading,
      professor,
      applyExerciseFeedback,
      professorAudio,
      inputLanguage,
    ]
  );

  const handleExerciseNext = useCallback(() => {
    if (!currentExercise || !exerciseResult) return;
    memoryRef.current = recordSpeakDailyExercise(
      memoryRef.current,
      currentExercise.type,
      exerciseResult.score
    );
    saveSpeakMemory(memoryRef.current);
    setDailyExercises(memoryRef.current.dailyExercises);
    const nextIndex = memoryRef.current.dailyExercises.currentIndex;
    setExerciseIndex(nextIndex);
    setExerciseResult(null);
    updateProgress((p) => ({
      dailyStats: {
        ...p.dailyStats,
        exercisesCompleted: (p.dailyStats.exercisesCompleted ?? 0) + 1,
      },
    }));
    setInfoMessage("Sonraki egzersize geçildi.");
  }, [currentExercise, exerciseResult, updateProgress]);

  const handleStartLesson = () => {
    if (loading) return;
    if (history.length > 0) {
      setInfoMessage(
        formatSpeakResumeMessage(memoryRef.current, currentLesson.title) ??
          "Devam et."
      );
      return;
    }
    void sendMessage(LESSON_START_MESSAGE);
  };

  const handleWrittenSubmit = useCallback(() => {
    const text = writtenText.trim();
    if (!text || activeLoading) return;
    if (exerciseOpen && currentExercise) {
      void submitExerciseAnswer(text);
      setWrittenText("");
      return;
    }
    void sendMessage(formatWrittenAnswer(text));
    focusWrittenInput();
  }, [writtenText, activeLoading, exerciseOpen, currentExercise, submitExerciseAnswer, sendMessage, focusWrittenInput]);

  const handleReset = () => {
    memoryRef.current = resetProfessorLesson(memoryRef.current);
    saveSpeakMemory(memoryRef.current);
    const applied = applyMemory(memoryRef.current);
    setHistory([]);
    setReply(null);
    setCorrection(null);
    setCorrectionExplanation(null);
    setGermanQuestion(null);
    setTurkishTranslation(null);
    setPartialHint(null);
    setPraise(null);
    setBoardPhase(null);
    setTeachingIntro(null);
    setTeachingTopicGerman(null);
    setTeachingTopicTurkish(null);
    setTeachingExamples([]);
    setLatestNotes([]);
    setWrittenText("");
    setProfessor(applied.professor);
    setApiUsage(memoryRef.current.apiUsage);
    setProfessorAdvice(null);
    setSessionLogs([]);
    setInputMode("voice");
    lastRequestAtRef.current = null;
    inFlightMessageRef.current = null;
    setInfoMessage("Sınıf sıfırlandı. “Derse gir” ile yeniden başla.");
  };

  useEffect(() => {
    if (!listening && pendingSendRef.current) {
      pendingSendRef.current = false;
      const text = finalTranscript.trim();
      if (text) {
        if (exerciseOpen && currentExercise?.type === "speak_prompt") {
          void submitExerciseAnswer(text);
        } else if (!exerciseOpen) {
          void sendMessage(text);
        } else {
          void submitExerciseAnswer(text);
        }
      } else setInfoMessage("Duymadım — tekrar dener misin?");
    }
  }, [listening, finalTranscript, sendMessage, exerciseOpen, currentExercise, submitExerciseAnswer]);

  const handleMicToggle = () => {
    if (!supported || activeLoading) return;
    if (listening) {
      pendingSendRef.current = true;
      stopListening();
    } else {
      stopAudio();
      resetTranscript();
      setChatError(null);
      pendingSendRef.current = true;
      startListening();
    }
  };

  const displayTranscript =
    finalTranscript + (interimTranscript ? (finalTranscript ? " " : "") + interimTranscript : "");

  const toggleProfessorAudio = () => {
    setProfessorAudio((prev) => {
      const next = !prev;
      saveProfessorAudioEnabled(next);
      if (!next) stopAudio();
      return next;
    });
  };

  const toggleFocusMode = () => {
    setFocusMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(FOCUS_MODE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const lastSaved = memoryRef.current.session.lastSavedAt;

  return (
    <PageShell
      title="Sınıf"
      subtitle="Öğretim → örnek → soru"
      maxWidth="full"
    >
      {scriptModeActive && (
        <div className="mb-3">
          <ScriptProfessorBanner lessonTitle={currentLesson.title} />
        </div>
      )}

      {focusMode ? (
        <details className="mb-2 card-soft p-2">
          <summary className="cursor-pointer text-xs text-sage-500">
            İlerleme · %{curriculumProgress.completedPercent} · {currentLesson.title}
          </summary>
          <div className="mt-2">
            <SpeakProgressPanel
              progress={curriculumProgress}
              professorAdvice={professorAdvice ?? fallbackAdvice}
              dailySteps={dailySteps}
              dailyExercises={dailyExercises}
            />
          </div>
        </details>
      ) : (
        <div className="mb-3 grid gap-2 lg:grid-cols-[1fr_auto]">
          <SpeakProgressPanel
            progress={curriculumProgress}
            professorAdvice={professorAdvice ?? fallbackAdvice}
            dailySteps={dailySteps}
            dailyExercises={dailyExercises}
          />
          <details className="card-soft group p-3 lg:min-w-[9rem]">
            <summary className="cursor-pointer text-xs font-medium text-sage-500">
              API · {apiUsage.dayRequests} istek
            </summary>
            <div className="mt-2">
              <SpeakApiUsagePanel usage={apiUsage} compact />
            </div>
          </details>
        </div>
      )}

      <div
        className={
          focusMode
            ? "flex flex-col gap-3"
            : "grid gap-3 xl:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_minmax(0,11rem)]"
        }
      >
        {!focusMode && (
          <div className="hidden xl:block">
            <SpeakLessonShelf
              currentLesson={currentLesson}
              currentStepIndex={professor.currentStepIndex}
              completedLessons={professor.completedLessons}
              assessedLevel={professor.assessedLevel}
              notes={professor.notes}
              collapsed
            />
          </div>
        )}

        <div className="flex min-h-[72vh] min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="text-xs text-sage-500">
              {memoryReady && lastSaved && (
                <>
                  {history.length} tur · destek {hintLevel}/3
                  {focusMode && ` · ${currentLesson.steps[professor.currentStepIndex]?.title ?? ""}`}
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/dialogues?level=${professor.assessedLevel}`}
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-900 hover:bg-indigo-100"
              >
                Hikayeler
              </Link>
              <button
                type="button"
                onClick={toggleExercisePanel}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  exerciseOpen
                    ? "bg-emerald-700 text-white"
                    : "border border-emerald-300 text-emerald-800"
                }`}
              >
                {exerciseOpen ? "Egzersiz ✓" : "Egzersiz alanı"}
              </button>
              <button
                type="button"
                onClick={toggleProfessorAudio}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  professorAudio
                    ? "bg-[#1a3d32] text-[#e8edd8]"
                    : "border border-sage-200 text-sage-500"
                }`}
                title={professorAudio ? "Otomatik sesi kapat" : "Otomatik sesi aç"}
              >
                {professorAudio ? "🔊 Ses açık" : "🔇 Sessiz"}
              </button>
              <button
                type="button"
                onClick={toggleFocusMode}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  focusMode
                    ? "bg-emerald-700 text-white"
                    : "border border-sage-200 text-sage-600"
                }`}
              >
                {focusMode ? "Derse odaklan ✓" : "Panelleri göster"}
              </button>
              <button
                type="button"
                onClick={handleStartLesson}
                disabled={loading}
                className="rounded-lg bg-goethe-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-goethe-blue/90 disabled:opacity-40"
              >
                {history.length ? "Devam" : "Derse gir"}
              </button>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-sage-200 px-3 py-2 text-xs text-sage-500 hover:text-goethe-red"
                >
                  Sıfırla
                </button>
              )}
            </div>
          </div>

          <SpeakBoard
            reply={reply}
            boardPhase={boardPhase}
            teachingIntro={teachingIntro}
            teachingTopicGerman={teachingTopicGerman}
            teachingTopicTurkish={teachingTopicTurkish}
            teachingExamples={teachingExamples}
            germanQuestion={germanQuestion}
            turkishTranslation={turkishTranslation}
            partialHint={partialHint}
            praise={praise}
            hintLevel={hintLevel}
            correction={correction}
            correctionExplanation={correctionExplanation}
            latestNotes={latestNotes}
            assignment={professor.currentAssignment}
            loading={activeLoading}
            loadingSlow={loadingSlow || exerciseLoading}
            exerciseMode={exerciseOpen}
            exerciseOpen={exerciseOpen}
            onToggleExercise={toggleExercisePanel}
            onBoardClick={toggleExercisePanel}
          />

          <SpeakExercisePanel
            open={exerciseOpen}
            level={professor.assessedLevel}
            exercise={currentExercise}
            dailyExercises={dailyExercises}
            hintLevel={hintLevel}
            loading={exerciseLoading}
            lastResult={exerciseResult}
            onClose={toggleExercisePanel}
            onSubmitMcq={(id) => void submitExerciseAnswer(id)}
            onSubmitText={(text) => void submitExerciseAnswer(text)}
            onSubmitTrueFalse={(v) => void submitExerciseAnswer(v ? "true" : "false")}
            onNext={handleExerciseNext}
          />

          {professor.stepConceptReady && boardPhase === "teach" && !germanQuestion && history.length > 0 && (
            <button
              type="button"
              disabled={loading}
              onClick={() => void sendMessage(formatWrittenAnswer("hazırım hocam"))}
              className="w-full rounded-xl border-2 border-[#ffd966]/60 bg-[#ffd966]/15 py-3 text-sm font-semibold text-[#5c4033] hover:bg-[#ffd966]/25 disabled:opacity-40"
            >
              Örnekleri okudum — alıştırmaya geç →
            </button>
          )}

          {/* Öğrenci masası — kompakt */}
          <div className="shrink-0 rounded-xl border border-[#5c4033]/30 bg-[#faf8f3] p-3 shadow-sm">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-[#5c4033]">
              {exerciseOpen ? "Egzersiz" : "Cevap ver"}
            </p>
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode("voice")}
                className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                  inputMode === "voice"
                    ? "bg-goethe-blue text-white"
                    : "border border-sage-200 text-sage-600"
                }`}
              >
                Konuş
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputMode("write");
                  focusWrittenInput();
                }}
                className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                  inputMode === "write"
                    ? "bg-goethe-blue text-white"
                    : "border border-sage-200 text-sage-600"
                }`}
              >
                Yaz
              </button>
            </div>

            {inputMode === "voice" ? (
              <div className="flex flex-col items-center gap-3 py-2">
                <button
                  type="button"
                  onClick={handleMicToggle}
                  disabled={!supported || activeLoading}
                  className={`flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition ${
                    listening
                      ? "animate-pulse bg-goethe-red text-white ring-4 ring-goethe-red/30"
                      : "bg-goethe-blue text-white hover:bg-goethe-blue/90 disabled:opacity-40"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </button>
                <p className="text-center text-xs text-sage-500">
                  {activeLoading ? "Kontrol…" : listening ? "Konuş…" : "Mikrofon"}
                </p>
                {(displayTranscript || listening) && (
                  <p className="text-sm text-goethe-blue">
                    {finalTranscript}
                    {interimTranscript && <span className="italic text-sage-400"> {interimTranscript}</span>}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  ref={writtenInputRef}
                  value={writtenText}
                  onChange={(e) => setWrittenText(e.target.value)}
                  placeholder="Almanca cümleini yaz…"
                  rows={3}
                  readOnly={activeLoading}
                  aria-busy={activeLoading}
                  className={`w-full resize-none rounded-xl border border-sage-200 bg-white px-3 py-2.5 text-sm text-goethe-blue placeholder:text-sage-300 focus:border-goethe-blue focus:outline-none focus:ring-1 focus:ring-goethe-blue/30 ${activeLoading ? "opacity-70" : ""}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleWrittenSubmit();
                    }
                  }}
                />
                <p className="text-xs text-sage-500">
                  ss→ß · oe→ö · ue→ü
                </p>
                <button
                  type="button"
                  onClick={handleWrittenSubmit}
                  disabled={activeLoading || !writtenText.trim()}
                  className="w-full rounded-xl bg-goethe-blue py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Gönder
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {INPUT_LANGUAGES.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  if (opt.id === inputLanguage) return;
                  setInputLanguage(opt.id);
                  resetTranscript();
                }}
                className={`flex-1 rounded-lg px-2 py-1.5 text-xs ${
                  inputLanguage === opt.id
                    ? "bg-sage-700 text-white"
                    : "border border-sage-200 text-sage-500"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {infoMessage && (
            <div className="rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-600">
              {infoMessage}
            </div>
          )}
          {(sttError || chatError) && (
            <div className="rounded-xl border border-goethe-red/30 bg-red-50 px-4 py-3 text-sm text-goethe-red">
              <p>{sttError || sanitizeProfessorErrorForUser(chatError)}</p>
              {chatError && !sttError && isProfessorMissingApiKeyError(chatError) && (
                <>
                  <Link
                    href="/ayarlar"
                    className="mt-3 inline-block font-semibold text-goethe-blue underline"
                  >
                    API ayarları →
                  </Link>
                </>
              )}
              {chatError && !sttError && isProfessorQuotaError(chatError) && (
                <p className="mt-2 text-xs leading-relaxed text-sage-600">
                  Sağlayıcı hesabınızdaki bakiye veya günlük limiti kontrol edin.
                </p>
              )}
              {chatError && !sttError && isProfessorRateLimitError(chatError) && (
                <p className="mt-2 text-xs leading-relaxed text-sage-600">
                  Birkaç saniye bekleyip tekrar deneyin.
                </p>
              )}
            </div>
          )}
        </div>

        {!focusMode && (
          <aside className="hidden space-y-2 xl:block">
            <details className="rounded-lg border border-sage-200 bg-white p-2">
              <summary className="cursor-pointer px-2 py-1 text-xs font-semibold uppercase text-sage-500">
                Eksiklerin ({professor.weaknesses.length})
              </summary>
              <div className="px-2 pb-2 pt-1">
                {professor.weaknesses.length === 0 ? (
                  <p className="text-xs italic text-sage-400">Henüz yok</p>
                ) : (
                  <ul className="space-y-1">
                    {professor.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-orange-900">
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
            <SpeakSessionLogPanel logs={sessionLogs} onClear={() => setSessionLogs([])} />
          </aside>
        )}

        {focusMode && (
          <div className="grid gap-2 sm:grid-cols-2">
            <details className="rounded-lg border border-sage-200 bg-white/90">
              <summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase text-sage-500">
                Not defteri & dersler
              </summary>
              <div className="border-t border-sage-100 p-2">
                <SpeakLessonShelf
                  currentLesson={currentLesson}
                  currentStepIndex={professor.currentStepIndex}
                  completedLessons={professor.completedLessons}
                  assessedLevel={professor.assessedLevel}
                  notes={professor.notes}
                  collapsed
                />
              </div>
            </details>
            <details className="rounded-lg border border-sage-200 bg-white/90">
              <summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase text-sage-500">
                Eksiklerin ({professor.weaknesses.length})
              </summary>
              <div className="border-t border-sage-100 p-3">
                {professor.weaknesses.length === 0 ? (
                  <p className="text-xs italic text-sage-400">Ders ilerledikçe birikir</p>
                ) : (
                  <ul className="space-y-1">
                    {professor.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-orange-950">
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
                {professor.currentAssignment && (
                  <button
                    type="button"
                    onClick={() => setInputMode("write")}
                    className="mt-2 w-full rounded-lg border border-amber-300 bg-amber-50 py-2 text-xs font-semibold text-amber-950"
                  >
                    Tahtadaki görevi yaz
                  </button>
                )}
              </div>
            </details>
          </div>
        )}
      </div>
    </PageShell>
  );
}
