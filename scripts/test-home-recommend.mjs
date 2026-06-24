/**
 * Önerilen rozet senaryoları — node scripts/test-home-recommend.mjs
 */
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Dynamic import TS via relative path — use compiled approach: inline duplicate minimal tests
// Run: npx tsx scripts/test-home-recommend.mjs OR node with strip types

const modPath = path.resolve(__dirname, "../apps/web/lib/homeLearningPath.ts");

let resolveRecommendedIntent;
try {
  const mod = await import(pathToFileURL(modPath).href);
  resolveRecommendedIntent = mod.resolveRecommendedIntent;
} catch {
  console.error("Run: npx tsx scripts/test-home-recommend.mjs");
  process.exit(1);
}

function assert(name, got, expectedId) {
  const ok = got.id === expectedId;
  console.log(ok ? "✓" : "✗", name, "→", got.id, `(${got.reason})`, ok ? "" : `expected ${expectedId}`);
  if (!ok) process.exitCode = 1;
}

// Yeni kullanıcı
assert(
  "12 kelimeden az → kartlar",
  resolveRecommendedIntent({ activeStageId: "words", a1Studied: 5, srsDue: 0, primaryHref: "/cards" }),
  "new"
);

// Ekran görüntüsü: 17 kelime, 17 tekrar
assert(
  "17 kelime + 17 tekrar → Tekrar",
  resolveRecommendedIntent({ activeStageId: "words", a1Studied: 17, srsDue: 17, primaryHref: "/cards" }),
  "words"
);

// Orta havuz, tekrar yok
assert(
  "25 kelime, tekrar yok → kartlar",
  resolveRecommendedIntent({ activeStageId: "words", a1Studied: 25, srsDue: 2, primaryHref: "/cards" }),
  "new"
);

// Gramer aşaması
assert(
  "grammar stage",
  resolveRecommendedIntent({
    activeStageId: "grammar",
    a1Studied: 200,
    srsDue: 0,
    primaryHref: "/grundlagen/satz",
  }),
  "grammar"
);

// goethe ≠ konuş (eski hata)
assert(
  "goethe stage → sınav",
  resolveRecommendedIntent({
    activeStageId: "goethe",
    a1Studied: 300,
    srsDue: 0,
    primaryHref: "/exam/hoeren",
  }),
  "exam"
);

assert(
  "exam stage",
  resolveRecommendedIntent({
    activeStageId: "exam",
    a1Studied: 400,
    srsDue: 0,
    primaryHref: "/exam/real/exam_01",
  }),
  "exam"
);

console.log(process.exitCode ? "\nFAILED" : "\nAll recommendation checks passed.");
