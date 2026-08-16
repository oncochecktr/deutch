import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const PACKS = [
  { key: "a1", label: "A1", file: "data/a1/vocabulary.json" },
  { key: "a2", label: "A2", file: "data/a2/vocabulary.json" },
  { key: "timur", label: "Mesleki", file: "data/timur/vocabulary.json" },
  { key: "universal", label: "Universal", file: "data/universal/vocabulary.json" },
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function escapeCell(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function csvCell(value) {
  const text = String(value ?? "").replace(/\r?\n/g, " ").trim();
  return `"${text.replace(/"/g, '""')}"`;
}

function articleWord(word) {
  return word.article ? `${word.article} ${word.word}` : word.word;
}

function buildMarkdown(packs) {
  const lines = [
    "# German Coach Kelime Havuzu",
    "",
    "Bu dosya JSON kelime havuzunun okunabilir kopyasidir. Kaynak JSON dosyalarini degistirmez.",
    "",
    "## Ozet",
    "",
    "| Paket | JSON toplam | Gercek kelime | Kategori | Kaynak |",
    "|---|---:|---:|---:|---|",
  ];

  for (const pack of packs) {
    lines.push(
      `| ${pack.label} | ${pack.data.total} | ${pack.data.words.length} | ${pack.data.categories.length} | \`${pack.file}\` |`
    );
  }

  for (const pack of packs) {
    lines.push("", `## ${pack.label}`, "");

    for (const category of pack.data.categories) {
      const words = pack.data.words.filter((word) => word.category === category);
      lines.push(`### ${category} (${words.length})`, "");
      lines.push("| ID | Kelime | Turkce | Ornek DE | Ornek TR | Etiket |");
      lines.push("|---|---|---|---|---|---|");

      for (const word of words) {
        lines.push(
          [
            word.id,
            articleWord(word),
            word.translation_tr,
            word.example_de,
            word.example_tr,
            (word.tags ?? []).join(", "),
          ]
            .map(escapeCell)
            .join(" | ")
            .replace(/^/, "| ")
            .replace(/$/, " |")
        );
      }

      lines.push("");
    }
  }

  while (lines.at(-1) === "") lines.pop();
  return `${lines.join("\n")}\n`;
}

function buildCsv(packs) {
  const rows = [["pack", "id", "level", "category", "word", "article", "plural", "translation_tr", "example_de", "example_tr", "tags"]];

  for (const pack of packs) {
    for (const word of pack.data.words) {
      rows.push([
        pack.key,
        word.id,
        word.level,
        word.category,
        word.word,
        word.article,
        word.plural,
        word.translation_tr,
        word.example_de,
        word.example_tr,
        (word.tags ?? []).join(", "),
      ]);
    }
  }

  return `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

const packs = PACKS.map((pack) => ({ ...pack, data: readJson(pack.file) }));
const outDir = path.join(ROOT, "scripts", "out");
fs.mkdirSync(outDir, { recursive: true });

const markdownPath = path.join(outDir, "vocabulary-readable.md");
const csvPath = path.join(outDir, "vocabulary-readable.csv");

fs.writeFileSync(markdownPath, buildMarkdown(packs), "utf8");
fs.writeFileSync(csvPath, buildCsv(packs), "utf8");

for (const pack of packs) {
  console.log(`${pack.label}: ${pack.data.words.length} kelime (${pack.data.categories.length} kategori)`);
}
console.log(`Markdown: ${path.relative(ROOT, markdownPath)}`);
console.log(`CSV: ${path.relative(ROOT, csvPath)}`);
