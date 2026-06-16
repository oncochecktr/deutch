import type {
  GoetheModulePoints,
  HoerenExamItem,
  HoerenQuestion,
  HoerenTrueFalse,
  LesenMatching,
  LesenPassage,
  LesenTrueFalse,
} from "@german-coach/exams";

export interface ExamAnswerState {
  mcq: Record<string, number>;
  trueFalse: Record<string, boolean>;
  matching: Record<string, number[]>;
  schreibenForm: Record<string, string>;
  schreibenLetter: string;
  sprechenAnswers: Record<string, string>;
  sprechenChecklists: Record<string, boolean[]>;
  sprechenScores: Record<string, number>;
}

export interface SchreibenScoreDetail {
  form: number;
  letter: number;
  total: number;
  formErrors: { fieldId: string; label: string; message: string }[];
  letterErrors: string[];
}

export interface SprechenScoreDetail {
  cardId: string;
  score: number;
  similarity: number;
  checklist: number;
}

export function isHoerenMcq(item: HoerenExamItem): item is HoerenQuestion {
  return !("format" in item) || item.format === "mcq";
}

export function isHoerenTrueFalse(item: HoerenExamItem): item is HoerenTrueFalse {
  return "format" in item && item.format === "true_false";
}

export function scoreHoerenMcq(
  questions: HoerenQuestion[],
  answers: Record<string, number>
): { correct: number; total: number; points: number } {
  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correct_index) correct++;
  }
  const total = questions.length;
  const points = total ? Math.round((correct / total) * 25) : 0;
  return { correct, total, points };
}

export function scoreHoerenTrueFalse(
  items: HoerenTrueFalse[],
  answers: Record<string, boolean>
): { correct: number; total: number; points: number } {
  let correct = 0;
  for (const q of items) {
    if (answers[q.id] === q.correct) correct++;
  }
  const total = items.length;
  const points = total ? Math.round((correct / total) * 8) : 0;
  return { correct, total, points };
}

export function scoreLesenTrueFalse(
  items: LesenTrueFalse[],
  answers: Record<string, boolean>
): { correct: number; total: number; points: number } {
  let correct = 0;
  for (const q of items) {
    if (answers[q.id] === q.correct) correct++;
  }
  const total = items.length;
  const points = total ? Math.round((correct / total) * 8) : 0;
  return { correct, total, points };
}

export function scoreLesenMatching(
  items: LesenMatching[],
  answers: Record<string, number[]>
): { correct: number; total: number; points: number } {
  let correct = 0;
  let total = 0;
  for (const m of items) {
    const user = answers[m.id] ?? [];
    m.prompts.forEach((_, i) => {
      total++;
      if (user[i] === m.correct_indices[i]) correct++;
    });
  }
  const points = total ? Math.round((correct / total) * 7) : 0;
  return { correct, total, points };
}

export function scoreLesenMcq(
  passages: LesenPassage[],
  answers: Record<string, number>
): { correct: number; total: number; points: number } {
  let correct = 0;
  let total = 0;
  for (const p of passages) {
    for (const q of p.questions) {
      total++;
      if (answers[q.id] === q.correct_index) correct++;
    }
  }
  const points = total ? Math.round((correct / total) * 10) : 0;
  return { correct, total, points };
}

export function scoreLesenModule(
  rf: LesenTrueFalse[],
  matching: LesenMatching[],
  passages: LesenPassage[],
  answers: ExamAnswerState
): { correct: number; total: number; points: number } {
  const rfS = scoreLesenTrueFalse(rf, answers.trueFalse);
  const mS = scoreLesenMatching(matching, answers.matching);
  const mcqS = scoreLesenMcq(passages, answers.mcq);
  return {
    correct: rfS.correct + mS.correct + mcqS.correct,
    total: rfS.total + mS.total + mcqS.total,
    points: Math.min(25, rfS.points + mS.points + mcqS.points),
  };
}

export function scoreHoerenModule(
  mcqItems: HoerenQuestion[],
  rfItems: HoerenTrueFalse[],
  answers: ExamAnswerState
): { correct: number; total: number; points: number } {
  const mcqS = scoreHoerenMcq(mcqItems, answers.mcq);
  const rfS = scoreHoerenTrueFalse(rfItems, answers.trueFalse);
  const mcqPoints = mcqItems.length ? Math.round((mcqS.correct / mcqS.total) * 17) : 0;
  const rfPoints = rfItems.length ? Math.round((rfS.correct / rfS.total) * 8) : 0;
  return {
    correct: mcqS.correct + rfS.correct,
    total: mcqS.total + rfS.total,
    points: Math.min(25, mcqPoints + rfPoints),
  };
}

export function computeGoetheModulePoints(input: {
  hoeren: { correct: number; total: number; points: number };
  lesen: { correct: number; total: number; points: number };
  schreiben: number;
  sprechen: number;
}): GoetheModulePoints {
  const hoeren = Math.min(25, input.hoeren.points);
  const lesen = Math.min(25, input.lesen.points);
  const schreiben = Math.min(25, input.schreiben);
  const sprechen = Math.min(25, input.sprechen);
  const total = hoeren + lesen + schreiben + sprechen;
  return {
    hoeren,
    lesen,
    schreiben,
    sprechen,
    total,
    passed: total >= 60,
  };
}

export function sprechenCardScore(
  userText: string,
  exampleDe: string,
  checklistChecked: boolean[],
  similarityScore: number
): number {
  const simPart = Math.round((similarityScore / 100) * 70);
  const checkPart = checklistChecked.filter(Boolean).length * 10;
  return Math.min(100, simPart + checkPart);
}

export function sprechenModulePoints(cardScores: number[]): number {
  if (!cardScores.length) return 0;
  const avg =
    cardScores.reduce((a, b) => a + b, 0) / cardScores.length;
  return Math.round((avg / 100) * 25);
}
