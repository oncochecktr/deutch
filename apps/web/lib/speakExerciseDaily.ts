import type { ExerciseScore } from "./speakExercise";

export interface SpeakDailyExercises {
  dayKey: string;
  completed: number;
  goal: number;
  streakDays: number;
  lastScores: ExerciseScore[];
  /** Bugünkü sette hangi görevdeyiz (0–4) */
  currentIndex: number;
}

export const DEFAULT_EXERCISE_GOAL = 5;

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function emptyDailyExercises(): SpeakDailyExercises {
  return {
    dayKey: todayKey(),
    completed: 0,
    goal: DEFAULT_EXERCISE_GOAL,
    streakDays: 0,
    lastScores: [],
    currentIndex: 0,
  };
}

export function normalizeDailyExercises(
  raw: Partial<SpeakDailyExercises> | undefined
): SpeakDailyExercises {
  const base = emptyDailyExercises();
  if (!raw) return base;
  const dayKey = todayKey();
  const staleDay = raw.dayKey !== dayKey;
  const validScores: ExerciseScore[] = ["poor", "ok", "good", "excellent"];
  return {
    dayKey,
    completed: staleDay ? 0 : typeof raw.completed === "number" ? raw.completed : 0,
    goal:
      typeof raw.goal === "number" && raw.goal > 0 ? raw.goal : DEFAULT_EXERCISE_GOAL,
    streakDays: typeof raw.streakDays === "number" ? raw.streakDays : 0,
    lastScores: staleDay
      ? []
      : Array.isArray(raw.lastScores)
        ? raw.lastScores.filter((s): s is ExerciseScore => validScores.includes(s as ExerciseScore))
        : [],
    currentIndex: staleDay
      ? 0
      : typeof raw.currentIndex === "number" && raw.currentIndex >= 0
        ? raw.currentIndex
        : 0,
  };
}

export function recordDailyExercise(
  current: SpeakDailyExercises,
  score: ExerciseScore
): SpeakDailyExercises {
  const dayKey = todayKey();
  const isNewDay = current.dayKey !== dayKey;
  const prevCompleted = isNewDay ? 0 : current.completed;
  const goal = current.goal || DEFAULT_EXERCISE_GOAL;
  const hitGoalYesterday = !isNewDay && prevCompleted >= goal;
  const justHitGoal = prevCompleted + 1 >= goal;

  const prevIndex = isNewDay ? 0 : current.currentIndex;
  const nextIndex = prevIndex + 1;

  return {
    dayKey,
    completed: prevCompleted + 1,
    goal,
    streakDays: isNewDay
      ? hitGoalYesterday
        ? current.streakDays + 1
        : justHitGoal
          ? 1
          : 0
      : justHitGoal && prevCompleted < goal
        ? current.streakDays || 1
        : current.streakDays,
    lastScores: [...(isNewDay ? [] : current.lastScores), score].slice(-10),
    currentIndex: nextIndex >= goal ? prevIndex : nextIndex,
  };
}

export function formatDailyExerciseLabel(daily: SpeakDailyExercises): string {
  const done = Math.min(daily.completed, daily.goal);
  return `Bugün ${done}/${daily.goal} egzersiz`;
}

export function scoreLabelTr(score: ExerciseScore): string {
  if (score === "excellent") return "Mükemmel";
  if (score === "good") return "İyi";
  if (score === "ok") return "Fena değil";
  return "Geliştir";
}
