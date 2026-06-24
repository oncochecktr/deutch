import type { HintSupportState } from "./speakHintLevel";
import { emptyHintSupport, normalizeHintSupport } from "./speakHintLevel";
import { getFirstLesson } from "./speakCurriculum";
import { emptyApiUsage, normalizeApiUsage, type SpeakApiUsageTotals } from "./speakApiUsage";
import type { SpeakDailySteps } from "./speakDailySteps";
import { emptyDailySteps, normalizeDailySteps, recordDailyStep } from "./speakDailySteps";
import type { SpeakDailyExercises } from "./speakExerciseDaily";
import {
  emptyDailyExercises,
  normalizeDailyExercises,
  recordDailyExercise,
} from "./speakExerciseDaily";
import type { ExerciseScore, ExerciseType } from "./speakExercise";
import type { ChatHistoryItem, SpeakInputLanguage, SpeakLevel } from "./speakTypes";

export const SPEAK_STORAGE_KEY = "german-coach-speak-memory";

export interface SpeakLevelSession {
  history: ChatHistoryItem[];
  inputLanguage: SpeakInputLanguage;
  lastReply: string | null;
  lastCorrection: string | null;
  lastCorrectionExplanation: string | null;
  lastSavedAt: string | null;
  /** Tahtadaki son soru / ipucu */
  lastGermanQuestion: string | null;
  lastTurkishTranslation: string | null;
  lastPartialHint: string | null;
  lastPraise: string | null;
  lastTeachingIntro: string | null;
  lastTeachingTopicGerman: string | null;
  lastTeachingTopicTurkish: string | null;
  lastTeachingExamples: { german: string; turkish: string }[];
  lastBoardPhase: "teach" | "practice" | "question" | null;
}

export interface CompletedLessonRecord {
  lessonId: string;
  title: string;
  level: SpeakLevel;
  completedAt: string;
}

export interface TeacherNote {
  id: string;
  text: string;
  lessonId: string;
  at: string;
}

export interface SpeakProfessorState {
  assessedLevel: SpeakLevel;
  currentLessonId: string;
  currentStepIndex: number;
  completedLessons: CompletedLessonRecord[];
  /** Profesörün tahtaya yazdığı notlar */
  notes: TeacherNote[];
  /** Tespit edilen eksikler */
  weaknesses: string[];
  /** Bekleyen yazılı ödev */
  currentAssignment: string | null;
  expectsWrittenAnswer: boolean;
  /** Son profesör tavsiyesi */
  lastProfessorAdvice: string | null;
  /** A1 destek seviyesi — performansa göre 1→2→3 */
  hintSupport: HintSupportState;
  /** Aktif adımda konu öğretildi mi (örnekler gösterildi) */
  stepConceptReady: boolean;
}

export interface SpeakMemoryStore {
  version: 2;
  professor: SpeakProfessorState;
  session: SpeakLevelSession;
  apiUsage: SpeakApiUsageTotals;
  dailySteps: SpeakDailySteps;
  dailyExercises: SpeakDailyExercises;
  exerciseStats: {
    totalCompleted: number;
    byType: Partial<Record<ExerciseType, number>>;
  };
}

/** @deprecated v1 uyumluluk */
interface SpeakMemoryStoreV1 {
  version: 1;
  activeLevel: SpeakLevel;
  sessions: Partial<Record<SpeakLevel, SpeakLevelSession>>;
}

const LEVELS: SpeakLevel[] = ["A1", "A2", "B1"];

export function emptySpeakSession(): SpeakLevelSession {
  return {
    history: [],
    inputLanguage: "tr",
    lastReply: null,
    lastCorrection: null,
    lastCorrectionExplanation: null,
    lastSavedAt: null,
    lastGermanQuestion: null,
    lastTurkishTranslation: null,
    lastPartialHint: null,
    lastPraise: null,
    lastTeachingIntro: null,
    lastTeachingTopicGerman: null,
    lastTeachingTopicTurkish: null,
    lastTeachingExamples: [],
    lastBoardPhase: null,
  };
}

export function emptyProfessorState(): SpeakProfessorState {
  const first = getFirstLesson();
  return {
    assessedLevel: "A1",
    currentLessonId: first.id,
    currentStepIndex: 0,
    completedLessons: [],
    notes: [],
    weaknesses: [],
    currentAssignment: null,
    expectsWrittenAnswer: false,
    lastProfessorAdvice: null,
    hintSupport: emptyHintSupport(),
    stepConceptReady: false,
  };
}

function emptyStore(): SpeakMemoryStore {
  return {
    version: 2,
    professor: emptyProfessorState(),
    session: emptySpeakSession(),
    apiUsage: emptyApiUsage(),
    dailySteps: emptyDailySteps(),
    dailyExercises: emptyDailyExercises(),
    exerciseStats: { totalCompleted: 0, byType: {} },
  };
}

function normalizeSession(raw: Partial<SpeakLevelSession> | undefined): SpeakLevelSession {
  const base = emptySpeakSession();
  if (!raw) return base;
  return {
    history: Array.isArray(raw.history) ? raw.history : [],
    inputLanguage: raw.inputLanguage === "de" ? "de" : "tr",
    lastReply: typeof raw.lastReply === "string" ? raw.lastReply : null,
    lastCorrection: typeof raw.lastCorrection === "string" ? raw.lastCorrection : null,
    lastCorrectionExplanation:
      typeof raw.lastCorrectionExplanation === "string"
        ? raw.lastCorrectionExplanation
        : null,
    lastSavedAt: typeof raw.lastSavedAt === "string" ? raw.lastSavedAt : null,
    lastGermanQuestion:
      typeof raw.lastGermanQuestion === "string" ? raw.lastGermanQuestion : null,
    lastTurkishTranslation:
      typeof raw.lastTurkishTranslation === "string" ? raw.lastTurkishTranslation : null,
    lastPartialHint: typeof raw.lastPartialHint === "string" ? raw.lastPartialHint : null,
    lastPraise: typeof raw.lastPraise === "string" ? raw.lastPraise : null,
    lastTeachingIntro:
      typeof raw.lastTeachingIntro === "string" ? raw.lastTeachingIntro : null,
    lastTeachingTopicGerman:
      typeof raw.lastTeachingTopicGerman === "string" ? raw.lastTeachingTopicGerman : null,
    lastTeachingTopicTurkish:
      typeof raw.lastTeachingTopicTurkish === "string" ? raw.lastTeachingTopicTurkish : null,
    lastTeachingExamples: Array.isArray(raw.lastTeachingExamples)
      ? raw.lastTeachingExamples
          .filter(
            (e) =>
              e &&
              typeof e === "object" &&
              typeof (e as { german?: string }).german === "string" &&
              typeof (e as { turkish?: string }).turkish === "string"
          )
          .map((e) => ({
            german: (e as { german: string }).german,
            turkish: (e as { turkish: string }).turkish,
          }))
      : [],
    lastBoardPhase:
      raw.lastBoardPhase === "teach" ||
      raw.lastBoardPhase === "practice" ||
      raw.lastBoardPhase === "question"
        ? raw.lastBoardPhase
        : null,
  };
}

function normalizeProfessor(raw: Partial<SpeakProfessorState> | undefined): SpeakProfessorState {
  const base = emptyProfessorState();
  if (!raw) return base;
  return {
    assessedLevel: LEVELS.includes(raw.assessedLevel as SpeakLevel)
      ? (raw.assessedLevel as SpeakLevel)
      : base.assessedLevel,
    currentLessonId:
      typeof raw.currentLessonId === "string" ? raw.currentLessonId : base.currentLessonId,
    currentStepIndex:
      typeof raw.currentStepIndex === "number" && raw.currentStepIndex >= 0
        ? raw.currentStepIndex
        : base.currentStepIndex,
    completedLessons: Array.isArray(raw.completedLessons)
      ? raw.completedLessons.filter(
          (c) =>
            c &&
            typeof c === "object" &&
            typeof c.lessonId === "string" &&
            typeof c.title === "string"
        )
      : [],
    notes: Array.isArray(raw.notes)
      ? raw.notes.filter(
          (n) =>
            n &&
            typeof n === "object" &&
            typeof n.id === "string" &&
            typeof n.text === "string"
        )
      : [],
    weaknesses: Array.isArray(raw.weaknesses)
      ? raw.weaknesses.filter((w): w is string => typeof w === "string" && w.trim().length > 0)
      : [],
    currentAssignment:
      typeof raw.currentAssignment === "string" ? raw.currentAssignment : null,
    expectsWrittenAnswer: raw.expectsWrittenAnswer === true,
    lastProfessorAdvice:
      typeof raw.lastProfessorAdvice === "string" ? raw.lastProfessorAdvice : null,
    hintSupport: normalizeHintSupport(raw.hintSupport),
    stepConceptReady: raw.stepConceptReady === true,
  };
}

export function appendTeacherNotes(
  store: SpeakMemoryStore,
  texts: string[],
  lessonId: string
): SpeakMemoryStore {
  if (!texts.length) return store;
  const at = new Date().toISOString();
  const newNotes: TeacherNote[] = texts.map((text, i) => ({
    id: `note_${Date.now()}_${i}`,
    text,
    lessonId,
    at,
  }));
  return patchSpeakMemory(store, {
    professor: { notes: [...store.professor.notes, ...newNotes] },
  });
}

export function mergeWeaknesses(store: SpeakMemoryStore, incoming: string[]): SpeakMemoryStore {
  if (!incoming.length) return store;
  const set = new Set([...store.professor.weaknesses, ...incoming]);
  return patchSpeakMemory(store, {
    professor: { weaknesses: [...set].slice(-12) },
  });
}

function migrateV1(parsed: SpeakMemoryStoreV1): SpeakMemoryStore {
  const activeLevel = LEVELS.includes(parsed.activeLevel) ? parsed.activeLevel : "A1";
  const session = normalizeSession(parsed.sessions?.[activeLevel]);
  return {
    version: 2,
    professor: emptyProfessorState(),
    session,
    apiUsage: emptyApiUsage(),
    dailySteps: emptyDailySteps(),
    dailyExercises: emptyDailyExercises(),
    exerciseStats: { totalCompleted: 0, byType: {} },
  };
}

function normalizeExerciseStats(
  raw: Partial<SpeakMemoryStore["exerciseStats"]> | undefined
): SpeakMemoryStore["exerciseStats"] {
  if (!raw) return { totalCompleted: 0, byType: {} };
  return {
    totalCompleted: typeof raw.totalCompleted === "number" ? raw.totalCompleted : 0,
    byType: raw.byType && typeof raw.byType === "object" ? raw.byType : {},
  };
}

export function loadSpeakMemory(): SpeakMemoryStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(SPEAK_STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<SpeakMemoryStore | SpeakMemoryStoreV1>;

    if (parsed.version === 2) {
      const store = parsed as Partial<SpeakMemoryStore>;
      return {
        version: 2,
        professor: normalizeProfessor(store.professor),
        session: normalizeSession(store.session),
        apiUsage: normalizeApiUsage(store.apiUsage),
        dailySteps: normalizeDailySteps(store.dailySteps),
        dailyExercises: normalizeDailyExercises(store.dailyExercises),
        exerciseStats: normalizeExerciseStats(store.exerciseStats),
      };
    }

    if (parsed.version === 1) {
      return {
        ...migrateV1(parsed as SpeakMemoryStoreV1),
        apiUsage: emptyApiUsage(),
        dailySteps: emptyDailySteps(),
        dailyExercises: emptyDailyExercises(),
        exerciseStats: { totalCompleted: 0, byType: {} },
      };
    }

    return emptyStore();
  } catch {
    return emptyStore();
  }
}

export function saveSpeakMemory(store: SpeakMemoryStore): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(SPEAK_STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

export function patchSpeakMemory(
  store: SpeakMemoryStore,
  patch: {
    session?: Partial<SpeakLevelSession>;
    professor?: Partial<SpeakProfessorState>;
    apiUsage?: SpeakApiUsageTotals;
    dailySteps?: SpeakDailySteps;
    dailyExercises?: SpeakDailyExercises;
    exerciseStats?: SpeakMemoryStore["exerciseStats"];
  }
): SpeakMemoryStore {
  return {
    version: 2,
    professor: patch.professor
      ? { ...store.professor, ...patch.professor }
      : store.professor,
    session: patch.session
      ? {
          ...store.session,
          ...patch.session,
          lastSavedAt: new Date().toISOString(),
        }
      : store.session,
    apiUsage: patch.apiUsage ?? store.apiUsage,
    dailySteps: patch.dailySteps ?? store.dailySteps,
    dailyExercises: patch.dailyExercises ?? store.dailyExercises,
    exerciseStats: patch.exerciseStats ?? store.exerciseStats,
  };
}

export function recordSpeakDailyExercise(
  store: SpeakMemoryStore,
  exerciseType: ExerciseType,
  score: ExerciseScore
): SpeakMemoryStore {
  const dailyExercises = recordDailyExercise(store.dailyExercises, score);
  const byType = { ...store.exerciseStats.byType };
  byType[exerciseType] = (byType[exerciseType] ?? 0) + 1;
  return patchSpeakMemory(store, {
    dailyExercises,
    exerciseStats: {
      totalCompleted: store.exerciseStats.totalCompleted + 1,
      byType,
    },
  });
}

export function recordSpeakDailyStep(store: SpeakMemoryStore): SpeakMemoryStore {
  return patchSpeakMemory(store, {
    dailySteps: recordDailyStep(store.dailySteps),
  });
}

export function completeLesson(
  store: SpeakMemoryStore,
  record: CompletedLessonRecord,
  nextLessonId: string
): SpeakMemoryStore {
  const exists = store.professor.completedLessons.some((c) => c.lessonId === record.lessonId);
  return patchSpeakMemory(store, {
    professor: {
      completedLessons: exists
        ? store.professor.completedLessons
        : [...store.professor.completedLessons, record],
      currentLessonId: nextLessonId,
      currentStepIndex: 0,
      stepConceptReady: false,
    },
  });
}

export function resetProfessorLesson(store: SpeakMemoryStore): SpeakMemoryStore {
  return {
    version: 2,
    professor: emptyProfessorState(),
    session: emptySpeakSession(),
    apiUsage: store.apiUsage,
    dailySteps: store.dailySteps,
    dailyExercises: store.dailyExercises,
    exerciseStats: store.exerciseStats,
  };
}

export function formatSpeakResumeMessage(store: SpeakMemoryStore, lessonTitle?: string): string | null {
  const session = store.session;
  if (!session.history.length) return null;
  const lastUser = [...session.history].reverse().find((h) => h.role === "user");
  const when = session.lastSavedAt
    ? new Date(session.lastSavedAt).toLocaleString("tr-TR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const preview = lastUser?.content
    ? lastUser.content.length > 48
      ? `${lastUser.content.slice(0, 48)}…`
      : lastUser.content
    : null;
  const lessonPart = lessonTitle ? `“${lessonTitle}” dersine` : "Derse";
  if (when && preview) return `${lessonPart} devam (${when}).`;
  if (when) return `${lessonPart} devam (${when}).`;
  return `${lessonPart} devam edebilirsin.`;
}

/** @deprecated v1 API — speak page artık patchSpeakMemory kullanır */
export function getSpeakSession(_store: SpeakMemoryStore, _level?: SpeakLevel): SpeakLevelSession {
  return _store.session;
}

export function patchSpeakSession(
  store: SpeakMemoryStore,
  _level: SpeakLevel,
  patch: Partial<SpeakLevelSession>
): SpeakMemoryStore {
  return patchSpeakMemory(store, { session: patch });
}

export function clearSpeakSession(store: SpeakMemoryStore, _level?: SpeakLevel): SpeakMemoryStore {
  return resetProfessorLesson(store);
}
