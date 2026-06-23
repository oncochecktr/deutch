import type { ScriptStepDef } from "../types";
import { hasAny } from "../utils";

export const A2_L01_STEPS: ScriptStepDef[] = [
  {
    teach: {
      reply: "A2 başlıyor! Önce A1 tekrarı, sonra geçmiş zaman.",
      teachingIntro: "Wie geht es dir? / Was machst du beruflich? — tekrar",
      teachingTopicGerman: "A1-Wiederholung",
      teachingTopicTurkish: "A1 tekrarı",
      teachingExamples: [
        { german: "Mir geht es gut.", turkish: "İyiyim." },
        { german: "Ich arbeite im Lager.", turkish: "Depoda çalışıyorum." },
      ],
      speakTextGerman: "Wie geht es dir? Mir geht es gut.",
      speakText: "A1 kalıplarını hatırla.",
    },
    practice: {
      germanQuestion: "Antworte: Wie geht es dir? und Was machst du beruflich?",
      turkishTranslation: "Nasılsın ve ne iş yapıyorsun?",
      speakTextGerman: "Wie geht es dir?",
    },
    expectedGerman: "Mir geht es gut … Ich arbeite …",
    correctionExplanationTr: "Hal hatır + meslek cevabı.",
    accept: (n) => hasAny(n, "gut", "geht es") && hasAny(n, "arbeite", "ich arbeite"),
    praiseReply: "Gut! Perfekt zamanına geçiyoruz.",
  },
  {
    teach: {
      reply: "Perfekt tanıtımı: Ich habe … gemacht.",
      teachingIntro: "gestern / letztes Wochenende + Ich habe … gemacht",
      teachingTopicGerman: "Ich habe … gemacht",
      teachingTopicTurkish: "… yaptım (Perfekt)",
      teachingExamples: [
        { german: "Ich habe gestern gearbeitet.", turkish: "Dün çalıştım." },
        { german: "Ich habe Pizza gegessen.", turkish: "Pizza yedim." },
      ],
      speakTextGerman: "Was hast du gestern gemacht? Ich habe gearbeitet.",
      speakText: "haben + Partizip II kalıbı.",
    },
    practice: {
      germanQuestion: "Was hast du gestern gemacht?",
      turkishTranslation: "Dün ne yaptın? Ich habe … gemacht.",
      speakTextGerman: "Was hast du gestern gemacht?",
    },
    expectedGerman: "Ich habe … gemacht",
    correctionExplanationTr: "Ich habe + fiil kökü + t/ge + macht/gemacht.",
    accept: (n) => hasAny(n, "ich habe", "habe") && hasAny(n, "gemacht", "gearbeitet", "gegessen", "gesehen"),
    praiseReply: "Sehr gut!",
  },
  {
    teach: {
      reply: "Geçmiş zaman pratiği.",
      teachingIntro: "Warst du …? / Ich habe am Wochenende …",
      teachingTopicGerman: "Perfekt — Übung",
      teachingTopicTurkish: "Perfekt alıştırma",
      teachingExamples: [
        { german: "Letztes Wochenende habe ich Fußball gespielt.", turkish: "Geçen hafta sonu futbol oynadım." },
      ],
      speakTextGerman: "Was hast du am Wochenende gemacht?",
      speakText: "Hafta sonu aktivitesi anlat.",
    },
    practice: {
      germanQuestion: "Erzähl vom letzten Wochenende.",
      turkishTranslation: "Geçen hafta sonunu anlat.",
      speakTextGerman: "Letztes Wochenende …",
    },
    expectedGerman: "Ich habe … gemacht",
    correctionExplanationTr: "Perfekt ile geçmiş bir olay.",
    accept: (n) => hasAny(n, "ich habe", "habe", "wochenende", "gestern") && hasAny(n, "gemacht", "ge", "gt"),
    praiseReply: "Harika!",
  },
  {
    teach: {
      reply: "A2 ders 1 özeti.",
      teachingIntro: "Mini diyalog — geçmiş zaman.",
      teachingTopicGerman: "Zusammenfassung — Perfekt",
      teachingTopicTurkish: "Perfekt özeti",
      teachingExamples: [
        {
          german: "Guten Tag! Was hast du gestern gemacht? — Ich habe gearbeitet und dann ferngesehen.",
          turkish: "Dün çalıştım, sonra TV izledim.",
        },
      ],
      speakTextGerman: "Was hast du gestern gemacht?",
      speakText: "Tam mini diyalog.",
    },
    practice: {
      germanQuestion: "Mini-Dialog mit Perfekt.",
      turkishTranslation: "Perfekt ile mini diyalog.",
      speakTextGerman: "Was hast du … gemacht?",
    },
    expectedGerman: "Ich habe … gemacht",
    correctionExplanationTr: "Soru + Perfekt cevap.",
    accept: (n) => hasAny(n, "was hast", "gemacht", "ich habe", "habe"),
    praiseReply: "Tebrikler! A2'ye hoş geldin — ilk ders tamam.",
  },
];
