import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const core = JSON.parse(fs.readFileSync(path.join(ROOT, "data/grundlagen/a1-core.json"), "utf8"));
const patterns = JSON.parse(fs.readFileSync(path.join(ROOT, "data/grundlagen/a1-patterns.json"), "utf8"));

const pronouns = ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"];
const verbs = ["sein", "haben", "kommen", "wohnen", "arbeiten", "lernen", "machen", "gehen", "essen", "trinken", "sprechen"];
const forms = [
  "ich bin", "du bist", "er ist", "sie ist", "es ist",
  "ich habe", "du hast", "er hat",
  "ich komme", "du kommst", "er kommt",
];

function countInText(text, term) {
  const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\b${esc}\\b`, "gi");
  return (text.match(re) || []).length;
}

function collectTexts(obj, arr = []) {
  if (typeof obj === "string") arr.push(obj);
  else if (Array.isArray(obj)) obj.forEach((x) => collectTexts(x, arr));
  else if (obj && typeof obj === "object") Object.values(obj).forEach((x) => collectTexts(x, arr));
  return arr;
}

function moduleText(mod) {
  return collectTexts(mod).join(" ");
}

const satz = core.sentenceBuilder;
const pack = core.grammarPack;
const coreText = moduleText(core).toLowerCase();

const patTexts = [];
patterns.patterns.forEach((p) => {
  if (p.anchor) collectTexts(p.anchor, patTexts);
  p.examples.forEach((e) => {
    patTexts.push(e.de);
    collectTexts(e.breakdown, patTexts);
    collectTexts(e.quiz, patTexts);
  });
});
const patText = patTexts.join(" ");
const satzText = moduleText(satz);
const packText = moduleText(pack);

const report = {
  pronouns: {},
  verbs: {},
  forms: {},
  modules: { satz: {}, patterns: {}, grammarPack: {} },
  interactive: {},
};

pronouns.forEach((p) => {
  const inGrammar = core.grammar.pronouns.items.some((i) => i.de === p);
  const inCore = countInText(coreText, p) > 0;
  const inPat = countInText(patText, p) > 0;
  const inSatz = countInText(satzText, p) > 0;
  const inPack = countInText(packText, p) > 0;
  report.pronouns[p] = { inGrammar, inCore, inPat, inSatz, inPack };
});

verbs.forEach((v) => {
  const inSeinHaben = v === "sein" || v === "haben";
  const verbBlock = core.grammar.verbs.find((x) => x.infinitive === v);
  const inModals = core.grammar.modals?.some((m) => m.verb.includes(v));
  const conjugationTable = inSeinHaben
    ? core.grammar[v]?.conjugation
    : verbBlock?.forms;
  report.verbs[v] = {
    conjugationTable: !!conjugationTable,
    forms: conjugationTable?.map((f) => f.de) ?? [],
    inPatterns: patterns.patterns.some((p) => p.anchor?.infinitive === v || p.examples.some((e) => e.de.toLowerCase().includes(v))),
    coreMentions: countInText(coreText, v),
    patternMentions: countInText(patText, v),
  };
});

forms.forEach((f) => {
  report.forms[f] = {
    satz: countInText(satzText, f),
    patterns: countInText(patText, f),
    grammarPack: countInText(packText, f),
  };
  report.modules.satz[f] = report.forms[f].satz;
  report.modules.patterns[f] = report.forms[f].patterns;
  report.modules.grammarPack[f] = report.forms[f].grammarPack;
  report.interactive[f] = report.forms[f].satz + report.forms[f].patterns + report.forms[f].grammarPack > 0;
});

// sie (plural they) - check if distinguished
const sieItems = core.grammar.pronouns.items.filter((i) => i.de.toLowerCase() === "sie");
report.sieNote = {
  grammarEntries: sieItems.length,
  labels: sieItems.map((i) => i.tr),
  pluralTheyExplicit: sieItems.some((i) => i.tr.includes("onlar") || i.tr.includes("çoğul") && i.de === "sie"),
};

// Goethe A1 rough score
const goetheChecks = {
  pronouns8: pronouns.every((p) => report.pronouns[p].inGrammar || report.pronouns[p].inCore),
  pronounsPluralThey: false,
  seinFull: ["ich bin", "du bist", "er ist"].every((f) => report.interactive[f] || countInText(coreText, f) > 0),
  habenFull: ["ich habe", "du hast", "er hat"].every((f) => report.interactive[f] || countInText(coreText, f) > 0),
  kommenFull: ["ich komme", "du kommst", "er kommt"].every((f) => report.interactive[f] || countInText(coreText, f) > 0),
  verbs11: verbs.filter((v) => report.verbs[v].conjugationTable || report.verbs[v].inPatterns).length,
  machen: report.verbs.machen.conjugationTable || report.verbs.machen.patternMentions > 5,
  gehen: report.verbs.gehen.conjugationTable || report.verbs.gehen.patternMentions > 5,
  essenTrinkenSprechen: ["essen", "trinken", "sprechen"].every((v) => report.verbs[v].conjugationTable || report.verbs[v].inPatterns),
  patternTrainer: patterns.patterns.length >= 40,
  sentenceBuilder: satz.exercises.length >= 30,
  grammarPack: pack.sections.length >= 5,
};

const weights = {
  pronouns8: 10,
  pronounsPluralThey: 5,
  seinFull: 10,
  habenFull: 10,
  kommenFull: 8,
  verbs11: 15,
  machen: 5,
  gehen: 5,
  essenTrinkenSprechen: 10,
  patternTrainer: 12,
  sentenceBuilder: 10,
  grammarPack: 10,
};

let score = 0;
let max = 0;
for (const [k, w] of Object.entries(weights)) {
  max += w;
  const val = goetheChecks[k];
  if (val === true) score += w;
  else if (typeof val === "number") score += Math.min(w, (val / 11) * w);
}
report.goetheA1CompatibilityPct = Math.round((score / max) * 100);
report.goetheChecks = goetheChecks;

console.log(JSON.stringify(report, null, 2));
