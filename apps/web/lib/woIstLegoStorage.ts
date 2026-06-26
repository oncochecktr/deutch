import type { WoIstDeckId } from "@/lib/woIstLego";

const KEY = "german-coach-wo-ist-lego";

export interface WoIstLegoProgress {
  scores: Partial<Record<WoIstDeckId, number>>;
  completed: WoIstDeckId[];
}

const DEFAULT: WoIstLegoProgress = { scores: {}, completed: [] };

export function loadWoIstLegoProgress(): WoIstLegoProgress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as WoIstLegoProgress;
    return {
      scores: parsed.scores ?? {},
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
    };
  } catch {
    return DEFAULT;
  }
}

export function saveWoIstLegoProgress(progress: WoIstLegoProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* ignore quota */
  }
}

export function markWoIstDeckDone(
  progress: WoIstLegoProgress,
  deckId: WoIstDeckId,
  score: number
): WoIstLegoProgress {
  const prev = progress.scores[deckId] ?? 0;
  const best = Math.max(prev, score);
  const completed = progress.completed.includes(deckId)
    ? progress.completed
    : best >= 8
      ? [...progress.completed, deckId]
      : progress.completed;
  return {
    scores: { ...progress.scores, [deckId]: best },
    completed,
  };
}
