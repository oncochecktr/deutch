import type { ElKitabiQuizItem } from "../types";

export const CH06_QUIZZES: Record<string, ElKitabiQuizItem[]> = {
  "ch06-1": [
    {
      id: "ch06-1-q1",
      question_tr: "durch den Park — hangi hal?",
      context_de: "durch den Park",
      options: ["Nominativ", "Akkusativ", "Dativ", "Wechsel"],
      correct_index: 1,
      explanation_tr: "DOGFUB edatları her zaman Akkusativ: durch, ohne, gegen, für, um, bis.",
    },
    {
      id: "ch06-1-q2",
      question_tr: "Hangi edat Akkusativ grubundadır?",
      options: ["mit", "für", "bei", "aus"],
      correct_index: 1,
      explanation_tr: "für → Akkusativ. mit, bei, aus → Dativ.",
    },
  ],
  "ch06-2": [
    {
      id: "ch06-2-q1",
      question_tr: "mit dem Bus — hangi hal?",
      context_de: "mit dem Bus",
      options: ["Akkusativ", "Dativ", "Nominativ", "Wechsel"],
      correct_index: 1,
      explanation_tr: "aus, bei, mit, nach, von, zu → Dativ.",
    },
    {
      id: "ch06-2-q2",
      question_tr: "nach Berlin — hangi hal?",
      options: ["Akkusativ", "Dativ", "Genitiv", "Wechsel"],
      correct_index: 1,
      explanation_tr: "nach, zu, von, aus, bei, mit → Dativ (yön/hareket).",
    },
  ],
};
