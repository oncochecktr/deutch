/** text.md ↔ A1 vocabulary audit helpers */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
export const TEXT_MD_PATH = join(__dir, "../../text.md");
export const VOCAB_PATH = join(__dir, "../../data/a1/vocabulary.json");
export const A1_TAIL_LINE = 460; // 1-based: line 460+ is A2/B1 block

export const TYPO = {
  graschaf: "Schaf",
  sparieren: "sparen",
  sehwer: "schwer",
  mars: "März",
  wain: "Wein",
  buttler: "Butter",
  "deutsch test": "Deutschtest",
  "deutsch unterricht": "Deutschunterricht",
  adress: "Adresse",
  gartner: "Gärtner",
  "gemüse geschafft": "Gemüse",
  gewinner: "gewinnen",
  "kennen lernen": "kennenlernen",
  feier: "Feier",
  große: "groß",
  form: "Form",
  vergleich: "Vergleich",
  "sondern?": "sondern",
  "echt?": "echt",
  "etwa?": "etwa",
  "wer?": "wer",
  "na?": "na",
  see: "See",
  teil: "Teil",
  lieder: "Lied",
};

export const GARBAGE = new Set(["beschäftig", "gebären"]);

export const GRAMMAR_SKIP = new Set([
  "du", "mich", "es", "sich", "an", "bei", "man", "zu", "von", "als", "dies", "werden",
  "akkusativ", "dativ", "nominativ", "artikel", "verb", "ihr", "ihm", "ihn", "mir", "dir",
  "euch", "uns", "sie", "er", "wir", "ich", "dich", "dem", "den", "welche", "ob", "dass",
  "weil", "wenn", "bis", "durch", "für", "gegen", "ohne", "um", "mit", "nach", "vor", "über",
  "unter", "zwischen", "hinter", "neben", "auf", "aus", "in", "dabei", "ihnen", "welch",
  "seit", "dürfen", "dazu", "während", "dafür", "sowie", "halt", "wohl", "davon", "deren",
  "beziehungsweise", "sogar", "wegen", "darüber", "daran", "gegenüber", "daher", "obwohl",
  "dessen", "zunächst", "einige", "gerade", "gar", "bereits", "meinen", "zwar", "weitere",
  "jedoch", "darauf", "allerdings", "fast", "überhaupt", "bestimmt", "nächste", "deshalb",
  "kaum", "einzeln", "allein", "politisch", "deutlich", "allgemein", "einzig", "gemeinsam",
  "nahe", "mehrere", "eben", "erst", "letzte", "solch", "schön", "schließlich", "eher", "je",
  "darin", "unterschiedlich", "handeln", "vorstellen", "entstehen", "scheinen", "erhalten",
  "bestehen", "setzen", "führen", "gelten", "zeigen", "nennen", "versuchen", "entsprechen",
  "ziehen", "reden", "aussehen", "erschienen", "darstellen", "entwickeln", "erkennen",
  "erreichen", "schaffen", "ragen", "dehnen", "es gibt", "temporal", "all", "jede", "solche",
  "sonst", "ganz", "gleich", "denn", "doch", "direkt", "endlich", "früher", "morgens",
  "alleine", "mal", "zahl", "ein bisschen", "bisschen", "sollen", "stehen", "gegen",
]);

/** Lines that are typos for words already in vocab — skip as missing */
export const ALREADY_IN_VOCAB_TYPO = new Set(["brot"]);

export function loadTextMdLines() {
  return readFileSync(TEXT_MD_PATH, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("<!--"));
}

export function loadVocabSet() {
  const vocab = JSON.parse(readFileSync(VOCAB_PATH, "utf8"));
  const byLower = new Map();
  for (const w of vocab.words) {
    byLower.set(w.word.toLowerCase(), w);
  }
  return { vocab, byLower };
}

export function parseLine(line) {
  const m = line.match(/^(der|die|das)\s+(.+)$/i);
  if (!m) {
    return { word: line, article: null, hadArticle: false };
  }
  let word = m[2].trim();
  const article = m[1].toLowerCase();
  const rawLow = word.toLowerCase();
  if (TYPO[rawLow]) word = TYPO[rawLow];
  return { word, article, hadArticle: true, rawWord: m[2].trim() };
}

export function auditTextMd() {
  const lines = loadTextMdLines();
  const { vocab, byLower } = loadVocabSet();
  const report = {
    vocabTotal: vocab.words.length,
    textMdLines: lines.length,
    in_vocab: [],
    missing: [],
    typo: [],
    grammar_skip: [],
    a2_tail: [],
    garbage: [],
    wrong_article_exists: [],
  };

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];
    const { word, article, hadArticle, rawWord } = parseLine(line);
    const low = word.toLowerCase();

    if (lineNum >= A1_TAIL_LINE) {
      report.a2_tail.push({ line: lineNum, raw: line, word });
      continue;
    }

    if (rawWord && TYPO[rawWord.toLowerCase()] && rawWord.toLowerCase() !== low) {
      report.typo.push({ line: lineNum, raw: line, fixed: word });
    }

    if (GARBAGE.has(low)) {
      report.garbage.push({ line: lineNum, raw: line, word });
      continue;
    }

    if (GRAMMAR_SKIP.has(low)) {
      report.grammar_skip.push({ line: lineNum, raw: line, word });
      continue;
    }

    if (hadArticle && ALREADY_IN_VOCAB_TYPO.has(low) && byLower.has(low)) {
      report.wrong_article_exists.push({ line: lineNum, raw: line, word, vocabArticle: byLower.get(low).article });
      continue;
    }

    if (byLower.has(low)) {
      report.in_vocab.push({ line: lineNum, raw: line, word, id: byLower.get(low).id });
      continue;
    }

    report.missing.push({ line: lineNum, raw: line, word, article });
  }

  const missingUnique = new Map();
  for (const m of report.missing) {
    if (!missingUnique.has(m.word.toLowerCase())) missingUnique.set(m.word.toLowerCase(), m);
  }
  report.missingUnique = [...missingUnique.values()].sort((a, b) =>
    a.word.localeCompare(b.word, "de")
  );
  report.summary = {
    in_vocab: report.in_vocab.length,
    missing_lines: report.missing.length,
    missing_unique: report.missingUnique.length,
    typo: report.typo.length,
    grammar_skip: report.grammar_skip.length,
    a2_tail: report.a2_tail.length,
    garbage: report.garbage.length,
    wrong_article_exists: report.wrong_article_exists.length,
  };

  return report;
}
