/**
 * gerceksinav.md ↔ A1/A2/B1 vocabulary audit
 * node scripts/audit-gerceksinav-vocab.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const TEXT_PATH = join(ROOT, "gerceksinav.md");
const OUT_PATH = join(__dir, "out", "gerceksinav-audit.json");

const LEVELS = ["a1", "a2"];

const SKIP = new Set([
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "einem", "einen", "eines",
  "und", "oder", "aber", "nicht", "ja", "nein", "doch", "so", "zu", "in", "im", "an", "auf",
  "aus", "bei", "mit", "von", "für", "um", "als", "wie", "was", "wer", "wo", "wann", "warum",
  "dass", "wenn", "weil", "denn", "noch", "auch", "nur", "schon", "mal", "hier", "dort", "da",
  "dann", "jetzt", "heute", "morgen", "gestern", "sehr", "ganz", "viel", "mehr", "mein", "meine",
  "meinen", "dein", "deine", "deinen", "sein", "seine", "seinen", "ihr", "ihre", "ihren", "sie",
  "er", "es", "ich", "du", "wir", "mich", "mir", "dir", "dich", "uns", "euch", "ihm", "ihn", "man",
  "sich", "ist", "sind", "war", "waren", "bin", "bist", "hat", "haben", "hab", "habe", "wird",
  "werden", "kann", "können", "muss", "müssen", "will", "wollen", "soll", "sollen", "darf",
  "dürfen", "mag", "mögen", "möchte", "gib", "gibt", "komm", "kommt", "komme", "geh", "geht",
  "gehe", "sag", "sagt", "sage", "mach", "macht", "mache", "lass", "lasst", "bitte", "danke",
  "hallo", "tschüs", "okay", "äh", "ähm", "na", "ach", "oh", "ah", "hmm", "psst", "pssst",
  "ne", "eh", "yeah", "thanks", "right", "girls", "love", "party", "room", "service", "super",
  "wow", "cool", "sorry", "ladies", "hi", "mmh", "tot", "real", "pass", "rot", "blau", "egal",
  "alle", "allem", "allen", "alles", "kein", "keine", "keinen", "keiner", "dieser", "diese",
  "dieses", "dies", "denn", "schon", "mal", "dich", "euch", "uns", "ihnen", "deren", "dessen",
]);

const NAMES = new Set([
  "sascha", "anna", "nic", "sam", "louis", "jo", "nadja", "brad", "pitt", "scott", "amerika",
  "berlin", "juli", "cha", "familie", "jo", "ami",
]);

function loadVocab() {
  const byLower = new Map();
  const byLevel = { A1: new Set(), A2: new Set(), B1: new Set() };
  for (const lv of LEVELS) {
    const data = JSON.parse(readFileSync(join(ROOT, "data", lv, "vocabulary.json"), "utf8"));
    for (const w of data.words) {
      const low = w.word.toLowerCase();
      byLower.set(low, { word: w.word, level: w.level, id: w.id, category: w.category });
      byLevel[w.level].add(low);
      for (const part of w.word.split(/[\s/\-]+/)) {
        if (part.length > 2) {
          byLower.set(part.toLowerCase(), { word: part, level: w.level, id: w.id, category: w.category });
        }
      }
    }
  }
  return byLower;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[„""''«»]/g, " ")
    .replace(/[^a-zäöüß\s'-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^['-]+|['-]+$/g, ""))
    .filter((t) => t.length > 2 && !SKIP.has(t) && !NAMES.has(t));
}

function findInVocab(token, byLower) {
  if (byLower.has(token)) return { match: token, entry: byLower.get(token) };

  const stems = [token];
  if (token.endsWith("ungen")) stems.push(token.slice(0, -2));
  if (token.endsWith("ung")) stems.push(token.slice(0, -3));
  if (token.endsWith("chen")) stems.push(token.slice(0, -4));
  if (token.endsWith("lein")) stems.push(token.slice(0, -4));
  if (token.endsWith("isch")) stems.push(token.slice(0, -4));
  if (token.endsWith("lich")) stems.push(token.slice(0, -4));
  if (token.endsWith("heit")) stems.push(token.slice(0, -4));
  if (token.endsWith("keit")) stems.push(token.slice(0, -4));
  if (token.endsWith("st")) stems.push(token.slice(0, -2), token.slice(0, -1));
  if (token.endsWith("en")) stems.push(token.slice(0, -2), token.slice(0, -1));
  if (token.endsWith("te")) stems.push(token.slice(0, -2), token.slice(0, -1));
  if (token.endsWith("t")) stems.push(token.slice(0, -1));
  if (token.endsWith("e")) stems.push(token.slice(0, -1));
  if (token.endsWith("er")) stems.push(token.slice(0, -2));
  if (token.endsWith("em")) stems.push(token.slice(0, -2));

  for (const s of stems) {
    if (s.length > 2 && byLower.has(s)) {
      return { match: s, entry: byLower.get(s), from: token };
    }
  }
  return null;
}

const text = readFileSync(TEXT_PATH, "utf8");
const byLower = loadVocab();
const tokens = tokenize(text);
const unique = [...new Set(tokens)].sort((a, b) => a.localeCompare(b, "de"));

const inVocab = [];
const missing = [];

for (const t of unique) {
  const found = findInVocab(t, byLower);
  if (found) inVocab.push({ token: t, ...found });
  else missing.push(t);
}

const report = {
  source: "gerceksinav.md",
  note: "Extra auf Deutsch — Sam aus Amerika bölümü transkripti",
  vocabLevels: LEVELS.map((l) => l.toUpperCase()),
  uniqueTokens: unique.length,
  inVocab: inVocab.length,
  missing: missing.length,
  coveragePct: Math.round((inVocab.length / unique.length) * 100),
  missingWords: missing,
  inVocabSample: inVocab.slice(0, 30),
  lineCountEstimate: text.split(/[.!?]+/).filter((s) => s.trim().length > 5).length,
  charCount: text.length,
};

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(report, null, 2), "utf8");

console.log("gerceksinav.md ↔ A1/A2/B1 vocabulary audit");
console.log("─".repeat(45));
console.log(`Benzersiz içerik kelimesi: ${report.uniqueTokens}`);
console.log(`Sözlükte var:              ${report.inVocab} (${report.coveragePct}%)`);
console.log(`Eksik:                     ${report.missing}`);
console.log(`Tahmini cümle/satır:       ~${report.lineCountEstimate}`);
console.log("");
if (missing.length) {
  console.log("Eksik kelimeler:");
  for (const w of missing) console.log(`  • ${w}`);
}
console.log(`\n→ ${OUT_PATH}`);
