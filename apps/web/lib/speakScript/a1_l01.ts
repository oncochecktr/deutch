import { normalizeAnswer } from "@/lib/speakExercise";
import type { ChatResponse } from "@/lib/speakTypes";
import { isReadyToPracticeSignal } from "@/lib/speakLessonFlow";
import { isWrittenAnswerMessage } from "@/lib/speakTypes";
import type { ScriptProfessorInput, ScriptStepDef } from "./types";

function stripUserMessage(message: string): string {
  if (isWrittenAnswerMessage(message)) {
    return message.replace(/^\[YAZILI CEVAP\]\s*/i, "").trim();
  }
  return message.replace(/\n\n\[SISTEM:[\s\S]*$/, "").trim();
}

function hasAny(norm: string, ...parts: string[]): boolean {
  return parts.some((p) => norm.includes(normalizeAnswer(p)));
}

export const A1_L01_STEPS: ScriptStepDef[] = [
  {
    teach: {
      reply:
        "Hoş geldin! Bugün A1'in ilk dersindeyiz: selamlaşma ve tanışma. Dört konu ve sonunda mini diyalog.",
      teachingIntro:
        "Plan: (1) Selamlaşma (2) İsim (3) Nereli (4) Nerede yaşıyorsun. Her adımda önce öğretirim, sonra birlikte deneriz.",
      teachingTopicGerman: "Willkommen im Unterricht",
      teachingTopicTurkish: "Derse hoş geldin",
      teachingExamples: [
        { german: "Guten Tag!", turkish: "İyi günler — derse başlıyoruz." },
      ],
      speakTextGerman: "Guten Tag. Willkommen im Unterricht.",
      speakText: "Sınıfa hoş geldin. Bugün tanışma kalıplarını öğreneceğiz.",
    },
    practice: {
      germanQuestion: "Bist du bereit?",
      turkishTranslation: "Hazır mısın? Türkçe veya Almanca 'hazırım' de.",
      speakTextGerman: "Bist du bereit?",
    },
    expectedGerman: "Ich bin bereit.",
    correctionExplanationTr: "Hazır olduğunu belirt: hazırım, tamam veya Ich bin bereit.",
    accept: (n) =>
      hasAny(n, "hazirim", "hazırım", "tamam", "ok", "bereit", "ich bin bereit", "ja", "evet"),
    praiseReply: "Güzel! O zaman selamlaşmayla başlayalım.",
  },
  {
    teach: {
      reply:
        "Hoş geldin! Bugün A1'in ilk dersindeyiz: selamlaşma ve tanışma. Dört adımda ilerleyeceğiz.",
      teachingIntro:
        "Plan: (1) Selamlaşma (2) İsim söyleme (3) Nereli olduğun (4) Nerede yaşadığın. Sonunda kısa bir tanışma diyalogu yapacağız.",
      teachingTopicGerman: "Hallo · Guten Tag",
      teachingTopicTurkish: "Merhaba · İyi günler",
      teachingExamples: [
        { german: "Hallo!", turkish: "Merhaba! (samimi)" },
        { german: "Guten Tag!", turkish: "İyi günler! (resmî)" },
      ],
      speakTextGerman: "Guten Tag. Willkommen im Unterricht.",
      speakText: "Sınıfa hoş geldin. Bugün tanışma kalıplarını öğreneceğiz.",
    },
    practice: {
      germanQuestion: "Sag Hallo oder Guten Tag.",
      turkishTranslation: "Almanca merhaba de: Hallo veya Guten Tag.",
      speakTextGerman: "Guten Tag. Sag Hallo.",
    },
    expectedGerman: "Hallo!",
    correctionExplanationTr: "Selamlaşma için Hallo veya Guten Tag yeterli.",
    accept: (n) => hasAny(n, "hallo", "guten tag", "guten morgen", "guten abend"),
    praiseReply: "Güzel! Selamlaşmayı öğrendin. Sıradaki konu: isim.",
  },
  {
    teach: {
      reply: "Şimdi kendini tanıtma: ismini söyleme kalıbı.",
      teachingIntro: "Almancada isim söylemek için Ich heiße … kullanılır. Heißen = adlandırılmak.",
      teachingTopicGerman: "Ich heiße …",
      teachingTopicTurkish: "Benim adım … / Adım …",
      teachingExamples: [
        { german: "Ich heiße Timur.", turkish: "Benim adım Timur." },
        { german: "Ich heiße Anna.", turkish: "Benim adım Anna." },
      ],
      speakTextGerman: "Ich heiße Timur. Und du?",
      speakText: "Ich heiße kalıbını dinle ve kendi adınla tekrarla.",
    },
    practice: {
      germanQuestion: "Wie heißt du? Antworte: Ich heiße …",
      turkishTranslation: "Adın ne? Cevap: Ich heiße [adın].",
      speakTextGerman: "Wie heißt du?",
    },
    expectedGerman: "Ich heiße …",
    correctionExplanationTr: "Cümle Ich heiße ile başlamalı, ardından adını söyle.",
    accept: (n) => hasAny(n, "ich heisse", "ich heiße", "ich heise", "heiße", "heisse"),
    praiseReply: "Sehr gut! İsmini Almanca söyleyebiliyorsun.",
  },
  {
    teach: {
      reply: "Sırada nereli olduğunu söylemek var.",
      teachingIntro: "Soru: Woher kommst du? Cevap: Ich komme aus … + ülke/şehir.",
      teachingTopicGerman: "Woher kommst du? — Ich komme aus …",
      teachingTopicTurkish: "Nerelisin? — … den/gelen",
      teachingExamples: [
        { german: "Woher kommst du?", turkish: "Nerelisin?" },
        { german: "Ich komme aus der Türkei.", turkish: "Türkiye'denim." },
        { german: "Ich komme aus Istanbul.", turkish: "İstanbul'danım." },
      ],
      speakTextGerman: "Woher kommst du? Ich komme aus der Türkei.",
      speakText: "Woher kommst du sorusunu ve Ich komme aus cevabını öğren.",
    },
    practice: {
      germanQuestion: "Woher kommst du?",
      turkishTranslation: "Nerelisin? Cevap ver: Ich komme aus …",
      speakTextGerman: "Woher kommst du?",
    },
    expectedGerman: "Ich komme aus …",
    correctionExplanationTr: "Ich komme aus ile ülke veya şehir adı gelir. Örn: der Türkei, Istanbul.",
    accept: (n) => hasAny(n, "ich komme aus", "komme aus", "aus der turkei", "aus turkei", "aus istanbul"),
    praiseReply: "Harika! Nereli olduğunu söyleyebildin.",
  },
  {
    teach: {
      reply: "Şimdi nerede yaşadığını söylemeyi öğrenelim.",
      teachingIntro: "Kalıp: Ich wohne in … + şehir. Wohnen = yaşamak.",
      teachingTopicGerman: "Ich wohne in …",
      teachingTopicTurkish: "… de yaşıyorum",
      teachingExamples: [
        { german: "Ich wohne in Berlin.", turkish: "Berlin'de yaşıyorum." },
        { german: "Ich wohne in Istanbul.", turkish: "İstanbul'da yaşıyorum." },
      ],
      speakTextGerman: "Ich wohne in Berlin. Und du?",
      speakText: "Ich wohne in kalıbını kendi şehrinle kullan.",
    },
    practice: {
      germanQuestion: "Wo wohnst du? Antworte: Ich wohne in …",
      turkishTranslation: "Nerede yaşıyorsun? Cevap: Ich wohne in …",
      speakTextGerman: "Wo wohnst du?",
    },
    expectedGerman: "Ich wohne in …",
    correctionExplanationTr: "Ich wohne in + şehir adı. Örn: in Berlin, in Istanbul.",
    accept: (n) => hasAny(n, "ich wohne in", "wohne in"),
    praiseReply: "Sehr gut! Yaşadığın yeri de söyledin.",
  },
  {
    teach: {
      reply: "Son adım: öğrendiklerini bir diyalogda birleştirelim.",
      teachingIntro:
        "Tam tanışma: selamla → isim → nereli → nerede yaşıyor. Hepsini arka arkaya kurabilirsin.",
      teachingTopicGerman: "Tanışma diyalogu",
      teachingTopicTurkish: "Selamlaşma + tanışma",
      teachingExamples: [
        {
          german: "Guten Tag! Ich heiße Timur. Ich komme aus der Türkei. Ich wohne in Berlin.",
          turkish: "İyi günler! Adım Timur. Türkiye'denim. Berlin'de yaşıyorum.",
        },
      ],
      speakTextGerman:
        "Guten Tag! Ich heiße Timur. Ich komme aus der Türkei. Ich wohne in Berlin.",
      speakText: "Örnek diyalogu dinle, sonra kendi cümlenle dene.",
    },
    practice: {
      germanQuestion: "Stell dich vor: Name, Land, Stadt.",
      turkishTranslation: "Kendini tanıt: isim, nereli, nerede yaşıyorsun.",
      speakTextGerman: "Stell dich vor. Ich heiße …",
    },
    expectedGerman: "Ich heiße … Ich komme aus … Ich wohne in …",
    correctionExplanationTr:
      "En az üç parça: Ich heiße, Ich komme aus ve Ich wohne in içeren bir tanışma.",
    accept: (n) =>
      hasAny(n, "ich heisse", "ich heiße", "heiße") &&
      hasAny(n, "komme aus", "ich komme") &&
      hasAny(n, "wohne in", "ich wohne"),
    praiseReply: "Tebrikler! İlk dersi tamamladın — mükemmel bir tanışma yaptın.",
  },
];

function baseResponse(): ChatResponse {
  return {
    reply: "",
    correction: null,
    correctionExplanation: null,
    assignment: null,
    germanQuestion: null,
    turkishTranslation: null,
    partialHint: null,
    praise: null,
    professorAdvice: null,
    weaknesses: null,
    lessonNotes: null,
    expectsWrittenAnswer: false,
    assessedLevel: null,
    teachingIntro: null,
    teachingTopicGerman: null,
    teachingTopicTurkish: null,
    teachingExamples: [],
    speakText: null,
    speakTextGerman: null,
    boardPhase: null,
    conceptIntroduced: false,
    stepComplete: false,
    lessonComplete: false,
  };
}

export function runA1L01Script(input: ScriptProfessorInput): ChatResponse {
  const msg = stripUserMessage(input.userMessage);
  const norm = normalizeAnswer(msg);
  const stepIndex = Math.min(Math.max(0, input.stepIndex), A1_L01_STEPS.length - 1);
  const step = A1_L01_STEPS[stepIndex];
  const isLastStep = stepIndex >= A1_L01_STEPS.length - 1;

  const wasAnswering =
    !isReadyToPracticeSignal(msg) &&
    (Boolean(input.lastGermanQuestion) ||
      input.lastBoardPhase === "practice" ||
      input.lastBoardPhase === "question");

  if (wasAnswering && input.stepConceptReady) {
    if (step.accept(norm, msg)) {
      return {
        ...baseResponse(),
        reply: step.praiseReply ?? "Sehr gut! Gut gemacht.",
        stepComplete: true,
        lessonComplete: isLastStep,
        praise: "Sehr gut!",
        boardPhase: "question",
        conceptIntroduced: true,
        speakTextGerman: "Sehr gut! Gut gemacht.",
      };
    }

    return {
      ...baseResponse(),
      reply: "Neredeyse! Bir daha deneyelim — model cümleye bak.",
      correction: step.expectedGerman,
      correctionExplanation: step.correctionExplanationTr,
      boardPhase: "practice",
      conceptIntroduced: true,
      germanQuestion: input.lastGermanQuestion ?? step.practice.germanQuestion,
      turkishTranslation: step.practice.turkishTranslation,
      speakTextGerman: step.expectedGerman,
      teachingTopicGerman: step.teach.teachingTopicGerman ?? null,
      teachingTopicTurkish: step.teach.teachingTopicTurkish ?? null,
      teachingExamples: step.teach.teachingExamples ?? [],
    };
  }

  if (input.stepConceptReady && isReadyToPracticeSignal(msg)) {
    return {
      ...baseResponse(),
      reply: "Şimdi deneyelim.",
      boardPhase: "practice",
      conceptIntroduced: true,
      germanQuestion: step.practice.germanQuestion,
      turkishTranslation: step.practice.turkishTranslation,
      speakTextGerman: step.practice.speakTextGerman,
    };
  }

  return {
    ...baseResponse(),
    ...step.teach,
    boardPhase: "teach",
    conceptIntroduced: false,
    teachingExamples: step.teach.teachingExamples ?? [],
  };
}
