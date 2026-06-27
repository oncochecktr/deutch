import type { DialogueLevel, DialogueStory } from "./dialogueTypes";
import a1Data from "../../../data/dialogues/a1.json";
import a2Data from "../../../data/dialogues/a2.json";
import extraSamData from "../../../data/dialogues/extra-sam.json";
import easyGermanMarketData from "../../../data/dialogues/easy-german-market.json";
import b1Data from "../../../data/dialogues/b1.json";

const A2_DIALOGUES = [
  ...(a2Data as DialogueStory[]),
  ...(extraSamData as DialogueStory[]),
  ...(easyGermanMarketData as DialogueStory[]),
];

const SEED_BY_LEVEL: Record<DialogueLevel, DialogueStory[]> = {
  A1: a1Data as DialogueStory[],
  A2: A2_DIALOGUES,
  B1: b1Data as DialogueStory[],
};

export function getSeedDialogues(level?: DialogueLevel): DialogueStory[] {
  if (level) return SEED_BY_LEVEL[level] ?? [];
  return [...SEED_BY_LEVEL.A1, ...SEED_BY_LEVEL.A2, ...SEED_BY_LEVEL.B1];
}

export function getDialogueById(id: string, saved: DialogueStory[] = []): DialogueStory | undefined {
  return saved.find((s) => s.id === id) ?? getSeedDialogues().find((s) => s.id === id);
}

export function getDialoguesByLevel(
  level: DialogueLevel,
  saved: DialogueStory[] = []
): DialogueStory[] {
  const seed = SEED_BY_LEVEL[level] ?? [];
  const aiSaved = saved.filter((s) => s.level === level && s.source === "ai");
  return [...seed, ...aiSaved];
}

export function countSeedDialogues(): number {
  return getSeedDialogues().length;
}
