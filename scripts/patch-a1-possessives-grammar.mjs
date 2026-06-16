// Patch a1-core — Possessivartikel grammar pack section
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corePath = path.join(__dirname, "../data/grundlagen/a1-core.json");
const core = JSON.parse(fs.readFileSync(corePath, "utf8"));

const hasPossessiv = core.grammarPack.sections.some((s) => s.id === "possessiv");
if (!hasPossessiv) {
  const akkusativIdx = core.grammarPack.sections.findIndex((s) => s.id === "akkusativ");
  const insertAt = akkusativIdx >= 0 ? akkusativIdx + 1 : core.grammarPack.sections.length;

  core.grammarPack.sections.splice(insertAt, 0, {
    id: "possessiv",
    title: "Possessivartikel",
    titleTr: "Sahiplik zamirleri",
    reference: {
      items: [
        { de: "mein Sohn (der)", tr: "benim oğlum" },
        { de: "meine Schwester (die)", tr: "benim kız kardeşim" },
        { de: "mein Kind (das)", tr: "benim çocuğum" },
        { de: "dein Sohn / deine Schwester", tr: "senin oğlun / kız kardeşin" },
        { de: "sein Sohn / seine Schwester", tr: "onun (erkek) oğlu / kız kardeşi" },
        { de: "ihr Sohn / ihre Schwester", tr: "onun (kadın) oğlu / kız kardeşi" },
        { de: "unser Sohn / unsere Familie", tr: "bizim oğlumuz / ailemiz" },
        { de: "euer Sohn / eure Familie", tr: "sizin oğlunuz / aileniz" },
      ],
      examples: [
        { de: "Anna, ist deine Schwester Lehrerin?", tr: "Anna, kız kardeşin öğretmen mi?" },
        { de: "David, ist dein Sohn Bäcker?", tr: "David, oğlun fırıncı mı?" },
      ],
    },
    quiz: [
      {
        id: "po_01",
        question_tr: "die Schwester → hangi form? (senin)",
        options: ["deine", "dein", "deinen", "deins"],
        correct_index: 0,
      },
      {
        id: "po_02",
        question_tr: "der Sohn → hangi form? (senin)",
        options: ["dein", "deine", "deinen", "deins"],
        correct_index: 0,
      },
      {
        id: "po_03",
        question_tr: "das Kind → hangi form? (benim)",
        options: ["mein", "meine", "meinen", "meins"],
        correct_index: 0,
      },
      {
        id: "po_04",
        question_tr: "die Familie → hangi form? (bizim)",
        options: ["unsere", "unser", "unseren", "unseres"],
        correct_index: 0,
      },
      {
        id: "po_05",
        question_tr: "der Bruder → hangi form? (onun — erkek)",
        options: ["sein", "seine", "seinen", "seins"],
        correct_index: 0,
      },
      {
        id: "po_06",
        question_tr: "die Mutter → hangi form? (onun — kadın)",
        options: ["ihre", "ihr", "ihren", "ihres"],
        correct_index: 0,
      },
    ],
  });
}

fs.writeFileSync(corePath, JSON.stringify(core, null, 2), "utf8");
console.log(
  `✓ a1-core possessiv — sections: ${core.grammarPack.sections.length}, possessiv quiz: ${
    core.grammarPack.sections.find((s) => s.id === "possessiv")?.quiz.length ?? 0
  }`
);
