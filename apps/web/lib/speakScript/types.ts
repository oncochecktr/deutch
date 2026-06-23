import type { BoardPhase, ChatResponse } from "@/lib/speakTypes";

export interface ScriptProfessorInput {
  lessonId: string;
  stepIndex: number;
  stepConceptReady: boolean;
  userMessage: string;
  lastGermanQuestion: string | null;
  lastBoardPhase: BoardPhase | null;
}

export interface ScriptStepPractice {
  germanQuestion: string;
  turkishTranslation: string;
  speakTextGerman: string;
}

export interface ScriptStepDef {
  teach: Pick<
    ChatResponse,
    | "reply"
    | "teachingIntro"
    | "teachingTopicGerman"
    | "teachingTopicTurkish"
    | "teachingExamples"
    | "speakTextGerman"
    | "speakText"
  >;
  practice: ScriptStepPractice;
  expectedGerman: string;
  correctionExplanationTr: string;
  accept: (normalized: string, raw: string) => boolean;
  praiseReply?: string;
}
