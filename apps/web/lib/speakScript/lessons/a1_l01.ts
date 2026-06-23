import type { ScriptStepDef } from "../types";
import { acceptsReady, hasAny } from "../utils";

export const A1_L01_STEPS: ScriptStepDef[] = [
  {
    teach: {
      reply: "Hoş geldin! Bugün selamlaşma ve tanışma dersindeyiz.",
      teachingIntro:
        "Plan: selamlaşma → isim → nereli → nerede yaşıyorsun → mini diyalog. Her adımda önce öğretirim, sonra deneriz.",
      teachingTopicGerman: "Willkommen im Unterricht",
      teachingTopicTurkish: "Derse hoş geldin",
      teachingExamples: [{ german: "Guten Tag!", turkish: "İyi günler — derse başlıyoruz." }],
      speakTextGerman: "Guten Tag. Willkommen im Unterricht.",
      speakText: "Sınıfa hoş geldin. Bugün tanışma kalıplarını öğreneceğiz.",
    },
    practice: {
      germanQuestion: "Bist du bereit?",
      turkishTranslation: "Hazır mısın? 'hazırım' veya Ich bin bereit de.",
      speakTextGerman: "Bist du bereit?",
    },
    expectedGerman: "Ich bin bereit.",
    correctionExplanationTr: "Hazır olduğunu belirt: hazırım, tamam veya Ich bin bereit.",
    accept: acceptsReady,
    praiseReply: "Güzel! Selamlaşmayla başlayalım.",
  },
  {
    teach: {
      reply: "Selamlaşma: Almancada en sık Hallo ve Guten Tag kullanılır.",
      teachingIntro: "Hallo samimi, Guten Tag daha resmî. İkisini de pratikte duyarsın.",
      teachingTopicGerman: "Hallo · Guten Tag",
      teachingTopicTurkish: "Merhaba · İyi günler",
      teachingExamples: [
        { german: "Hallo!", turkish: "Merhaba! (samimi)" },
        { german: "Guten Tag!", turkish: "İyi günler! (resmî)" },
      ],
      speakTextGerman: "Hallo! Guten Tag!",
      speakText: "İki selamlaşmayı dinle ve tekrarla.",
    },
    practice: {
      germanQuestion: "Sag Hallo oder Guten Tag.",
      turkishTranslation: "Almanca merhaba de.",
      speakTextGerman: "Sag Hallo.",
    },
    expectedGerman: "Hallo!",
    correctionExplanationTr: "Hallo veya Guten Tag yeterli.",
    accept: (n) => hasAny(n, "hallo", "guten tag", "guten morgen", "guten abend"),
    praiseReply: "Güzel! Sırada isim var.",
  },
  {
    teach: {
      reply: "Kendini tanıtma: Ich heiße …",
      teachingIntro: "Heißen = adlandırılmak. Ich heiße + adın.",
      teachingTopicGerman: "Ich heiße …",
      teachingTopicTurkish: "Benim adım …",
      teachingExamples: [
        { german: "Ich heiße Timur.", turkish: "Benim adım Timur." },
        { german: "Ich heiße Anna.", turkish: "Benim adım Anna." },
      ],
      speakTextGerman: "Ich heiße Timur. Und du?",
      speakText: "Kendi adınla tekrarla.",
    },
    practice: {
      germanQuestion: "Wie heißt du?",
      turkishTranslation: "Adın ne? Ich heiße … ile cevap ver.",
      speakTextGerman: "Wie heißt du?",
    },
    expectedGerman: "Ich heiße …",
    correctionExplanationTr: "Ich heiße ile başla, ardından adını söyle.",
    accept: (n) => hasAny(n, "ich heisse", "ich heiße", "heiße", "heisse"),
    praiseReply: "Sehr gut! İsmini söyledin.",
  },
  {
    teach: {
      reply: "Nereli olduğunu söyleme.",
      teachingIntro: "Woher kommst du? → Ich komme aus …",
      teachingTopicGerman: "Woher kommst du? — Ich komme aus …",
      teachingTopicTurkish: "Nerelisin? — … den/gelen",
      teachingExamples: [
        { german: "Ich komme aus der Türkei.", turkish: "Türkiye'denim." },
        { german: "Ich komme aus Istanbul.", turkish: "İstanbul'danım." },
      ],
      speakTextGerman: "Woher kommst du? Ich komme aus der Türkei.",
      speakText: "Soru ve cevabı birlikte öğren.",
    },
    practice: {
      germanQuestion: "Woher kommst du?",
      turkishTranslation: "Nerelisin? Ich komme aus …",
      speakTextGerman: "Woher kommst du?",
    },
    expectedGerman: "Ich komme aus …",
    correctionExplanationTr: "Ich komme aus + ülke/şehir.",
    accept: (n) => hasAny(n, "ich komme aus", "komme aus", "aus der turkei", "aus istanbul"),
    praiseReply: "Harika!",
  },
  {
    teach: {
      reply: "Nerede yaşadığını söyleme.",
      teachingIntro: "Ich wohne in … + şehir.",
      teachingTopicGerman: "Ich wohne in …",
      teachingTopicTurkish: "… de yaşıyorum",
      teachingExamples: [
        { german: "Ich wohne in Berlin.", turkish: "Berlin'de yaşıyorum." },
        { german: "Ich wohne in Istanbul.", turkish: "İstanbul'da yaşıyorum." },
      ],
      speakTextGerman: "Ich wohne in Berlin.",
      speakText: "Kendi şehrinle dene.",
    },
    practice: {
      germanQuestion: "Wo wohnst du?",
      turkishTranslation: "Nerede yaşıyorsun?",
      speakTextGerman: "Wo wohnst du?",
    },
    expectedGerman: "Ich wohne in …",
    correctionExplanationTr: "Ich wohne in + şehir.",
    accept: (n) => hasAny(n, "ich wohne in", "wohne in"),
    praiseReply: "Sehr gut!",
  },
  {
    teach: {
      reply: "Son adım: tam tanışma diyalogu.",
      teachingIntro: "Selamla → isim → nereli → şehir — hepsini birleştir.",
      teachingTopicGerman: "Tanışma diyalogu",
      teachingTopicTurkish: "Kendini tanıtma",
      teachingExamples: [
        {
          german: "Guten Tag! Ich heiße Timur. Ich komme aus der Türkei. Ich wohne in Berlin.",
          turkish: "İyi günler! Adım Timur. Türkiye'denim. Berlin'de yaşıyorum.",
        },
      ],
      speakTextGerman: "Guten Tag! Ich heiße Timur. Ich komme aus der Türkei. Ich wohne in Berlin.",
      speakText: "Örnek diyalogu dinle, kendi versiyonunu kur.",
    },
    practice: {
      germanQuestion: "Stell dich vor.",
      turkishTranslation: "Kendini tanıt: isim, ülke, şehir.",
      speakTextGerman: "Stell dich vor.",
    },
    expectedGerman: "Ich heiße … Ich komme aus … Ich wohne in …",
    correctionExplanationTr: "Üç kalıp bir arada: heiße, komme aus, wohne in.",
    accept: (n) =>
      hasAny(n, "ich heisse", "ich heiße", "heiße") &&
      hasAny(n, "komme aus", "ich komme") &&
      hasAny(n, "wohne in", "ich wohne"),
    praiseReply: "Tebrikler! İlk ders tamam — harika tanışma!",
  },
];
