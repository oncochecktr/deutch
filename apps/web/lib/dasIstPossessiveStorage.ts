import type { DasIstPossessiveDeckId } from "@/lib/dasIstPossessiveEngine";
import { loadDasIstProgress } from "@/lib/dasIstStorage";

const KEY = "german-coach-das-ist-mein";

export interface DasIstPossessiveProgress {
  completed: DasIstPossessiveDeckId[];
  scores: Partial<Record<DasIstPossessiveDeckId, number>>;
}

const DEFAULT: DasIstPossessiveProgress = { completed: [], scores: {} };

const DECK_ORDER: DasIstPossessiveDeckId[] = [
  "mein",
  "dein",
  "unser",
  "onlar",
  "euer",
  "mixed",
];

export function loadDasIstPossessiveProgress(): DasIstPossessiveProgress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const p = JSON.parse(raw) as DasIstPossessiveProgress;
    return {
      completed: Array.isArray(p.completed) ? p.completed : [],
      scores: p.scores ?? {},
    };
  } catch {
    return DEFAULT;
  }
}

export function saveDasIstPossessiveProgress(progress: DasIstPossessiveProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

export function markDasIstPossessiveDeckDone(
  progress: DasIstPossessiveProgress,
  deckId: DasIstPossessiveDeckId,
  score: number
): DasIstPossessiveProgress {
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

/** Pattern 03 (mixed) bitmeden mein kilidi */
export function isDasIstPossessiveDeckUnlocked(
  deckId: DasIstPossessiveDeckId,
  progress: DasIstPossessiveProgress
): boolean {
  const dasIst = loadDasIstProgress();
  if (!dasIst.completed.includes("mixed")) return false;

  const idx = DECK_ORDER.indexOf(deckId);
  if (idx <= 0) return true;
  return progress.completed.includes(DECK_ORDER[idx - 1]);
}

export function isDasIstPossessiveModuleUnlocked(): boolean {
  return loadDasIstProgress().completed.includes("mixed");
}
