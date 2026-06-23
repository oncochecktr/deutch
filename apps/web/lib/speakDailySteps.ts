import { SPEAK_LESSONS } from "./speakCurriculum";

export interface SpeakDailySteps {
  dayKey: string;
  completed: number;
  goal: number;
  streakDays: number;
  journeyStartDay: string | null;
  totalStepsCompleted: number;
}

export const JOURNEY_TARGET_DAYS = 60;

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function countTotalCurriculumSteps(): number {
  return SPEAK_LESSONS.reduce((sum, l) => sum + l.steps.length, 0);
}

export function emptyDailySteps(): SpeakDailySteps {
  return {
    dayKey: todayKey(),
    completed: 0,
    goal: 1,
    streakDays: 0,
    journeyStartDay: null,
    totalStepsCompleted: 0,
  };
}

export function normalizeDailySteps(raw: Partial<SpeakDailySteps> | undefined): SpeakDailySteps {
  const base = emptyDailySteps();
  if (!raw) return base;
  const dayKey = todayKey();
  const staleDay = raw.dayKey !== dayKey;
  return {
    dayKey,
    completed: staleDay ? 0 : typeof raw.completed === "number" ? raw.completed : 0,
    goal: typeof raw.goal === "number" && raw.goal > 0 ? raw.goal : 1,
    streakDays: typeof raw.streakDays === "number" ? raw.streakDays : 0,
    journeyStartDay:
      typeof raw.journeyStartDay === "string" ? raw.journeyStartDay : raw.journeyStartDay ?? null,
    totalStepsCompleted:
      typeof raw.totalStepsCompleted === "number" ? raw.totalStepsCompleted : 0,
  };
}

export function recordDailyStep(current: SpeakDailySteps): SpeakDailySteps {
  const dayKey = todayKey();
  const isNewDay = current.dayKey !== dayKey;
  const prevCompleted = isNewDay ? 0 : current.completed;
  const goal = current.goal || 1;
  const hitGoalYesterday = !isNewDay && prevCompleted >= goal;
  const justHitGoal = prevCompleted + 1 >= goal;

  return {
    dayKey,
    completed: prevCompleted + 1,
    goal,
    streakDays: isNewDay
      ? hitGoalYesterday
        ? current.streakDays + 1
        : current.streakDays > 0 && prevCompleted >= goal
          ? current.streakDays
          : 0
      : justHitGoal && prevCompleted + 1 === goal
        ? current.streakDays === 0
          ? 1
          : current.streakDays
        : current.streakDays,
    journeyStartDay: current.journeyStartDay ?? dayKey,
    totalStepsCompleted: current.totalStepsCompleted + 1,
  };
}

export function formatDailyStepLabel(steps: SpeakDailySteps): string {
  const done = steps.completed >= steps.goal;
  return done
    ? `Bugün: ${steps.completed}/${steps.goal} adım ✓`
    : `Bugün: ${steps.completed}/${steps.goal} adım`;
}

export function formatJourneyLabel(steps: SpeakDailySteps): string {
  const total = countTotalCurriculumSteps();
  const start = steps.journeyStartDay
    ? new Date(`${steps.journeyStartDay}T12:00:00`)
    : new Date();
  const now = new Date();
  const elapsedDays = Math.max(
    0,
    Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );
  const remainingDays = Math.max(0, JOURNEY_TARGET_DAYS - elapsedDays);
  return `Adım ${steps.totalStepsCompleted}/${total} · ~${remainingDays} gün kaldı (${JOURNEY_TARGET_DAYS} gün hedef)`;
}
