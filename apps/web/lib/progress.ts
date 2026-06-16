import type { SRSRecord } from "./srs";
import { processSRSReview, todayISO, isMastered } from "./srs";
import { DEFAULT_GOETHE, type GoetheProgress, normalizeGoetheProgress } from "./goetheProgress";
import { DEFAULT_DAILY_GOALS, type DailyGoals } from "./dailyGoals";

export interface GrundlagenProgress {
  satzCompleted: string[];
  patternsCompleted: string[];
  patternScores: Record<string, number>;
  conjugationCompleted: string[];
  conjugationScores: Record<string, number>;
  possessivesCompleted: string[];
  possessiveScores: Record<string, number>;
  wordOrderCompleted: string[];
  wordOrderScores: Record<string, number>;
  grammarPack: Record<string, number>;
}

export const DEFAULT_GRUNDLAGEN: GrundlagenProgress = {
  satzCompleted: [],
  patternsCompleted: [],
  patternScores: {},
  conjugationCompleted: [],
  conjugationScores: {},
  possessivesCompleted: [],
  possessiveScores: {},
  wordOrderCompleted: [],
  wordOrderScores: {},
  grammarPack: {},
};

export interface WordProgress {
  correct: number;
  wrong: number;
  lastSeen: string;
  mastered: boolean;
}

export interface DailyStats {
  date: string;
  correct: number;
  wrong: number;
  minutesStudied: number;
  wordsReviewed: number;
  quizzesCompleted: number;
  srsReviews: number;
  newWordsLearned: number;
  hoerenSessions: number;
  lesenPassages: number;
  schreibenTasks: number;
  sprechenCards: number;
}

export interface UserProgress {
  version: 3;
  lastRoute: string;
  lastCategory: string | null;
  lastSavedAt: string | null;
  cardIndex: number;
  quizIndex: number;
  reviewQueue: string[];
  reviewIndex: number;
  /** Oturum hafızası — tarayıcıda kalır */
  reviewSessionWords: string[];
  reviewViewPos: number;
  cardsTrail: string[];
  cardsTrailCursor: number;
  /** Sayfa yolu → scrollY */
  scrollPositions: Record<string, number>;
  knownWordIds: string[];
  wordProgress: Record<string, WordProgress>;
  srsRecords: Record<string, SRSRecord>;
  dailyStats: DailyStats;
  totalStudyMinutes: number;
  sessionStartTime: string | null;
  breakReminderEnabled: boolean;
  studyBlockMinutes: number;
  breakMinutes: number;
  lastBreakAt: string | null;
  examSimulations: number;
  dailyNewWordGoal: number;
  dailyGoals: DailyGoals;
  targetExamDate: string | null;
  goethe: GoetheProgress;
  grundlagen: GrundlagenProgress;
}

export const STORAGE_KEY = "german-coach-progress";

export const DEFAULT_PROGRESS: UserProgress = {
  version: 3,
  lastRoute: "/",
  lastCategory: null,
  lastSavedAt: null,
  cardIndex: 0,
  quizIndex: 0,
  reviewQueue: [],
  reviewIndex: 0,
  reviewSessionWords: [],
  reviewViewPos: 0,
  cardsTrail: [],
  cardsTrailCursor: 0,
  scrollPositions: {},
  knownWordIds: [],
  wordProgress: {},
  srsRecords: {},
  dailyStats: {
    date: todayISO(),
    correct: 0,
    wrong: 0,
    minutesStudied: 0,
    wordsReviewed: 0,
    quizzesCompleted: 0,
    srsReviews: 0,
    newWordsLearned: 0,
    hoerenSessions: 0,
    lesenPassages: 0,
    schreibenTasks: 0,
    sprechenCards: 0,
  },
  totalStudyMinutes: 0,
  sessionStartTime: null,
  breakReminderEnabled: true,
  studyBlockMinutes: 45,
  breakMinutes: 10,
  lastBreakAt: null,
  examSimulations: 0,
  dailyNewWordGoal: 40,
  dailyGoals: { ...DEFAULT_DAILY_GOALS },
  targetExamDate: null,
  goethe: { ...DEFAULT_GOETHE },
  grundlagen: { ...DEFAULT_GRUNDLAGEN },
};

function normalizeGoethe(goethe: Partial<GoetheProgress> | null | undefined): GoetheProgress {
  return normalizeGoetheProgress(goethe ?? undefined);
}

export function normalizeProgress(progress: Partial<UserProgress>): UserProgress {
  const dailyStats = {
    ...DEFAULT_PROGRESS.dailyStats,
    ...(progress.dailyStats ?? {}),
  };
  return {
    ...DEFAULT_PROGRESS,
    ...progress,
    knownWordIds: Array.isArray(progress.knownWordIds) ? progress.knownWordIds : [],
    wordProgress:
      progress.wordProgress && typeof progress.wordProgress === "object"
        ? progress.wordProgress
        : {},
    srsRecords:
      progress.srsRecords && typeof progress.srsRecords === "object"
        ? progress.srsRecords
        : {},
    reviewQueue: Array.isArray(progress.reviewQueue) ? progress.reviewQueue : [],
    reviewSessionWords: Array.isArray(progress.reviewSessionWords)
      ? progress.reviewSessionWords
      : [],
    reviewViewPos:
      typeof progress.reviewViewPos === "number" ? progress.reviewViewPos : 0,
    cardsTrail: Array.isArray(progress.cardsTrail) ? progress.cardsTrail : [],
    cardsTrailCursor:
      typeof progress.cardsTrailCursor === "number" ? progress.cardsTrailCursor : 0,
    scrollPositions:
      progress.scrollPositions && typeof progress.scrollPositions === "object"
        ? (progress.scrollPositions as Record<string, number>)
        : {},
    dailyStats,
    dailyGoals: { ...DEFAULT_DAILY_GOALS, ...(progress.dailyGoals ?? {}) },
    goethe: normalizeGoethe(progress.goethe),
    grundlagen: normalizeGrundlagen(progress.grundlagen),
  };
}

function normalizeGrundlagen(
  grundlagen: Partial<GrundlagenProgress> | null | undefined
): GrundlagenProgress {
  const g = grundlagen ?? {};
  return {
    satzCompleted: Array.isArray(g.satzCompleted) ? g.satzCompleted : [],
    patternsCompleted: Array.isArray(g.patternsCompleted) ? g.patternsCompleted : [],
    patternScores:
      g.patternScores && typeof g.patternScores === "object" && !Array.isArray(g.patternScores)
        ? g.patternScores
        : {},
    conjugationCompleted: Array.isArray(g.conjugationCompleted) ? g.conjugationCompleted : [],
    conjugationScores:
      g.conjugationScores &&
      typeof g.conjugationScores === "object" &&
      !Array.isArray(g.conjugationScores)
        ? g.conjugationScores
        : {},
    possessivesCompleted: Array.isArray(g.possessivesCompleted) ? g.possessivesCompleted : [],
    possessiveScores:
      g.possessiveScores &&
      typeof g.possessiveScores === "object" &&
      !Array.isArray(g.possessiveScores)
        ? g.possessiveScores
        : {},
    wordOrderCompleted: Array.isArray(g.wordOrderCompleted) ? g.wordOrderCompleted : [],
    wordOrderScores:
      g.wordOrderScores &&
      typeof g.wordOrderScores === "object" &&
      !Array.isArray(g.wordOrderScores)
        ? g.wordOrderScores
        : {},
    grammarPack:
      g.grammarPack && typeof g.grammarPack === "object" && !Array.isArray(g.grammarPack)
        ? g.grammarPack
        : {},
  };
}

function migrateProgress(parsed: Record<string, unknown>): UserProgress {
  const today = todayISO();
  const base = { ...DEFAULT_PROGRESS, ...parsed } as UserProgress;

  if (parsed.dailyStats && typeof parsed.dailyStats === "object") {
    const ds = parsed.dailyStats as DailyStats;
    base.dailyStats = {
      ...DEFAULT_PROGRESS.dailyStats,
      ...ds,
      srsReviews: ds.srsReviews ?? 0,
      newWordsLearned: ds.newWordsLearned ?? 0,
      hoerenSessions: ds.hoerenSessions ?? 0,
      lesenPassages: ds.lesenPassages ?? 0,
      schreibenTasks: ds.schreibenTasks ?? 0,
      sprechenCards: ds.sprechenCards ?? 0,
    };
    if (base.dailyStats.date !== today) {
      base.dailyStats = {
        date: today,
        correct: 0,
        wrong: 0,
        minutesStudied: 0,
        wordsReviewed: 0,
        quizzesCompleted: 0,
        srsReviews: 0,
        newWordsLearned: 0,
        hoerenSessions: 0,
        lesenPassages: 0,
        schreibenTasks: 0,
        sprechenCards: 0,
      };
    }
  }

  base.version = 3;
  base.srsRecords =
    parsed.srsRecords && typeof parsed.srsRecords === "object" && !Array.isArray(parsed.srsRecords)
      ? (parsed.srsRecords as Record<string, SRSRecord>)
      : {};
  base.reviewQueue = Array.isArray(parsed.reviewQueue) ? parsed.reviewQueue : [];
  base.reviewIndex = (parsed.reviewIndex as number) ?? 0;
  base.reviewSessionWords = Array.isArray(parsed.reviewSessionWords)
    ? (parsed.reviewSessionWords as string[])
    : [];
  base.reviewViewPos = (parsed.reviewViewPos as number) ?? 0;
  base.cardsTrail = Array.isArray(parsed.cardsTrail) ? (parsed.cardsTrail as string[]) : [];
  base.cardsTrailCursor = (parsed.cardsTrailCursor as number) ?? 0;
  base.scrollPositions =
    parsed.scrollPositions && typeof parsed.scrollPositions === "object"
      ? (parsed.scrollPositions as Record<string, number>)
      : {};
  base.lastSavedAt = (parsed.lastSavedAt as string | null) ?? null;
  base.dailyNewWordGoal = (parsed.dailyNewWordGoal as number) ?? 40;
  base.dailyGoals = { ...DEFAULT_DAILY_GOALS, ...(parsed.dailyGoals as DailyGoals) };
  base.targetExamDate = (parsed.targetExamDate as string | null) ?? null;
  base.goethe = normalizeGoethe(parsed.goethe as GoetheProgress);
  base.grundlagen = normalizeGrundlagen(parsed.grundlagen as GrundlagenProgress);

  return normalizeProgress(base);
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return migrateProgress(parsed);
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

/** Tüm çalışma profilini sıfırla (tarayıcıdaki ilerleme) */
export function resetStudyProfile(progress: UserProgress): Partial<UserProgress> {
  const today = todayISO();
  return {
    srsRecords: {},
    knownWordIds: [],
    wordProgress: {},
    cardIndex: 0,
    quizIndex: 0,
    cardsTrail: [],
    cardsTrailCursor: 0,
    reviewQueue: [],
    reviewIndex: 0,
    reviewSessionWords: [],
    reviewViewPos: 0,
    examSimulations: 0,
    targetExamDate: null,
    goethe: { ...DEFAULT_GOETHE },
    grundlagen: { ...DEFAULT_GRUNDLAGEN },
    scrollPositions: {},
    dailyStats: {
      date: today,
      correct: 0,
      wrong: 0,
      minutesStudied: 0,
      wordsReviewed: 0,
      quizzesCompleted: 0,
      srsReviews: 0,
      newWordsLearned: 0,
      hoerenSessions: 0,
      lesenPassages: 0,
      schreibenTasks: 0,
      sprechenCards: 0,
    },
  };
}

/** @deprecated resetStudyProfile kullan */
export const resetSRSIndicators = resetStudyProfile;

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  const payload = { ...progress, lastSavedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function recordAnswer(
  progress: UserProgress,
  wordId: string,
  isCorrect: boolean
): UserProgress {
  const wp = progress.wordProgress[wordId] ?? {
    correct: 0,
    wrong: 0,
    lastSeen: new Date().toISOString(),
    mastered: false,
  };
  wp.correct += isCorrect ? 1 : 0;
  wp.wrong += isCorrect ? 0 : 1;
  wp.lastSeen = new Date().toISOString();

  const srsRecord = processSRSReview(progress.srsRecords[wordId], isCorrect);
  wp.mastered = isMastered(srsRecord);

  const wasKnown = progress.knownWordIds.includes(wordId);
  const knownWordIds =
    progress.knownWordIds.includes(wordId) || wp.mastered
      ? [...new Set([...progress.knownWordIds, wordId])]
      : isCorrect && wp.correct >= 2
        ? [...progress.knownWordIds, wordId]
        : progress.knownWordIds;

  return {
    ...progress,
    knownWordIds,
    wordProgress: { ...progress.wordProgress, [wordId]: wp },
    srsRecords: { ...progress.srsRecords, [wordId]: srsRecord },
    dailyStats: {
      ...progress.dailyStats,
      correct: progress.dailyStats.correct + (isCorrect ? 1 : 0),
      wrong: progress.dailyStats.wrong + (isCorrect ? 0 : 1),
      wordsReviewed: progress.dailyStats.wordsReviewed + 1,
      newWordsLearned:
        progress.dailyStats.newWordsLearned +
        (!wasKnown && isCorrect && wordId.startsWith("a1_") ? 1 : 0),
    },
  };
}

export function recordSRSReview(
  progress: UserProgress,
  wordId: string,
  isCorrect: boolean
): UserProgress {
  const updated = recordAnswer(progress, wordId, isCorrect);
  return {
    ...updated,
    dailyStats: {
      ...updated.dailyStats,
      srsReviews: updated.dailyStats.srsReviews + 1,
    },
  };
}

export function calcAccuracy(progress: UserProgress): number {
  const { correct, wrong } = progress.dailyStats;
  const total = correct + wrong;
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function calcReadiness(progress: UserProgress, totalWords: number): number {
  const records = progress.srsRecords ?? {};
  const mastered = Object.values(records).filter(isMastered).length;
  if (!totalWords) return 0;
  return Math.min(100, Math.round((mastered / totalWords) * 100));
}

export function calcKnownPercent(progress: UserProgress, totalWords: number): number {
  return Math.min(100, Math.round((progress.knownWordIds.length / totalWords) * 100));
}

export function getStudyMinutesSinceBreak(progress: UserProgress): number {
  const ref = progress.lastBreakAt ?? progress.sessionStartTime;
  if (!ref) return 0;
  return Math.floor((Date.now() - new Date(ref).getTime()) / 60000);
}

export function shouldShowBreakReminder(progress: UserProgress): boolean {
  if (!progress.breakReminderEnabled) return false;
  return getStudyMinutesSinceBreak(progress) >= progress.studyBlockMinutes;
}

export function getBreakMessage(minutesStudied: number): string {
  if (minutesStudied >= 90) {
    return "90+ dakika çalıştın. 15-20 dakika mola şart — gözlerini dinlendir, su iç, kalk yürü.";
  }
  if (minutesStudied >= 45) {
    return "45 dakika doldu. 10 dakika mola: esneme, su, pencere aç.";
  }
  return "Kısa mola zamanı. 5 dakika nefes al, sonra devam.";
}

export function getNextStudyTip(
  progress: UserProgress,
  totalWords: number,
  dueCount: number
): string {
  const accuracy = calcAccuracy(progress);
  const readiness = calcReadiness(progress, totalWords);

  if (dueCount > 0) return `${dueCount} kelime tekrar bekliyor. Önce Tekrar moduna git — SRS motoru.`;
  if (readiness < 10) return `Bugün ${progress.dailyNewWordGoal} yeni kelime öğren. Selamlama ile başla.`;
  if (accuracy < 70) return "Doğruluk %70 altında. Yanlış kelimeler yarın tekrar gelecek — bugün tekrar et.";
  if (readiness < 50) return "Quiz + Tekrar döngüsü: 15 dk SRS, 15 dk quiz, 10 dk mola.";
  if (readiness >= 85) return "Goethe A1 hazırlığı iyi! Deneme sınavını dene — Prüfungssimulation.";
  return "Kart → Tekrar → Quiz. Her gün 20 yeni + tekrar listesi.";
}

export function markSatzCompleted(progress: UserProgress, exerciseId: string): UserProgress {
  if (progress.grundlagen.satzCompleted.includes(exerciseId)) return progress;
  return {
    ...progress,
    grundlagen: {
      ...progress.grundlagen,
      satzCompleted: [...progress.grundlagen.satzCompleted, exerciseId],
    },
  };
}

export function recordGrammarPackScore(
  progress: UserProgress,
  sectionId: string,
  correctCount: number
): UserProgress {
  const prev = progress.grundlagen.grammarPack[sectionId] ?? 0;
  if (correctCount <= prev) return progress;
  return {
    ...progress,
    grundlagen: {
      ...progress.grundlagen,
      grammarPack: {
        ...progress.grundlagen.grammarPack,
        [sectionId]: correctCount,
      },
    },
  };
}

const PATTERN_PASS_SCORE = 4;

export function markPatternCompleted(
  progress: UserProgress,
  patternId: string,
  score: number
): UserProgress {
  const prevScore = progress.grundlagen.patternScores[patternId] ?? 0;
  const bestScore = Math.max(prevScore, score);
  const passed = bestScore >= PATTERN_PASS_SCORE;
  const alreadyDone = progress.grundlagen.patternsCompleted.includes(patternId);

  if (bestScore <= prevScore && alreadyDone) return progress;

  return {
    ...progress,
    grundlagen: {
      ...progress.grundlagen,
      patternScores: {
        ...progress.grundlagen.patternScores,
        [patternId]: bestScore,
      },
      patternsCompleted:
        passed && !alreadyDone
          ? [...progress.grundlagen.patternsCompleted, patternId]
          : progress.grundlagen.patternsCompleted,
    },
  };
}

export const CONJUGATION_PASS_SCORE = 8;

export function markConjugationCompleted(
  progress: UserProgress,
  verbId: string,
  score: number
): UserProgress {
  const prevScore = progress.grundlagen.conjugationScores[verbId] ?? 0;
  const bestScore = Math.max(prevScore, score);
  const passed = bestScore >= CONJUGATION_PASS_SCORE;
  const alreadyDone = progress.grundlagen.conjugationCompleted.includes(verbId);

  if (bestScore <= prevScore && alreadyDone) return progress;

  return {
    ...progress,
    grundlagen: {
      ...progress.grundlagen,
      conjugationScores: {
        ...progress.grundlagen.conjugationScores,
        [verbId]: bestScore,
      },
      conjugationCompleted:
        passed && !alreadyDone
          ? [...progress.grundlagen.conjugationCompleted, verbId]
          : progress.grundlagen.conjugationCompleted,
    },
  };
}

export const POSSESSIVE_PASS_SCORE = 6;

export function markPossessiveCompleted(
  progress: UserProgress,
  ownerId: string,
  score: number
): UserProgress {
  const prevScore = progress.grundlagen.possessiveScores[ownerId] ?? 0;
  const bestScore = Math.max(prevScore, score);
  const passed = bestScore >= POSSESSIVE_PASS_SCORE;
  const alreadyDone = progress.grundlagen.possessivesCompleted.includes(ownerId);

  if (bestScore <= prevScore && alreadyDone) return progress;

  return {
    ...progress,
    grundlagen: {
      ...progress.grundlagen,
      possessiveScores: {
        ...progress.grundlagen.possessiveScores,
        [ownerId]: bestScore,
      },
      possessivesCompleted:
        passed && !alreadyDone
          ? [...progress.grundlagen.possessivesCompleted, ownerId]
          : progress.grundlagen.possessivesCompleted,
    },
  };
}

export const WORD_ORDER_PASS_SCORE = 8;

export function markWordOrderCompleted(
  progress: UserProgress,
  sectionId: string,
  score: number
): UserProgress {
  const prevScore = progress.grundlagen.wordOrderScores[sectionId] ?? 0;
  const bestScore = Math.max(prevScore, score);
  const passed = bestScore >= WORD_ORDER_PASS_SCORE;
  const alreadyDone = progress.grundlagen.wordOrderCompleted.includes(sectionId);

  if (bestScore <= prevScore && alreadyDone) return progress;

  return {
    ...progress,
    grundlagen: {
      ...progress.grundlagen,
      wordOrderScores: {
        ...progress.grundlagen.wordOrderScores,
        [sectionId]: bestScore,
      },
      wordOrderCompleted:
        passed && !alreadyDone
          ? [...progress.grundlagen.wordOrderCompleted, sectionId]
          : progress.grundlagen.wordOrderCompleted,
    },
  };
}
