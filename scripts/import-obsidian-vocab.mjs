import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "scripts", "out");

const EXISTING_PACKS = [
  { key: "a1", file: "data/a1/vocabulary.json" },
  { key: "a2", file: "data/a2/vocabulary.json" },
  { key: "timur", file: "data/timur/vocabulary.json" },
  { key: "universal", file: "data/universal/vocabulary.json" },
];

const TARGET_PACK = {
  key: "universal",
  level: "A1",
  idPrefix: "u",
  file: "data/universal/vocabulary.json",
  category: "Universal Paket 001",
  version: "1.0.0",
};

function argValue(name) {
  const idx = process.argv.indexOf(name);
  return idx === -1 ? null : process.argv[idx + 1] ?? null;
}

function hasArg(name) {
  return process.argv.includes(name);
}

function readJson(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

function writeJson(relativePath, data) {
  const fullPath = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function normalizeWord(word) {
  return String(word ?? "")
    .toLocaleLowerCase("de-DE")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9ß]+/giu, " ")
    .trim();
}

function slugify(word) {
  return normalizeWord(word)
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseObsidian(content) {
  const blocks = [...content.matchAll(/^##\s+(\d+)\.\s+(.+?)\r?\n([\s\S]*?)(?=^##\s+\d+\.\s+|$(?![\s\S]))/gm)];
  return blocks.map((match) => {
    const body = match[3];
    const tagsLine = body.match(/\*\*Etiket:\*\*\s*(.+)/);
    const translationLine = body.match(/\*\*Turkce:\*\*\s*(.+)/);
    return {
      sourceIndex: Number(match[1]),
      word: match[2].trim(),
      translation_tr: translationLine ? translationLine[1].trim() : "",
    };
  });
}

function createEmptyPack() {
  return {
    level: TARGET_PACK.level,
    version: TARGET_PACK.version,
    total: 0,
    categories: [TARGET_PACK.category],
    words: [],
  };
}

function nextId(words) {
  const prefix = TARGET_PACK.idPrefix;
  const max = words.reduce((current, word) => {
    const match = String(word.id ?? "").match(new RegExp(`^${prefix}_(\\d{4})$`));
    return match ? Math.max(current, Number(match[1])) : current;
  }, 0);
  return (offset) => `${prefix}_${String(max + offset).padStart(4, "0")}`;
}

function makeWordEntry(item, id) {
  return {
    id,
    level: TARGET_PACK.level,
    category: TARGET_PACK.category,
    word: item.word,
    article: null,
    plural: null,
    translation_tr: item.translation_tr,
    translation_ru: "",
    example_de: `Ich lerne das Wort "${item.word}".`,
    example_tr: `"${item.word}" kelimesini öğreniyorum.`,
    audio_word: "",
    audio_example: "",
    tags: ["universal", "batch-001", "needs-review"],
  };
}

function markdownTable(rows) {
  const lines = [
    "| Durum | Seviye | Kelime | Turkce | Not |",
    "|---|---|---|---|---|",
  ];
  for (const row of rows) {
    lines.push(
      `| ${row.status} | ${row.level} | ${row.word.replace(/\|/g, "\\|")} | ${row.translation_tr.replace(/\|/g, "\\|")} | ${row.note.replace(/\|/g, "\\|")} |`
    );
  }
  return lines.join("\n");
}

const source = argValue("--source");
const write = hasArg("--write");

if (!source) {
  console.error("Kullanim: node scripts/import-obsidian-vocab.mjs --source <obsidian.md> [--write]");
  process.exit(1);
}

const sourcePath = path.resolve(source);
const obsidianWords = parseObsidian(fs.readFileSync(sourcePath, "utf8"));
const existingPacks = EXISTING_PACKS.map((pack) => ({ ...pack, data: readJson(pack.file) }));
const targetPack = readJson(TARGET_PACK.file) ?? createEmptyPack();

const existing = new Map();
for (const pack of existingPacks) {
  if (!pack.data) continue;
  for (const word of pack.data.words) {
    const key = normalizeWord(word.word);
    if (!key) continue;
    if (!existing.has(key)) existing.set(key, []);
    existing.get(key).push({ pack: pack.key, id: word.id, word: word.word, category: word.category });
  }
}

const reportRows = [];
const additions = [];

for (const item of obsidianWords) {
  const key = normalizeWord(item.word);
  const hit = existing.get(key);
  if (hit) {
    reportRows.push({
      status: "mevcut",
      level: "Mevcut",
      word: item.word,
      translation_tr: item.translation_tr,
      note: hit.map((word) => `${word.pack}:${word.id}`).join(", "),
    });
    continue;
  }

  additions.push(item);
  existing.set(key, [{ pack: TARGET_PACK.key, id: "new", word: item.word, category: TARGET_PACK.category }]);
  reportRows.push({
    status: "eklenecek",
    level: TARGET_PACK.category,
    word: item.word,
    translation_tr: item.translation_tr,
    note: item.translation_tr ? "Obsidian cevirisi alindi" : "Turkce ceviri eksik",
  });
}

if (write) {
  const idFor = nextId(targetPack.words);
  const entries = additions.map((item, index) => makeWordEntry(item, idFor(index + 1)));
  targetPack.words.push(...entries);
  targetPack.total = targetPack.words.length;
  if (!targetPack.categories.includes(TARGET_PACK.category)) targetPack.categories.push(TARGET_PACK.category);
  writeJson(TARGET_PACK.file, targetPack);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const summary = {
  source: sourcePath,
  mode: write ? "write" : "dry-run",
  obsidian_total: obsidianWords.length,
  existing_total: reportRows.filter((row) => row.status === "mevcut").length,
  target_file: TARGET_PACK.file,
  target_category: TARGET_PACK.category,
  additions: additions.length,
};
fs.writeFileSync(
  path.join(OUT_DIR, "obsidian-import-report.json"),
  `${JSON.stringify({ summary, rows: reportRows }, null, 2)}\n`,
  "utf8"
);
fs.writeFileSync(
  path.join(OUT_DIR, "obsidian-import-report.md"),
  `# Obsidian Kelime Import Raporu\n\n${JSON.stringify(summary, null, 2)}\n\n${markdownTable(reportRows)}\n`,
  "utf8"
);

console.log(`Mod: ${summary.mode}`);
console.log(`Obsidian: ${summary.obsidian_total}`);
console.log(`Mevcut: ${summary.existing_total}`);
console.log(`Eklenecek: ${summary.additions}`);
console.log(`Hedef: ${summary.target_file}`);
console.log("Rapor: scripts/out/obsidian-import-report.md");
