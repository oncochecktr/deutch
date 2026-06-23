/**
 * Diyalog generate API testi
 * Kullanım: node scripts/test-dialogue-generate.mjs
 */
const BASE = process.env.DIALOGUE_URL ?? "http://localhost:3000/api/dialogue/generate";

async function generate(body) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(120_000),
  });
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON HTTP ${res.status}. Rebuild? ${text.slice(0, 80)}`);
  }
  return { ok: res.ok, status: res.status, data: await res.json() };
}

function validateStory(story) {
  if (!story.title_de || !story.title_tr) throw new Error("Missing title");
  if (!Array.isArray(story.lines) || story.lines.length < 4) throw new Error("Need 4+ lines");
  for (const line of story.lines) {
    if (!line.text_de?.trim()) throw new Error(`Missing text_de on ${line.id}`);
    if (!line.text_tr?.trim()) throw new Error(`Missing text_tr on ${line.id}`);
  }
  if (!Array.isArray(story.comprehension) || story.comprehension.length < 1) {
    throw new Error("Need comprehension");
  }
}

console.log("Diyalog generate testi →", BASE);

const seedCheck = await fetch("http://localhost:3000/dialogues").catch(() => null);
if (seedCheck?.ok) {
  console.log("✓ /dialogues page reachable");
}

let r = await generate({ level: "A1", theme: "Familie und Fußball", style: "funny", maxLines: 14 });
console.log("\n--- AI A1 funny ---");
console.log("HTTP", r.status, r.data.error ?? "OK");
if (!r.ok) {
  console.error(r.data);
  process.exit(1);
}
validateStory(r.data);
console.log("title:", r.data.title_de);
console.log("lines:", r.data.lines.length, "| comprehension:", r.data.comprehension.length);
console.log("sample TR:", r.data.lines[0]?.text_tr?.slice(0, 50));

console.log("\n✓ Dialogue generate OK");
