/**
 * Tam Sınıf akışı: teach → hazırım → cevap → stepComplete
 * Kullanım: node scripts/test-speak-flow.mjs
 * Sunucu: http://localhost:3000
 */
const BASE = process.env.CHAT_URL ?? "http://localhost:3000/api/chat";

async function chat(body) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

const profile = {
  weaknesses: [],
  currentAssignment: null,
  recentNotes: [],
  levelProgressPercent: 10,
  levelRemainingPercent: 90,
  nextMilestone: "Meslek",
  hintLevel: 1,
  consecutiveCorrect: 0,
  stepConceptReady: false,
};

let history = [];
let stepIndex = 2;
let lastQuestion = null;
let lastPhase = null;

function log(step, r) {
  const d = r.data;
  console.log("\n---", step, "---");
  console.log("HTTP", r.status, d.error ?? "OK");
  if (d.error) {
    console.log("detail:", d.detail?.slice?.(0, 120));
    return false;
  }
  console.log("phase:", d.boardPhase, "| Q:", d.germanQuestion ?? "-");
  console.log("stepComplete:", d.stepComplete, "| lessonComplete:", d.lessonComplete);
  console.log("reply:", (d.reply ?? "").slice(0, 90));
  lastQuestion = d.germanQuestion ?? lastQuestion;
  lastPhase = d.boardPhase ?? lastPhase;
  if (d.teachingExamples?.length || d.teachingTopicGerman) {
    profile.stepConceptReady = true;
  }
  return true;
}

console.log("Sınıf akış testi →", BASE);

let r = await chat({
  message: "Merhaba profesorum. Bugunku konuyu ogret.",
  level: "A1",
  history,
  inputLanguage: "tr",
  lessonId: "a1_l02",
  lessonStepIndex: stepIndex,
  studentProfile: profile,
});
if (!log("1 ogretim", r)) process.exit(1);
history.push({ role: "user", content: "Merhaba profesorum..." });
history.push({ role: "assistant", content: r.data.reply });

r = await chat({
  message: "[YAZILI CEVAP] hazirim hocam",
  level: "A1",
  history,
  inputLanguage: "tr",
  lessonId: "a1_l02",
  lessonStepIndex: stepIndex,
  studentProfile: profile,
});
if (!log("2 hazirim", r)) process.exit(1);
if (!r.data.germanQuestion) {
  console.error("FAIL: germanQuestion bekleniyordu");
  process.exit(1);
}
lastQuestion = r.data.germanQuestion;
lastPhase = "practice";
history.push({ role: "user", content: "[YAZILI CEVAP] hazirim hocam" });
history.push({ role: "assistant", content: r.data.reply });

r = await chat({
  message: "[YAZILI CEVAP] Ich arbeite als Lehrer",
  level: "A1",
  history,
  inputLanguage: "tr",
  lessonId: "a1_l02",
  lessonStepIndex: stepIndex,
  studentProfile: { ...profile, stepConceptReady: true },
});
if (!log("3 cevap", r)) process.exit(1);

if (r.data.stepComplete) {
  console.log("\n✓ stepComplete alındı — adım ilerlemesi OK");
} else {
  console.log("\n⚠ stepComplete yok (client coerce UI tarafında devreye girer)");
}

console.log("\nAkış testi bitti.");
