import type { ScriptStepDef } from "../types";
import { hasAny } from "../utils";

export const A1_L04_STEPS: ScriptStepDef[] = [
  {
    teach: {
      reply: "Sayılar 1–20: temel sayma.",
      teachingIntro: "eins, zwei, drei … zehn, elf, zwölf … zwanzig",
      teachingTopicGerman: "Zahlen 1–20",
      teachingTopicTurkish: "Sayılar 1–20",
      teachingExamples: [
        { german: "eins, zwei, drei", turkish: "bir, iki, üç" },
        { german: "zehn, elf, zwölf", turkish: "on, on bir, on iki" },
        { german: "zwanzig", turkish: "yirmi" },
      ],
      speakTextGerman: "eins, zwei, drei, vier, fünf",
      speakText: "1'den 10'a kadar say.",
    },
    practice: {
      germanQuestion: "Zähl von eins bis fünf.",
      turkishTranslation: "Birden beşe kadar say.",
      speakTextGerman: "eins, zwei, drei …",
    },
    expectedGerman: "eins zwei drei",
    correctionExplanationTr: "Almanca sayıları sırayla söyle.",
    accept: (n) => hasAny(n, "eins", "zwei", "drei", "vier", "funf", "fünf"),
    praiseReply: "Gut! Saate geçiyoruz.",
  },
  {
    teach: {
      reply: "Saat sorma ve söyleme.",
      teachingIntro: "Wie spät ist es? — Es ist drei Uhr. / Es ist halb vier.",
      teachingTopicGerman: "Wie spät ist es?",
      teachingTopicTurkish: "Saat kaç?",
      teachingExamples: [
        { german: "Wie spät ist es?", turkish: "Saat kaç?" },
        { german: "Es ist drei Uhr.", turkish: "Saat üç." },
        { german: "Es ist zehn Uhr.", turkish: "Saat on." },
      ],
      speakTextGerman: "Wie spät ist es? Es ist drei Uhr.",
      speakText: "Soru ve cevap kalıbı.",
    },
    practice: {
      germanQuestion: "Wie spät ist es? Antworte: Es ist … Uhr.",
      turkishTranslation: "Saat kaç? Es ist … Uhr.",
      speakTextGerman: "Wie spät ist es?",
    },
    expectedGerman: "Es ist … Uhr",
    correctionExplanationTr: "Es ist + sayı + Uhr.",
    accept: (n) => hasAny(n, "es ist", "ist") && hasAny(n, "uhr", "eins", "zwei", "drei", "vier", "funf", "zehn"),
    praiseReply: "Sehr gut!",
  },
  {
    teach: {
      reply: "Sayı ve saat pratiği.",
      teachingIntro: "3 saat + 3 sayı sorusu.",
      teachingTopicGerman: "Zahlen & Uhrzeit — Übung",
      teachingTopicTurkish: "Sayı ve saat alıştırması",
      teachingExamples: [
        { german: "Es ist acht Uhr.", turkish: "Saat sekiz." },
        { german: "Ich habe fünf Äpfel.", turkish: "Beş elmam var." },
      ],
      speakTextGerman: "Es ist acht Uhr.",
      speakText: "Saat ve sayı birlikte.",
    },
    practice: {
      germanQuestion: "Sag die Uhrzeit und eine Zahl über 10.",
      turkishTranslation: "Saat söyle ve 10'dan büyük bir sayı.",
      speakTextGerman: "Wie spät ist es?",
    },
    expectedGerman: "Es ist … Uhr …",
    correctionExplanationTr: "Bir saat + bir sayı.",
    accept: (n) => hasAny(n, "es ist", "uhr") && hasAny(n, "elf", "zwolf", "zwoelf", "dreizehn", "zwanzig", "funfzehn"),
    praiseReply: "Harika!",
  },
  {
    teach: {
      reply: "Mini sınav: sayılar ve saat.",
      teachingIntro: "Sınav formatında kısa cevaplar.",
      teachingTopicGerman: "Mini-Test",
      teachingTopicTurkish: "Mini test",
      teachingExamples: [
        { german: "Wie spät ist es? — Es ist neun Uhr.", turkish: "Saat dokuz." },
      ],
      speakTextGerman: "Wie spät ist es?",
      speakText: "3 saat + 3 sayı cevabı.",
    },
    practice: {
      germanQuestion: "Nenne drei Uhrzeiten.",
      turkishTranslation: "Üç saat söyle.",
      speakTextGerman: "Es ist … Uhr.",
    },
    expectedGerman: "Es ist … Uhr",
    correctionExplanationTr: "En az iki Es ist … Uhr.",
    accept: (n) => (n.match(/uhr/g) ?? []).length >= 1 && hasAny(n, "es ist"),
    praiseReply: "Tebrikler! Sayılar dersi tamam.",
  },
];
