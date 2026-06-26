/**
 * A1 vocabulary audio_word yollarını düzelt — çok kelimeli ifadeler için tam slug
 * node scripts/fix-a1-audio-paths.mjs [--write]
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const VOCAB = join(__dir, "../data/a1/vocabulary.json");
const WRITE = process.argv.includes("--write");

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

function speakWord(w) {
  return w.article ? `${w.article} ${w.word}` : w.word;
}

const pack = JSON.parse(readFileSync(VOCAB, "utf8"));
const pathOwners = new Map();
let fixed = 0;
const fixes = [];

for (const w of pack.words) {
  const speak = speakWord(w);
  let base = slug(w.word);
  if (!base) base = slug(speak);
  let audioWord = `/audio/a1/${base}.mp3`;

  const owner = pathOwners.get(audioWord);
  if (owner && owner.speak !== speak) {
    const withId = `/audio/a1/${base}-${w.id.replace(/^a1_/, "")}.mp3`;
    if (pathOwners.has(withId) && pathOwners.get(withId).speak !== speak) {
      audioWord = `/audio/a1/${slug(speak)}.mp3`;
    } else {
      audioWord = withId;
    }
  }

  const exSlug = slug(w.example_de.slice(0, 80));
  const audioExample = `/audio/a1/${exSlug}.mp3`;

  if (w.audio_word !== audioWord || w.audio_example !== audioExample) {
    fixes.push({
      id: w.id,
      word: w.word,
      oldWord: w.audio_word,
      newWord: audioWord,
      speak,
    });
    w.audio_word = audioWord;
    w.audio_example = audioExample;
    fixed++;
  }

  pathOwners.set(audioWord, { id: w.id, speak });
}

console.log(`Düzeltilecek kayıt: ${fixed}`);
fixes.slice(0, 15).forEach((f) => {
  console.log(`  ${f.id} ${f.word}: ${f.oldWord} → ${f.newWord}`);
});
if (fixes.length > 15) console.log(`  … +${fixes.length - 15} daha`);

const dupAfter = new Map();
for (const w of pack.words) {
  const o = pathOwners.get(w.audio_word);
  if (!dupAfter.has(w.audio_word)) dupAfter.set(w.audio_word, []);
  dupAfter.get(w.audio_word).push(w.word);
}
let badDups = 0;
for (const [p, words] of dupAfter) {
  const speaks = new Set(
    pack.words.filter((w) => w.audio_word === p).map((w) => speakWord(w))
  );
  if (speaks.size > 1) {
    badDups++;
    console.log(`Hâlâ çakışma: ${p} → ${[...speaks].join(" | ")}`);
  }
}
console.log(`Çakışan farklı metin: ${badDups}`);

if (WRITE) {
  writeFileSync(VOCAB, JSON.stringify(pack, null, 2) + "\n", "utf8");
  console.log("vocabulary.json güncellendi.");
} else {
  console.log("\nUygulamak için: node scripts/fix-a1-audio-paths.mjs --write");
}
