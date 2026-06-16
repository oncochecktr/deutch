import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const corePath = path.join(__dirname, "../data/grundlagen/a1-core.json");
const core = JSON.parse(fs.readFileSync(corePath, "utf8"));

core.grammar.jaNein = {
  title: "Ja/Nein Fragen",
  titleTr: "Evet/Hayır soruları",
  items: [
    { de: "Verb an Position 1 + du/Sie?", tr: "Fiil başa + du/Sie?" },
    { de: "Ja, …", tr: "Evet, … (tam cümle)" },
    { de: "Nein, …", tr: "Hayır, … (tam cümle)" },
  ],
  examples: [
    {
      de: "Kommst du aus der Türkei?",
      tr: "Türkiye'den misin?",
      example_de: "Ja, ich komme aus der Türkei.",
      example_tr: "Evet, Türkiye'denim.",
    },
    {
      de: "Hast du Zeit?",
      tr: "Vaktin var mı?",
      example_de: "Nein, ich habe keine Zeit.",
      example_tr: "Hayır, vaktim yok.",
    },
    {
      de: "Lernst du Deutsch?",
      tr: "Almanca öğreniyor musun?",
      example_de: "Ja, ich lerne Deutsch.",
      example_tr: "Evet, Almanca öğreniyorum.",
    },
    {
      de: "Wohnst du in Berlin?",
      tr: "Berlin'de mi oturuyorsun?",
      example_de: "Nein, ich wohne in Ankara.",
      example_tr: "Hayır, Ankara'da oturuyorum.",
    },
  ],
};

core.grammar.akkusativ = {
  title: "Akkusativ",
  titleTr: "Belirtme hali (Akkusativ)",
  items: [
    { de: "ein → einen (der)", tr: "eril: ein Hund → einen Hund" },
    { de: "eine → eine (die)", tr: "dişil: eine Katze → eine Katze" },
    { de: "ein → ein (das)", tr: "nötr: ein Kind → ein Kind" },
  ],
  examples: [
    { de: "Ich habe einen Hund.", tr: "Bir köpeğim var." },
    { de: "Ich kaufe einen Apfel.", tr: "Bir elma alıyorum." },
    { de: "Ich trinke eine Cola.", tr: "Bir kola içiyorum." },
    { de: "Ich esse ein Brötchen.", tr: "Bir küçük ekmek yiyorum." },
    { de: "Ich brauche einen Stift.", tr: "Bir kaleme ihtiyacım var." },
    { de: "Ich möchte einen Kaffee.", tr: "Bir kahve istiyorum." },
  ],
};

core.grammar.trennbareVerben = {
  title: "Trennbare Verben",
  titleTr: "Ayrılabilen fiiller",
  verbs: [
    {
      infinitive: "aufstehen",
      prefix: "auf",
      tr: "kalkmak",
      example_de: "Ich stehe um 7 Uhr auf.",
      example_tr: "Saat 7'de kalkıyorum.",
    },
    {
      infinitive: "einkaufen",
      prefix: "ein",
      tr: "alışveriş yapmak",
      example_de: "Ich kaufe im Supermarkt ein.",
      example_tr: "Süpermarkette alışveriş yapıyorum.",
    },
    {
      infinitive: "anrufen",
      prefix: "an",
      tr: "telefon etmek",
      example_de: "Ich rufe meine Mutter an.",
      example_tr: "Annemi arıyorum.",
    },
    {
      infinitive: "fernsehen",
      prefix: "fern",
      tr: "televizyon izlemek",
      example_de: "Am Abend sehe ich fern.",
      example_tr: "Akşam televizyon izliyorum.",
    },
    {
      infinitive: "mitkommen",
      prefix: "mit",
      tr: "birlikte gelmek",
      example_de: "Kommst du mit?",
      example_tr: "Sen de geliyor musun?",
    },
    {
      infinitive: "abholen",
      prefix: "ab",
      tr: "almak (yolcu)",
      example_de: "Ich hole dich ab.",
      example_tr: "Seni alıyorum.",
    },
    {
      infinitive: "zuhören",
      prefix: "zu",
      tr: "dinlemek",
      example_de: "Hör bitte zu!",
      example_tr: "Lütfen dinle!",
    },
    {
      infinitive: "anfangen",
      prefix: "an",
      tr: "başlamak",
      example_de: "Der Kurs fängt um 9 Uhr an.",
      example_tr: "Kurs saat 9'da başlıyor.",
    },
  ],
};

const sentences = [
  ["Ben öğrenciyim.", ["Ich", "bin", "Student", "."], [], "Ich bin Student.", "sein: ich → bin"],
  ["Ben Timur'um.", ["Ich", "bin", "Timur", "."], ["du"], "Ich bin Timur.", "sein"],
  ["Sen öğrencisin.", ["Du", "bist", "Student", "."], ["Ich"], "Du bist Student.", "sein: du → bist"],
  ["Biz Türkiye'deniz.", ["Wir", "sind", "aus", "der", "Türkei", "."], [], "Wir sind aus der Türkei.", "sein + aus"],
  ["Ben Almanya'dayım.", ["Ich", "bin", "in", "Deutschland", "."], [], "Ich bin in Deutschland.", "sein + in"],
  ["Bir arabam var.", ["Ich", "habe", "ein", "Auto", "."], ["du"], "Ich habe ein Auto.", "haben: ich → habe"],
  ["Vaktin var mı? (soru)", ["Hast", "du", "Zeit", "?"], ["Ich", "habe"], "Hast du Zeit?", "haben + du"],
  ["Bir köpeğim var.", ["Ich", "habe", "einen", "Hund", "."], [], "Ich habe einen Hund.", "Akkusativ: einen"],
  ["İki çocuğum var.", ["Ich", "habe", "zwei", "Kinder", "."], [], "Ich habe zwei Kinder.", "haben + sayı"],
  ["Türkiye'den geliyorum.", ["Ich", "komme", "aus", "der", "Türkei", "."], [], "Ich komme aus der Türkei.", "kommen + aus"],
  ["Almanya'dan geliyorum.", ["Ich", "komme", "aus", "Deutschland", "."], ["in"], "Ich komme aus Deutschland.", "kommen"],
  ["Ankara'da oturuyorum.", ["Ich", "wohne", "in", "Ankara", "."], [], "Ich wohne in Ankara.", "wohnen + in"],
  ["Berlin'de oturuyorum.", ["Ich", "wohne", "in", "Berlin", "."], ["aus"], "Ich wohne in Berlin.", "wohnen"],
  ["İstanbul'da oturuyorum.", ["Ich", "wohne", "in", "Istanbul", "."], [], "Ich wohne in Istanbul.", "wohnen + in"],
  ["Depo işçisi olarak çalışıyorum.", ["Ich", "arbeite", "als", "Lagerist", "."], [], "Ich arbeite als Lagerist.", "arbeiten + als"],
  ["Öğretmen olarak çalışıyorum.", ["Ich", "arbeite", "als", "Lehrer", "."], ["bin"], "Ich arbeite als Lehrer.", "arbeiten"],
  ["Almanca öğrenmek istiyorum.", ["Ich", "möchte", "Deutsch", "lernen", "."], [], "Ich möchte Deutsch lernen.", "möchten"],
  ["Bir kahve istiyorum.", ["Ich", "möchte", "einen", "Kaffee", ",", "bitte", "."], [], "Ich möchte einen Kaffee, bitte.", "möchten + Akkusativ"],
  ["Yardıma ihtiyacım var.", ["Ich", "brauche", "Hilfe", "."], [], "Ich brauche Hilfe.", "brauchen"],
  ["Bugün Almanca öğreniyorum.", ["Heute", "lerne", "ich", "Deutsch", "."], ["morgen"], "Heute lerne ich Deutsch.", "Zeit + fiil"],
  ["Bu kim?", ["Wer", "ist", "das", "?"], [], "Wer ist das?", "W-Frage: Wer"],
  ["Nerede oturuyorsun?", ["Wo", "wohnst", "du", "?"], [], "Wo wohnst du?", "W-Frage: Wo"],
  ["Neredensin?", ["Woher", "kommst", "du", "?"], [], "Woher kommst du?", "W-Frage: Woher"],
  ["Ne zaman başlıyor?", ["Wann", "beginnt", "der", "Kurs", "?"], [], "Wann beginnt der Kurs?", "W-Frage: Wann"],
  ["Türkiye'den misin?", ["Kommst", "du", "aus", "der", "Türkei", "?"], [], "Kommst du aus der Türkei?", "Ja/Nein soru"],
  ["Almanca öğreniyor musun?", ["Lernst", "du", "Deutsch", "?"], [], "Lernst du Deutsch?", "Ja/Nein"],
  ["Evet, Türkiye'denim.", ["Ja", ",", "ich", "komme", "aus", "der", "Türkei", "."], [], "Ja, ich komme aus der Türkei.", "Ja cevabı"],
  ["Hayır, vaktim yok.", ["Nein", ",", "ich", "habe", "keine", "Zeit", "."], [], "Nein, ich habe keine Zeit.", "Nein cevabı"],
  ["Bir elma alıyorum.", ["Ich", "kaufe", "einen", "Apfel", "."], [], "Ich kaufe einen Apfel.", "Akkusativ"],
  ["Bir kola içiyorum.", ["Ich", "trinke", "eine", "Cola", "."], [], "Ich trinke eine Cola.", "Akkusativ: eine"],
  ["Bir kaleme ihtiyacım var.", ["Ich", "brauche", "einen", "Stift", "."], [], "Ich brauche einen Stift.", "Akkusativ: einen"],
  ["Saat 7'de kalkıyorum.", ["Ich", "stehe", "um", "7", "Uhr", "auf", "."], [], "Ich stehe um 7 Uhr auf.", "Trennbar: aufstehen"],
  ["Süpermarkette alışveriş yapıyorum.", ["Ich", "kaufe", "im", "Supermarkt", "ein", "."], [], "Ich kaufe im Supermarkt ein.", "Trennbar: einkaufen"],
  ["Annemi arıyorum.", ["Ich", "rufe", "meine", "Mutter", "an", "."], [], "Ich rufe meine Mutter an.", "Trennbar: anrufen"],
  ["Akşam televizyon izliyorum.", ["Am", "Abend", "sehe", "ich", "fern", "."], [], "Am Abend sehe ich fern.", "Trennbar: fernsehen"],
  ["Sen de geliyor musun?", ["Kommst", "du", "mit", "?"], [], "Kommst du mit?", "Trennbar: mitkommen"],
  ["Kurs saat 9'da başlıyor.", ["Der", "Kurs", "fängt", "um", "9", "Uhr", "an", "."], [], "Der Kurs fängt um 9 Uhr an.", "Trennbar: anfangen"],
  ["Almanca öğrenebilirim.", ["Ich", "kann", "Deutsch", "lernen", "."], [], "Ich kann Deutsch lernen.", "Modal: können"],
  ["Çalışmak zorundayım.", ["Ich", "muss", "arbeiten", "."], [], "Ich muss arbeiten.", "Modal: müssen"],
  ["Eve gitmek istiyorum.", ["Ich", "will", "nach", "Hause", "."], [], "Ich will nach Hause.", "Modal: wollen"],
  ["Nasılsın?", ["Wie", "geht", "es", "dir", "?"], [], "Wie geht es dir?", "W-Frage: Wie"],
];

core.sentenceBuilder = {
  title: "Satz Builder",
  titleTr: "Cümle kur",
  exercises: sentences.map((s, i) => ({
    id: `sb_${String(i + 1).padStart(3, "0")}`,
    prompt_tr: s[0],
    tokens: s[1],
    distractors: s[2],
    answer_de: s[3],
    hint: s[4],
  })),
};

const gpSections = [
  {
    id: "pronouns",
    title: "Pronomen",
    titleTr: "Zamirler",
    refItems: [
      { de: "ich", tr: "ben" },
      { de: "du", tr: "sen" },
      { de: "er", tr: "o (erkek)" },
      { de: "sie", tr: "o (kadın)" },
      { de: "wir", tr: "biz" },
      { de: "Sie", tr: "siz (resmi)" },
    ],
    quiz: [
      { id: "pr_01", question_tr: 'Hangisi "ben"?', options: ["ich", "du", "wir", "ihr"], correct_index: 0 },
      { id: "pr_02", question_tr: 'Hangisi "sen"?', options: ["er", "du", "Sie", "wir"], correct_index: 1 },
      { id: "pr_03", question_tr: 'Hangisi "biz"?', options: ["ihr", "wir", "ich", "du"], correct_index: 1 },
      { id: "pr_04", question_tr: 'Hangisi resmi "siz"?', options: ["du", "Sie", "sie", "er"], correct_index: 1 },
      { id: "pr_05", question_tr: 'Hangisi "o (erkek)"?', options: ["sie", "es", "er", "ich"], correct_index: 2 },
      { id: "pr_06", question_tr: 'Hangisi "o (kadın)"?', options: ["er", "sie", "du", "wir"], correct_index: 1 },
    ],
  },
  {
    id: "verbs",
    title: "Verbkonjugation",
    titleTr: "Fiil çekimleri",
    refItems: [
      { de: "ich bin / habe / komme", tr: "ben …ım / … var / geliyorum" },
      { de: "du bist / hast / kommst", tr: "sen …sın / … var / geliyorsun" },
    ],
    quiz: [
      { id: "vb_01", question_tr: "Ich ___ Student. (olmak)", options: ["bin", "bist", "ist", "sind"], correct_index: 0 },
      { id: "vb_02", question_tr: "Du ___ aus der Türkei. (gelmek)", options: ["komme", "kommst", "kommt", "kommen"], correct_index: 1 },
      { id: "vb_03", question_tr: "Ich ___ ein Auto. (sahip olmak)", options: ["habe", "hast", "hat", "haben"], correct_index: 0 },
      { id: "vb_04", question_tr: "Wir ___ in Ankara. (oturmak)", options: ["wohne", "wohnst", "wohnen", "wohnt"], correct_index: 2 },
      { id: "vb_05", question_tr: "Er ___ als Lehrer. (çalışmak)", options: ["arbeite", "arbeitest", "arbeitet", "arbeiten"], correct_index: 2 },
      { id: "vb_06", question_tr: "Du ___ Deutsch. (öğrenmek)", options: ["lerne", "lernst", "lernt", "lernen"], correct_index: 1 },
    ],
  },
  {
    id: "wFragen",
    title: "W-Fragen",
    titleTr: "Soru kelimeleri",
    refItems: [
      { de: "Wer?", tr: "Kim?" },
      { de: "Was?", tr: "Ne?" },
      { de: "Wo?", tr: "Nerede?" },
      { de: "Wann?", tr: "Ne zaman?" },
      { de: "Wie?", tr: "Nasıl?" },
    ],
    quiz: [
      { id: "wf_01", question_tr: "___ ist das? (Bu kim?)", options: ["Wer", "Was", "Wo", "Wann"], correct_index: 0 },
      { id: "wf_02", question_tr: "___ wohnst du? (Nerede oturuyorsun?)", options: ["Wo", "Wer", "Was", "Warum"], correct_index: 0 },
      { id: "wf_03", question_tr: "___ kommst du? (Neredensin?)", options: ["Woher", "Wohin", "Wann", "Wie"], correct_index: 0 },
      { id: "wf_04", question_tr: "___ beginnt der Kurs? (Ne zaman?)", options: ["Wann", "Wo", "Wer", "Was"], correct_index: 0 },
      { id: "wf_05", question_tr: "___ geht es dir? (Nasılsın?)", options: ["Wie", "Was", "Wo", "Wer"], correct_index: 0 },
      { id: "wf_06", question_tr: "___ kostet das? (Ne kadar?)", options: ["Wie viel", "Wer", "Wo", "Wann"], correct_index: 0 },
    ],
  },
  {
    id: "jaNein",
    title: "Ja/Nein Fragen",
    titleTr: "Evet/Hayır soruları",
    refItems: [
      { de: "Kommst du …?", tr: "… misin/musun?" },
      { de: "Ja, ich …", tr: "Evet, …" },
      { de: "Nein, ich … nicht", tr: "Hayır, … değilim/yapmıyorum" },
    ],
    quiz: [
      {
        id: "jn_01",
        question_tr: "Hangisi soru cümlesi?",
        options: ["Kommst du aus der Türkei?", "Ich komme aus der Türkei.", "Ja, ich komme.", "Aus der Türkei."],
        correct_index: 0,
      },
      { id: "jn_02", question_tr: '"Vaktin var mı?" Almancası:', options: ["Hast du Zeit?", "Du hast Zeit.", "Ja, Zeit.", "Zeit du hast?"], correct_index: 0 },
      {
        id: "jn_03",
        question_tr: "Kommst du aus der Türkei? — Evet cevabı:",
        options: ["Ja, ich komme aus der Türkei.", "Nein, ich komme.", "Ja, du kommst.", "Ich komme nicht."],
        correct_index: 0,
      },
      {
        id: "jn_04",
        question_tr: "Lernst du Deutsch? — Hayır:",
        options: ["Nein, ich lerne kein Deutsch.", "Ja, ich lerne Deutsch.", "Nein, du lernst.", "Lernst du nicht."],
        correct_index: 0,
      },
      {
        id: "jn_05",
        question_tr: "Hangisi cümle (soru değil)?",
        options: ["Ich wohne in Berlin.", "Wohnst du in Berlin?", "Hast du Zeit?", "Kommst du mit?"],
        correct_index: 0,
      },
      {
        id: "jn_06",
        question_tr: "Wohnst du in Ankara? — Evet:",
        options: ["Ja, ich wohne in Ankara.", "Nein, ich wohne.", "Ja, du wohnst.", "Wohne ich in Ankara."],
        correct_index: 0,
      },
    ],
  },
  {
    id: "akkusativ",
    title: "Akkusativ",
    titleTr: "Belirtme hali",
    refItems: [
      { de: "einen Hund", tr: "bir köpek (eril)" },
      { de: "eine Cola", tr: "bir kola (dişil)" },
      { de: "ein Brötchen", tr: "bir küçük ekmek (nötr)" },
    ],
    quiz: [
      { id: "ak_01", question_tr: "Ich habe ___ Hund.", options: ["einen", "ein", "eine", "der"], correct_index: 0 },
      { id: "ak_02", question_tr: "Ich kaufe ___ Apfel.", options: ["einen", "eine", "ein", "die"], correct_index: 0 },
      { id: "ak_03", question_tr: "Ich trinke ___ Cola.", options: ["eine", "einen", "ein", "der"], correct_index: 0 },
      { id: "ak_04", question_tr: "Ich esse ___ Brötchen.", options: ["ein", "einen", "eine", "das"], correct_index: 0 },
      { id: "ak_05", question_tr: "Ich möchte ___ Kaffee.", options: ["einen", "eine", "ein", "der"], correct_index: 0 },
      { id: "ak_06", question_tr: "Ich brauche ___ Stift.", options: ["einen", "eine", "ein", "die"], correct_index: 0 },
    ],
  },
  {
    id: "trennbar",
    title: "Trennbare Verben",
    titleTr: "Ayrılabilen fiiller",
    refItems: [
      { de: "aufstehen → stehe … auf", tr: "kalkmak" },
      { de: "anrufen → rufe … an", tr: "aramak" },
      { de: "einkaufen → kaufe … ein", tr: "alışveriş" },
    ],
    quiz: [
      { id: "tv_01", question_tr: "Ich stehe um 7 Uhr ___. (aufstehen)", options: ["auf", "an", "ein", "mit"], correct_index: 0 },
      { id: "tv_02", question_tr: "Ich rufe meine Mutter ___. (anrufen)", options: ["an", "auf", "ein", "zu"], correct_index: 0 },
      { id: "tv_03", question_tr: "Ich kaufe im Supermarkt ___. (einkaufen)", options: ["ein", "an", "auf", "fern"], correct_index: 0 },
      { id: "tv_04", question_tr: "Am Abend sehe ich ___. (fernsehen)", options: ["fern", "an", "auf", "mit"], correct_index: 0 },
      { id: "tv_05", question_tr: "Kommst du ___? (mitkommen)", options: ["mit", "an", "auf", "ein"], correct_index: 0 },
      { id: "tv_06", question_tr: "Der Kurs fängt um 9 Uhr ___. (anfangen)", options: ["an", "auf", "ein", "zu"], correct_index: 0 },
    ],
  },
];

core.grammarPack = {
  title: "A1 Grammar Pack",
  titleTr: "A1 Gramer Paketi",
  sections: gpSections.map((s) => ({
    id: s.id,
    title: s.title,
    titleTr: s.titleTr,
    reference: { items: s.refItems, examples: [] },
    quiz: s.quiz,
  })),
};

core.version = "1.1.0";
fs.writeFileSync(corePath, JSON.stringify(core, null, 2));
console.log(
  "Updated",
  corePath,
  "sentences:",
  core.sentenceBuilder.exercises.length,
  "grammar sections:",
  core.grammarPack.sections.length
);
