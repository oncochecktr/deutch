// A1 Dativ Trainer — run: npm run build:dativ
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../data/grundlagen/a1-dativ.json");

const SETS = [
  {
    id: "mit",
    title: "mit + Dativ",
    title_tr: "mit + Dativ",
    order: 1,
    examples: [
      { de: "Ich fahre mit dem Bus.", tr: "Otobüsle gidiyorum." },
      { de: "Ich komme mit meiner Mutter.", tr: "Annemle geliyorum." },
      { de: "Er spricht mit dem Lehrer.", tr: "Öğretmenle konuşuyor." },
      { de: "Wir essen mit der Familie.", tr: "Aileyle yemek yiyoruz." },
      { de: "Sie fährt mit dem Auto.", tr: "Arabayla gidiyor." },
      { de: "Ich gehe mit meinem Bruder.", tr: "Erkek kardeşimle gidiyorum." },
      { de: "Du kommst mit uns?", tr: "Bizimle geliyor musun?" },
      { de: "Er arbeitet mit dem Kollegen.", tr: "Meslektaşıyla çalışıyor." },
    ],
    drills: [
      { gap: "dem Bus", options: ["dem Bus", "den Bus", "der Bus", "das Bus"], correct: 0, ctx: "Ich fahre mit ___." },
      { gap: "meiner Mutter", options: ["meiner Mutter", "meine Mutter", "meinen Mutter", "meinem Mutter"], correct: 0, ctx: "Ich komme mit ___." },
      { gap: "dem Lehrer", options: ["dem Lehrer", "den Lehrer", "der Lehrer", "des Lehrer"], correct: 0, ctx: "Er spricht mit ___." },
      { gap: "der Familie", options: ["der Familie", "die Familie", "den Familie", "dem Familie"], correct: 0, ctx: "Wir essen mit ___." },
      { gap: "dem Auto", options: ["dem Auto", "das Auto", "den Auto", "der Auto"], correct: 0, ctx: "Sie fährt mit ___." },
      { gap: "meinem Bruder", options: ["meinem Bruder", "meinen Bruder", "meiner Bruder", "mein Bruder"], correct: 0, ctx: "Ich gehe mit ___." },
      { gap: "uns", options: ["uns", "wir", "unser", "unseren"], correct: 0, ctx: "Kommst du mit ___?" },
      { gap: "dem Kollegen", options: ["dem Kollegen", "den Kollegen", "der Kollegen", "des Kollegen"], correct: 0, ctx: "Er arbeitet mit ___." },
    ],
  },
  {
    id: "bei",
    title: "bei + Dativ",
    title_tr: "bei + Dativ",
    order: 2,
    examples: [
      { de: "Ich bin bei meiner Schwester.", tr: "Kız kardeşimin yanındayım." },
      { de: "Er wohnt bei seinen Eltern.", tr: "Ailesinin yanında oturuyor." },
      { de: "Sie arbeitet bei der Firma.", tr: "Şirkette çalışıyor." },
      { de: "Wir sind bei Freunden.", tr: "Arkadaşların yanındayız." },
      { de: "Ich esse bei meiner Oma.", tr: "Büyükannemde yemek yiyorum." },
      { de: "Du bist bei mir?", tr: "Benim yanında mısın?" },
      { de: "Er ist beim Arzt.", tr: "Doktorda." },
      { de: "Sie ist bei der Arbeit.", tr: "İşte." },
    ],
    drills: [
      { gap: "meiner Schwester", options: ["meiner Schwester", "meine Schwester", "meinen Schwester", "meinem Schwester"], correct: 0, ctx: "Ich bin bei ___." },
      { gap: "seinen Eltern", options: ["seinen Eltern", "seine Eltern", "sein Eltern", "seiner Eltern"], correct: 0, ctx: "Er wohnt bei ___." },
      { gap: "der Firma", options: ["der Firma", "die Firma", "den Firma", "dem Firma"], correct: 0, ctx: "Sie arbeitet bei ___." },
      { gap: "Freunden", options: ["Freunden", "Freunde", "Freundes", "Freund"], correct: 0, ctx: "Wir sind bei ___." },
      { gap: "meiner Oma", options: ["meiner Oma", "meine Oma", "meinen Oma", "meinem Oma"], correct: 0, ctx: "Ich esse bei ___." },
      { gap: "mir", options: ["mir", "ich", "mich", "mein"], correct: 0, ctx: "Bist du bei ___?" },
      { gap: "beim Arzt", options: ["beim Arzt", "bei den Arzt", "bei der Arzt", "beim Arzten"], correct: 0, ctx: "Er ist ___." },
      { gap: "der Arbeit", options: ["der Arbeit", "die Arbeit", "den Arbeit", "dem Arbeit"], correct: 0, ctx: "Sie ist bei ___." },
    ],
  },
  {
    id: "in",
    title: "in + Dativ",
    title_tr: "in der / in dem",
    order: 3,
    examples: [
      { de: "Ich wohne in der Stadt.", tr: "Şehirde oturuyorum." },
      { de: "Er ist in der Schule.", tr: "Okulda." },
      { de: "Sie arbeitet in dem Büro.", tr: "Ofiste çalışıyor." },
      { de: "Wir sind in der Küche.", tr: "Mutfaktayız." },
      { de: "Ich bin in der Türkei.", tr: "Türkiye'deyim." },
      { de: "Du bist im Krankenhaus.", tr: "Hastanedesin." },
      { de: "Er lernt in der Bibliothek.", tr: "Kütüphanede öğreniyor." },
      { de: "Sie wohnt in dem Haus.", tr: "Evde oturuyor." },
    ],
    drills: [
      { gap: "der Stadt", options: ["der Stadt", "die Stadt", "den Stadt", "dem Stadt"], correct: 0, ctx: "Ich wohne in ___." },
      { gap: "der Schule", options: ["der Schule", "die Schule", "den Schule", "dem Schule"], correct: 0, ctx: "Er ist in ___." },
      { gap: "dem Büro", options: ["dem Büro", "das Büro", "den Büro", "der Büro"], correct: 0, ctx: "Sie arbeitet in ___." },
      { gap: "der Küche", options: ["der Küche", "die Küche", "den Küche", "dem Küche"], correct: 0, ctx: "Wir sind in ___." },
      { gap: "der Türkei", options: ["der Türkei", "die Türkei", "den Türkei", "dem Türkei"], correct: 0, ctx: "Ich bin in ___." },
      { gap: "im Krankenhaus", options: ["im Krankenhaus", "in den Krankenhaus", "in der Krankenhaus", "ins Krankenhaus"], correct: 0, ctx: "Du bist ___." },
      { gap: "der Bibliothek", options: ["der Bibliothek", "die Bibliothek", "den Bibliothek", "dem Bibliothek"], correct: 0, ctx: "Er lernt in ___." },
      { gap: "dem Haus", options: ["dem Haus", "das Haus", "den Haus", "der Haus"], correct: 0, ctx: "Sie wohnt in ___." },
    ],
  },
  {
    id: "zu",
    title: "zu + Dativ",
    title_tr: "zu / nach Hause",
    order: 4,
    examples: [
      { de: "Ich gehe nach Hause.", tr: "Eve gidiyorum." },
      { de: "Er fährt zum Arzt.", tr: "Doktora gidiyor." },
      { de: "Sie kommt zur Arbeit.", tr: "İşe geliyor." },
      { de: "Wir gehen zur Schule.", tr: "Okula gidiyoruz." },
      { de: "Ich fahre zu meiner Mutter.", tr: "Anneme gidiyorum." },
      { de: "Du gehst zum Supermarkt.", tr: "Süpermarkete gidiyorsun." },
      { de: "Er ist zu Hause.", tr: "Evde." },
      { de: "Sie fährt zur Bank.", tr: "Bankaya gidiyor." },
    ],
    drills: [
      { gap: "nach Hause", options: ["nach Hause", "zu Hause", "in Hause", "dem Hause"], correct: 0, ctx: "Ich gehe ___." },
      { gap: "zum Arzt", options: ["zum Arzt", "den Arzt", "der Arzt", "am Arzt"], correct: 0, ctx: "Er fährt ___." },
      { gap: "zur Arbeit", options: ["zur Arbeit", "die Arbeit", "den Arbeit", "am Arbeit"], correct: 0, ctx: "Sie kommt ___." },
      { gap: "zur Schule", options: ["zur Schule", "die Schule", "den Schule", "in Schule"], correct: 0, ctx: "Wir gehen ___." },
      { gap: "zu meiner Mutter", options: ["zu meiner Mutter", "zu meine Mutter", "zu meinen Mutter", "nach meiner Mutter"], correct: 0, ctx: "Ich fahre ___." },
      { gap: "zum Supermarkt", options: ["zum Supermarkt", "den Supermarkt", "in Supermarkt", "am Supermarkt"], correct: 0, ctx: "Du gehst ___." },
      { gap: "zu Hause", options: ["zu Hause", "nach Hause", "in Hause", "dem Hause"], correct: 0, ctx: "Er ist ___." },
      { gap: "zur Bank", options: ["zur Bank", "die Bank", "den Bank", "am Bank"], correct: 0, ctx: "Sie fährt ___." },
    ],
  },
];

const sets = SETS.map((s) => ({
  id: s.id,
  title: s.title,
  title_tr: s.title_tr,
  order: s.order,
  examples: s.examples.map((ex, i) => ({
    id: `${s.id}-ex-${i}`,
    de: ex.de,
    tr: ex.tr,
    breakdown: [{ de: ex.de, tr: ex.tr, role: "phrase" }],
    noun: "",
    article: "der",
    plural: null,
  })),
  drills: s.drills.map((d, i) => ({
    id: `drill-${s.id}-${String(i + 1).padStart(2, "0")}`,
    type: "sentence_gap",
    prompt_tr: "Doğru Dativ formunu seç",
    context_de: d.ctx.replace("___", "___"),
    options: d.options,
    correct_index: d.correct,
    explanation_tr: `Doğru: ${d.gap}`,
  })),
}));

const output = {
  version: "1.0.0",
  level: "A1",
  title: "Dativ Trainer",
  titleTr: "Dativ temel kalıplar",
  description: "mit · bei · in · zu/nach — A1 sabit kalıplar",
  passThreshold: 6,
  drillsPerSet: 8,
  rules: [
    { article: "mit", tr: "mit + dem/der/mir …" },
    { article: "bei", tr: "bei + Dativ (yanında)" },
    { article: "in", tr: "in der / in dem (içinde)" },
    { article: "zu", tr: "zu/zur/zum, nach Hause" },
  ],
  sets,
};

fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");
console.log(`✓ a1-dativ.json — ${sets.length} sets → ${OUT}`);
