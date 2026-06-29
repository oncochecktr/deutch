/**
 * (Legacy) PDF metninden el kitabi cikarimi — kaynak PDF repoda tutulmuyor.
 * Icerik: apps/web/lib/elKitabi/
 * node scripts/extract-el-kitabi.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const PDF_TEXT = join(ROOT, "almanca-a1-b1-elkitabi.pdf");
const OUT_DIR = join(ROOT, "data", "el-kitabi");
const OUT_JSON = join(OUT_DIR, "extracted.json");

const BRAND_PATTERNS = [
  [/DİJİTAL DİL OKULUNUZ/gi, ""],
  [/ALFA ALMANCA · A1–B1 El Kitabı/gi, ""],
  [/ALFA ALMANCA/gi, "German Coach"],
  [/alfaalmanca\.com/gi, ""],
  [/ALFA ELITE/gi, "A1"],
  [/ALFA EXZELLENZ/gi, "A2"],
  [/ALFA AUFSTREBER/gi, "B1"],
  [/Hueber yayınevinin Menschen kitap serisi üzerinden ilerler/gi, "German Coach müfredati üzerinden ilerler"],
  [/Menschen A1 Lektion 16–24/gi, "tema tekrari ve sinav hazirligi"],
  [/Menschen B1 Lektion 16–24/gi, "tema tekrari ve sinav hazirligi"],
  [/Menschen A1–B1 Lektion temaları/gi, "A1–B1 tema basliklari"],
  [/Alfa Almanca platformundaki/gi, "German Coach uygulamasindaki"],
  [/Alfa Almanca'da/gi, "German Coach'ta"],
  [/Alfa Almanca öğrencileri için/gi, "German Coach kullanicilari icin"],
  [/Bu kitap Alfa Almanca/gi, "Bu rehber German Coach"],
  [/platform videosunun/gi, "uygulama modullerinin"],
  [/Platformdaki/gi, "German Coach'taki"],
  [/platformdan/gi, "German Coach'tan"],
  [/platformun/gi, "German Coach'un"],
  [/Platform /gi, "German Coach "],
  [/KÖPRÜ:/gi, "German Coach'ta:"],
  [/A1 · Modul (\d+)/gi, "A1 adim $1"],
  [/A2 · Modul (\d+)/gi, "A2 adim $1"],
  [/B1 · Modul (\d+)/gi, "B1 adim $1"],
  [/SPRECHEN_Redemittel[^;]*/gi, "konusma modulu"],
  [/SCHREIBEN[^;]*/gi, "yazma modulu"],
  [/MAIL NASIL YAZILIR\?/gi, "e-posta yazimi"],
  [/—\s*\d+\s+$/gm, ""],
  [/^\s*\d+\s+$/gm, ""],
  [/-- \d+ of \d+ --/g, ""],
  [/İçindekiler[\s\S]*?Bölüm 1 —/m, "Bölüm 1 —"],
];

function cleanText(raw) {
  let t = raw;
  for (const [re, rep] of BRAND_PATTERNS) {
    t = t.replace(re, rep);
  }
  return t
    .replace(/\t+/g, "\t")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseCallout(line) {
  if (line.startsWith("TRİK:") || line.startsWith("TRIK:")) {
    return { type: "callout", kind: "ipucu", text: line.replace(/^TR[İI]K:\s*/, "") };
  }
  if (line.startsWith("DİKKAT:") || line.startsWith("DIKKAT:")) {
    return { type: "callout", kind: "dikkat", text: line.replace(/^D[İI]KKAT[^:]*:\s*/, "") };
  }
  if (line.startsWith("ÖRNEK:") || line.startsWith("ORNEK:")) {
    return { type: "callout", kind: "ornek", text: line.replace(/^ÖRNEK:\s*/, "") };
  }
  return null;
}

function splitChapters(text) {
  const chapterRe = /Bölüm (\d+) — ([^\n]+)/g;
  const matches = [...text.matchAll(chapterRe)];
  const chapters = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const start = m.index;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.indexOf("Ekler (Anhang)");
    const body = text.slice(start, end > start ? end : undefined).trim();
    const subRe = /(\d+\.\d+)\s+([^\n]+)/g;
    const subs = [...body.matchAll(subRe)];
    chapters.push({
      number: Number(m[1]),
      title: m[2].trim(),
      raw: body,
      subsectionCount: subs.length,
    });
  }
  return chapters;
}

function main() {
  if (!existsSync(PDF_TEXT)) {
    console.log("Kaynak PDF yok (icerik apps/web/lib/elKitabi/ icinde).");
    process.exit(0);
  }
  const raw = readFileSync(PDF_TEXT, "utf8");
  const cleaned = cleanText(raw);
  const chapters = splitChapters(cleaned);
  const appendixStart = cleaned.indexOf("Ekler (Anhang)");
  const introEnd = cleaned.indexOf("Bölüm 1 —");
  const intro = cleaned.slice(0, introEnd > 0 ? introEnd : 5000);

  const out = {
    generatedAt: new Date().toISOString(),
    introLength: intro.length,
    chapterCount: chapters.length,
    chapters: chapters.map((c) => ({
      number: c.number,
      title: c.title,
      subsectionCount: c.subsectionCount,
      preview: c.raw.slice(0, 500),
    })),
    appendixPreview: appendixStart > 0 ? cleaned.slice(appendixStart, appendixStart + 800) : "",
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(out, null, 2), "utf8");
  writeFileSync(join(OUT_DIR, "cleaned.txt"), cleaned, "utf8");
  console.log(`Extracted ${chapters.length} chapters → ${OUT_JSON}`);
}

main();
