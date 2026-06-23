import type { ScriptStepDef } from "../types";
import { hasAny } from "../utils";

export const A1_L06_STEPS: ScriptStepDef[] = [
  {
    teach: {
      reply: "Yön sorma: Wo ist …? ve Entschuldigung.",
      teachingIntro: "Entschuldigung — Wo ist der Bahnhof?",
      teachingTopicGerman: "Wo ist …? · Entschuldigung",
      teachingTopicTurkish: "… nerede? · Affedersiniz",
      teachingExamples: [
        { german: "Entschuldigung!", turkish: "Affedersiniz!" },
        { german: "Wo ist der Bahnhof?", turkish: "Tren garı nerede?" },
        { german: "Wo ist die Toilette?", turkish: "Tuvalet nerede?" },
      ],
      speakTextGerman: "Entschuldigung! Wo ist der Bahnhof?",
      speakText: "Kibarca soru sorma.",
    },
    practice: {
      germanQuestion: "Frag: Wo ist der Bahnhof?",
      turkishTranslation: "Tren garı nerede diye sor.",
      speakTextGerman: "Wo ist der Bahnhof?",
    },
    expectedGerman: "Wo ist der Bahnhof?",
    correctionExplanationTr: "Wo ist der/die/das …?",
    accept: (n) => hasAny(n, "wo ist", "bahnhof", "toilette", "entschuldigung"),
    praiseReply: "Gut! Yön kelimelerine geçelim.",
  },
  {
    teach: {
      reply: "Yön tarifi: links, rechts, geradeaus.",
      teachingIntro: "Gehen Sie links / rechts / geradeaus.",
      teachingTopicGerman: "links · rechts · geradeaus",
      teachingTopicTurkish: "sol · sağ · düz",
      teachingExamples: [
        { german: "Gehen Sie geradeaus.", turkish: "Düz gidin." },
        { german: "Dann links.", turkish: "Sonra sola." },
        { german: "Die zweite Straße rechts.", turkish: "İkinci sokak sağda." },
      ],
      speakTextGerman: "Gehen Sie geradeaus, dann links.",
      speakText: "Üç yön kelimesini öğren.",
    },
    practice: {
      germanQuestion: "Sag eine Richtung: links, rechts oder geradeaus.",
      turkishTranslation: "Bir yön söyle.",
      speakTextGerman: "Gehen Sie …",
    },
    expectedGerman: "links / rechts / geradeaus",
    correctionExplanationTr: "links, rechts veya geradeaus.",
    accept: (n) => hasAny(n, "links", "rechts", "geradeaus", "gehen sie"),
    praiseReply: "Sehr gut!",
  },
  {
    teach: {
      reply: "Yol tarifi pratiği.",
      teachingIntro: "Soru sor, yön cevabı ver.",
      teachingTopicGerman: "Wegbeschreibung",
      teachingTopicTurkish: "Yol tarifi",
      teachingExamples: [
        {
          german: "Entschuldigung, wo ist der Supermarkt? — Gehen Sie geradeaus, dann rechts.",
          turkish: "Market nerede? — Düz, sonra sağ.",
        },
      ],
      speakTextGerman: "Wo ist der Supermarkt?",
      speakText: "Soru + yön cevabı.",
    },
    practice: {
      germanQuestion: "Frag nach dem Bahnhof und gib eine Richtung.",
      turkishTranslation: "Garı sor ve yön tarif et.",
      speakTextGerman: "Wo ist …? Gehen Sie …",
    },
    expectedGerman: "Wo ist … geradeaus/links",
    correctionExplanationTr: "Wo ist + yön kelimesi.",
    accept: (n) => hasAny(n, "wo ist", "bahnhof", "supermarkt") && hasAny(n, "links", "rechts", "geradeaus"),
    praiseReply: "Harika!",
  },
  {
    teach: {
      reply: "Goethe Sprechen tarzı mini sınav.",
      teachingIntro: "Yol sorma + yön verme — sınav formatı.",
      teachingTopicGerman: "Sprechen — Wegbeschreibung",
      teachingTopicTurkish: "Konuşma — yol tarifi",
      teachingExamples: [
        {
          german: "Entschuldigung! Wo ist die Apotheke? — Gehen Sie geradeaus. Dann die erste Straße links.",
          turkish: "Eczane nerede? — Düz, ilk sokak sola.",
        },
      ],
      speakTextGerman: "Entschuldigung! Wo ist die Apotheke?",
      speakText: "Tam sınav cevabı.",
    },
    practice: {
      germanQuestion: "Komplette Wegbeschreibung.",
      turkishTranslation: "Tam yol tarifi: soru + cevap.",
      speakTextGerman: "Entschuldigung! Wo ist …?",
    },
    expectedGerman: "Entschuldigung … Wo ist … links/rechts",
    correctionExplanationTr: "Entschuldigung + Wo ist + yön.",
    accept: (n) =>
      hasAny(n, "wo ist", "entschuldigung") &&
      hasAny(n, "links", "rechts", "geradeaus", "gehen"),
    praiseReply: "Tebrikler! A1 yön dersi ve A1 konuşma temeli tamam!",
  },
];
