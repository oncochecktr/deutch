import type { EngineAdjectiveDeck } from "@/lib/adjektivDeclension";

const KEY = "german-coach-sentence-engine";

export interface SentenceEngineProgress {
  pattern02Completed: EngineAdjectiveDeck[];
  pattern02Scores: Partial<Record<EngineAdjectiveDeck, number>>;
  pattern02AdjectivesSeen: string[];
}

const DEFAULT: SentenceEngineProgress = {
  pattern02Completed: [],
  pattern02Scores: {},
  pattern02AdjectivesSeen: [],
};

export function loadSentenceEngineProgress(): SentenceEngineProgress {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const p = JSON.parse(raw) as SentenceEngineProgress;
    return {
      pattern02Completed: Array.isArray(p.pattern02Completed) ? p.pattern02Completed : [],
      pattern02Scores: p.pattern02Scores ?? {},
      pattern02AdjectivesSeen: Array.isArray(p.pattern02AdjectivesSeen)
        ? p.pattern02AdjectivesSeen
        : [],
    };
  } catch {
    return DEFAULT;
  }
}

export function saveSentenceEngineProgress(progress: SentenceEngineProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

export function markPattern02DeckDone(
  progress: SentenceEngineProgress,
  deckId: EngineAdjectiveDeck,
  score: number,
  adjIds: string[]
): SentenceEngineProgress {
  const prev = progress.pattern02Scores[deckId] ?? 0;
  const best = Math.max(prev, score);
  const seen = new Set([...progress.pattern02AdjectivesSeen, ...adjIds]);
  const completed = progress.pattern02Completed.includes(deckId)
    ? progress.pattern02Completed
    : best >= 8
      ? [...progress.pattern02Completed, deckId]
      : progress.pattern02Completed;

  return {
    pattern02Completed: completed,
    pattern02Scores: { ...progress.pattern02Scores, [deckId]: best },
    pattern02AdjectivesSeen: [...seen],
  };
}
