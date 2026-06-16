// A1 Word Order Trainer — run: npm run build:word-order
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "data/grundlagen/a1-word-order.json");

function tok(s) {
  return s.replace(/\s+/g, " ").trim().split(" ");
}

function shuffle(arr, seed = 0) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function reorderEx(id, prompt_tr, answer_de, hint_tr, category = "statement") {
  const tokens = tok(answer_de);
  const distractors = shuffle(
    ["Ich", "Er", "Wir", "Sie", "ist", "bin", "nicht", "auch"].filter((d) => !tokens.includes(d)),
    id.length
  ).slice(0, 3);
  return {
    id,
    type: "reorder",
    category,
    prompt_tr,
    tokens,
    distractors,
    answer_de,
    hint_tr,
  };
}

function transformEx(id, statement_de, answer_de, prompt_tr, hint_tr, category = "yes_no") {
  const tokens = tok(answer_de);
  const stTokens = tok(statement_de);
  const distractors = shuffle(
    [...stTokens.filter((t) => t !== "."), "Ich", "Er", "nicht"].filter((d) => !tokens.includes(d)),
    id.length
  ).slice(0, 3);
  return {
    id,
    type: "transform",
    category,
    prompt_tr,
    statement_de,
    tokens,
    distractors,
    answer_de,
    hint_tr,
  };
}

function gapEx(id, context_de, options, correct_index, prompt_tr, hint_tr, category = "w_question") {
  return {
    id,
    type: "gap",
    category,
    prompt_tr,
    context_de,
    options,
    correct_index,
    hint_tr,
  };
}

function compareEx(id, statement_de, question_de, options, correct_index, explanation_tr, category = "compare") {
  return {
    id,
    type: "compare",
    category,
    prompt_tr: "İki cümle arasındaki fark nedir?",
    statement_de,
    question_de,
    options,
    correct_index,
    explanation_tr,
  };
}

function spotVerbEx(
  id,
  statement_de,
  answer_de,
  verb,
  extraDistractors,
  hint_tr,
  category = "yes_no"
) {
  const tokens = tok(answer_de);
  const stTokens = tok(statement_de).filter((t) => t !== ".");
  const word_pool = shuffle([...new Set([...stTokens, ...extraDistractors])], id.length);
  const distractors = shuffle(
    ["Ich", "Er", "Wir", "nicht"].filter((d) => !tokens.includes(d)),
    id.length
  ).slice(0, 3);
  return {
    id,
    type: "spot_verb",
    category,
    prompt_tr: "Önce fiili (motoru) bul, sonra soruyu kur",
    statement_de,
    verb,
    word_pool,
    tokens,
    distractors,
    answer_de,
    hint_tr,
    verb_hint_tr: `Motor: ${verb} — soruda fiil polis gibi öne geçer`,
  };
}

// --- Section 1: Normal cümle (SVO) ---
const STATEMENT_EXAMPLES = [
  { de: "Ich komme aus Istanbul.", tr: "İstanbul'dan geliyorum." },
  { de: "Du arbeitest heute.", tr: "Bugün çalışıyorsun." },
  { de: "Er spielt Fußball.", tr: "Futbol oynuyor." },
  { de: "Mein Papa joggt oft.", tr: "Babam sık koşar." },
  { de: "Wir lernen Deutsch.", tr: "Almanca öğreniyoruz." },
];

const statementDrill = [
  reorderEx("wo-st-01", "Kelime sırası: Özne + Fiil + …", "Ich komme aus Istanbul.", "Ich + komme + aus Istanbul"),
  reorderEx("wo-st-02", "Doğru cümle sırası", "Du arbeitest heute.", "Du + arbeitest + heute"),
  reorderEx("wo-st-03", "Sırayı kur", "Er spielt Fußball.", "Er + spielt + Fußball"),
  reorderEx("wo-st-04", "Normal cümle (SVO)", "Mein Papa joggt oft.", "Mein Papa + joggt + oft"),
  reorderEx("wo-st-05", "Sırayı kur", "Wir lernen Deutsch.", "Wir + lernen + Deutsch"),
  reorderEx("wo-st-06", "Doğru sıra", "Sie wohnt in Berlin.", "Sie + wohnt + in Berlin"),
  reorderEx("wo-st-07", "Cümleyi kur", "Ich bin müde.", "Ich + bin + müde"),
  reorderEx("wo-st-08", "Sırayı kur", "Du kommst aus der Türkei.", "Du + kommst + aus der Türkei"),
  reorderEx("wo-st-09", "Normal cümle", "Er hat einen Bruder.", "Er + hat + einen Bruder"),
  reorderEx("wo-st-10", "Sırayı kur", "Wir spielen heute.", "Wir + spielen + heute"),
];

// --- Section 2: Ja/Nein soruları ---
const YESNO_EXAMPLES = [
  { de: "David joggt oft.", tr: "David sık koşar." },
  { de: "Joggt David oft?", tr: "Motor joggt öne geçti — David sık koşar mı?" },
  { de: "David arbeitet heute.", tr: "David bugün çalışıyor." },
  { de: "Arbeitet David heute?", tr: "Fiil başta: David bugün çalışıyor mu?" },
  { de: "Alex spielt Tennis.", tr: "Alex tenis oynuyor." },
  { de: "Spielt Alex Tennis?", tr: "Spielt → öne: Alex tenis oynuyor mu?" },
  { de: "Du kommst aus Istanbul.", tr: "İstanbul'dan geliyorsun." },
  { de: "Kommst du aus Istanbul?", tr: "Kommst başta — İstanbul'dan mısın?" },
];

const yesNoDrill = [
  spotVerbEx(
    "wo-yn-01",
    "David joggt oft.",
    "Joggt David oft?",
    "joggt",
    ["Lehrerin", "Anna"],
    "Normal: David joggt oft. → Soru: Joggt David oft?"
  ),
  spotVerbEx(
    "wo-yn-02",
    "Du kommst aus Istanbul.",
    "Kommst du aus Istanbul?",
    "kommst",
    ["Istanbul", "Berlin"],
    "Motor: kommst → öne: Kommst du …?"
  ),
  spotVerbEx(
    "wo-yn-03",
    "David arbeitet heute.",
    "Arbeitet David heute?",
    "arbeitet",
    ["heute", "Lehrer"],
    "Arbeitet David heute?"
  ),
  spotVerbEx(
    "wo-yn-04",
    "Alex spielt Tennis.",
    "Spielt Alex Tennis?",
    "spielt",
    ["Tennis", "Fußball"],
    "Spielt Alex Tennis?"
  ),
  spotVerbEx(
    "wo-yn-05",
    "Du joggst oft.",
    "Joggst du oft?",
    "joggst",
    ["oft", "Lehrerin"],
    "Joggst du oft?"
  ),
  spotVerbEx(
    "wo-yn-06",
    "Du bist müde.",
    "Bist du müde?",
    "bist",
    ["müde", "oft"],
    "Bist du müde?"
  ),
  transformEx("wo-yn-07", "Du hast einen Bruder.", "Hast du einen Bruder?", "Soruya çevir", "Hast du …?"),
  transformEx("wo-yn-08", "Du lernst Deutsch.", "Lernst du Deutsch?", "Soruya çevir", "Lernst du …?"),
  transformEx("wo-yn-09", "Du wohnst in Berlin.", "Wohnst du in Berlin?", "Soruya çevir", "Wohnst du …?"),
  transformEx("wo-yn-10", "Du spielst Fußball.", "Spielst du Fußball?", "Soruya çevir", "Spielst du …?"),
];

// --- Section 3: W-Fragen ---
const W_EXAMPLES = [
  { de: "Wie heißt du?", tr: "Adın ne?" },
  { de: "Wo wohnst du?", tr: "Nerede oturuyorsun?" },
  { de: "Woher kommst du?", tr: "Nereden geliyorsun?" },
  { de: "Was machst du?", tr: "Ne yapıyorsun?" },
  { de: "Wann arbeitest du?", tr: "Ne zaman çalışıyorsun?" },
];

const wDrill = [
  gapEx("wo-w-01", "___ heißt du?", ["Wie", "Wo", "Was", "Wann"], 0, "Eksik W-Frage kelimesi", "Wie = nasıl / ne (ad)"),
  gapEx("wo-w-02", "Wo ___ du?", ["wohnst", "wohnen", "wohnt", "kommst"], 0, "Eksik fiili yerleştir", "Wo wohnst du?"),
  gapEx("wo-w-03", "Woher ___ du?", ["kommst", "komme", "kommt", "kommen"], 0, "Eksik fiil", "Woher kommst du?"),
  gapEx("wo-w-04", "Was ___ du?", ["machst", "macht", "mache", "machen"], 0, "Eksik fiil", "Was machst du?"),
  gapEx("wo-w-05", "Wann ___ du?", ["arbeitest", "arbeitet", "arbeite", "arbeiten"], 0, "Eksik fiil", "Wann arbeitest du?"),
  gapEx("wo-w-06", "___ alt bist du?", ["Wie", "Wo", "Was", "Wer"], 0, "Wie alt = kaç yaşında", "Wie alt bist du?"),
  gapEx("wo-w-07", "___ ist das?", ["Was", "Wo", "Wie", "Wann"], 0, "Was = ne", "Was ist das?"),
  gapEx("wo-w-08", "___ wohnst du?", ["Wo", "Was", "Wie", "Woher"], 0, "Wo = nerede", "Wo wohnst du?"),
  gapEx("wo-w-09", "___ kommst du?", ["Woher", "Wo", "Was", "Wie"], 0, "Woher = nereden", "Woher kommst du?"),
  gapEx("wo-w-10", "___ spielst du Fußball?", ["Wann", "Wo", "Wie", "Was"], 0, "Wann = ne zaman", "Wann spielst du …?"),
];

// --- Section 4: Pattern recognition ---
const COMPARE_OPTS = [
  "Ja/Nein sorusunda fiil 1. sırada",
  "Soruda özne fiilden önce gelir",
  "Kelime sırası tamamen aynı",
  "Soruda fiil sonda",
];

const compareDrill = [
  compareEx(
    "wo-cp-01",
    "Du kommst aus Deutschland.",
    "Kommst du aus Deutschland?",
    COMPARE_OPTS,
    0,
    "Normal: Du kommst … → Soru: Kommst du … (fiil başta)"
  ),
  compareEx(
    "wo-cp-02",
    "Du joggst oft.",
    "Joggst du oft?",
    COMPARE_OPTS,
    0,
    "Du joggst oft. → Joggst du oft?"
  ),
  compareEx(
    "wo-cp-03",
    "Du bist müde.",
    "Bist du müde?",
    COMPARE_OPTS,
    0,
    "sein: Bist du …?"
  ),
  compareEx(
    "wo-cp-04",
    "Du arbeitest heute.",
    "Arbeitest du heute?",
    COMPARE_OPTS,
    0,
    "Fiil çekimi + du = soru"
  ),
  compareEx(
    "wo-cp-05",
    "Ich komme aus Istanbul.",
    "Kommst du aus Istanbul?",
    [
      "Özne değişti (ich → du) ve fiil başta",
      "Sadece noktalama farkı",
      "Fiil sonda kaldı",
      "Hiç fark yok",
    ],
    0,
    "Soru ayrıca du formunda — fiil yine başta"
  ),
  compareEx(
    "wo-cp-06",
    "Du hast einen Bruder.",
    "Hast du einen Bruder?",
    COMPARE_OPTS,
    0,
    "haben: Hast du …?"
  ),
  compareEx(
    "wo-cp-07",
    "Du lernst Deutsch.",
    "Lernst du Deutsch?",
    COMPARE_OPTS,
    0,
    "Lernst du …?"
  ),
  compareEx(
    "wo-cp-08",
    "Du wohnst in Berlin.",
    "Wohnst du in Berlin?",
    COMPARE_OPTS,
    0,
    "Wohnst du …?"
  ),
  compareEx(
    "wo-cp-09",
    "Er spielt Fußball.",
    "Spielt er Fußball?",
    ["Fiil başta (er soru)", "Er başta kalır", "Fiil sonda", "Aynı sıra"],
    0,
    "er/sie için de: Spielt er …?"
  ),
  compareEx(
    "wo-cp-10",
    "Wir lernen Deutsch.",
    "Lernt ihr Deutsch?",
    [
      "Fiil başta, ihr özne",
      "Wir değişmedi",
      "Fiil sonda",
      "W-Frage",
    ],
    0,
    "Soru: fiil + özne"
  ),
];

const sections = [
  {
    id: "statement",
    order: 1,
    title: "Normal Cümle",
    titleTr: "Düz cümle (SVO)",
    rule_de: "Subjekt + Verb + Rest",
    rule_tr: "Özne + Fiil + Diğerleri",
    examples: STATEMENT_EXAMPLES,
    drill: statementDrill,
  },
  {
    id: "yes_no",
    order: 2,
    title: "Ja/Nein Soruları",
    titleTr: "Evet/Hayır soruları",
    rule_de: "Verb + Subjekt + Rest",
    rule_tr: "Önce motoru (fiili) bul · Soruda fiil başa",
    examples: YESNO_EXAMPLES.map((e) => ({ de: e.de, tr: e.tr })),
    drill: yesNoDrill,
  },
  {
    id: "w_question",
    order: 3,
    title: "W-Fragen",
    titleTr: "Soru kelimeli sorular",
    rule_de: "W-Wort + Verb + Subjekt",
    rule_tr: "W-Frage + Fiil + Özne",
    examples: W_EXAMPLES,
    drill: wDrill,
  },
  {
    id: "compare",
    order: 4,
    title: "Pattern Recognition",
    titleTr: "Kalıp farkı",
    rule_de: "Aussage: Subjekt zuerst · Frage: Verb zuerst",
    rule_tr: "Düz cümle: özne önce · Soru: fiil önce",
    examples: [
      { de: "Du kommst … → Kommst du …?", tr: "Fiil başa geçer" },
      { de: "Wie heißt du?", tr: "W-Frage + fiil + özne" },
    ],
    drill: compareDrill,
  },
];

// --- Mega drill: 100+ mixed ---
const megaDrill = [];
let megaIdx = 0;

const MORE_STATEMENTS = [
  ["Ich esse gern Pizza.", "Pizzayı severim"],
  ["Du trinkst Wasser.", "Su içiyorsun"],
  ["Er liest ein Buch.", "Kitap okuyor"],
  ["Wir gehen heute.", "Bugün gidiyoruz"],
  ["Sie spricht Deutsch.", "Almanca konuşuyor"],
  ["Ich wohne in München.", "Münih'te oturuyorum"],
  ["Du hast Zeit.", "Vaktin var"],
  ["Er ist Lehrer.", "Öğretmen"],
  ["Meine Mutter kocht.", "Annem yemek yapıyor"],
  ["Das Kind spielt.", "Çocuk oynuyor"],
  ["Ich fahre mit dem Bus.", "Otobüsle gidiyorum"],
  ["Du kommst morgen.", "Yarın geliyorsun"],
  ["Er arbeitet hier.", "Burada çalışıyor"],
  ["Wir sind Freunde.", "Arkadaşız"],
  ["Ich heiße Timur.", "Adım Timur"],
];

for (const [de, tr] of MORE_STATEMENTS) {
  megaDrill.push(
    reorderEx(`wo-mg-r${megaIdx++}`, tr + " — sırayı kur", de, "SVO: özne + fiil", "mixed")
  );
}

const MORE_YESNO = [
  ["Du isst Pizza.", "Isst du Pizza?"],
  ["Du trinkst Kaffee.", "Trinkst du Kaffee?"],
  ["Du liest heute.", "Liest du heute?"],
  ["Du gehst nach Hause.", "Gehst du nach Hause?"],
  ["Du sprichst Türkisch.", "Sprichst du Türkisch?"],
  ["Du hast Hunger.", "Hast du Hunger?"],
  ["Du bist Student.", "Bist du Student?"],
  ["Du fährst mit dem Zug.", "Fährst du mit dem Zug?"],
  ["Du kommst heute.", "Kommst du heute?"],
  ["Du arbeitest hier.", "Arbeitest du hier?"],
  ["Du lernst Englisch.", "Lernst du Englisch?"],
  ["Du wohnst allein.", "Wohnst du allein?"],
  ["Du machst Hausaufgaben.", "Machst du Hausaufgaben?"],
  ["Du spielst Gitarre.", "Spielst du Gitarre?"],
  ["Du bist aus der Türkei.", "Bist du aus der Türkei?"],
];

for (const [st, q] of MORE_YESNO) {
  megaDrill.push(
    transformEx(`wo-mg-t${megaIdx++}`, st, q, "Soruya çevir", "Fiil başta", "mixed")
  );
}

const SPOT_VERB_MEGA = [
  ["David joggt oft.", "Joggt David oft?", "joggt", ["Lehrerin", "Anna"]],
  ["Maria arbeitet heute.", "Arbeitet Maria heute?", "arbeitet", ["Lehrer", "oft"]],
  ["Alex spielt Tennis.", "Spielt Alex Tennis?", "spielt", ["Fußball", "oft"]],
  ["Timur kommt morgen.", "Kommt Timur morgen?", "kommt", ["heute", "Berlin"]],
  ["Lisa wohnt in Berlin.", "Wohnt Lisa in Berlin?", "wohnt", ["Hamburg", "oft"]],
  ["Emma lernt Deutsch.", "Lernt Emma Deutsch?", "lernt", ["Englisch", "heute"]],
  ["Paul hat Zeit.", "Hat Paul Zeit?", "hat", ["Geld", "oft"]],
  ["Anna ist müde.", "Ist Anna müde?", "ist", ["oft", "heute"]],
  ["Mehmet spielt Fußball.", "Spielt Mehmet Fußball?", "spielt", ["Tennis", "oft"]],
  ["Du arbeitest heute.", "Arbeitest du heute?", "arbeitest", ["Lehrerin", "morgen"]],
  ["Du kommst aus Istanbul.", "Kommst du aus Istanbul?", "kommst", ["Berlin", "oft"]],
  ["Er joggt oft.", "Joggt er oft?", "joggt", ["Lehrerin", "David"]],
  ["Sie wohnt hier.", "Wohnt sie hier?", "wohnt", ["dort", "oft"]],
  ["Ihr lernt Deutsch.", "Lernt ihr Deutsch?", "lernt", ["Englisch", "heute"]],
  ["Ihr spielt Tennis.", "Spielt ihr Tennis?", "spielt", ["Fußball", "oft"]],
];

for (const [st, ans, verb, dist] of SPOT_VERB_MEGA) {
  megaDrill.push(
    spotVerbEx(`wo-mg-sv${megaIdx++}`, st, ans, verb, dist, `${st} → ${ans}`, "mixed")
  );
}

const MORE_W = [
  ["___ heißt du?", ["Wie", "Wo", "Was", "Wer"], 0],
  ["Wo ___ du?", ["wohnst", "wohne", "wohnt", "kommst"], 0],
  ["Woher ___ du?", ["kommst", "komme", "kommt", "kommen"], 0],
  ["Was ___ du?", ["machst", "macht", "mache", "machen"], 0],
  ["Wann ___ du?", ["arbeitest", "arbeitet", "arbeite", "arbeiten"], 0],
  ["Wie ___ du?", ["heißt", "heiße", "heißen", "heisst"], 0],
  ["Wo ___ er?", ["wohnt", "wohnst", "wohne", "wohnen"], 2],
  ["Was ___ das?", ["ist", "sind", "bin", "bist"], 0],
  ["Wann ___ wir?", ["lernen", "lernt", "lernst", "lerne"], 0],
  ["Woher ___ Sie?", ["kommen", "kommt", "kommst", "komme"], 0],
  ["Wie ___ Sie?", ["heißen", "heißt", "heiße", "heisst"], 0],
  ["Was ___ du heute?", ["machst", "macht", "mache", "machen"], 0],
  ["Wo ___ ihr?", ["wohnt", "wohnst", "wohne", "wohnen"], 0],
  ["Wann ___ du?", ["kommst", "kommt", "komme", "kommen"], 0],
  ["Wie alt ___ du?", ["bist", "bin", "ist", "sind"], 0],
];

for (const [ctx, opts, ci] of MORE_W) {
  megaDrill.push(gapEx(`wo-mg-g${megaIdx++}`, ctx, opts, ci, "Eksik parçayı seç", "W + fiil + özne", "mixed"));
}

const MORE_COMPARE = [
  ["Du isst Pizza.", "Isst du Pizza?"],
  ["Du trinkst Wasser.", "Trinkst du Wasser?"],
  ["Er liest ein Buch.", "Liest er ein Buch?"],
  ["Du bist hier.", "Bist du hier?"],
  ["Du hast Zeit.", "Hast du Zeit?"],
  ["Wir lernen.", "Lernt ihr?"],
  ["Sie kommt.", "Kommt sie?"],
  ["Du wohnst hier.", "Wohnst du hier?"],
  ["Ich bin müde.", "Bist du müde?"],
  ["Du machst Sport.", "Machst du Sport?"],
];

for (const [st, q] of MORE_COMPARE) {
  megaDrill.push(
    compareEx(
      `wo-mg-c${megaIdx++}`,
      st,
      q,
      COMPARE_OPTS,
      0,
      `${st} → ${q}: fiil başa`
    )
  );
}

// Pad to 110+ with extra reorder/yes-no variants
const EXTRA_REORDER = [
  "Ich gehe ins Kino.",
  "Du siehst fern.",
  "Er kauft Brot.",
  "Wir essen zusammen.",
  "Sie tanzt gern.",
  "Ich schlafe spät.",
  "Du rufst an.",
  "Er kommt später.",
  "Wir fahren nach Hause.",
  "Du lernst schnell.",
];

for (const de of EXTRA_REORDER) {
  megaDrill.push(reorderEx(`wo-mg-x${megaIdx++}`, "Cümle sırası", de, "SVO", "mixed"));
}

const EXTRA_TRANSFORM = [
  ["Du kaufst Brot.", "Kaufst du Brot?"],
  ["Du gehst ins Bett.", "Gehst du ins Bett?"],
  ["Du siehst fern.", "Siehst du fern?"],
  ["Du rufst mich an.", "Rufst du mich an?"],
  ["Du kommst spät.", "Kommst du spät?"],
  ["Du isst gern.", "Isst du gern?"],
  ["Du trinkst Tee.", "Trinkst du Tee?"],
  ["Du liest Zeitung.", "Liest du Zeitung?"],
  ["Du fährst Auto.", "Fährst du Auto?"],
  ["Du schläfst viel.", "Schläfst du viel?"],
  ["Du tanzt gut.", "Tanzt du gut?"],
  ["Du singst laut.", "Singst du laut?"],
  ["Du kochst heute.", "Kochst du heute?"],
  ["Du wartest hier.", "Wartest du hier?"],
  ["Du findest es.", "Findest du es?"],
  ["Du nimmst den Bus.", "Nimmst du den Bus?"],
  ["Du gibst mir Zeit.", "Gibst du mir Zeit?"],
  ["Du zeigst den Weg.", "Zeigst du den Weg?"],
  ["Du heißt Anna.", "Heißt du Anna?"],
  ["Du bleibst hier.", "Bleibst du hier?"],
];

for (const [st, q] of EXTRA_TRANSFORM) {
  megaDrill.push(transformEx(`wo-mg-y${megaIdx++}`, st, q, "Soruya çevir", "Fiil başta", "mixed"));
}

const EXTRA_REORDER2 = [
  "Du gehst zur Schule.",
  "Ich bin in der Türkei.",
  "Er kommt aus Berlin.",
  "Wir haben Zeit.",
  "Sie ist Ärztin.",
  "Ich trinke Kaffee.",
  "Du isst Brot.",
  "Er wohnt hier.",
  "Wir spielen Tennis.",
  "Ich lerne Deutsch.",
  "Du arbeitest viel.",
  "Er hat einen Hund.",
  "Wir kommen morgen.",
  "Sie spricht Englisch.",
  "Ich fahre nach Hause.",
];

for (const de of EXTRA_REORDER2) {
  megaDrill.push(reorderEx(`wo-mg-z${megaIdx++}`, "Sırayı kur", de, "SVO", "mixed"));
}

function validate(data) {
  if (data.sections.length !== 4) throw new Error("Expected 4 sections");
  const ids = new Set();
  for (const s of data.sections) {
    if (s.drill.length !== 10) throw new Error(`${s.id}: need 10 drill`);
    for (const e of s.drill) {
      if (ids.has(e.id)) throw new Error(`Duplicate ${e.id}`);
      ids.add(e.id);
      if (e.type === "spot_verb" && (!e.verb || !e.word_pool?.length)) {
        throw new Error(`${e.id}: spot_verb needs verb + word_pool`);
      }
    }
  }
  for (const e of data.megaDrill) {
    if (ids.has(e.id)) throw new Error(`Duplicate mega ${e.id}`);
    ids.add(e.id);
  }
  if (data.megaDrill.length < 100) throw new Error(`Need 100+ mega, got ${data.megaDrill.length}`);
}

const output = {
  version: "1.0.0",
  level: "A1",
  title: "Word Order Trainer",
  titleTr: "Kelime Sırası Motoru",
  description: "SVO · Ja/Nein · W-Fragen · 100+ drill — Goethe A1 soru kalıpları",
  passThreshold: 8,
  drillsPerSection: 10,
  sections,
  megaDrill,
};

validate(output);
fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");
console.log(
  `✓ a1-word-order.json — ${output.sections.length} sections, ${output.megaDrill.length} mega drill → ${OUT}`
);
