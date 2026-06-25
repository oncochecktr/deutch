/**
 * Kelime × kalıp snapshot testi — node scripts/test-word-patterns.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createWordPatternEngine, buildSentence } from "./lib/wordPatternSlots.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const vocab = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/a1/vocabulary.json"), "utf8")
);
const wordPatterns = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/a1/word-patterns.json"), "utf8")
);

const engine = createWordPatternEngine(vocab.words);

function findWord(term) {
  return vocab.words.find((w) => w.word.toLowerCase() === term.toLowerCase());
}

function assert(name, ok, detail = "") {
  console.log(ok ? "✓" : "✗", name, detail);
  if (!ok) process.exitCode = 1;
}

const arbeit = findWord("Arbeit");
const brot = findWord("Brot");
const lernen = findWord("lernen");

assert("Arbeit bulundu", !!arbeit);
assert("Brot bulundu", !!brot);
assert("lernen bulundu", !!lernen);

const arbeitPatterns = wordPatterns.entries[arbeit?.id]?.patterns ?? [];
assert(
  "Arbeit ich-bin içermez",
  !arbeitPatterns.some((p) => p.patternId === "ich-bin"),
  `(${arbeitPatterns.map((p) => p.patternId).join(", ")})`
);
assert(
  "Arbeit ich-habe içerir",
  arbeitPatterns.some((p) => p.patternId === "ich-habe"),
  arbeitPatterns.find((p) => p.patternId === "ich-habe")?.de
);

const brotEntry = wordPatterns.entries[brot?.id];
assert(
  "Brot das-ist",
  !!brotEntry?.patterns.some((p) => p.patternId === "das-ist" && p.de.includes("Brot")),
  brotEntry?.patterns.find((p) => p.patternId === "das-ist")?.de
);

const lernenEntry = wordPatterns.entries[lernen?.id];
assert(
  "lernen ich-kann",
  !!lernenEntry?.patterns.some((p) => p.patternId === "ich-kann"),
  lernenEntry?.patterns.find((p) => p.patternId === "ich-kann")?.tr
);

const coverage = engine.patternCoverage();
assert("ich-habe coverage > 50", coverage["ich-habe"] > 50, String(coverage["ich-habe"]));
assert("word-patterns totalWords > 400", wordPatterns.totalWords > 400, String(wordPatterns.totalWords));

const sent = buildSentence(brot, "das-ist");
assert("buildSentence Brot", sent?.de === "Das ist ein Brot.", sent?.de);

console.log(process.exitCode ? "\nFAILED" : "\nAll word-pattern checks passed.");
