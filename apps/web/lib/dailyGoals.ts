/**
 * Tek kaynak — günlük hedefler ve öğrenme koçu eşikleri.
 * Dashboard, kartlar, readiness ve ana sayfa buradan okur.
 */
export const DAILY_COACH = {
  /** Readiness / dashboard günlük yeni kelime */
  newWords: 40,
  /** SRS tekrar hedefi */
  srsReviews: 80,
  /** Dinleme (MP3) dakika hedefi */
  listenMinutes: 30,
  /** İlk günler: koç "kartlar" adımı tamamlanma */
  beginnerWordsStudied: 12,
  /** Kart oturumunda sıradaki modül banner eşiği */
  cardsSessionNudge: 5,
  /** Konuş-Dinle günlük tur hedefi (koç) */
  konusDinleTurns: 3,
  /** Gramer koç adımı */
  grammarExercises: 1,
  /** Ana sayfa: SRS tekrar önerisi */
  srsDueNudge: 5,
  srsDueHighlight: 10,
} as const;

/** Günlük karışık öğrenme kuyruğu — SRS + el-kitabı + grundlagen */
export const SMART_QUEUE = {
  dailySize: 14,
  srsSlots: 8,
  elKitabiSlots: 3,
  grundlagenSlots: 3,
} as const;

export const DEFAULT_DAILY_GOALS = {
  newWords: DAILY_COACH.newWords,
  srsReviews: DAILY_COACH.srsReviews,
  listenMinutes: DAILY_COACH.listenMinutes,
  hoerenSessions: 1,
  lesenPassages: 1,
  schreibenTasks: 1,
  sprechenCards: 5,
  speakSteps: 1,
  exercises: 3,
  dialoguesRead: 1,
} as const;

export type DailyGoals = typeof DEFAULT_DAILY_GOALS;

export const A1_TARGETS = {
  wordsKnownPct: 85,
  srsAccuracyPct: 80,
  grammarPct: 70,
  hoerenPct: 75,
  lesenPct: 80,
  schreibenPct: 70,
  sprechenPct: 70,
  practiceExamsMin: 3,
  practiceExamPassPct: 75,
  realExamsMin: 1,
  realExamPassPoints: 60,
} as const;
