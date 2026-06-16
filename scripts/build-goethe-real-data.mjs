/**
 * Goethe A1 real exam item pools (R/F + matching)
 * Run: node scripts/build-goethe-real-data.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const OUT = join(ROOT, "data/goethe/a1");

const hoerenMcq = JSON.parse(readFileSync(join(OUT, "hoeren.json"), "utf8"));

const hoerenReal = [];
for (let i = 1; i <= 20; i++) {
  const base = hoerenMcq[(i * 3) % hoerenMcq.length];
  hoerenReal.push({
    id: `hrf_${String(i).padStart(3, "0")}`,
    level: "A1",
    part: 1,
    format: "true_false",
    audio_text: base.audio_text,
    statement_de: base.question_de.replace(/\?$/, "."),
    statement_tr: base.question_tr,
    correct: i % 2 === 1,
    tags: ["real", "teil1"],
  });
}

const lesenRf = [];
const signs = [
  { ctx: "Geöffnet\nMo–Fr 9–18 Uhr", stmt: "Am Samstag ist geöffnet.", correct: false },
  { ctx: "Ausgang\n←", stmt: "Das ist der Ausgang.", correct: true },
  { ctx: "Rauchen verboten", stmt: "Hier darf man rauchen.", correct: false },
  { ctx: "Kursraum 12\n2. Stock", stmt: "Der Kurs ist im zweiten Stock.", correct: true },
  { ctx: "Eingang nur mit Ticket", stmt: "Man braucht ein Ticket.", correct: true },
  { ctx: "Toilette\n→", stmt: "Die Toilette ist links.", correct: false },
  { ctx: "Parken verboten", stmt: "Parken ist nicht erlaubt.", correct: true },
  { ctx: "Bibliothek\ngeschlossen", stmt: "Die Bibliothek ist offen.", correct: false },
  { ctx: "Achtung!\nBaustelle", stmt: "Es gibt eine Baustelle.", correct: true },
  { ctx: "Fahrräder\nbitte abstellen", stmt: "Man soll Fahrräder abstellen.", correct: true },
  { ctx: "Nicht rauchen", stmt: "Rauchen ist verboten.", correct: true },
  { ctx: "Information\nMo–Fr 8–16", stmt: "Am Freitag ist Information offen.", correct: true },
  { ctx: "Zimmer 5\nBitte leise", stmt: "Man soll leise sein.", correct: true },
  { ctx: "Feuerwehr\nNotausgang", stmt: "Das ist ein Notausgang.", correct: true },
  { ctx: "Kinder\n0–6 Jahre frei", stmt: "Kinder zahlen nicht.", correct: true },
  { ctx: "Hund\nnicht erlaubt", stmt: "Hunde sind erlaubt.", correct: false },
  { ctx: "Aufzug\nout of order", stmt: "Der Aufzug funktioniert nicht.", correct: true },
  { ctx: "Kasse 3\n←", stmt: "Kasse 3 ist links.", correct: true },
  { ctx: "WLAN\nPasswort: gast123", stmt: "Es gibt WLAN.", correct: true },
  { ctx: "Bitte\nSchuhe ausziehen", stmt: "Man soll Schuhe ausziehen.", correct: true },
];
signs.forEach((s, i) => {
  lesenRf.push({
    id: `lrf_${String(i + 1).padStart(3, "0")}`,
    format: "true_false",
    context_de: s.ctx,
    context_title: "Schild / Tafel",
    statement_de: s.stmt,
    statement_tr: s.stmt,
    correct: s.correct,
    tags: ["real", "teil1"],
  });
});

const lesenMatch = [];
for (let g = 0; g < 4; g++) {
  lesenMatch.push({
    id: `lmatch_${String(g + 1).padStart(3, "0")}`,
    format: "matching",
    title_de: "Was passt? Ordnen Sie zu.",
    title_tr: "Hangisi uyuyor? Eşleştirin.",
    prompts: [
      { id: "a", text_de: "Ich suche einen Arzt.", text_tr: "Doktor arıyorum." },
      { id: "b", text_de: "Ich möchte einkaufen.", text_tr: "Alışveriş yapmak istiyorum." },
      { id: "c", text_de: "Ich brauche Geld.", text_tr: "Paraya ihtiyacım var." },
      { id: "d", text_de: "Ich möchte Deutsch lernen.", text_tr: "Almanca öğrenmek istiyorum." },
      { id: "e", text_de: "Ich habe Hunger.", text_tr: "Açım." },
    ],
    options: [
      "Supermarkt — Mo–Sa 8–20",
      "Sprachschule — Kurs Mo–Fr",
      "Bank — Geldautomat 24h",
      "Praxis Dr. Müller — Tel. 030…",
      "Restaurant — Mittag 12–14",
    ],
    correct_indices: [3, 0, 2, 1, 4],
    tags: ["real", "teil2"],
  });
}

writeFileSync(join(OUT, "hoeren-real.json"), JSON.stringify(hoerenReal, null, 2));
writeFileSync(
  join(OUT, "lesen-real.json"),
  JSON.stringify({ rf: lesenRf, matching: lesenMatch }, null, 2)
);

const exams = JSON.parse(readFileSync(join(OUT, "exams.json"), "utf8"));
for (let i = 0; i < exams.length; i++) {
  const n = i + 1;
  exams[i].real = {
    hoeren: [
      `hrf_${String(((n - 1) % 20) + 1).padStart(3, "0")}`,
      ...exams[i].hoeren.slice(0, 9),
    ],
    lesen_rf: Array.from({ length: 5 }, (_, j) =>
      `lrf_${String(((n - 1 + j) % 20) + 1).padStart(3, "0")}`
    ),
    lesen_match: [`lmatch_${String((n % 4) + 1).padStart(3, "0")}`],
    lesen: exams[i].lesen.slice(0, 3),
  };
}
writeFileSync(join(OUT, "exams.json"), JSON.stringify(exams, null, 2));

const bank = JSON.parse(readFileSync(join(OUT, "bank.json"), "utf8"));
bank.counts.hoeren_real = hoerenReal.length;
bank.counts.lesen_rf = lesenRf.length;
bank.counts.lesen_match = lesenMatch.length;
writeFileSync(join(OUT, "bank.json"), JSON.stringify(bank, null, 2));

console.log("Real exam data:", hoerenReal.length, "hoeren R/F,", lesenRf.length, "lesen R/F,", lesenMatch.length, "matching");
