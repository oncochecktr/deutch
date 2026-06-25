/**
 * text.md ↔ A1 vocabulary audit
 * node scripts/audit-text-md-vocab.mjs
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { auditTextMd } from "./lib/textMdVocab.mjs";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dir, "out");
const OUT_JSON = join(OUT_DIR, "text-md-audit.json");

const report = auditTextMd();
const { summary } = report;

console.log("text.md ↔ A1 vocabulary audit");
console.log("─".repeat(40));
console.log(`Vocabulary: ${report.vocabTotal} kelime`);
console.log(`text.md:    ${report.textMdLines} satır (A1: 1–${459})`);
console.log("");
console.log(`✓ Zaten var:        ${summary.in_vocab}`);
console.log(`✗ Eksik (satır):    ${summary.missing_lines}`);
console.log(`✗ Eksik (benzersiz):${summary.missing_unique}`);
console.log(`⚠ Yazım düzeltmesi: ${summary.typo}`);
console.log(`⊘ Dilbilgisi atla:  ${summary.grammar_skip}`);
console.log(`⊘ A2/B1 kuyruk:     ${summary.a2_tail}`);
console.log(`⊘ Bozuk satır:       ${summary.garbage}`);
console.log(`⚠ Yanlış artikel:   ${summary.wrong_article_exists}`);

if (report.missingUnique.length > 0) {
  console.log("\nEksik kelimeler:");
  console.log(report.missingUnique.map((m) => `  ${m.line}: ${m.word}`).join("\n"));
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), "utf8");
console.log(`\n→ ${OUT_JSON}`);

if (summary.missing_unique > 0) process.exitCode = 1;
