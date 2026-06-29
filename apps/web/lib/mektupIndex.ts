import type { MektupExample, MektupLevel, MektupStructureResult } from "./mektupTypes";
import { MEKTUP_B1_EXAMPLES, checkB1Structure, scoreB1Rubric } from "./mektupB1";
import {
  MEKTUP_EXAMPLES,
  buildFullLetter,
  checkStructure,
  countWords,
  checkBullet,
} from "./mektupRealExam";
import { loadCustomScenarios, mektupDoneKey } from "./mektupStorage";

export { buildFullLetter, countWords, checkBullet } from "./mektupRealExam";
export * from "./mektupTypes";
export * from "./mektupB1";
export * from "./mektupStorage";

/** @deprecated use mektupDoneKey from mektupStorage */
export function mektupStorageKey(level: MektupLevel): string {
  return mektupDoneKey(level);
}

export function getBuiltinMektupExamples(level: MektupLevel): MektupExample[] {
  if (level === "B1") return MEKTUP_B1_EXAMPLES;
  return MEKTUP_EXAMPLES.map((ex) => ({ ...ex, level: "A1" as const }));
}

export function getMektupExamples(level: MektupLevel): MektupExample[] {
  return [...getBuiltinMektupExamples(level), ...loadCustomScenarios(level)];
}
export function checkStructureForLevel(
  text: string,
  level: MektupLevel,
  minWords: number
): MektupStructureResult {
  if (level === "B1") return checkB1Structure(text, minWords);
  const base = checkStructure(text);
  const words = countWords(text);
  if (words < minWords) {
    return {
      ...base,
      ok: false,
      missing: [...base.missing, `Kelime sayısı (${words}/${minWords})`],
    };
  }
  return base;
}

export { scoreB1Rubric };
