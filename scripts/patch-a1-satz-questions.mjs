// Add Satzstellung question exercises (wir/ihr/payment) — run: node scripts/patch-a1-satz-questions.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORE = path.join(__dirname, "../data/grundlagen/a1-core.json");
const core = JSON.parse(fs.readFileSync(CORE, "utf8"));

const NEW_EXERCISES = [
  {
    id: "sb_pay_01",
    prompt_tr: "Biz kartla mı ödüyoruz?",
    tokens: ["Zahlen", "wir", "mit", "Karte", "?"],
    distractors: ["Bäckerei", "bar"],
    answer_de: "Zahlen wir mit Karte?",
    hint: "Ja/Nein — fiil başa (Zahlen)",
    tier: 2,
  },
  {
    id: "sb_pay_02",
    prompt_tr: "Nakit mi ödüyorsunuz?",
    tokens: ["Bezahlt", "ihr", "bar", "?"],
    distractors: ["Karte", "wir"],
    answer_de: "Bezahlt ihr bar?",
    hint: "Ja/Nein — ihr + fiil başta",
    tier: 2,
  },
  {
    id: "sb_pay_03",
    prompt_tr: "Berlin'de mi oturuyorsunuz?",
    tokens: ["Wohnt", "ihr", "in", "Berlin", "?"],
    distractors: ["München", "wir"],
    answer_de: "Wohnt ihr in Berlin?",
    hint: "Ja/Nein — Wohnt ihr …?",
    tier: 2,
  },
  {
    id: "sb_pay_04",
    prompt_tr: "Birlikte mi yemek yiyoruz?",
    tokens: ["Essen", "wir", "zusammen", "?"],
    distractors: ["Heute", "ihr"],
    answer_de: "Essen wir zusammen?",
    hint: "Ja/Nein — wir sorusu",
    tier: 2,
  },
  {
    id: "sb_pay_05",
    prompt_tr: "Münih'te mi oturuyorsunuz? (Sie)",
    tokens: ["Wohnen", "Sie", "in", "München", "?"],
    distractors: ["Berlin", "ihr"],
    answer_de: "Wohnen Sie in München?",
    hint: "Ja/Nein — resmi Sie",
    tier: 2,
  },
  {
    id: "sb_pay_06",
    prompt_tr: "Almanca mı öğreniyoruz?",
    tokens: ["Lernen", "wir", "Deutsch", "?"],
    distractors: ["Englisch", "ihr"],
    answer_de: "Lernen wir Deutsch?",
    hint: "Ja/Nein — Lernen wir …?",
    tier: 2,
  },
];

const existing = core.sentenceBuilder.exercises;
for (const ex of NEW_EXERCISES) {
  if (!existing.some((e) => e.id === ex.id)) {
    existing.push(ex);
  }
}

fs.writeFileSync(CORE, JSON.stringify(core, null, 2), "utf8");
console.log(`✓ a1-core sentenceBuilder — ${existing.length} exercises (${NEW_EXERCISES.length} payment/question added)`);
