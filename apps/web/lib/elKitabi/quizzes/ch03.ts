import type { ElKitabiQuizItem } from "../types";

export const CH03_QUIZZES: Record<string, ElKitabiQuizItem[]> = {
  "ch03-1": [
    {
      id: "ch03-1-q1",
      question_tr: "die Zeitung — hangi artikel kuralı?",
      options: ["-er eki → der", "-ung eki → die", "-chen eki → das", "gün adı → der"],
      correct_index: 1,
      explanation_tr: "-ung, -heit, -keit → her zaman die.",
    },
    {
      id: "ch03-1-q2",
      question_tr: "das Mädchen — neden das?",
      options: ["disil kelime", "-chen eki → das", "-ung eki", "cogul"],
      correct_index: 1,
      explanation_tr: "-chen ve -lein → her zaman das (kız çocuk = das Mädchen).",
    },
  ],
  "ch03-2": [
    {
      id: "ch03-2-q1",
      question_tr: "Belirsiz artikel (bir) eril?",
      options: ["der", "die", "das", "ein"],
      correct_index: 3,
      explanation_tr: "ein Mann, eine Frau, ein Kind.",
    },
    {
      id: "ch03-2-q2",
      question_tr: "Olumsuz artikel (hiç/yok) dişil?",
      options: ["kein", "keine", "keinen", "nicht"],
      correct_index: 1,
      explanation_tr: "keine Frau, kein Mann, kein Kind.",
    },
  ],
};
