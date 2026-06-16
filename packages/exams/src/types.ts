export type ExamLevel = "A1";
export type ExamMode = "practice" | "real";

export interface HoerenQuestion {
  id: string;
  level: ExamLevel;
  part: 1 | 2 | 3;
  format?: "mcq";
  type: "word" | "sentence" | "dialogue" | "announcement";
  audio_text: string;
  question_de: string;
  question_tr: string;
  options: string[];
  correct_index: number;
  tags: string[];
}

export interface HoerenTrueFalse {
  id: string;
  level: ExamLevel;
  part: 1 | 2 | 3;
  format: "true_false";
  audio_text: string;
  statement_de: string;
  statement_tr: string;
  correct: boolean;
  tags: string[];
}

export type HoerenExamItem = HoerenQuestion | HoerenTrueFalse;

export interface LesenQuestion {
  id: string;
  format?: "mcq";
  question_de: string;
  question_tr: string;
  options: string[];
  correct_index: number;
}

export interface LesenTrueFalse {
  id: string;
  format: "true_false";
  context_de: string;
  context_title?: string;
  statement_de: string;
  statement_tr: string;
  correct: boolean;
  tags: string[];
}

export interface LesenMatching {
  id: string;
  format: "matching";
  title_de: string;
  title_tr: string;
  prompts: { id: string; text_de: string; text_tr: string }[];
  options: string[];
  correct_indices: number[];
  tags: string[];
}

export type LesenExamItem = LesenTrueFalse | LesenMatching;

export interface LesenPassage {
  id: string;
  level: ExamLevel;
  type: "email" | "notice" | "sign" | "message" | "advert";
  title_de: string;
  text_de: string;
  questions: LesenQuestion[];
  tags: string[];
}

export interface SchreibenField {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  answer?: string;
  acceptAlso?: string[];
}

export interface SchreibenTask {
  id: string;
  level: ExamLevel;
  type: "form" | "email" | "invitation" | "message" | "appointment";
  prompt_de: string;
  prompt_tr: string;
  source_text_de?: string;
  fields: SchreibenField[];
  min_words: number;
  sample_answer: string;
  letter_bullets?: { de: string; tr: string; hints: string[] }[];
  tags: string[];
}

export interface SprechenCard {
  id: string;
  level: ExamLevel;
  part: 1 | 2 | 3;
  prompt_de: string;
  prompt_tr: string;
  example_de: string;
  example_tr: string;
  checklist: string[];
  tags: string[];
}

export interface GoetheExamRealBlueprint {
  hoeren: string[];
  lesen_rf: string[];
  lesen_match: string[];
  lesen: string[];
}

export interface GoetheExam {
  id: string;
  number: number;
  title: string;
  hoeren: string[];
  lesen: string[];
  schreiben: string[];
  sprechen: string[];
  time_minutes: number;
  real?: GoetheExamRealBlueprint;
}

export interface GoetheQuestionBank {
  level: ExamLevel;
  version: string;
  counts: {
    hoeren: number;
    lesen_questions: number;
    lesen_passages: number;
    schreiben: number;
    sprechen: number;
    exams: number;
    hoeren_real?: number;
    lesen_rf?: number;
    lesen_match?: number;
  };
}

export interface GoetheModulePoints {
  hoeren: number;
  lesen: number;
  schreiben: number;
  sprechen: number;
  total: number;
  passed: boolean;
}
