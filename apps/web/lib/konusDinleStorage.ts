import type { KonusDinleLevel, KonusDinleLengthFilter } from "@/lib/konusDinlePlaylist";
import { filterKey } from "@/lib/konusDinlePlaylist";

export const KONUS_DINLE_STORAGE_KEY = "german-coach-konus-dinle";
export const DEFAULT_DAILY_GOAL_TURNS = 15;

export interface KonusDinleProgress {
  version: 2;
  totalXp: number;
  streak: number;
  lastSessionDate: string | null;
  completedByFilter: Record<string, string[]>;
  lastFilter: {
    level: KonusDinleLevel;
    lengthFilter: KonusDinleLengthFilter;
  };
  sessionTurns: number;
  sessionXp: number;
  dailyGoalTurns: number;
  todayTurns: number;
  todayDate: string;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyProgress(): KonusDinleProgress {
  return {
    version: 2,
    totalXp: 0,
    streak: 0,
    lastSessionDate: null,
    completedByFilter: {},
    lastFilter: { level: "A1", lengthFilter: 1 },
    sessionTurns: 0,
    sessionXp: 0,
    dailyGoalTurns: DEFAULT_DAILY_GOAL_TURNS,
    todayTurns: 0,
    todayDate: todayKey(),
  };
}

export function ensureTodayTurns(progress: KonusDinleProgress): KonusDinleProgress {
  const today = todayKey();
  if (progress.todayDate === today) return progress;
  return { ...progress, todayDate: today, todayTurns: 0 };
}

export function setDailyGoalTurns(progress: KonusDinleProgress, turns: number): KonusDinleProgress {
  const clamped = Math.min(100, Math.max(5, Math.round(turns) || DEFAULT_DAILY_GOAL_TURNS));
  const next = { ...ensureTodayTurns(progress), dailyGoalTurns: clamped };
  saveKonusDinleProgress(next);
  return next;
}

export function loadKonusDinleProgress(): KonusDinleProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = localStorage.getItem(KONUS_DINLE_STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<KonusDinleProgress> & { version?: number };
    const base = emptyProgress();
    const merged: KonusDinleProgress = {
      ...base,
      ...parsed,
      version: 2,
      completedByFilter: parsed.completedByFilter ?? {},
      lastFilter: parsed.lastFilter ?? base.lastFilter,
      dailyGoalTurns:
        typeof parsed.dailyGoalTurns === "number"
          ? parsed.dailyGoalTurns
          : DEFAULT_DAILY_GOAL_TURNS,
      todayTurns: typeof parsed.todayTurns === "number" ? parsed.todayTurns : 0,
      todayDate: typeof parsed.todayDate === "string" ? parsed.todayDate : todayKey(),
    };
    return ensureTodayTurns(merged);
  } catch {
    return emptyProgress();
  }
}

export function saveKonusDinleProgress(progress: KonusDinleProgress): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(KONUS_DINLE_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function resetSessionStats(progress: KonusDinleProgress): KonusDinleProgress {
  return { ...progress, sessionTurns: 0, sessionXp: 0 };
}

export interface RecordTurnOptions {
  itemId: string;
  level: KonusDinleLevel;
  lengthFilter: KonusDinleLengthFilter;
  xp: number;
  isGood: boolean;
}

export function recordKonusDinleTurn(
  progress: KonusDinleProgress,
  opts: RecordTurnOptions
): KonusDinleProgress {
  const today = todayKey();
  const withDay = ensureTodayTurns(progress);
  const key = filterKey(opts.level, opts.lengthFilter);
  const completed = new Set(withDay.completedByFilter[key] ?? []);
  completed.add(opts.itemId);

  const streak =
    opts.isGood && withDay.lastSessionDate === today
      ? withDay.streak + 1
      : opts.isGood
        ? 1
        : 0;

  return {
    ...withDay,
    totalXp: withDay.totalXp + opts.xp,
    sessionXp: withDay.sessionXp + opts.xp,
    sessionTurns: withDay.sessionTurns + 1,
    todayTurns: withDay.todayTurns + 1,
    todayDate: today,
    streak: opts.isGood ? streak : 0,
    lastSessionDate: today,
    completedByFilter: {
      ...withDay.completedByFilter,
      [key]: [...completed],
    },
    lastFilter: { level: opts.level, lengthFilter: opts.lengthFilter },
  };
}

export function isItemCompleted(
  progress: KonusDinleProgress,
  level: KonusDinleLevel,
  lengthFilter: KonusDinleLengthFilter,
  itemId: string
): boolean {
  const key = filterKey(level, lengthFilter);
  return (progress.completedByFilter[key] ?? []).includes(itemId);
}
