// Patch word-order — conjunction section + extra w-fragen drills
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WO = path.join(__dirname, "../data/grundlagen/a1-word-order.json");
const wo = JSON.parse(fs.readFileSync(WO, "utf8"));

if (!wo.sections.find((s) => s.id === "conjunction")) {
  wo.sections.push({
    id: "conjunction",
    order: 4,
    title: "Bağlaçlar",
    titleTr: "und / aber / denn",
    rule_de: "Hauptsatz + Konjunktion + Hauptsatz",
    rule_tr: "Cümle + bağlaç + cümle",
    examples: [
      { de: "Ich lerne Deutsch, aber es ist schwer.", tr: "Almanca öğreniyorum ama zor." },
      { de: "Er isst Brot und trinkt Kaffee.", tr: "Ekmek yiyor ve kahve içiyor." },
      { de: "Ich bleibe zu Hause, denn ich bin müde.", tr: "Evde kalıyorum çünkü yorgunum." },
    ],
    drill: [
      {
        id: "wo-kon-01",
        type: "reorder",
        category: "statement",
        prompt_tr: "und ile birleştir",
        tokens: ["Er", "isst", "Brot", "und", "trinkt", "Kaffee", "."],
        distractors: ["aber", "denn"],
        answer_de: "Er isst Brot und trinkt Kaffee.",
        hint_tr: "… und …",
      },
      {
        id: "wo-kon-02",
        type: "reorder",
        category: "statement",
        prompt_tr: "aber ile birleştir",
        tokens: ["Ich", "lerne", "Deutsch", ",", "aber", "es", "ist", "schwer", "."],
        distractors: ["und", "denn"],
        answer_de: "Ich lerne Deutsch, aber es ist schwer.",
        hint_tr: "… , aber …",
      },
      {
        id: "wo-kon-03",
        type: "reorder",
        category: "statement",
        prompt_tr: "denn ile birleştir",
        tokens: ["Ich", "bleibe", "zu", "Hause", ",", "denn", "ich", "bin", "müde", "."],
        distractors: ["und", "aber"],
        answer_de: "Ich bleibe zu Hause, denn ich bin müde.",
        hint_tr: "… , denn …",
      },
      {
        id: "wo-kon-04",
        type: "reorder",
        category: "statement",
        prompt_tr: "Sırayı kur",
        tokens: ["Sie", "kommt", "und", "er", "geht", "."],
        distractors: ["aber", "denn"],
        answer_de: "Sie kommt und er geht.",
        hint_tr: "und bağlar",
      },
      {
        id: "wo-kon-05",
        type: "reorder",
        category: "statement",
        prompt_tr: "aber — olumsuz ikinci cümle",
        tokens: ["Ich", "habe", "Zeit", ",", "aber", "ich", "komme", "nicht", "."],
        distractors: ["und", "denn"],
        answer_de: "Ich habe Zeit, aber ich komme nicht.",
        hint_tr: "… , aber …",
      },
    ],
  });
}

const wq = wo.sections.find((s) => s.id === "w_question");
if (wq) {
  const extra = [
    {
      id: "wo-wq-extra-01",
      type: "reorder",
      category: "w_question",
      prompt_tr: "Wohin sorusu",
      tokens: ["Wohin", "gehst", "du", "?"],
      distractors: ["Wo", "Woher"],
      answer_de: "Wohin gehst du?",
      hint_tr: "Wohin = nereye",
    },
    {
      id: "wo-wq-extra-02",
      type: "reorder",
      category: "w_question",
      prompt_tr: "Woher sorusu",
      tokens: ["Woher", "kommst", "du", "?"],
      distractors: ["Wo", "Wohin"],
      answer_de: "Woher kommst du?",
      hint_tr: "Woher = nereden",
    },
    {
      id: "wo-wq-extra-03",
      type: "reorder",
      category: "w_question",
      prompt_tr: "Warum sorusu",
      tokens: ["Warum", "lernst", "du", "Deutsch", "?"],
      distractors: ["Wann", "Wo"],
      answer_de: "Warum lernst du Deutsch?",
      hint_tr: "Warum = neden",
    },
    {
      id: "wo-wq-extra-04",
      type: "reorder",
      category: "w_question",
      prompt_tr: "Wann sorusu",
      tokens: ["Wann", "beginnt", "der", "Kurs", "?"],
      distractors: ["Wo", "Was"],
      answer_de: "Wann beginnt der Kurs?",
      hint_tr: "Wann = ne zaman",
    },
    {
      id: "wo-wq-extra-05",
      type: "reorder",
      category: "w_question",
      prompt_tr: "Wer sorusu",
      tokens: ["Wer", "ist", "das", "?"],
      distractors: ["Was", "Wo"],
      answer_de: "Wer ist das?",
      hint_tr: "Wer = kim",
    },
  ];
  for (const d of extra) {
    if (!wq.drill.some((x) => x.id === d.id)) wq.drill.push(d);
  }
}

fs.writeFileSync(WO, JSON.stringify(wo, null, 2), "utf8");
console.log(`✓ a1-word-order patched — sections: ${wo.sections.length}`);
