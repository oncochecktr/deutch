import type { ChatResponse } from "@/lib/speakTypes";
import { isReadyToPracticeSignal } from "@/lib/speakLessonFlow";
import { normalizeAnswer } from "@/lib/speakExercise";
import type { ScriptProfessorInput, ScriptStepDef } from "./types";
import { stripUserMessage } from "./utils";

function baseResponse(): ChatResponse {
  return {
    reply: "",
    correction: null,
    correctionExplanation: null,
    assignment: null,
    germanQuestion: null,
    turkishTranslation: null,
    partialHint: null,
    praise: null,
    professorAdvice: null,
    weaknesses: null,
    lessonNotes: null,
    expectsWrittenAnswer: false,
    assessedLevel: null,
    teachingIntro: null,
    teachingTopicGerman: null,
    teachingTopicTurkish: null,
    teachingExamples: [],
    speakText: null,
    speakTextGerman: null,
    boardPhase: null,
    conceptIntroduced: false,
    stepComplete: false,
    lessonComplete: false,
  };
}

export function runScriptSteps(steps: ScriptStepDef[], input: ScriptProfessorInput): ChatResponse {
  const msg = stripUserMessage(input.userMessage);
  const norm = normalizeAnswer(msg);
  const stepIndex = Math.min(Math.max(0, input.stepIndex), steps.length - 1);
  const step = steps[stepIndex];
  const isLastStep = stepIndex >= steps.length - 1;

  const wasAnswering =
    !isReadyToPracticeSignal(msg) &&
    (Boolean(input.lastGermanQuestion) ||
      input.lastBoardPhase === "practice" ||
      input.lastBoardPhase === "question");

  if (wasAnswering && input.stepConceptReady) {
    if (step.accept(norm, msg)) {
      return {
        ...baseResponse(),
        reply: step.praiseReply ?? "Sehr gut! Gut gemacht.",
        stepComplete: true,
        lessonComplete: isLastStep,
        praise: "Sehr gut!",
        boardPhase: "question",
        conceptIntroduced: true,
        speakTextGerman: "Sehr gut! Gut gemacht.",
      };
    }

    return {
      ...baseResponse(),
      reply: "Neredeyse! Bir daha deneyelim — model cümleye bak.",
      correction: step.expectedGerman,
      correctionExplanation: step.correctionExplanationTr,
      boardPhase: "practice",
      conceptIntroduced: true,
      germanQuestion: input.lastGermanQuestion ?? step.practice.germanQuestion,
      turkishTranslation: step.practice.turkishTranslation,
      speakTextGerman: step.expectedGerman,
      teachingTopicGerman: step.teach.teachingTopicGerman ?? null,
      teachingTopicTurkish: step.teach.teachingTopicTurkish ?? null,
      teachingExamples: step.teach.teachingExamples ?? [],
    };
  }

  if (input.stepConceptReady && isReadyToPracticeSignal(msg)) {
    return {
      ...baseResponse(),
      reply: "Şimdi deneyelim.",
      boardPhase: "practice",
      conceptIntroduced: true,
      germanQuestion: step.practice.germanQuestion,
      turkishTranslation: step.practice.turkishTranslation,
      speakTextGerman: step.practice.speakTextGerman,
    };
  }

  return {
    ...baseResponse(),
    ...step.teach,
    boardPhase: "teach",
    conceptIntroduced: false,
    teachingExamples: step.teach.teachingExamples ?? [],
  };
}
