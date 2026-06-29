/**
 * Öğrenme motoru — tek yazma sözleşmesi.
 *
 * Exposure (dinleme, gezinme): mastery artırmaz.
 * Recall (quiz, SRS, dikte): explicit cevap → SRS + günlük sayaçlar.
 * Read: el-kitabı okuma / test / modül ziyareti.
 */
import type { UserProgress } from "./progress";
import {
  recordAnswer,
  recordElKitabiModuleVisit,
  recordElKitabiQuiz,
  recordElKitabiRead,
  recordSRSReview,
} from "./progress";

export type WordRecallKind = "srs" | "quiz" | "dictation" | "artikel" | "speak";

/** Dinleme / gezinme — SRS, knownWordIds ve günlük öğrenme sayacını değiştirmez. */
export function recordWordExposure(progress: UserProgress, wordId: string): UserProgress {
  const wp = progress.wordProgress[wordId];
  if (!wp) return progress;
  return {
    ...progress,
    wordProgress: {
      ...progress.wordProgress,
      [wordId]: { ...wp, lastSeen: new Date().toISOString() },
    },
  };
}

/** Bilinçli hatırlama — yalnızca bu mastery ve SRS ilerletir. */
export function recordWordRecall(
  progress: UserProgress,
  wordId: string,
  isCorrect: boolean,
  kind: WordRecallKind = "quiz"
): UserProgress {
  if (kind === "srs" || kind === "speak") {
    return recordSRSReview(progress, wordId, isCorrect);
  }
  return recordAnswer(progress, wordId, isCorrect);
}

export function recordElKitabiSectionRead(
  progress: UserProgress,
  subsectionId: string
): UserProgress {
  return recordElKitabiRead(progress, subsectionId);
}

export function recordElKitabiSectionQuiz(
  progress: UserProgress,
  subsectionId: string,
  correct: number,
  total: number
): UserProgress {
  return recordElKitabiQuiz(progress, subsectionId, correct, total);
}

export function recordElKitabiModuleLinkVisit(
  progress: UserProgress,
  subsectionId: string
): UserProgress {
  return recordElKitabiModuleVisit(progress, subsectionId);
}

/** Modül sayfaları için kısa alias */
export const LearningEngine = {
  recordWordExposure,
  recordWordRecall,
  recordElKitabiSectionRead,
  recordElKitabiSectionQuiz,
  recordElKitabiModuleLinkVisit,
} as const;
