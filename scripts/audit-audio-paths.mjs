/**
 * A1 audio_word çakışma denetimi
 * node scripts/audit-audio-paths.mjs
 */
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const VOCAB = join(__dir, "../data/a1/vocabulary.json");
const PUBLIC = join(__dir, "../apps/web/public");

function speakWord(w) {
  return w.article ? `${w.article} ${w.word}` : w.word;
}

function slug(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const pack = JSON.parse(readFileSync(VOCAB, "utf8"));
const byPath = new Map();
let mismatchDups = 0;
let missingMp3 = 0;

for (const w of pack.words) {
  const speak = speakWord(w);
  const expected = slug(speak);
  const file = w.audio_word.split("/").pop()?.replace(".mp3", "") ?? "";
  if (file !== expected && !w.audio_word.includes(w.id.replace("a1_", ""))) {
    console.log(`⚠ slug uyumsuz ${w.id} ${w.word}: dosya=${file} beklenen=${expected}`);
  }
  if (!byPath.has(w.audio_word)) byPath.set(w.audio_word, []);
  byPath.get(w.audio_word).push({ word: w.word, speak });
  const disk = join(PUBLIC, w.audio_word.replace(/^\//, ""));
  if (!existsSync(disk)) missingMp3++;
}

for (const [p, items] of byPath) {
  const speaks = new Set(items.map((i) => i.speak));
  if (speaks.size > 1) {
    mismatchDups++;
    console.log(`✗ Çakışma ${p}:`, [...speaks].join(" | "));
  }
}

console.log(`\nKelime: ${pack.words.length}`);
console.log(`Çakışan farklı metin: ${mismatchDups}`);
console.log(`Eksik MP3: ${missingMp3}`);
process.exit(mismatchDups > 0 ? 1 : 0);
