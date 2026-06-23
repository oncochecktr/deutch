// A1 Negation Trainer — run: npm run build:negation
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../data/grundlagen/a1-negation.json");

const KEIN_SET = {
  id: "kein",
  title: "kein / keine / keinen",
  title_tr: "kein ile olumsuzluk",
  order: 1,
  examples: [
    { de: "Ich habe keine Zeit.", tr: "Vaktim yok." },
    { de: "Er hat kein Auto.", tr: "Arabası yok." },
    { de: "Sie hat keine Kinder.", tr: "Çocuğu yok." },
    { de: "Wir haben kein Geld.", tr: "Paramız yok." },
    { de: "Du hast keinen Hunger.", tr: "Aç değilsin." },
    { de: "Ich spreche kein Deutsch.", tr: "Almanca konuşmuyorum." },
    { de: "Er isst kein Fleisch.", tr: "Et yemiyor." },
    { de: "Sie trinkt keinen Kaffee.", tr: "Kahve içmiyor." },
  ],
  drills: [
    { ctx: "Ich habe ___ Zeit.", correct: "keine", options: ["keine", "kein", "keinen", "nicht"] },
    { ctx: "Er hat ___ Auto.", correct: "kein", options: ["kein", "keine", "keinen", "nicht"] },
    { ctx: "Sie hat ___ Kinder.", correct: "keine", options: ["keine", "kein", "keinen", "keinem"] },
    { ctx: "Wir haben ___ Geld.", correct: "kein", options: ["kein", "keine", "keinen", "nicht"] },
    { ctx: "Du hast ___ Hunger.", correct: "keinen", options: ["keinen", "kein", "keine", "nicht"] },
    { ctx: "Ich spreche ___ Deutsch.", correct: "kein", options: ["kein", "keine", "keinen", "nicht"] },
    { ctx: "Er isst ___ Fleisch.", correct: "kein", options: ["kein", "keine", "keinen", "nicht"] },
    { ctx: "Sie trinkt ___ Kaffee.", correct: "keinen", options: ["keinen", "kein", "keine", "nicht"] },
  ],
};

const NICHT_SET = {
  id: "nicht",
  title: "nicht pozisyonu",
  title_tr: "nicht nereye gelir?",
  order: 2,
  examples: [
    { de: "Ich arbeite nicht heute.", tr: "Bugün çalışmıyorum." },
    { de: "Er kommt nicht.", tr: "Gelmiyor." },
    { de: "Sie wohnt nicht hier.", tr: "Burada oturmuyor." },
    { de: "Ich bin nicht müde.", tr: "Yorgun değilim." },
    { de: "Du lernst nicht Deutsch.", tr: "Almanca öğrenmiyorsun." },
    { de: "Er steht um 7 Uhr nicht auf.", tr: "Saat 7'de kalkmıyor." },
    { de: "Das ist nicht teuer.", tr: "Bu pahalı değil." },
    { de: "Ich verstehe das nicht.", tr: "Bunu anlamıyorum." },
  ],
  drills: [
    { ctx: "Ich arbeite ___ heute.", correct: "nicht", options: ["nicht", "kein", "keine", "keinen"], full: "Ich arbeite nicht heute." },
    { ctx: "Er kommt ___.", correct: "nicht", options: ["nicht", "kein", "keine", "keinen"], full: "Er kommt nicht." },
    { ctx: "Sie wohnt ___ hier.", correct: "nicht", options: ["nicht", "kein", "keine", "keinen"], full: "Sie wohnt nicht hier." },
    { ctx: "Ich bin ___ müde.", correct: "nicht", options: ["nicht", "kein", "keine", "keinen"], full: "Ich bin nicht müde." },
    { ctx: "Du lernst ___ Deutsch.", correct: "nicht", options: ["nicht", "kein", "keine", "keinen"], full: "Du lernst nicht Deutsch." },
    { ctx: "Er steht um 7 Uhr ___ auf.", correct: "nicht", options: ["nicht", "kein", "keine", "keinen"], full: "Er steht um 7 Uhr nicht auf." },
    { ctx: "Das ist ___ teuer.", correct: "nicht", options: ["nicht", "kein", "keine", "keinen"], full: "Das ist nicht teuer." },
    { ctx: "Ich verstehe das ___.", correct: "nicht", options: ["nicht", "kein", "keine", "keinen"], full: "Ich verstehe das nicht." },
  ],
};

function toSet(cfg) {
  return {
    id: cfg.id,
    title: cfg.title,
    title_tr: cfg.title_tr,
    order: cfg.order,
    examples: cfg.examples.map((ex, i) => ({
      id: `${cfg.id}-ex-${i}`,
      de: ex.de,
      tr: ex.tr,
      breakdown: [{ de: ex.de, tr: ex.tr, role: "phrase" }],
      noun: "",
      article: "der",
      plural: null,
    })),
    drills: cfg.drills.map((d, i) => ({
      id: `drill-${cfg.id}-${String(i + 1).padStart(2, "0")}`,
      type: cfg.id === "kein" ? "kein_form" : "nicht_position",
      prompt_tr: cfg.id === "kein" ? "Doğru kein formu" : "nicht nereye gelir?",
      context_de: d.ctx,
      options: d.options,
      correct_index: d.options.indexOf(d.correct),
      explanation_tr: d.full ? `Tam cümle: ${d.full}` : `Doğru: ${d.correct}`,
    })),
  };
}

const output = {
  version: "1.0.0",
  level: "A1",
  title: "Negation Trainer",
  titleTr: "Olumsuzluk (nicht / kein)",
  description: "kein/keine/keinen + nicht pozisyonu",
  passThreshold: 6,
  drillsPerSet: 8,
  rules: [
    { article: "kein", tr: "isim olumsuzluğu: kein/keine/keinen" },
    { article: "nicht", tr: "fiil/sıfat/zarf olumsuzluğu: nicht" },
  ],
  sets: [toSet(KEIN_SET), toSet(NICHT_SET)],
};

fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");
console.log(`✓ a1-negation.json — ${output.sets.length} sets → ${OUT}`);
