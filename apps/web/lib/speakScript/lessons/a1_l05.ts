import type { ScriptStepDef } from "../types";
import { hasAny } from "../utils";

export const A1_L05_STEPS: ScriptStepDef[] = [
  {
    teach: {
      reply: "Market alışverişi: temel kalıplar.",
      teachingIntro: "Ich möchte … / Was kostet das? / Das kostet … Euro",
      teachingTopicGerman: "Ich möchte … · Was kostet das?",
      teachingTopicTurkish: "… istiyorum · Bu kaç para?",
      teachingExamples: [
        { german: "Ich möchte Brot.", turkish: "Ekmek istiyorum." },
        { german: "Was kostet das?", turkish: "Bu kaç para?" },
        { german: "Das kostet zwei Euro.", turkish: "İki euro." },
      ],
      speakTextGerman: "Ich möchte Brot. Was kostet das?",
      speakText: "İstek ve fiyat sorma.",
    },
    practice: {
      germanQuestion: "Sag: Ich möchte … und Was kostet das?",
      turkishTranslation: "Bir ürün iste ve fiyat sor.",
      speakTextGerman: "Ich möchte … Was kostet das?",
    },
    expectedGerman: "Ich möchte … Was kostet das?",
    correctionExplanationTr: "Ich möchte + ürün ve Was kostet das?",
    accept: (n) => hasAny(n, "ich mochte", "ich möchte", "mochte") && hasAny(n, "kostet", "was kostet"),
    praiseReply: "Gut! Ürün kelimelerine bakalım.",
  },
  {
    teach: {
      reply: "Market kelimeleri: Brot, Milch, Kaffee.",
      teachingIntro: "die Milch, das Brot, der Kaffee — Euro ile fiyat",
      teachingTopicGerman: "Brot · Milch · Kaffee",
      teachingTopicTurkish: "Ekmek · Süt · Kahve",
      teachingExamples: [
        { german: "Ich möchte Milch.", turkish: "Süt istiyorum." },
        { german: "Das kostet drei Euro.", turkish: "Üç euro." },
      ],
      speakTextGerman: "Ich möchte Kaffee, bitte.",
      speakText: "Üç üründen birini sipariş et.",
    },
    practice: {
      germanQuestion: "Bestell Brot oder Milch.",
      turkishTranslation: "Ekmek veya süt sipariş et.",
      speakTextGerman: "Ich möchte … bitte.",
    },
    expectedGerman: "Ich möchte Brot/Milch",
    correctionExplanationTr: "Ich möchte + Brot, Milch veya Kaffee.",
    accept: (n) => hasAny(n, "ich mochte", "ich möchte") && hasAny(n, "brot", "milch", "kaffee"),
    praiseReply: "Sehr gut!",
  },
  {
    teach: {
      reply: "Market sahnesi: tam diyalog.",
      teachingIntro: "Verkäufer — Kunde diyalogu.",
      teachingTopicGerman: "Im Supermarkt",
      teachingTopicTurkish: "Markette",
      teachingExamples: [
        {
          german: "Guten Tag! Ich möchte Brot und Milch. Was kostet das? — Das kostet vier Euro.",
          turkish: "Ekmek ve süt istiyorum. Kaç para? — Dört euro.",
        },
      ],
      speakTextGerman: "Guten Tag! Ich möchte Brot, bitte.",
      speakText: "Sipariş + fiyat sorusu.",
    },
    practice: {
      germanQuestion: "Spiel den Kunden: bestellen und bezahlen.",
      turkishTranslation: "Müşteri ol: sipariş ver, fiyat sor.",
      speakTextGerman: "Ich möchte … Was kostet das?",
    },
    expectedGerman: "Ich möchte … kostet … Euro",
    correctionExplanationTr: "Sipariş + fiyat.",
    accept: (n) =>
      hasAny(n, "mochte", "möchte") &&
      hasAny(n, "kostet", "euro", "bitte"),
    praiseReply: "Harika market diyalogu!",
  },
  {
    teach: {
      reply: "Alışveriş dersi özeti.",
      teachingIntro: "Tam market konuşması.",
      teachingTopicGerman: "Zusammenfassung — Einkaufen",
      teachingTopicTurkish: "Alışveriş özeti",
      teachingExamples: [
        {
          german: "Ich möchte zwei Brote und eine Milch. Das kostet fünf Euro, bitte.",
          turkish: "İki ekmek ve bir süt. Beş euro lütfen.",
        },
      ],
      speakTextGerman: "Das kostet fünf Euro. Danke!",
      speakText: "Tam alışveriş diyalogu.",
    },
    practice: {
      germanQuestion: "Kompletter Einkaufsdialog.",
      turkishTranslation: "Tam alışveriş diyalogu kur.",
      speakTextGerman: "Ich möchte … Das kostet …",
    },
    expectedGerman: "Ich möchte … Euro",
    correctionExplanationTr: "Ich möchte + ürün + fiyat/Euro.",
    accept: (n) => hasAny(n, "mochte", "möchte") && hasAny(n, "euro", "kostet"),
    praiseReply: "Tebrikler! Market dersi bitti.",
  },
];
