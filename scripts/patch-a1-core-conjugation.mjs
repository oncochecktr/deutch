// Patch a1-core for conjugation audit fixes
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corePath = path.join(__dirname, "../data/grundlagen/a1-core.json");
const core = JSON.parse(fs.readFileSync(corePath, "utf8"));

// 1. Add sie (onlar) to grammar pronouns if not present
const pronouns = core.grammar.pronouns.items;
const hasPluralThey = pronouns.some((p) => p.tr === "onlar");
if (!hasPluralThey) {
  pronouns.push({ de: "sie", tr: "onlar" });
}

// 2. Grammar Pack pronouns reference + quizzes
const packPronouns = core.grammarPack.sections.find((s) => s.id === "pronouns");
if (packPronouns) {
  const ref = packPronouns.reference.items;
  const needEs = !ref.some((i) => i.de === "es");
  const needIhr = !ref.some((i) => i.de === "ihr");
  const needThey = !ref.some((i) => i.tr === "onlar");
  if (needEs) ref.splice(4, 0, { de: "es", tr: "o (nötr)" });
  if (needIhr) {
    const wirIdx = ref.findIndex((i) => i.de === "wir");
    ref.splice(wirIdx + 1, 0, { de: "ihr", tr: "siz (çoğul)" });
  }
  if (needThey) ref.push({ de: "sie", tr: "onlar" });

  const hasPr07 = packPronouns.quiz.some((q) => q.id === "pr_07");
  if (!hasPr07) {
    packPronouns.quiz.push(
      {
        id: "pr_07",
        question_tr: 'Hangisi "o (nötr)"?',
        options: ["es", "er", "sie", "ihr"],
        correct_index: 0,
      },
      {
        id: "pr_08",
        question_tr: 'Hangisi "onlar"?',
        options: ["Sie", "sie", "ihr", "wir"],
        correct_index: 1,
      }
    );
  }
}

// 3. Sentence builder du/er/sie exercises
const newExercises = [
  {
    id: "sb_042",
    prompt_tr: "Sen öğrencisin.",
    tokens: ["Du", "bist", "Student", "."],
    distractors: ["Ich", "bin", "Er", "ist"],
    answer_de: "Du bist Student.",
    hint: "sein: du → bist",
  },
  {
    id: "sb_043",
    prompt_tr: "O (erkek) öğretmen.",
    tokens: ["Er", "ist", "Lehrer", "."],
    distractors: ["Sie", "ist", "Du", "bist"],
    answer_de: "Er ist Lehrer.",
    hint: "sein: er → ist",
  },
  {
    id: "sb_044",
    prompt_tr: "O (kadın) doktor.",
    tokens: ["Sie", "ist", "Ärztin", "."],
    distractors: ["Er", "ist", "Es", "ist"],
    answer_de: "Sie ist Ärztin.",
    hint: "sein: sie → ist",
  },
  {
    id: "sb_045",
    prompt_tr: "Vaktin var mı?",
    tokens: ["Hast", "du", "Zeit", "?"],
    distractors: ["Habe", "ich", "Hat", "er"],
    answer_de: "Hast du Zeit?",
    hint: "haben: du → hast",
  },
  {
    id: "sb_046",
    prompt_tr: "O (erkek) Türkiye'den geliyor.",
    tokens: ["Er", "kommt", "aus", "der", "Türkei", "."],
    distractors: ["Ich", "komme", "Du", "kommst"],
    answer_de: "Er kommt aus der Türkei.",
    hint: "kommen: er → kommt",
  },
  {
    id: "sb_047",
    prompt_tr: "Ne yapıyorsun?",
    tokens: ["Was", "machst", "du", "?"],
    distractors: ["macht", "er", "mache", "ich"],
    answer_de: "Was machst du?",
    hint: "machen: du → machst",
  },
  {
    id: "sb_048",
    prompt_tr: "Almanca öğreniyorsun.",
    tokens: ["Du", "lernst", "Deutsch", "."],
    distractors: ["Ich", "lerne", "Er", "lernt"],
    answer_de: "Du lernst Deutsch.",
    hint: "lernen: du → lernst",
  },
  {
    id: "sb_049",
    prompt_tr: "O (erkek) burada çalışıyor.",
    tokens: ["Er", "arbeitet", "hier", "."],
    distractors: ["Ich", "arbeite", "Du", "arbeitest"],
    answer_de: "Er arbeitet hier.",
    hint: "arbeiten: er → arbeitet",
  },
];

const existingIds = new Set(core.sentenceBuilder.exercises.map((e) => e.id));
for (const ex of newExercises) {
  if (!existingIds.has(ex.id)) {
    core.sentenceBuilder.exercises.push(ex);
  }
}

fs.writeFileSync(corePath, JSON.stringify(core, null, 2), "utf8");
console.log(
  `✓ a1-core patched — pronouns: ${core.grammar.pronouns.items.length}, satz: ${core.sentenceBuilder.exercises.length}, pack pronouns quiz: ${packPronouns?.quiz.length}`
);
