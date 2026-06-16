/**
 * A2 kelime paketi (~400+ kelime)
 * node scripts/build-a2.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { A2_NEW_WORDS } from "./a2-seed.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, "../data/a2/vocabulary.json");
const A1_PATH = join(__dir, "../data/a1/vocabulary.json");

const CATEGORIES_A2 = [
  "Seyahat",
  "Alışveriş & Hizmetler",
  "Sağlık",
  "İş & Kariyer",
  "Günlük rutin",
  "Hava & Doğa",
  "Duygular",
  "Geçmiş zaman",
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
  const base = slug(word.split(" ").pop() ?? word);
  return {
    id: `a2_${String(id).padStart(4, "0")}`,
    level: "A2",
    category,
    word,
    article: article ?? null,
    plural: plural ?? null,
    translation_tr: tr,
    translation_ru: ru,
    example_de: exDe,
    example_tr: exTr,
    audio_word: `/audio/a2/${base}.mp3`,
    audio_example: `/audio/a2/${slug(exDe.slice(0, 40))}.mp3`,
    tags: [...tags, "a2"],
  };
}

const a1 = JSON.parse(readFileSync(A1_PATH, "utf8"));
let id = 1;
const words = [];

const a1Slice = a1.words.slice(100, 420);
for (const w of a1Slice) {
  const cat = CATEGORIES_A2[id % CATEGORIES_A2.length];
  words.push({
    ...w,
    id: `a2_${String(id).padStart(4, "0")}`,
    level: "A2",
    category: cat,
    tags: [...w.tags.filter((t) => t !== "a1"), "a2", "review"],
    audio_word: `/audio/a2/${slug(w.word)}.mp3`,
    audio_example: `/audio/a2/${slug(w.example_de.slice(0, 40))}.mp3`,
  });
  id++;
}

for (const cat of CATEGORIES_A2) {
  const entries = A2_NEW_WORDS[cat] ?? [];
  for (const entry of entries) {
    words.push(buildWord(id++, cat, entry));
  }
}

const pack = {
  level: "A2",
  version: "1.0.0",
  total: words.length,
  categories: CATEGORIES_A2,
  words,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(pack, null, 2));
console.log(`A2 vocabulary: ${words.length} words → ${OUT}`);
