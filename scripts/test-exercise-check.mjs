/**
 * Egzersiz check API testi
 * Kullanım: node scripts/test-exercise-check.mjs
 */
const BASE = process.env.EXERCISE_URL ?? "http://localhost:3000/api/exercise/check";

async function check(body) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON (HTTP ${res.status}). Rebuild: stop.bat → start.bat --rebuild. Body: ${text.slice(0, 80)}`);
  }
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

function assertFields(data) {
  const required = [
    "score",
    "isCorrect",
    "boardReply",
    "correction",
    "correctionExplanation",
    "praise",
    "tip",
    "strengths",
    "weaknesses",
    "nextSuggestion",
  ];
  for (const key of required) {
    if (!(key in data)) {
      throw new Error(`Missing field: ${key}`);
    }
  }
  const scores = ["poor", "ok", "good", "excellent"];
  if (!scores.includes(data.score)) {
    throw new Error(`Invalid score: ${data.score}`);
  }
}

console.log("Egzersiz API testi →", BASE);

let r = await check({
  level: "A1",
  exerciseType: "vocab_mcq",
  promptDe: '"der Apfel" kelimesinin Türkçe karşılığı hangisi?',
  expectedHint: "elma",
  studentAnswer: "wrong-id",
  correctOptionId: "a1_apfel",
  hintLevel: 1,
  weaknesses: [],
});

console.log("\n--- vocab_mcq (yerel) ---");
console.log("HTTP", r.status, r.data.error ?? "OK");
if (!r.ok) {
  console.error("FAIL:", r.data);
  process.exit(1);
}
assertFields(r.data);
console.log("score:", r.data.score, "| isCorrect:", r.data.isCorrect);
console.log("boardReply:", r.data.boardReply?.slice(0, 80));

r = await check({
  level: "A1",
  exerciseType: "true_false",
  promptDe: "Bu ifade doğru mu?",
  expectedHint: "true",
  studentAnswer: "true",
  correctTrueFalse: true,
  hintLevel: 2,
  weaknesses: [],
});

console.log("\n--- true_false (yerel) ---");
console.log("HTTP", r.status, r.data.error ?? "OK");
if (!r.ok) {
  console.error("FAIL:", r.data);
  process.exit(1);
}
assertFields(r.data);
console.log("score:", r.data.score, "| isCorrect:", r.data.isCorrect);

r = await check({
  level: "A1",
  exerciseType: "fill_blank",
  promptDe: "Boşluğu doldur",
  expectedHint: "Apfel",
  studentAnswer: "Apfel",
  blankWord: "Apfel",
  hintLevel: 1,
  weaknesses: [],
});

console.log("\n--- fill_blank (yerel) ---");
console.log("HTTP", r.status, r.data.error ?? "OK");
if (!r.ok) {
  console.error("FAIL:", r.data);
  process.exit(1);
}
assertFields(r.data);
console.log("score:", r.data.score, "| isCorrect:", r.data.isCorrect);

console.log("\n✓ Egzersiz check API şeması OK");
console.log("(short_write AI testi opsiyonel — DEEPSEEK_API_KEY gerekir)");
