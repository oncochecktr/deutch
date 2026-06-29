import type { ElKitabiQuizItem } from "../types";

export const CH01_QUIZZES: Record<string, ElKitabiQuizItem[]> = {
  "ch01-3": [
    {
      id: "ch01-3-q1",
      question_tr: "21 sayısı Almancada nasıl okunur?",
      options: ["zwanzigeins", "einundzwanzig", "zweieins", "einsundzwanzig"],
      correct_index: 1,
      explanation_tr: "Iki haneli sayılar tersten: ein-und-zwanzig (bir ve yirmi).",
    },
    {
      id: "ch01-3-q2",
      question_tr: "Saat 9:30 için doğru ifade hangisi?",
      context_de: "halb zehn",
      options: [
        "Dokuz buçuk (resmi saat)",
        "On buçuk",
        "Dokuz otuz (yarım on)",
        "Sekiz otuz",
      ],
      correct_index: 2,
      explanation_tr: "halb on = 9:30. Onun yarısı demek — Türkçe saat mantığından farklı.",
    },
  ],
};
