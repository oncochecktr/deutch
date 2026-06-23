// A1 Prepositions Trainer — run: npm run build:prepositions
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../data/grundlagen/a1-prepositions.json");

const PREP_SETS = [
  {
    id: "in",
    title: "in",
    title_tr: "in (içinde / -de)",
    order: 1,
    phrases: [
      ["Ich wohne in Berlin.", "Berlin'de oturuyorum."],
      ["Er ist in der Schule.", "Okulda."],
      ["Wir sind in der Türkei.", "Türkiye'deyiz."],
      ["Sie arbeitet in dem Büro.", "Ofiste çalışıyor."],
      ["Das Buch ist in der Tasche.", "Kitap çantada."],
    ],
    drills: [
      ["Ich wohne ___ Berlin.", "in", ["in", "auf", "an", "bei"]],
      ["Er ist ___ der Schule.", "in der", ["in der", "in den", "auf der", "an der"]],
      ["Wir sind ___ der Türkei.", "in der", ["in der", "in den", "auf der", "bei der"]],
      ["Sie arbeitet ___ dem Büro.", "in dem", ["in dem", "in den", "auf dem", "an dem"]],
      ["Das ist ___ der Küche.", "in der", ["in der", "in den", "auf der", "an der"]],
    ],
  },
  {
    id: "auf",
    title: "auf",
    title_tr: "auf (üstünde)",
    order: 2,
    phrases: [
      ["Das Buch liegt auf dem Tisch.", "Kitap masanın üstünde."],
      ["Die Katze ist auf dem Sofa.", "Kedi kanepenin üstünde."],
      ["Ich stelle die Tasse auf den Tisch.", "Bardağı masaya koyuyorum."],
      ["Er sitzt auf dem Stuhl.", "Sandalyede oturuyor."],
      ["Wir treffen uns auf dem Platz.", "Meydanda buluşuyoruz."],
    ],
    drills: [
      ["Das Buch liegt ___ dem Tisch.", "auf dem", ["auf dem", "in dem", "an dem", "bei dem"]],
      ["Die Katze ist ___ dem Sofa.", "auf dem", ["auf dem", "in dem", "an dem", "bei dem"]],
      ["Ich stelle es ___ den Tisch.", "auf den", ["auf den", "in den", "an den", "bei den"]],
      ["Er sitzt ___ dem Stuhl.", "auf dem", ["auf dem", "in dem", "an dem", "bei dem"]],
      ["Wir sind ___ dem Platz.", "auf dem", ["auf dem", "in dem", "an dem", "bei dem"]],
    ],
  },
  {
    id: "an",
    title: "an",
    title_tr: "an (yanında / -de)",
    order: 3,
    phrases: [
      ["Ich bin an der Haltestelle.", "Duraktayım."],
      ["Das Bild hängt an der Wand.", "Resim duvarda."],
      ["Er steht an der Tür.", "Kapının yanında duruyor."],
      ["Wir warten an der Ecke.", "Köşede bekliyoruz."],
      ["Sie ist an der Kasse.", "Kasada."],
    ],
    drills: [
      ["Ich bin ___ der Haltestelle.", "an der", ["an der", "in der", "auf der", "bei der"]],
      ["Das Bild hängt ___ der Wand.", "an der", ["an der", "in der", "auf der", "bei der"]],
      ["Er steht ___ der Tür.", "an der", ["an der", "in der", "auf der", "bei der"]],
      ["Wir warten ___ der Ecke.", "an der", ["an der", "in der", "auf der", "bei der"]],
      ["Sie ist ___ der Kasse.", "an der", ["an der", "in der", "auf der", "bei der"]],
    ],
  },
  {
    id: "bei",
    title: "bei",
    title_tr: "bei (yanında / -de)",
    order: 4,
    phrases: [
      ["Ich bin bei meiner Mutter.", "Annemin yanındayım."],
      ["Er arbeitet bei der Firma.", "Şirkette çalışıyor."],
      ["Wir essen bei Freunden.", "Arkadaşlarda yemek yiyoruz."],
      ["Sie wohnt bei ihren Eltern.", "Ailesinin yanında oturuyor."],
      ["Du bist bei mir.", "Benim yanındasın."],
    ],
    drills: [
      ["Ich bin ___ meiner Mutter.", "bei meiner", ["bei meiner", "in meiner", "an meiner", "auf meiner"]],
      ["Er arbeitet ___ der Firma.", "bei der", ["bei der", "in der", "an der", "auf der"]],
      ["Wir essen ___ Freunden.", "bei", ["bei", "in", "an", "auf"]],
      ["Sie wohnt ___ ihren Eltern.", "bei", ["bei", "in", "an", "auf"]],
      ["Du bist ___ mir.", "bei", ["bei", "in", "an", "mit"]],
    ],
  },
  {
    id: "mit",
    title: "mit",
    title_tr: "mit (ile)",
    order: 5,
    phrases: [
      ["Ich fahre mit dem Bus.", "Otobüsle gidiyorum."],
      ["Er kommt mit seiner Schwester.", "Kız kardeşiyle geliyor."],
      ["Wir sprechen mit dem Lehrer.", "Öğretmenle konuşuyoruz."],
      ["Sie geht mit dem Hund.", "Köpekle gidiyor."],
      ["Ich esse mit der Familie.", "Aileyle yemek yiyorum."],
    ],
    drills: [
      ["Ich fahre ___ dem Bus.", "mit dem", ["mit dem", "in dem", "an dem", "bei dem"]],
      ["Er kommt ___ seiner Schwester.", "mit", ["mit", "in", "an", "bei"]],
      ["Wir sprechen ___ dem Lehrer.", "mit dem", ["mit dem", "in dem", "an dem", "bei dem"]],
      ["Sie geht ___ dem Hund.", "mit dem", ["mit dem", "in dem", "an dem", "bei dem"]],
      ["Ich esse ___ der Familie.", "mit der", ["mit der", "in der", "an der", "bei der"]],
    ],
  },
];

const sets = PREP_SETS.map((p) => ({
  id: p.id,
  title: p.title,
  title_tr: p.title_tr,
  order: p.order,
  examples: p.phrases.map(([de, tr], i) => ({
    id: `${p.id}-ex-${i}`,
    de,
    tr,
    breakdown: [{ de, tr, role: "phrase" }],
    noun: "",
    article: "der",
    plural: null,
  })),
  drills: p.drills.map(([ctx, correct, options], i) => ({
    id: `drill-${p.id}-${String(i + 1).padStart(2, "0")}`,
    type: "prep_gap",
    prompt_tr: `Doğru edat: ${p.title}`,
    context_de: ctx,
    options,
    correct_index: options.indexOf(correct),
    explanation_tr: `Doğru: ${correct}`,
  })),
}));

const output = {
  version: "1.0.0",
  level: "A1",
  title: "Prepositions Trainer",
  titleTr: "Yer edatları",
  description: "in · auf · an · bei · mit — A1 kalıplar",
  passThreshold: 4,
  drillsPerSet: 5,
  rules: PREP_SETS.map((p) => ({ article: p.title, tr: p.title_tr })),
  sets,
};

fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");
console.log(`✓ a1-prepositions.json — ${sets.length} sets → ${OUT}`);
