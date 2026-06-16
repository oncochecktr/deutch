/**
 * A1 article-reference.json üretici (ilk seed veya güncelleme)
 * node scripts/seed-article-reference.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const VOCAB_PATH = join(ROOT, "data/a1/vocabulary.json");
const OUT = join(ROOT, "data/a1/article-reference.json");

/** Bilinen doğrulamalar — referans çelişkisi kontrolü için */
const VERIFIED = {
  Salat: "der",
  Brot: "das",
  Wurst: "die",
  Butter: "die",
  Milch: "die",
  Wasser: "das",
  Käse: "der",
  Apfel: "der",
  Banane: "die",
  Tomate: "die",
  Kartoffel: "die",
  Reis: "der",
  Fisch: "der",
  Fleisch: "das",
  Ei: "das",
  Suppe: "die",
  Kaffee: "der",
  Tee: "der",
  Saft: "der",
};

const vocab = JSON.parse(readFileSync(VOCAB_PATH, "utf8"));
const entries = {};
const byWord = {};

for (const w of vocab.words) {
  if (!w.article) continue;
  const verified = VERIFIED[w.word];
  entries[w.id] = {
    id: w.id,
    word: w.word,
    article: w.article,
    verified: verified ? verified === w.article : false,
    category: w.category,
  };
  const key = w.word.toLowerCase();
  if (!byWord[key] || w.id < byWord[key].id) {
    byWord[key] = { id: w.id, article: w.article, word: w.word };
  }
}

for (const [word, expected] of Object.entries(VERIFIED)) {
  const key = word.toLowerCase();
  if (!byWord[key]) {
    byWord[key] = { id: null, article: expected, word, verifiedOnly: true };
  } else {
    byWord[key].expectedVerified = expected;
    byWord[key].verified = byWord[key].article === expected;
  }
}

const pack = {
  version: "1.0.0",
  source: "seed-from-vocabulary",
  generated: new Date().toISOString(),
  total: Object.keys(entries).length,
  verifiedSpotChecks: Object.keys(VERIFIED).length,
  entries,
  byWord,
};

writeFileSync(OUT, JSON.stringify(pack, null, 2));
console.log(`Article reference: ${pack.total} entries → ${OUT}`);
