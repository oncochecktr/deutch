// A1 Artikel Trainer — run: npm run build:articles
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "data/grundlagen/a1-articles.json");

const vocab = JSON.parse(fs.readFileSync(path.join(ROOT, "data/a1/vocabulary.json"), "utf8"));
const artRef = JSON.parse(fs.readFileSync(path.join(ROOT, "data/a1/article-reference.json"), "utf8"));

const wordMap = {};
for (const w of vocab.words) {
  if (w.article) wordMap[w.word.toLowerCase()] = w;
}
for (const e of Object.values(artRef.entries)) {
  if (!wordMap[e.word.toLowerCase()]) {
    wordMap[e.word.toLowerCase()] = {
      word: e.word,
      article: e.article,
      translation_tr: e.word,
      plural: null,
    };
  }
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

function pickWords(article, count, seed) {
  const pool = Object.values(wordMap).filter((w) => w.article === article);
  return shuffle(pool, seed).slice(0, count);
}

function einForm(article, caseType = "nom") {
  if (caseType === "akk") {
    if (article === "der") return "einen";
    if (article === "die") return "eine";
    return "ein";
  }
  if (article === "die") return "eine";
  return "ein";
}

function buildExamples(words, setId) {
  return words.slice(0, 8).map((w, i) => ({
    id: `${setId}-ex-${i}`,
    de: `${w.article} ${w.word}`,
    tr: w.translation_tr,
    breakdown: [
      { de: w.article, tr: `${w.article} artikel`, role: "article" },
      { de: w.word, tr: w.translation_tr, role: "noun" },
    ],
    noun: w.word,
    article: w.article,
    plural: w.plural ?? null,
  }));
}

function buildDrills(setId, examples, articleFilter, seed) {
  const articles = ["der", "die", "das"];
  const drills = [];

  examples.forEach((ex, i) => {
    if (i >= 10) return;
    const type = i % 3 === 0 ? "pick_article" : i % 3 === 1 ? "noun_gap" : "article_match";
    const correct =
      type === "pick_article"
        ? ex.article
        : type === "noun_gap"
          ? ex.article
          : ex.noun;
    const wrongArticles = articles.filter((a) => a !== ex.article);
    const wrongNouns = shuffle(
      Object.values(wordMap).filter((w) => w.article !== ex.article),
      seed + i
    )
      .slice(0, 3)
      .map((w) => w.word);

    let options;
    let context_de;
    let prompt_tr;

    if (type === "pick_article") {
      options = shuffle([ex.article, ...wrongArticles], seed + i);
      context_de = `___ ${ex.noun}`;
      prompt_tr = `"${ex.tr}" → hangi artikel?`;
    } else if (type === "noun_gap") {
      options = shuffle([ex.noun, ...wrongNouns.slice(0, 3)], seed + i);
      context_de = `${ex.article} ___`;
      prompt_tr = `${ex.article} + ? → ${ex.tr}`;
    } else {
      options = shuffle([ex.noun, ...wrongNouns.slice(0, 3)], seed + i);
      context_de = `${ex.article} ?`;
      prompt_tr = `Artikel eşleştir: ${ex.article} …`;
    }

    drills.push({
      id: `drill-${setId}-${String(i + 1).padStart(2, "0")}`,
      type,
      prompt_tr,
      context_de,
      options: options.slice(0, 4),
      correct_index: Math.max(0, options.indexOf(correct)),
      explanation_tr: `${ex.noun} → ${ex.article} (${ex.tr})`,
    });
  });

  return drills;
}

function buildEinDrills(seed) {
  const samples = [
    { noun: "Mann", article: "der", tr: "adam" },
    { noun: "Frau", article: "die", tr: "kadın" },
    { noun: "Kind", article: "das", tr: "çocuk" },
    { noun: "Apfel", article: "der", tr: "elma" },
    { noun: "Katze", article: "die", tr: "kedi" },
    { noun: "Brot", article: "das", tr: "ekmek" },
    { noun: "Hund", article: "der", tr: "köpek" },
    { noun: "Blume", article: "die", tr: "çiçek" },
  ];

  const examples = samples.map((s, i) => ({
    id: `ein-ex-${i}`,
    de: `${einForm(s.article)} ${s.noun}`,
    tr: `bir ${s.tr}`,
    breakdown: [
      { de: einForm(s.article), tr: "belirsiz artikel (Nom.)", role: "article" },
      { de: s.noun, tr: s.tr, role: "noun" },
    ],
    noun: s.noun,
    article: s.article,
    plural: null,
  }));

  const drills = samples.map((s, i) => {
    const nom = einForm(s.article, "nom");
    const akk = einForm(s.article, "akk");
    const isAkk = i % 2 === 1;
    const correct = isAkk ? akk : nom;
    const wrong = shuffle(
      ["ein", "eine", "einen", "einer"].filter((x) => x !== correct),
      seed + i
    ).slice(0, 3);
    const options = shuffle([correct, ...wrong], seed + i);
    return {
      id: `drill-ein-${String(i + 1).padStart(2, "0")}`,
      type: isAkk ? "ein_akk" : "ein_nom",
      prompt_tr: isAkk
        ? `Akkusativ: Ich kaufe ___ ${s.noun}.`
        : `Nominativ: Das ist ___ ${s.noun}.`,
      context_de: isAkk ? `Ich kaufe ___ ${s.noun}.` : `Das ist ___ ${s.noun}.`,
      options: options.slice(0, 4),
      correct_index: Math.max(0, options.indexOf(correct)),
      explanation_tr: `${s.article} → Nom: ${nom}, Akk: ${akk}`,
    };
  });

  return { examples, drills };
}

function buildPluralDrills(seed) {
  const withPlural = Object.values(wordMap).filter((w) => w.plural && w.article);
  const samples = shuffle(withPlural, seed).slice(0, 8);
  const examples = samples.map((w, i) => ({
    id: `pl-ex-${i}`,
    de: `die ${w.plural}`,
    tr: w.translation_tr + " (çoğul)",
    breakdown: [
      { de: "die", tr: "çoğul artikel", role: "article" },
      { de: w.plural, tr: w.translation_tr, role: "noun" },
    ],
    noun: w.word,
    article: w.article,
    plural: w.plural,
  }));

  const drills = samples.map((w, i) => {
    const correct = w.plural;
    const wrong = shuffle(
      Object.values(wordMap)
        .filter((x) => x.plural && x.plural !== w.plural)
        .map((x) => x.plural),
      seed + i
    ).slice(0, 3);
    const options = shuffle([correct, ...wrong], seed + i);
    return {
      id: `drill-pl-${String(i + 1).padStart(2, "0")}`,
      type: "plural_match",
      prompt_tr: `${w.article} ${w.word} → çoğul?`,
      context_de: `die ___`,
      options: options.slice(0, 4),
      correct_index: Math.max(0, options.indexOf(correct)),
      explanation_tr: `${w.word} → die ${w.plural}`,
    };
  });

  return { examples, drills };
}

const ARTICLE_SETS = [
  { id: "der", article: "der", title_tr: "der (eril)", order: 1 },
  { id: "die", article: "die", title_tr: "die (dişil)", order: 2 },
  { id: "das", article: "das", title_tr: "das (nötr)", order: 3 },
];

const sets = ARTICLE_SETS.map((cfg) => {
  const words = pickWords(cfg.article, 40, cfg.order * 100);
  const examples = buildExamples(words, cfg.id);
  const drills = buildDrills(cfg.id, examples, cfg.article, cfg.order * 50);
  return {
    id: cfg.id,
    title: cfg.article,
    title_tr: cfg.title_tr,
    order: cfg.order,
    examples,
    drills,
  };
});

const einData = buildEinDrills(999);
sets.push({
  id: "ein",
  title: "ein / eine",
  title_tr: "Belirsiz artikel",
  order: 4,
  examples: einData.examples,
  drills: einData.drills,
});

const plData = buildPluralDrills(888);
sets.push({
  id: "plural",
  title: "Plural",
  title_tr: "Çoğul tanıma",
  order: 5,
  examples: plData.examples,
  drills: plData.drills,
});

const output = {
  version: "1.0.0",
  level: "A1",
  title: "Artikel Trainer",
  titleTr: "Artikel (der / die / das)",
  description: "der · die · das · ein/eine · çoğul — 5 set × drill",
  passThreshold: 6,
  drillsPerSet: 10,
  rules: [
    { article: "der", tr: "eril (masculine)" },
    { article: "die", tr: "dişil (feminine) + çoğul" },
    { article: "das", tr: "nötr (neuter)" },
  ],
  sets,
};

fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");
console.log(`✓ a1-articles.json — ${output.sets.length} sets → ${OUT}`);
