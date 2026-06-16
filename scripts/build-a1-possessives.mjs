// A1 Possessive Trainer — run: npm run build:possessives
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "data/grundlagen/a1-possessives.json");

const vocab = JSON.parse(fs.readFileSync(path.join(ROOT, "data/a1/vocabulary.json"), "utf8"));
const artRef = JSON.parse(fs.readFileSync(path.join(ROOT, "data/a1/article-reference.json"), "utf8"));

const wordMap = {};
for (const w of vocab.words) wordMap[w.word.toLowerCase()] = w;
for (const e of Object.values(artRef.entries)) {
  if (!wordMap[e.word.toLowerCase()]) {
    wordMap[e.word.toLowerCase()] = { word: e.word, article: e.article, translation_tr: e.word };
  } else if (e.article) {
    wordMap[e.word.toLowerCase()].article = e.article;
  }
}

const EXTRA_WORDS = {
  Hotel: { article: "das", translation_tr: "otel" },
  Mann: { article: "der", translation_tr: "adam / koca" },
};
for (const [w, meta] of Object.entries(EXTRA_WORDS)) {
  wordMap[w.toLowerCase()] = { word: w, ...meta };
}

function tr(word) {
  return wordMap[word.toLowerCase()]?.translation_tr ?? word;
}

function articleOf(word, slotArticle) {
  if (slotArticle) return slotArticle;
  return wordMap[word.toLowerCase()]?.article ?? "der";
}

const OWNERS = [
  { id: "mein", owner: "mein", owner_tr: "benim", masc_neut: "mein", fem_pl: "meine", order: 1 },
  { id: "dein", owner: "dein", owner_tr: "senin", masc_neut: "dein", fem_pl: "deine", order: 2 },
  { id: "sein", owner: "sein", owner_tr: "onun (erkek)", masc_neut: "sein", fem_pl: "seine", order: 3 },
  { id: "ihr", owner: "ihr", owner_tr: "onun (kadın)", masc_neut: "ihr", fem_pl: "ihre", order: 4 },
  { id: "unser", owner: "unser", owner_tr: "bizim", masc_neut: "unser", fem_pl: "unsere", order: 5 },
  { id: "euer", owner: "euer", owner_tr: "sizin (çoğul)", masc_neut: "euer", fem_pl: "eure", order: 6 },
];

const JOBS = [
  { de: "Lehrerin", tr: "öğretmen (kadın)" },
  { de: "Bäcker", tr: "fırıncı" },
  { de: "Arzt", tr: "doktor" },
  { de: "Ärztin", tr: "doktor (kadın)" },
  { de: "Student", tr: "öğrenci" },
  { de: "Koch", tr: "aşçı" },
  { de: "Krankenschwester", tr: "hemşire" },
  { de: "Verkäufer", tr: "satıcı" },
];

const NAMES = ["Anna", "David", "Maria", "Timur", "Lisa", "Ali", "Emma", "Mehmet"];

const NOUN_SLOTS = [
  { word: "Sohn", jobIdx: 1 },
  { word: "Schwester", jobIdx: 0 },
  { word: "Mutter", jobIdx: null },
  { word: "Hotel", jobIdx: null, article: "das" },
  { word: "Kind", jobIdx: null },
  { word: "Familie", jobIdx: null },
  { word: "Bruder", jobIdx: 3 },
  { word: "Mann", jobIdx: null, article: "der" },
];

function possessiveForm(owner, article) {
  return article === "die" ? owner.fem_pl : owner.masc_neut;
}

function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildBreakdown(name, poss, noun, job, owner, art) {
  const parts = [];
  if (name) parts.push({ de: name, tr: name, role: "name" });
  parts.push({ de: "ist", tr: "mi / …dır", role: "verb" });
  parts.push({
    de: poss,
    tr: `${owner.owner_tr} (${art === "die" ? "die → " + owner.fem_pl : "der/das → " + owner.masc_neut})`,
    role: "possessive",
  });
  parts.push({ de: noun, tr: tr(noun), role: "noun" });
  if (job) parts.push({ de: job.de, tr: job.tr, role: "job" });
  return parts;
}

function buildExample(owner, slot, idx, useQuestion) {
  const noun = slot.word;
  const art = articleOf(noun, slot.article);
  const poss = possessiveForm(owner, art);
  const name = NAMES[idx % NAMES.length];
  const job = slot.jobIdx !== null ? JOBS[slot.jobIdx] : null;

  let de;
  let trSent;
  if (useQuestion && job) {
    de = `${name}, ist ${poss} ${noun} ${job.de}?`;
    trSent = `${name}, ${owner.owner_tr} ${tr(noun).toLowerCase()} ${job.tr} mi?`;
  } else if (job) {
    de = `${poss.charAt(0).toUpperCase() + poss.slice(1)} ${noun} ist ${job.de}.`;
    trSent = `${owner.owner_tr} ${tr(noun).toLowerCase()} ${job.tr}.`;
  } else {
    de = `${poss.charAt(0).toUpperCase() + poss.slice(1)} ${noun} ist nett.`;
    trSent = `${owner.owner_tr} ${tr(noun).toLowerCase()} nazik.`;
  }

  return {
    id: `${owner.id}-ex-${idx}`,
    de,
    tr: trSent,
    breakdown: buildBreakdown(useQuestion && job ? name : null, poss, noun, job, owner, art),
    noun,
    article: art,
    owner: owner.id,
    possessive_form: poss,
  };
}

function buildDrills(owner, examples, setOrder) {
  const allForms = [owner.masc_neut, owner.fem_pl];
  const wrong = OWNERS.filter((o) => o.id !== owner.id).flatMap((o) => [o.masc_neut, o.fem_pl]);
  const drills = [];

  examples.forEach((ex, i) => {
    if (i >= 8) return;
    const type = i % 3 === 0 ? "pick_form" : i % 3 === 1 ? "sentence_gap" : "article_match";
    const correct = ex.possessive_form;
    const distractors = shuffle(
      [...allForms.filter((f) => f !== correct), ...wrong].slice(0, 3),
      setOrder * 10 + i
    );
    const options = shuffle([correct, ...distractors], i);
    while (options.length < 4) options.push(allForms[0]);

    let context_de;
    let prompt_tr;
    if (type === "pick_form") {
      context_de = `___ ${ex.noun} (${ex.article})`;
      prompt_tr = `${tr(ex.noun)} — ${ex.article} → hangi sahiplik?`;
    } else if (type === "sentence_gap") {
      context_de = ex.de.replace(ex.possessive_form, "___");
      prompt_tr = `Boşluğu doldur (${owner.owner_tr})`;
    } else {
      context_de = `${ex.article} ${ex.noun} → ?`;
      prompt_tr = `Artikel eşleştir: ${ex.article} ${ex.noun}`;
    }

    drills.push({
      id: `drill-${owner.id}-${String(i + 1).padStart(2, "0")}`,
      type,
      prompt_tr,
      context_de,
      options: options.slice(0, 4),
      correct_index: options.indexOf(correct) >= 0 ? options.indexOf(correct) : 0,
      explanation_tr: `${ex.article} → ${correct} (${owner.owner_tr})`,
    });
  });

  return drills;
}

const rules = OWNERS.map((o) => ({
  owner: o.id,
  owner_tr: o.owner_tr,
  masc_neut: o.masc_neut,
  fem_pl: o.fem_pl,
}));

const sets = OWNERS.map((owner) => {
  const examples = NOUN_SLOTS.map((slot, i) => buildExample(owner, slot, i, i < 4));
  const drills = buildDrills(owner, examples, owner.order);
  return {
    id: owner.id,
    owner: owner.id,
    owner_tr: owner.owner_tr,
    masc_neut: owner.masc_neut,
    fem_pl: owner.fem_pl,
    order: owner.order,
    examples,
    drills,
  };
});

function validate(data) {
  if (data.sets.length !== 6) throw new Error("Expected 6 sets");
  const ids = new Set();
  for (const s of data.sets) {
    if (s.examples.length !== 8) throw new Error(`${s.id}: need 8 examples`);
    if (s.drills.length !== 8) throw new Error(`${s.id}: need 8 drills`);
    for (const e of s.examples) {
      if (ids.has(e.id)) throw new Error(`Duplicate ${e.id}`);
      ids.add(e.id);
    }
  }
}

const output = {
  version: "1.0.0",
  level: "A1",
  title: "Possessive Trainer",
  titleTr: "Sahiplik Zamirleri (Possessivartikel)",
  description: "der/die/das → mein/deine — 6 sahip × 8 örnek + drill",
  passThreshold: 6,
  drillsPerSet: 8,
  rules,
  sets,
};

validate(output);
fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");
console.log(`✓ a1-possessives.json — ${output.sets.length} sets, ${output.sets.length * 8} examples → ${OUT}`);
