import type { DialogueStory } from "./dialogueTypes";

export const DIALOGUE_STORAGE_KEY = "german-coach-dialogues";
export const MAX_SAVED_STORIES = 30;
export const MAX_AI_GENERATIONS_PER_DAY = 3;

export interface DialogueStorageState {
  version: 1;
  savedStories: DialogueStory[];
  readStoryIds: string[];
  dailyReads: { dayKey: string; count: number };
  aiGenerations: { dayKey: string; count: number };
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function emptyDialogueStorage(): DialogueStorageState {
  return {
    version: 1,
    savedStories: [],
    readStoryIds: [],
    dailyReads: { dayKey: todayKey(), count: 0 },
    aiGenerations: { dayKey: todayKey(), count: 0 },
  };
}

function normalize(raw: Partial<DialogueStorageState> | undefined): DialogueStorageState {
  const base = emptyDialogueStorage();
  if (!raw) return base;
  const dayKey = todayKey();
  return {
    version: 1,
    savedStories: Array.isArray(raw.savedStories)
      ? raw.savedStories.filter((s) => s && typeof s.id === "string").slice(0, MAX_SAVED_STORIES)
      : [],
    readStoryIds: Array.isArray(raw.readStoryIds)
      ? raw.readStoryIds.filter((id): id is string => typeof id === "string")
      : [],
    dailyReads:
      raw.dailyReads?.dayKey === dayKey
        ? { dayKey, count: raw.dailyReads.count ?? 0 }
        : { dayKey, count: 0 },
    aiGenerations:
      raw.aiGenerations?.dayKey === dayKey
        ? { dayKey, count: raw.aiGenerations.count ?? 0 }
        : { dayKey, count: 0 },
  };
}

export function loadDialogueStorage(): DialogueStorageState {
  if (typeof window === "undefined") return emptyDialogueStorage();
  try {
    const raw = localStorage.getItem(DIALOGUE_STORAGE_KEY);
    if (!raw) return emptyDialogueStorage();
    return normalize(JSON.parse(raw) as Partial<DialogueStorageState>);
  } catch {
    return emptyDialogueStorage();
  }
}

export function saveDialogueStorage(state: DialogueStorageState): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(DIALOGUE_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function saveAiStory(state: DialogueStorageState, story: DialogueStory): DialogueStorageState {
  const without = state.savedStories.filter((s) => s.id !== story.id);
  const savedStories = [story, ...without].slice(0, MAX_SAVED_STORIES);
  return { ...state, savedStories };
}

export function recordDialogueRead(state: DialogueStorageState, storyId: string): DialogueStorageState {
  const dayKey = todayKey();
  const isNewDay = state.dailyReads.dayKey !== dayKey;
  const prevCount = isNewDay ? 0 : state.dailyReads.count;
  const readSet = new Set(state.readStoryIds);
  const firstRead = !readSet.has(storyId);
  readSet.add(storyId);
  return {
    ...state,
    readStoryIds: [...readSet],
    dailyReads: {
      dayKey,
      count: firstRead ? prevCount + 1 : prevCount,
    },
    savedStories: state.savedStories.map((s) =>
      s.id === storyId ? { ...s, readCount: (s.readCount ?? 0) + 1 } : s
    ),
  };
}

export function canGenerateAiStory(state: DialogueStorageState): { ok: boolean; reason?: string } {
  const dayKey = todayKey();
  const count =
    state.aiGenerations.dayKey === dayKey ? state.aiGenerations.count : 0;
  if (count >= MAX_AI_GENERATIONS_PER_DAY) {
    return { ok: false, reason: `Günde en fazla ${MAX_AI_GENERATIONS_PER_DAY} yeni hikaye oluşturabilirsiniz.` };
  }
  return { ok: true };
}

export function recordAiGeneration(state: DialogueStorageState): DialogueStorageState {
  const dayKey = todayKey();
  const isNewDay = state.aiGenerations.dayKey !== dayKey;
  const prev = isNewDay ? 0 : state.aiGenerations.count;
  return {
    ...state,
    aiGenerations: { dayKey, count: prev + 1 },
  };
}

export function isStoryRead(state: DialogueStorageState, storyId: string): boolean {
  return state.readStoryIds.includes(storyId);
}
