import type { ElKitabiQuizItem } from "../types";

export const CH02_QUIZZES: Record<string, ElKitabiQuizItem[]> = {
  "ch02-2": [
    {
      id: "ch02-2-q1",
      question_tr: "ich + lernen → doğru çekim?",
      options: ["lerne", "lernst", "lernt", "lernen"],
      correct_index: 0,
      explanation_tr: "ich ile fiil -e ile biter: ich lerne.",
    },
    {
      id: "ch02-2-q2",
      question_tr: "er/sie/es + haben → doğru çekim?",
      options: ["habe", "hast", "hat", "haben"],
      correct_index: 2,
      explanation_tr: "sein, haben, werden düzensiz — er/sie/es hat.",
    },
  ],
  "ch02-4": [
    {
      id: "ch02-4-q1",
      question_tr: "Düz cümlede çekimli fiil hangi pozisyonda?",
      options: ["1. pozisyon", "2. pozisyon (V2)", "son pozisyon", "serbest"],
      correct_index: 1,
      explanation_tr: "Verbzweit: fiil her zaman 2. sırada.",
    },
    {
      id: "ch02-4-q2",
      question_tr: "Heute lerne ich Deutsch. — fiil nerede?",
      options: ["1. pozisyon", "2. pozisyon", "3. pozisyon", "sonda"],
      correct_index: 1,
      explanation_tr: "Özne kayabilir; fiil ikinci pozisyonda kalır.",
    },
  ],
  "ch02-5": [
    {
      id: "ch02-5-q1",
      question_tr: "Ich habe ___ Auto. (arabam yok)",
      context_de: "Ich habe ___ Auto.",
      options: ["nicht", "kein", "keine", "nicht ein"],
      correct_index: 1,
      explanation_tr: "Belirsiz isim olumsuzluğu → kein/keine/keinen.",
    },
    {
      id: "ch02-5-q2",
      question_tr: "Ich komme heute ___. (bugün gelmiyorum)",
      context_de: "Ich komme heute ___.",
      options: ["kein", "keine", "nicht", "keinen"],
      correct_index: 2,
      explanation_tr: "Fiil ve zarf olumsuzluğu → nicht.",
    },
  ],
};
