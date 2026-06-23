import type { ScriptStepDef } from "../types";
import { acceptsReady, hasAny } from "../utils";

export const A1_L02_STEPS: ScriptStepDef[] = [
  {
    teach: {
      reply: "Ders 2: Nasılsın ve ne iş yapıyorsun. Önce kısa tekrar yapalım.",
      teachingIntro: "Geçen dersten: Ich heiße … ve Ich komme aus …",
      teachingTopicGerman: "Wiederholung",
      teachingTopicTurkish: "Tekrar",
      teachingExamples: [
        { german: "Ich heiße …", turkish: "Adım …" },
        { german: "Ich komme aus der Türkei.", turkish: "Türkiye'denim." },
      ],
      speakTextGerman: "Ich heiße Timur. Ich komme aus der Türkei.",
      speakText: "Tanışma kalıplarını hatırla.",
    },
    practice: {
      germanQuestion: "Sag: Ich heiße … und Ich komme aus …",
      turkishTranslation: "Adını ve nereli olduğunu söyle.",
      speakTextGerman: "Ich heiße … Ich komme aus …",
    },
    expectedGerman: "Ich heiße … Ich komme aus …",
    correctionExplanationTr: "Hem isim hem nereli kalıbı gerekli.",
    accept: (n) => hasAny(n, "ich heisse", "ich heiße", "heiße") && hasAny(n, "komme aus", "ich komme"),
    praiseReply: "Güzel tekrar! Hal hatıra sorusuna geçiyoruz.",
  },
  {
    teach: {
      reply: "Hal hatır sorma: Wie geht es dir?",
      teachingIntro: "Soru: Wie geht es dir? Cevap: Mir geht es gut. / Sehr gut.",
      teachingTopicGerman: "Wie geht es dir? — Mir geht es gut.",
      teachingTopicTurkish: "Nasılsın? — İyiyim.",
      teachingExamples: [
        { german: "Wie geht es dir?", turkish: "Nasılsın?" },
        { german: "Mir geht es gut, danke.", turkish: "İyiyim, teşekkürler." },
        { german: "Sehr gut!", turkish: "Çok iyiyim!" },
      ],
      speakTextGerman: "Wie geht es dir? Mir geht es gut, danke.",
      speakText: "Soru ve olumlu cevabı öğren.",
    },
    practice: {
      germanQuestion: "Wie geht es dir?",
      turkishTranslation: "Nasılsın? Mir geht es gut ile cevap ver.",
      speakTextGerman: "Wie geht es dir?",
    },
    expectedGerman: "Mir geht es gut.",
    correctionExplanationTr: "Mir geht es gut veya Sehr gut kullan.",
    accept: (n) => hasAny(n, "mir geht es gut", "geht es gut", "sehr gut", "gut danke", "es geht"),
    praiseReply: "Sehr gut! Meslek konusuna geçelim.",
  },
  {
    teach: {
      reply: "Meslek söyleme: Ich arbeite …",
      teachingIntro: "Ich arbeite im Lager / als Fahrer / in einer Fabrik.",
      teachingTopicGerman: "Ich arbeite …",
      teachingTopicTurkish: "… de çalışıyorum",
      teachingExamples: [
        { german: "Ich arbeite im Lager.", turkish: "Depoda çalışıyorum." },
        { german: "Ich arbeite als Fahrer.", turkish: "Şoför olarak çalışıyorum." },
        { german: "Was machst du beruflich?", turkish: "Mesleğin ne?" },
      ],
      speakTextGerman: "Was machst du beruflich? Ich arbeite im Lager.",
      speakText: "Kendi işini söyle.",
    },
    practice: {
      germanQuestion: "Was machst du beruflich?",
      turkishTranslation: "Mesleğin ne? Ich arbeite …",
      speakTextGerman: "Was machst du beruflich?",
    },
    expectedGerman: "Ich arbeite …",
    correctionExplanationTr: "Ich arbeite im … veya als …",
    accept: (n) => hasAny(n, "ich arbeite", "arbeite im", "arbeite als", "beruflich"),
    praiseReply: "Harika! Mini diyalog zamanı.",
  },
  {
    teach: {
      reply: "Tanışma + hal hatır + meslek — bir arada.",
      teachingIntro: "Guten Tag → Wie geht es dir? → Ich arbeite …",
      teachingTopicGerman: "Mini-Dialog",
      teachingTopicTurkish: "Kısa diyalog",
      teachingExamples: [
        {
          german: "Guten Tag! Wie geht es dir? Mir geht es gut. Ich arbeite im Lager.",
          turkish: "İyi günler! Nasılsın? İyiyim. Depoda çalışıyorum.",
        },
      ],
      speakTextGerman: "Guten Tag! Wie geht es dir?",
      speakText: "Üç parçayı birleştir.",
    },
    practice: {
      germanQuestion: "Stell dich vor und sag, wo du arbeitest.",
      turkishTranslation: "Tanış, hal hatır sor ve işini söyle.",
      speakTextGerman: "Guten Tag! Wie geht es dir?",
    },
    expectedGerman: "Guten Tag … Mir geht es gut … Ich arbeite …",
    correctionExplanationTr: "Selam + nasılsın cevabı + meslek.",
    accept: (n) =>
      hasAny(n, "guten tag", "hallo", "wie geht") &&
      hasAny(n, "gut", "geht es") &&
      hasAny(n, "ich arbeite", "arbeite"),
    praiseReply: "Çok iyi diyalog!",
  },
  {
    teach: {
      reply: "Ders özeti: 5 cümlelik konuşma.",
      teachingIntro: "İsim, hal hatır, meslek — sınav formatında tekrar.",
      teachingTopicGerman: "Zusammenfassung",
      teachingTopicTurkish: "Özet",
      teachingExamples: [
        {
          german:
            "Hallo! Ich heiße … Mir geht es gut. Ich komme aus der Türkei. Ich arbeite im Lager.",
          turkish: "Merhaba! Adım … İyiyim. Türkiye'denim. Depoda çalışıyorum.",
        },
      ],
      speakTextGerman: "Hallo! Ich heiße Timur. Mir geht es gut.",
      speakText: "Tam özet konuşmayı dene.",
    },
    practice: {
      germanQuestion: "Erzähl kurz über dich: Name, Befinden, Herkunft, Beruf.",
      turkishTranslation: "Kısaca kendinden bahset.",
      speakTextGerman: "Erzähl über dich.",
    },
    expectedGerman: "Ich heiße … Mir geht es gut … Ich arbeite …",
    correctionExplanationTr: "En az isim, hal hatır ve meslek.",
    accept: (n) =>
      hasAny(n, "ich heisse", "ich heiße", "heiße") &&
      hasAny(n, "gut", "geht es") &&
      hasAny(n, "ich arbeite", "arbeite"),
    praiseReply: "Tebrikler! İkinci ders tamam.",
  },
];
