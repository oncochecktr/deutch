/**
 * 500 A1 kelime JSON üretici
 * node scripts/build-a1-500.mjs
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { SEED } from "./a1-seed-part1.mjs";
import { SEED_PART2 } from "./a1-seed-part2.mjs";
import { SEED_PART3 } from "./a1-seed-part3.mjs";
import { GOETHE_FORM_WORDS } from "./a1-seed-goethe-form.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, "../data/a1/vocabulary.json");

const ALL_SEED = { ...SEED, ...SEED_PART2, ...SEED_PART3 };
ALL_SEED["Form doldurma"] = [
  ...(ALL_SEED["Form doldurma"] ?? []),
  ...GOETHE_FORM_WORDS,
];

const CATEGORIES = [
  "Selamlama", "Tanışma", "Aile", "Ev", "Market", "İş", "Ulaşım",
  "Saat", "Tarih", "Doktor", "Restoran", "Telefon", "Form doldurma",
  "Günlük ihtiyaçlar", "Basit yön tarifleri",
];

function slug(s) {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildWord(id, category, entry) {
  const [word, article, plural, tr, ru, exDe, exTr, tags] = entry;
  const base = slug(word.split(" ")[0]);
  return {
    id: `a1_${String(id).padStart(4, "0")}`,
    level: "A1",
    category,
    word,
    article: article ?? null,
    plural: plural ?? null,
    translation_tr: tr,
    translation_ru: ru,
    example_de: exDe,
    example_tr: exTr,
    audio_word: `/audio/a1/${base}.mp3`,
    audio_example: `/audio/a1/${slug(exDe.slice(0, 40))}.mp3`,
    tags: [...tags, "a1"],
  };
}

let id = 1;
const words = [];

for (const cat of CATEGORIES) {
  const entries = ALL_SEED[cat];
  if (!entries) {
    console.error(`Missing category: ${cat}`);
    process.exit(1);
  }
  for (const entry of entries) {
    words.push(buildWord(id++, cat, entry));
  }
}

const pack = {
  level: "A1",
  version: "2.0.0",
  total: words.length,
  categories: CATEGORIES,
  words,
};

writeFileSync(OUT, JSON.stringify(pack, null, 2), "utf8");
console.log(`✓ ${words.length} A1 kelime → ${OUT}`);

// Kategori dağılımı
const counts = {};
for (const w of words) counts[w.category] = (counts[w.category] || 0) + 1;
console.log("Kategori dağılımı:", counts);
