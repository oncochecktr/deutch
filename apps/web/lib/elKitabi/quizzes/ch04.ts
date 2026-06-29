import type { ElKitabiQuizItem } from "../types";

export const CH04_QUIZZES: Record<string, ElKitabiQuizItem[]> = {
  "ch04-1": [
    {
      id: "ch04-1-q1",
      question_tr: "Der Mann gibt dem Kind den Ball. — dem Kind hangi hal?",
      context_de: "Der Mann gibt dem Kind den Ball.",
      options: ["Nominativ", "Akkusativ", "Dativ", "Genitiv"],
      correct_index: 2,
      explanation_tr: "wem? → Dativ (kime? çocuğa).",
    },
    {
      id: "ch04-1-q2",
      question_tr: "den Ball hangi hal? (kimi? neyi?)",
      options: ["Nominativ", "Akkusativ", "Dativ", "Genitiv"],
      correct_index: 1,
      explanation_tr: "wen? / was? → Akkusativ (düz nesne).",
    },
  ],
};
