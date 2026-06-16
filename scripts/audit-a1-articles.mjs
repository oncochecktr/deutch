/**
 * A1 Article Audit — der/die/das kalite kontrol raporu
 *
 * Kullanım:
 *   node scripts/audit-a1-articles.mjs
 *   npm run audit:articles
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const VOCAB_PATH = join(ROOT, "data/a1/vocabulary.json");
const REF_PATH = join(ROOT, "data/a1/article-reference.json");
const REPORT_DIR = join(ROOT, "data/reports");
const JSON_OUT = join(REPORT_DIR, "a1-article-audit.json");
const MD_OUT = join(REPORT_DIR, "a1-article-audit.md");

const EXPECTED_NULL_TAGS = new Set([
  "greeting",
  "verb",
  "adjective",
  "adverb",
  "time",
  "interjection",
  "phrase",
  "conjunction",
  "preposition",
  "pronoun",
  "number",
]);

const INTENTIONAL_NULL_WORDS = new Set([
  "männlich",
  "weiblich",
  "ledig",
  "verheiratet",
  "geschieden",
  "verwitwet",
  "bar",
  "beiden",
  "staatsbürgerlich",
  "geboren",
  "morgen",
  "heute",
  "gestern",
  "jetzt",
  "später",
  "früh",
  "spät",
  "immer",
  "manchmal",
  "nie",
  "oft",
  "selten",
  "schon",
  "noch",
  "pünktlich",
  "billig",
  "teuer",
  "sauber",
  "schmutzig",
  "krank",
  "gesund",
  "müde",
  "schwach",
  "besser",
  "schlecht",
  "hungrig",
  "satt",
  "durstig",
  "lecker",
  "vegetarisch",
  "warm",
  "kalt",
  "allein",
  "zusammen",
]);

function loadReference() {
  if (!existsSync(REF_PATH)) {
    console.error(`Referans bulunamadı: ${REF_PATH}`);
    console.error("Önce: node scripts/seed-article-reference.mjs");
    process.exit(1);
  }
  return JSON.parse(readFileSync(REF_PATH, "utf8"));
}

function classifyNullArticle(word) {
  const tags = word.tags ?? [];
  const wLower = word.word.toLowerCase();

  if (INTENTIONAL_NULL_WORDS.has(wLower)) {
    return "intentionalNull";
  }
  if (tags.some((t) => EXPECTED_NULL_TAGS.has(t))) {
    return "expectedNull";
  }
  if (word.word.includes(" ") || word.word.includes("?")) {
    return "expectedNull";
  }
  if (tags.includes("form") || word.category === "Form doldurma") {
    return "intentionalNull";
  }
  if (wLower.endsWith("en") && tags.includes("verb")) {
    return "expectedNull";
  }
  return "reviewRequired";
}

function extractArticleFromExample(exampleDe, targetWord) {
  if (!exampleDe) return null;
  const word = targetWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\b(Der|Die|Das)\\s+(${word})\\b`, "i");
  const m = exampleDe.match(re);
  if (!m) return null;
  const art = m[1].toLowerCase();
  if (art === "der" || art === "die" || art === "das") return art;
  return null;
}

function isExampleFalsePositive(exampleDe, exArticle, targetWord) {
  if (!exampleDe || !exArticle) return false;
  const lower = exampleDe.toLowerCase();
  if (lower.startsWith("das ist ") || lower.startsWith("das kostet ")) return true;
  if (lower.includes(" ein ") || lower.includes(" eine ")) return true;
  if (lower.includes(" hat ") && exArticle === "der") return true;
  if (lower.includes(" schreibt ") && exArticle === "der") return true;
  // Dativ / Präposition: an der, in der, bei der … (Artikel fiilin, ismin değil)
  if (/\b(an|in|bei|von|zu|mit|nach|aus|vor|hinter|über|unter)\s+(der|die|dem|den)\s+/i.test(exampleDe)) {
    return true;
  }
  // Plural nominativ: Die Möbel (das → die normal)
  if (exArticle === "die" && lower.startsWith("die ") && targetWord && !lower.includes(`die ${targetWord.toLowerCase()}`)) {
    return true;
  }
  if (lower.startsWith("die ") && /möbel|leute|kosten|ferien/i.test(targetWord ?? "")) return true;
  return false;
}

function runAudit() {
  const vocab = JSON.parse(readFileSync(VOCAB_PATH, "utf8"));
  const ref = loadReference();
  const words = vocab.words;

  const counts = { der: 0, die: 0, das: 0, null: 0, other: 0 };
  const withArticle = [];
  const expectedNull = [];
  const intentionalNull = [];
  const reviewRequired = [];
  const referenceMismatch = [];
  const exampleHintMismatch = [];

  for (const w of words) {
    if (w.article === "der") counts.der++;
    else if (w.article === "die") counts.die++;
    else if (w.article === "das") counts.das++;
    else if (w.article === null || w.article === undefined) counts.null++;
    else counts.other++;

    if (w.article) {
      withArticle.push(w);
      const refEntry = ref.entries[w.id];
      if (refEntry && refEntry.article !== w.article) {
        referenceMismatch.push({
          id: w.id,
          word: w.word,
          article: w.article,
          expected: refEntry.article,
          reason: "reference_mismatch",
          category: w.category,
        });
      }

      const exArt = extractArticleFromExample(w.example_de, w.word);
      if (
        exArt &&
        exArt !== w.article &&
        !isExampleFalsePositive(w.example_de, exArt, w.word)
      ) {
        exampleHintMismatch.push({
          id: w.id,
          word: w.word,
          article: w.article,
          expected: exArt,
          reason: "example_sentence_hint",
          category: w.category,
          example_de: w.example_de,
          confidence: "low",
        });
      }
    } else {
      const bucket = classifyNullArticle(w);
      const row = {
        id: w.id,
        word: w.word,
        category: w.category,
        tags: w.tags,
      };
      if (bucket === "expectedNull") expectedNull.push(row);
      else if (bucket === "intentionalNull") intentionalNull.push(row);
      else reviewRequired.push(row);
    }
  }

  const spotChecks = ["Salat", "Brot", "Wurst"].map((name) => {
    const w = words.find((x) => x.word === name);
    const refByWord = ref.byWord?.[name.toLowerCase()];
    return {
      word: name,
      inVocab: !!w,
      vocabArticle: w?.article ?? null,
      referenceArticle: refByWord?.article ?? null,
      ok: w?.article === refByWord?.article && w?.article !== null,
    };
  });

  const summary = {
    generated: new Date().toISOString(),
    totalWords: words.length,
    counts,
    withArticleCount: withArticle.length,
    expectedNullCount: expectedNull.length,
    intentionalNullCount: intentionalNull.length,
    reviewRequiredCount: reviewRequired.length,
    referenceMismatchCount: referenceMismatch.length,
    exampleHintMismatchCount: exampleHintMismatch.length,
    spotChecks,
    referenceMeta: {
      path: "data/a1/article-reference.json",
      total: ref.total,
      generated: ref.generated,
    },
  };

  const report = {
    summary,
    expectedNull,
    intentionalNull,
    reviewRequired,
    referenceMismatch,
    exampleHintMismatch,
    spotChecks,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(JSON_OUT, JSON.stringify(report, null, 2));

  const md = buildMarkdown(report);
  writeFileSync(MD_OUT, md);

  console.log(`\nA1 Article Audit`);
  console.log(`Toplam kelime: ${summary.totalWords}`);
  console.log(
    `der: ${counts.der} | die: ${counts.die} | das: ${counts.das} | null: ${counts.null}`
  );
  console.log(`Artikelli isim: ${summary.withArticleCount}`);
  console.log(`Article eksik (şüpheli): ${summary.reviewRequiredCount}`);
  console.log(`Referans çelişkisi: ${summary.referenceMismatchCount}`);
  console.log(`Örnek cümle ipucu (düşük güven): ${summary.exampleHintMismatchCount}`);
  console.log(`\nJSON: ${JSON_OUT}`);
  console.log(`MD:   ${MD_OUT}`);

  for (const s of spotChecks) {
    console.log(`  ${s.word}: ${s.ok ? "OK" : "FAIL"} (${s.vocabArticle})`);
  }

  return report;
}

function buildMarkdown(report) {
  const s = report.summary;
  const c = s.counts;
  let md = `# A1 Article Audit\n\n`;
  md += `Oluşturulma: ${s.generated}\n\n`;
  md += `## Özet\n\n`;
  md += `\`\`\`text\n`;
  md += `A1 Article Audit\n`;
  md += `Toplam kelime: ${s.totalWords}\n`;
  md += `der: ${c.der} | die: ${c.die} | das: ${c.das} | null: ${c.null}\n`;
  md += `Artikelli isim: ${s.withArticleCount}\n`;
  md += `Article eksik (şüpheli isim adayı): ${s.reviewRequiredCount}\n`;
  md += `Article yanlış ihtimali (referans): ${s.referenceMismatchCount}\n`;
  md += `Örnek cümle ipucu (düşük güven): ${s.exampleHintMismatchCount}\n`;
  md += `\`\`\`\n\n`;

  md += `## Spot check (Salat / Brot / Wurst)\n\n`;
  md += `| Kelime | Vocab | Referans | OK |\n|--------|-------|----------|----|\n`;
  for (const row of report.spotChecks) {
    md += `| ${row.word} | ${row.vocabArticle ?? "—"} | ${row.referenceArticle ?? "—"} | ${row.ok ? "✓" : "✗"} |\n`;
  }
  md += `\n`;

  md += sectionList("Article eksik — inceleme gerekli", report.reviewRequired, (r) =>
    `- \`${r.id}\` **${r.word}** (${r.category})`
  );

  md += sectionList(
    "Article yanlış ihtimali — referans çelişkisi",
    report.referenceMismatch,
    (r) =>
      `- \`${r.id}\` **${r.word}**: vocab \`${r.article}\` → referans \`${r.expected}\` (${r.category})`
  );

  md += sectionList(
    "Örnek cümle ipucu (düşük güven)",
    report.exampleHintMismatch,
    (r) =>
      `- \`${r.id}\` **${r.word}**: vocab \`${r.article}\`, örnek ipucu \`${r.expected}\` — _${r.example_de}_`
  );

  md += `## Bilinçli null — form / sıfat / ifade (${report.intentionalNull.length})\n\n`;
  md += `<details><summary>Listeyi göster</summary>\n\n`;
  for (const r of report.intentionalNull.slice(0, 50)) {
    md += `- ${r.word} (${r.category})\n`;
  }
  if (report.intentionalNull.length > 50) {
    md += `\n_… ve ${report.intentionalNull.length - 50} kelime daha (JSON'da tam liste)_\n`;
  }
  md += `\n</details>\n\n`;

  md += `## Beklenen null — selamlama / fiil / zarf (${report.expectedNull.length})\n\n`;
  md += `<details><summary>Listeyi göster</summary>\n\n`;
  for (const r of report.expectedNull.slice(0, 40)) {
    md += `- ${r.word} (${r.category})\n`;
  }
  if (report.expectedNull.length > 40) {
    md += `\n_… ve ${report.expectedNull.length - 40} kelime daha_\n`;
  }
  md += `\n</details>\n\n`;

  md += `---\nReferans: \`${s.referenceMeta.path}\` (${s.referenceMeta.total} kayıt)\n`;
  return md;
}

function sectionList(title, items, fmt) {
  let md = `## ${title} (${items.length})\n\n`;
  if (items.length === 0) {
    md += `_Yok — temiz._\n\n`;
    return md;
  }
  for (const r of items) {
    md += `${fmt(r)}\n`;
  }
  md += `\n`;
  return md;
}

runAudit();
