import { runScriptSteps } from "./engine";
import { SCRIPT_LESSON_REGISTRY, SCRIPT_LESSON_IDS } from "./registry";
import type { ScriptProfessorInput } from "./types";
import type { ChatResponse } from "@/lib/speakTypes";

export { SCRIPT_LESSON_IDS };

export type ScriptLessonId = string;

export function isScriptLesson(lessonId: string): boolean {
  return lessonId in SCRIPT_LESSON_REGISTRY;
}

/** API anahtarı yokken script destekli derslerde yerel profesör kullanılır */
export function shouldUseScriptProfessor(lessonId: string, hasApiKey: boolean): boolean {
  return isScriptLesson(lessonId) && !hasApiKey;
}

export function runScriptProfessor(input: ScriptProfessorInput): ChatResponse {
  const steps = SCRIPT_LESSON_REGISTRY[input.lessonId];
  if (!steps) {
    throw new Error(`Script not found for lesson ${input.lessonId}`);
  }
  return runScriptSteps(steps, input);
}

export type { ScriptProfessorInput } from "./types";
