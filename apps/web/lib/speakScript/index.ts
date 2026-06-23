import { runA1L01Script } from "./a1_l01";
import type { ScriptProfessorInput } from "./types";
import type { ChatResponse } from "@/lib/speakTypes";

export const SCRIPT_LESSON_IDS = ["a1_l01"] as const;

export type ScriptLessonId = (typeof SCRIPT_LESSON_IDS)[number];

export function isScriptLesson(lessonId: string): lessonId is ScriptLessonId {
  return (SCRIPT_LESSON_IDS as readonly string[]).includes(lessonId);
}

/** API anahtarı yokken script destekli derslerde yerel profesör kullanılır */
export function shouldUseScriptProfessor(lessonId: string, hasApiKey: boolean): boolean {
  return isScriptLesson(lessonId) && !hasApiKey;
}

export function runScriptProfessor(input: ScriptProfessorInput): ChatResponse {
  if (input.lessonId === "a1_l01") {
    return runA1L01Script(input);
  }
  throw new Error(`Script not found for lesson ${input.lessonId}`);
}

export type { ScriptProfessorInput } from "./types";
