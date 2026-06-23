import type { ScriptStepDef } from "../types";
import { hasAny } from "../utils";

export const A1_L03_STEPS: ScriptStepDef[] = [
  {
    teach: {
      reply: "Aile konusu: die Familie ve temel kelimeler.",
      teachingIntro: "die Familie, die Frau, der Mann, das Kind / die Kinder",
      teachingTopicGerman: "die Familie",
      teachingTopicTurkish: "aile",
      teachingExamples: [
        { german: "die Familie", turkish: "aile" },
        { german: "die Frau / der Mann", turkish: "kadın-eş / erkek-eş" },
        { german: "das Kind", turkish: "çocuk" },
      ],
      speakTextGerman: "Das ist meine Familie.",
      speakText: "Aile kelimelerini ezberle.",
    },
    practice: {
      germanQuestion: "Sag drei Wörter: Familie, Frau, Kind.",
      turkishTranslation: "Üç kelime: aile, kadın/eş, çocuk.",
      speakTextGerman: "Familie, Frau, Kind.",
    },
    expectedGerman: "Familie … Frau … Kind",
    correctionExplanationTr: "En az Familie ve Kind söyle.",
    accept: (n) => hasAny(n, "familie") && hasAny(n, "kind", "frau", "mann"),
    praiseReply: "Güzel! Ich habe kalıbına geçiyoruz.",
  },
  {
    teach: {
      reply: "Ich habe … — sahip olmak kalıbı.",
      teachingIntro: "Ich habe eine Frau und zwei Kinder.",
      teachingTopicGerman: "Ich habe …",
      teachingTopicTurkish: "… var / … sahibim",
      teachingExamples: [
        { german: "Ich habe eine Frau.", turkish: "Bir eşim var." },
        { german: "Ich habe zwei Kinder.", turkish: "İki çocuğum var." },
      ],
      speakTextGerman: "Ich habe eine Frau und zwei Kinder.",
      speakText: "Kendi ailene uyarla.",
    },
    practice: {
      germanQuestion: "Beschreibe deine Familie mit Ich habe …",
      turkishTranslation: "Aileni Ich habe ile anlat.",
      speakTextGerman: "Ich habe …",
    },
    expectedGerman: "Ich habe …",
    correctionExplanationTr: "Ich habe + aile üyesi.",
    accept: (n) => hasAny(n, "ich habe", "habe eine", "habe zwei", "habe einen"),
    praiseReply: "Sehr gut!",
  },
  {
    teach: {
      reply: "Aileni birkaç cümleyle anlat.",
      teachingIntro: "Meine Frau … / Mein Mann … / Meine Kinder …",
      teachingTopicGerman: "Meine Familie",
      teachingTopicTurkish: "Ailem",
      teachingExamples: [
        {
          german: "Ich habe eine Frau. Wir haben zwei Kinder. Meine Familie ist groß.",
          turkish: "Bir eşim var. İki çocuğumuz var. Ailem kalabalık.",
        },
      ],
      speakTextGerman: "Meine Familie ist wichtig.",
      speakText: "2–3 cümle kur.",
    },
    practice: {
      germanQuestion: "Erzähl von deiner Familie.",
      turkishTranslation: "Ailenden bahset.",
      speakTextGerman: "Erzähl von deiner Familie.",
    },
    expectedGerman: "Ich habe … Meine …",
    correctionExplanationTr: "Ich habe veya Meine/Mein kullan.",
    accept: (n) => hasAny(n, "ich habe", "meine", "mein", "familie", "frau", "mann", "kinder"),
    praiseReply: "Harika anlatım!",
  },
  {
    teach: {
      reply: "Aile dersi özeti.",
      teachingIntro: "4 cümlelik aile paragrafı.",
      teachingTopicGerman: "Zusammenfassung — Familie",
      teachingTopicTurkish: "Aile özeti",
      teachingExamples: [
        {
          german: "Ich habe eine Frau und ein Kind. Meine Familie wohnt in Berlin. Wir sind glücklich.",
          turkish: "Bir eşim ve bir çocuğum var. Ailem Berlin'de. Mutluyuz.",
        },
      ],
      speakTextGerman: "Das ist meine Familie.",
      speakText: "Tam paragrafı dene.",
    },
    practice: {
      germanQuestion: "Schreibe deine Familie in 3–4 Sätzen.",
      turkishTranslation: "3–4 cümleyle aileni anlat.",
      speakTextGerman: "Erzähl von deiner Familie.",
    },
    expectedGerman: "Ich habe … Familie …",
    correctionExplanationTr: "En az iki aile cümlesi.",
    accept: (n) =>
      hasAny(n, "ich habe", "meine", "mein") &&
      hasAny(n, "familie", "frau", "mann", "kind", "kinder"),
    praiseReply: "Tebrikler! Aile dersi bitti.",
  },
];
