export const DEFAULT_DAILY_GOALS = {
  newWords: 40,
  srsReviews: 80,
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
