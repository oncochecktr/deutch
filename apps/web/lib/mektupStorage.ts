import type { MektupExample, MektupLevel } from "./mektupTypes";

const PREFIX = "german-coach-mektup";

export function mektupDoneKey(level: MektupLevel): string {
  return level === "B1" ? `${PREFIX}-done-b1` : `${PREFIX}-done`;
}

export function mektupCustomKey(level: MektupLevel): string {
  return level === "B1" ? `${PREFIX}-custom-b1` : `${PREFIX}-custom`;
}

export function mektupDraftsKey(level: MektupLevel): string {
  return level === "B1" ? `${PREFIX}-drafts-b1` : `${PREFIX}-drafts`;
}

export function mektupSavedKey(level: MektupLevel): string {
  return level === "B1" ? `${PREFIX}-saved-b1` : `${PREFIX}-saved`;
}

/** studyReset — tüm mektup anahtarları */
export const MEKTUP_STORAGE_PREFIX = PREFIX;

export interface MektupDraft {
  parts: Record<string, string>;
  updatedAt: string;
}

export interface MektupSavedLetter {
  id: string;
  exampleId: string;
  titleTr: string;
  fullLetter: string;
  wordCount: number;
  savedAt: string;
}

export type CustomMektupScenario = MektupExample & { isCustom: true; createdAt: string };

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") as T ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadDoneIds(level: MektupLevel): string[] {
  return readJson<string[]>(mektupDoneKey(level), []);
}

export function saveDoneIds(level: MektupLevel, ids: string[]): void {
  writeJson(mektupDoneKey(level), ids);
}

export function loadCustomScenarios(level: MektupLevel): CustomMektupScenario[] {
  return readJson<CustomMektupScenario[]>(mektupCustomKey(level), []);
}

export function saveCustomScenarios(level: MektupLevel, items: CustomMektupScenario[]): void {
  writeJson(mektupCustomKey(level), items);
}

export function addCustomScenario(
  level: MektupLevel,
  input: {
    titleTr: string;
    promptDe: string;
    promptTr: string;
    bullets: { de: string; tr: string }[];
  }
): CustomMektupScenario {
  const items = loadCustomScenarios(level);
  const scenario = buildCustomScenario(level, input);
  const next = [...items, scenario];
  saveCustomScenarios(level, next);
  return scenario;
}

export function removeCustomScenario(level: MektupLevel, id: string): void {
  const next = loadCustomScenarios(level).filter((s) => s.id !== id);
  saveCustomScenarios(level, next);
  removeDraft(level, id);
}

export function loadDrafts(level: MektupLevel): Record<string, MektupDraft> {
  return readJson<Record<string, MektupDraft>>(mektupDraftsKey(level), {});
}

export function loadDraft(level: MektupLevel, exampleId: string): MektupDraft | null {
  return loadDrafts(level)[exampleId] ?? null;
}

export function saveDraft(level: MektupLevel, exampleId: string, parts: Record<string, string>): void {
  const drafts = loadDrafts(level);
  const trimmed = Object.fromEntries(
    Object.entries(parts).filter(([, v]) => v.trim().length > 0)
  );
  if (Object.keys(trimmed).length === 0) {
    removeDraft(level, exampleId);
    return;
  }
  drafts[exampleId] = { parts: trimmed, updatedAt: new Date().toISOString() };
  writeJson(mektupDraftsKey(level), drafts);
}

export function removeDraft(level: MektupLevel, exampleId: string): void {
  const drafts = loadDrafts(level);
  if (!drafts[exampleId]) return;
  delete drafts[exampleId];
  writeJson(mektupDraftsKey(level), drafts);
}

export function loadSavedLetters(level: MektupLevel): MektupSavedLetter[] {
  const list = readJson<MektupSavedLetter[]>(mektupSavedKey(level), []);
  return list.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function saveLetter(
  level: MektupLevel,
  entry: Omit<MektupSavedLetter, "id" | "savedAt">
): MektupSavedLetter {
  const list = loadSavedLetters(level);
  const item: MektupSavedLetter = {
    ...entry,
    id: `saved_${Date.now()}`,
    savedAt: new Date().toISOString(),
  };
  writeJson(mektupSavedKey(level), [item, ...list]);
  return item;
}

export function removeSavedLetter(level: MektupLevel, id: string): void {
  writeJson(
    mektupSavedKey(level),
    loadSavedLetters(level).filter((s) => s.id !== id)
  );
}

function defaultB1Sections(): MektupExample["sections"] {
  return [
    {
      id: "anrede",
      labelDe: "Anrede",
      labelTr: "Hitap",
      hintTr: "Sehr geehrte Damen und Herren,",
      placeholder: "Sehr geehrte Damen und Herren,",
      phrases: [{ de: "Sehr geehrte Damen und Herren,", tr: "Sayın yetkililer," }],
    },
    {
      id: "einleitung",
      labelDe: "Einleitung",
      labelTr: "Giriş",
      hintTr: "ich schreibe Ihnen, weil …",
      placeholder: "ich schreibe Ihnen, weil …",
      phrases: [{ de: "ich schreibe Ihnen, weil …", tr: "… için yazıyorum." }],
    },
    {
      id: "hauptteil",
      labelDe: "Hauptteil",
      labelTr: "Ana bölüm",
      hintTr: "Sorulara cevap ver. Außerdem … deshalb …",
      placeholder: "Leider … . Außerdem … . Deshalb …",
      phrases: [],
    },
    {
      id: "schluss",
      labelDe: "Schluss",
      labelTr: "Kapanış",
      hintTr: "Ich wäre Ihnen dankbar …",
      placeholder: "Ich wäre Ihnen dankbar, wenn Sie mir antworten könnten.",
      phrases: [{ de: "Ich freue mich auf Ihre Antwort.", tr: "Cevabınızı bekliyorum." }],
    },
    {
      id: "gruss",
      labelDe: "Gruß",
      labelTr: "İmza",
      hintTr: "Mit freundlichen Grüßen + adın",
      placeholder: "Mit freundlichen Grüßen\nAd Soyad",
      phrases: [{ de: "Mit freundlichen Grüßen", tr: "Saygılarımla" }],
    },
  ];
}

function defaultA1Sections(): MektupExample["sections"] {
  return [
    {
      id: "anrede",
      labelDe: "Anrede",
      labelTr: "Hitap",
      hintTr: "Liebe … / Sehr geehrte …",
      placeholder: "Liebe …,",
      phrases: [],
    },
    {
      id: "grund",
      labelDe: "Grund",
      labelTr: "Neden",
      hintTr: "ich schreibe …, weil … veya neden + Deshalb schreibe ich …",
      placeholder: "ich schreibe …, weil …",
      phrases: [],
    },
    {
      id: "inhalt",
      labelDe: "Inhalt",
      labelTr: "Detaylar",
      hintTr: "Madde işaretli sorulara cevap ver",
      placeholder: "",
      phrases: [],
    },
    {
      id: "schluss",
      labelDe: "Schluss",
      labelTr: "Kapanış",
      hintTr: "Ich bitte um eine Antwort. Vielen Dank im Voraus.",
      placeholder: "Ich bitte um eine Antwort.\nVielen Dank im Voraus.",
      phrases: [],
    },
    {
      id: "gruss",
      labelDe: "Gruß",
      labelTr: "İmza",
      hintTr: "Mit freundlichen Grüßen / Viele Grüße",
      placeholder: "Mit freundlichen Grüßen\nAdın",
      phrases: [],
    },
  ];
}

export function buildCustomScenario(
  level: MektupLevel,
  input: {
    titleTr: string;
    promptDe: string;
    promptTr: string;
    bullets: { de: string; tr: string }[];
  }
): CustomMektupScenario {
  const minWords = level === "B1" ? 80 : 30;
  const maxWords = level === "B1" ? 120 : undefined;
  const bullets = input.bullets.map((b, i) => ({
    de: b.de.trim() || `Punkt ${i + 1}`,
    tr: b.tr.trim() || `Madde ${i + 1}`,
    hints: b.de
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 3),
  }));

  return {
    id: `custom_${level.toLowerCase()}_${Date.now()}`,
    isCustom: true,
    createdAt: new Date().toISOString(),
    level,
    titleTr: input.titleTr.trim() || "Kendi senaryom",
    promptDe: input.promptDe.trim(),
    promptTr: input.promptTr.trim() || input.promptDe.trim(),
    register: level === "B1" ? "formal" : undefined,
    minWords,
    maxWords,
    bullets,
    sections: level === "B1" ? defaultB1Sections() : defaultA1Sections(),
    sampleLetter: "",
  };
}
