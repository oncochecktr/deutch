// A1 Possessive Audit — Satz Builder + Grammar Pack + vocabulary balance
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const corePath = path.join(ROOT, "data/grundlagen/a1-core.json");
const vocabPath = path.join(ROOT, "data/a1/vocabulary.json");

const core = JSON.parse(fs.readFileSync(corePath, "utf8"));
const vocab = JSON.parse(fs.readFileSync(vocabPath, "utf8"));

// --- Sentence Builder: possessive token exercises ---
const newSatz = [
  {
    id: "sb_050",
    prompt_tr: "Bu benim oğlum.",
    tokens: ["Das", "ist", "mein", "Sohn", "."],
    distractors: ["meine", "dein", "sein", "ihr"],
    answer_de: "Das ist mein Sohn.",
    hint: "der Sohn → mein",
  },
  {
    id: "sb_051",
    prompt_tr: "Bu senin kız kardeşin.",
    tokens: ["Das", "ist", "deine", "Schwester", "."],
    distractors: ["dein", "meine", "seine", "ihre"],
    answer_de: "Das ist deine Schwester.",
    hint: "die Schwester → deine",
  },
  {
    id: "sb_052",
    prompt_tr: "Bu onun (erkek) arabası.",
    tokens: ["Das", "ist", "sein", "Auto", "."],
    distractors: ["seine", "mein", "dein", "ihr"],
    answer_de: "Das ist sein Auto.",
    hint: "das Auto → sein",
  },
  {
    id: "sb_053",
    prompt_tr: "Bu onun (kadın) kocası.",
    tokens: ["Das", "ist", "ihr", "Mann", "."],
    distractors: ["ihre", "sein", "dein", "unser"],
    answer_de: "Das ist ihr Mann.",
    hint: "der Mann → ihr (onun — kadın)",
  },
  {
    id: "sb_054",
    prompt_tr: "Bu bizim otelimiz.",
    tokens: ["Das", "ist", "unser", "Hotel", "."],
    distractors: ["unsere", "mein", "euer", "dein"],
    answer_de: "Das ist unser Hotel.",
    hint: "das Hotel → unser",
  },
];

const satzIds = new Set(core.sentenceBuilder.exercises.map((e) => e.id));
let satzAdded = 0;
for (const ex of newSatz) {
  if (!satzIds.has(ex.id)) {
    core.sentenceBuilder.exercises.push(ex);
    satzAdded++;
  }
}

// --- Grammar Pack possessiv: ref + quizzes ---
const possessiv = core.grammarPack.sections.find((s) => s.id === "possessiv");
if (possessiv) {
  const refDe = new Set(possessiv.reference.items.map((i) => i.de));
  const extraRef = [
    { de: "mein Hotel (das)", tr: "benim otelim" },
    { de: "ihr Mann (der)", tr: "onun (kadın) kocası" },
    { de: "Ihr Name / Ihre Adresse (Sie)", tr: "sizin adınız / adresiniz (resmi)" },
  ];
  for (const item of extraRef) {
    if (!refDe.has(item.de)) possessiv.reference.items.push(item);
  }

  const exDe = new Set((possessiv.reference.examples || []).map((e) => e.de));
  const extraEx = [
    { de: "Das ist mein Hotel.", tr: "Bu benim otelim." },
    { de: "Das ist ihr Mann.", tr: "Bu onun (kadın) kocası." },
  ];
  if (!possessiv.reference.examples) possessiv.reference.examples = [];
  for (const ex of extraEx) {
    if (!exDe.has(ex.de)) possessiv.reference.examples.push(ex);
  }

  const quizIds = new Set(possessiv.quiz.map((q) => q.id));
  const extraQuiz = [
    {
      id: "po_07",
      question_tr: "Ich suche ___ Sohn. (Akkusativ — benim)",
      options: ["meinen", "mein", "meine", "meinem"],
      correct_index: 0,
    },
    {
      id: "po_08",
      question_tr: 'Resmi "sizin adresiniz" — hangisi?',
      options: ["Ihre Adresse", "ihre Adresse", "deine Adresse", "unsere Adresse"],
      correct_index: 0,
    },
  ];
  for (const q of extraQuiz) {
    if (!quizIds.has(q.id)) possessiv.quiz.push(q);
  }
}

// --- Vocabulary: balance dein / sein / ihr / unser / euer examples ---
const VOCAB_EXAMPLES = {
  Vater: {
    example_de: "Sein Vater ist Lehrer.",
    example_tr: "Babası öğretmen.",
  },
  Sohn: {
    example_de: "Dein Sohn ist nett.",
    example_tr: "Oğlun nazik.",
  },
  Kind: {
    example_de: "Ihr Kind spielt gern.",
    example_tr: "Çocuğu oynamayı sever.",
  },
  Schwester: {
    example_de: "Seine Schwester ist Ärztin.",
    example_tr: "Kız kardeşi doktor.",
  },
  Bruder: {
    example_de: "Sein Bruder wohnt in Berlin.",
    example_tr: "Erkek kardeşi Berlin'de oturuyor.",
  },
  Familie: {
    example_de: "Unsere Familie ist groß.",
    example_tr: "Ailemiz büyük.",
  },
  Haus: {
    example_de: "Euer Haus ist schön.",
    example_tr: "Eviniz güzel.",
  },
  Auto: {
    example_de: "Das ist dein Auto.",
    example_tr: "Bu senin araban.",
  },
};

let vocabUpdated = 0;
for (const w of vocab.words) {
  const patch = VOCAB_EXAMPLES[w.word];
  if (patch) {
    w.example_de = patch.example_de;
    w.example_tr = patch.example_tr;
    vocabUpdated++;
  }
}

fs.writeFileSync(corePath, JSON.stringify(core, null, 2), "utf8");
fs.writeFileSync(vocabPath, JSON.stringify(vocab, null, 2), "utf8");

console.log(
  `✓ possessive audit — satz +${satzAdded}, grammar quiz ${possessiv?.quiz.length ?? 0}, vocab ${vocabUpdated} updated`
);
