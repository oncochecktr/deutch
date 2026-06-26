import type { DasIstDeckId } from "@/lib/dasIstEngine";

const KEY = "german-coach-das-ist";

export interface DasIstProgress {
  completed: DasIstDeckId[];
  scores: Partial<Record<DasIstDeckId, number>>;
}

const DEFAULT: DasIstProgress = { completed: [], scores: {} };

export function loadDasIstProgress(): DasIstProgress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const p = JSON.parse(raw) as DasIstProgress;
    return {
      completed: Array.isArray(p.completed) ? p.completed : [],
      scores: p.scores ?? {},
    };
  } catch {
    return DEFAULT;
  }
}

export function saveDasIstProgress(progress: DasIstProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

export function markDasIstDeckDone(
  progress: DasIstProgress,
  deckId: DasIstDeckId,
  score: number
): DasIstProgress {
  const best = Math.max(progress.scores[deckId] ?? 0, score);
  const completed = progress.completed.includes(deckId)
    ? progress.completed
    : best >= 6
      ? [...progress.completed, deckId]
      : progress.completed;
  return {
    completed,
    scores: { ...progress.scores, [deckId]: best },
  };
}

/** Sırayla kilitle — kafa karışmasın */
export function isDasIstDeckUnlocked(
  deckId: DasIstDeckId,
  progress: DasIstProgress
): boolean {
  if (deckId === "es") return true;
  if (deckId === "er") return progress.completed.includes("es");
  if (deckId === "sie") return progress.completed.includes("er");
  if (deckId === "mixed") return progress.completed.includes("sie");
  return false;
}
