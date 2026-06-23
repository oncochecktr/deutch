// Patch a1-core — grammar pack sections, grammar reference, satz exercises
// run: node scripts/patch-a1-grammar-complete.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CORE = path.join(__dirname, "../data/grundlagen/a1-core.json");

const core = JSON.parse(fs.readFileSync(CORE, "utf8"));

function quiz(id, question_tr, options, correct_index) {
  return { id, question_tr, options, correct_index };
}

const NEW_SECTIONS = [
  {
    id: "artikel",
    title: "Artikel",
    titleTr: "der / die / das",
    reference: {
      items: [
        { de: "der Mann", tr: "eril isim" },
        { de: "die Frau", tr: "dişil isim" },
        { de: "das Kind", tr: "nötr isim" },
        { de: "die Kinder", tr: "çoğul → die" },
      ],
      examples: [
        { de: "Der Tisch ist groß.", tr: "Masa büyük." },
        { de: "Die Tür ist offen.", tr: "Kapı açık." },
        { de: "Das Buch ist neu.", tr: "Kitap yeni." },
      ],
    },
    quiz: [
      quiz("art_01", "Mann → hangi artikel?", ["der", "die", "das", "den"], 0),
      quiz("art_02", "Frau → hangi artikel?", ["der", "die", "das", "den"], 1),
      quiz("art_03", "Kind → hangi artikel?", ["der", "die", "das", "den"], 2),
      quiz("art_04", "Tisch → hangi artikel?", ["der", "die", "das", "eine"], 0),
      quiz("art_05", "Katze → hangi artikel?", ["der", "die", "das", "ein"], 1),
      quiz("art_06", "Auto → hangi artikel?", ["der", "die", "das", "den"], 2),
      quiz("art_07", "Kinder (çoğul) → ?", ["der", "die", "das", "den"], 1),
      quiz("art_08", "Blume → hangi artikel?", ["der", "die", "das", "dem"], 1),
    ],
  },
  {
    id: "ein-artikel",
    title: "ein / eine",
    titleTr: "Belirsiz artikel",
    reference: {
      items: [
        { de: "ein Mann (Nom.)", tr: "bir adam" },
        { de: "eine Frau (Nom.)", tr: "bir kadın" },
        { de: "ein Kind (Nom.)", tr: "bir çocuk" },
        { de: "einen Mann (Akk.)", tr: "bir adam (belirtme)" },
      ],
      examples: [
        { de: "Das ist ein Hund.", tr: "Bu bir köpek." },
        { de: "Ich kaufe einen Apfel.", tr: "Bir elma alıyorum." },
      ],
    },
    quiz: [
      quiz("ein_01", "Nom: Das ist ___ Mann.", ["ein", "eine", "einen", "einer"], 0),
      quiz("ein_02", "Nom: Das ist ___ Frau.", ["ein", "eine", "einen", "einer"], 1),
      quiz("ein_03", "Akk: Ich kaufe ___ Apfel.", ["ein", "eine", "einen", "einer"], 2),
      quiz("ein_04", "Akk: Ich trinke ___ Cola.", ["ein", "eine", "einen", "einer"], 1),
      quiz("ein_05", "Nom: Das ist ___ Kind.", ["ein", "eine", "einen", "einer"], 0),
      quiz("ein_06", "Akk: Ich esse ___ Brötchen.", ["ein", "eine", "einen", "einer"], 0),
    ],
  },
  {
    id: "modalverben",
    title: "Modalverben",
    titleTr: "Modal fiiller",
    reference: {
      items: [
        { de: "ich kann", tr: "yapabilirim" },
        { de: "ich muss", tr: "zorundayım" },
        { de: "ich möchte", tr: "isterim (kibar)" },
        { de: "ich will", tr: "istiyorum" },
        { de: "ich darf", tr: "yapabilirim (izin)" },
      ],
      examples: [
        { de: "Ich kann Deutsch sprechen.", tr: "Almanca konuşabilirim." },
        { de: "Ich muss arbeiten.", tr: "Çalışmak zorundayım." },
      ],
    },
    quiz: [
      quiz("mod_01", "Ich ___ Deutsch sprechen. (können)", ["kann", "kannst", "können", "könnt"], 0),
      quiz("mod_02", "Du ___ arbeiten. (müssen)", ["muss", "musst", "müssen", "müsst"], 1),
      quiz("mod_03", "Ich ___ Wasser. (möchten)", ["möchte", "möchtest", "möchten", "möchtet"], 0),
      quiz("mod_04", "Er ___ nach Hause. (wollen)", ["will", "willst", "wollen", "wollt"], 0),
      quiz("mod_05", "Darf ich …? → ich ___", ["darf", "darfst", "dürfen", "dürft"], 0),
      quiz("mod_06", "Wir ___ helfen. (können)", ["kann", "kannst", "können", "könnt"], 2),
      quiz("mod_07", "Sie ___ kommen. (müssen, resmi)", ["muss", "musst", "müssen", "müsst"], 2),
      quiz("mod_08", "Ihr ___ gehen. (wollen)", ["will", "willst", "wollen", "wollt"], 3),
    ],
  },
  {
    id: "dativ",
    title: "Dativ",
    titleTr: "Dativ temel",
    reference: {
      items: [
        { de: "mit dem Bus", tr: "otobüsle" },
        { de: "bei mir", tr: "benim yanımda" },
        { de: "in der Schule", tr: "okulda" },
        { de: "nach Hause", tr: "eve" },
      ],
      examples: [
        { de: "Ich fahre mit dem Bus.", tr: "Otobüsle gidiyorum." },
        { de: "Er ist bei seiner Mutter.", tr: "Annesinin yanında." },
      ],
    },
    quiz: [
      quiz("dat_01", "Ich fahre mit ___ Bus.", ["dem", "den", "der", "das"], 0),
      quiz("dat_02", "Ich bin bei ___ Mutter.", ["meiner", "meine", "meinen", "meinem"], 0),
      quiz("dat_03", "Er ist in ___ Schule.", ["der", "die", "den", "dem"], 0),
      quiz("dat_04", "Ich gehe nach ___.", ["Hause", "Haus", "dem Haus", "den Haus"], 0),
      quiz("dat_05", "mit ___ Auto", ["dem", "den", "das", "der"], 0),
      quiz("dat_06", "bei ___ Freunden", ["Freunden", "Freunde", "den Freunde", "der Freunde"], 0),
    ],
  },
  {
    id: "negation",
    title: "Negation",
    titleTr: "nicht / kein",
    reference: {
      items: [
        { de: "kein / keine / keinen", tr: "isim olumsuzluğu" },
        { de: "nicht", tr: "fiil/sıfat olumsuzluğu" },
        { de: "Ich habe keine Zeit.", tr: "Vaktim yok." },
        { de: "Ich arbeite nicht.", tr: "Çalışmıyorum." },
      ],
      examples: [],
    },
    quiz: [
      quiz("neg_01", "Ich habe ___ Zeit.", ["keine", "kein", "nicht", "keinen"], 0),
      quiz("neg_02", "Er hat ___ Auto.", ["kein", "keine", "nicht", "keinen"], 0),
      quiz("neg_03", "Ich arbeite ___.", ["nicht", "kein", "keine", "keinen"], 0),
      quiz("neg_04", "Du lernst ___ Deutsch.", ["nicht", "kein", "keine", "keinen"], 0),
      quiz("neg_05", "Ich spreche ___ Deutsch.", ["kein", "keine", "nicht", "keinen"], 0),
      quiz("neg_06", "Das ist ___ teuer.", ["nicht", "kein", "keine", "keinen"], 0),
    ],
  },
  {
    id: "imperativ",
    title: "Imperativ",
    titleTr: "Emir cümlesi",
    reference: {
      items: [
        { de: "Komm!", tr: "Gel! (du)" },
        { de: "Kommen Sie!", tr: "Gelin! (Sie)" },
        { de: "Geht!", tr: "Gidin! (ihr)" },
        { de: "Nehmen Sie Platz!", tr: "Yerinize oturun!" },
      ],
      examples: [
        { de: "Hör bitte zu!", tr: "Lütfen dinle!" },
        { de: "Machen Sie bitte die Tür auf!", tr: "Lütfen kapıyı açın!" },
      ],
    },
    quiz: [
      quiz("imp_01", "___ bitte! (kommen, du)", ["Komm", "Kommen", "Kommt", "Komme"], 0),
      quiz("imp_02", "___ Sie bitte! (kommen, Sie)", ["Komm", "Kommen", "Kommt", "Komme"], 1),
      quiz("imp_03", "___ ! (gehen, ihr)", ["Geh", "Gehen", "Geht", "Gehe"], 2),
      quiz("imp_04", "___ Platz! (nehmen, Sie)", ["Nimm", "Nehmen", "Nehmt", "Nehme"], 1),
      quiz("imp_05", "___ bitte zu! (hören, du)", ["Hör", "Hören", "Hört", "Höre"], 0),
      quiz("imp_06", "___ das Fenster! (machen, du)", ["Mach", "Machen", "Macht", "Mache"], 0),
    ],
  },
  {
    id: "w-fragen",
    title: "W-Fragen",
    titleTr: "Soru kelimeleri",
    reference: {
      items: [
        { de: "Wer?", tr: "Kim?" },
        { de: "Was?", tr: "Ne?" },
        { de: "Wo?", tr: "Nerede?" },
        { de: "Wohin?", tr: "Nereye?" },
        { de: "Wann?", tr: "Ne zaman?" },
        { de: "Warum?", tr: "Neden?" },
      ],
      examples: [],
    },
    quiz: [
      quiz("wf_01", "___ ist das? (kim)", ["Wer", "Was", "Wo", "Wann"], 0),
      quiz("wf_02", "___ ist das? (ne)", ["Wer", "Was", "Wo", "Wann"], 1),
      quiz("wf_03", "___ wohnst du? (nerede)", ["Wer", "Was", "Wo", "Warum"], 2),
      quiz("wf_04", "___ gehst du? (nereye)", ["Wo", "Wohin", "Woher", "Wann"], 1),
      quiz("wf_05", "___ beginnt der Kurs?", ["Wann", "Wo", "Was", "Wer"], 0),
      quiz("wf_06", "___ lernst du Deutsch?", ["Warum", "Wo", "Was", "Wer"], 0),
      quiz("wf_07", "___ kommst du? (nereden)", ["Woher", "Wohin", "Wo", "Wann"], 0),
      quiz("wf_08", "___ viel kostet das?", ["Wie", "Was", "Wo", "Wer"], 0),
    ],
  },
  {
    id: "plural",
    title: "Plural",
    titleTr: "Çoğul",
    reference: {
      items: [
        { de: "die Kinder", tr: "çocuklar" },
        { de: "die Eltern", tr: "ebeveynler" },
        { de: "die Freunde", tr: "arkadaşlar" },
        { de: "Plural → die", tr: "çoğul artikel her zaman die" },
      ],
      examples: [
        { de: "Die Kinder spielen.", tr: "Çocuklar oynuyor." },
        { de: "Meine Eltern wohnen in Berlin.", tr: "Ailem Berlin'de oturuyor." },
      ],
    },
    quiz: [
      quiz("pl_01", "Kind → çoğul?", ["Kinder", "Kinds", "Kindes", "Kinden"], 0),
      quiz("pl_02", "Eltern → çoğul artikel?", ["der", "die", "das", "den"], 1),
      quiz("pl_03", "Freund → çoğul?", ["Freunde", "Freunds", "Freunden", "Freünder"], 0),
      quiz("pl_04", "Mann → çoğul?", ["Männer", "Manne", "Manns", "Mannen"], 0),
      quiz("pl_05", "Frau → çoğul?", ["Frauen", "Fraue", "Fraues", "Fraus"], 0),
      quiz("pl_06", "Buch → çoğul?", ["Bücher", "Buche", "Buchs", "Buchen"], 0),
    ],
  },
  {
    id: "praepositionen",
    title: "Präpositionen",
    titleTr: "Edatlar",
    reference: {
      items: [
        { de: "in der Stadt", tr: "şehirde" },
        { de: "auf dem Tisch", tr: "masanın üstünde" },
        { de: "an der Tür", tr: "kapıda" },
        { de: "mit dem Bus", tr: "otobüsle" },
      ],
      examples: [],
    },
    quiz: [
      quiz("prep_01", "Ich wohne in ___.", ["Berlin", "dem Berlin", "der Berlin", "den Berlin"], 0),
      quiz("prep_02", "Das Buch liegt auf ___ Tisch.", ["dem", "den", "der", "das"], 0),
      quiz("prep_03", "Er steht an ___ Tür.", ["der", "die", "den", "dem"], 0),
      quiz("prep_04", "Ich fahre mit ___ Bus.", ["dem", "den", "der", "das"], 0),
      quiz("prep_05", "Wir sind bei ___ Freunden.", ["Freunden", "Freunde", "den Freund", "der Freund"], 0),
    ],
  },
  {
    id: "konjunktionen",
    title: "Konjunktionen",
    titleTr: "Bağlaçlar",
    reference: {
      items: [
        { de: "und", tr: "ve" },
        { de: "aber", tr: "ama" },
        { de: "denn", tr: "çünkü" },
        { de: "oder", tr: "veya" },
      ],
      examples: [
        { de: "Ich lerne Deutsch, aber es ist schwer.", tr: "Almanca öğreniyorum ama zor." },
        { de: "Er isst Brot und trinkt Kaffee.", tr: "Ekmek yiyor ve kahve içiyor." },
      ],
    },
    quiz: [
      quiz("kon_01", "Ich lerne Deutsch, ___ es ist schwer.", ["aber", "und", "denn", "oder"], 0),
      quiz("kon_02", "Er isst Brot ___ trinkt Kaffee.", ["und", "aber", "denn", "oder"], 0),
      quiz("kon_03", "Ich bleibe zu Hause, ___ ich müde bin.", ["denn", "und", "aber", "oder"], 0),
      quiz("kon_04", "Kaffee ___ Tee?", ["oder", "und", "aber", "denn"], 0),
      quiz("kon_05", "Sie kommt, ___ er geht.", ["und", "aber", "denn", "oder"], 0),
    ],
  },
  {
    id: "perfekt-intro",
    title: "Perfekt (Intro)",
    titleTr: "Perfekt tanıma",
    reference: {
      items: [
        { de: "haben + ge…t", tr: "Ich habe gemacht." },
        { de: "sein + ge…en", tr: "Ich bin gekommen." },
        { de: "gekauft, gegessen, gelernt", tr: "yaygın Partizip II" },
      ],
      examples: [
        { de: "Ich habe Deutsch gelernt.", tr: "Almanca öğrendim." },
        { de: "Wir sind nach Hause gekommen.", tr: "Eve geldik." },
      ],
    },
    quiz: [
      quiz("perf_01", "Ich ___ gestern gearbeitet.", ["habe", "bin", "hat", "ist"], 0),
      quiz("perf_02", "Wir ___ nach Hause gekommen.", ["sind", "haben", "ist", "hat"], 0),
      quiz("perf_03", "Er hat Deutsch ___.", ["gelernt", "lernen", "lernt", "gelerne"], 0),
      quiz("perf_04", "Sie hat Brot ___.", ["gegessen", "essen", "isst", "geesse"], 0),
      quiz("perf_05", "Ich habe ein Buch ___.", ["gekauft", "kaufen", "kaufe", "gekauf"], 0),
      quiz("perf_06", "Wir haben Pizza ___.", ["gemacht", "machen", "macht", "gemach"], 0),
    ],
  },
];

const existingIds = new Set(core.grammarPack.sections.map((s) => s.id));
for (const section of NEW_SECTIONS) {
  if (!existingIds.has(section.id)) {
    core.grammarPack.sections.push(section);
  }
}

const akk = core.grammarPack.sections.find((s) => s.id === "akkusativ");
if (akk) {
  if (!akk.reference.items.some((i) => i.de.includes("der → den"))) {
    akk.reference.items.push(
      { de: "der → den", tr: "eril belirtili → Akk." },
      { de: "die → die", tr: "dişil değişmez" },
      { de: "das → das", tr: "nötr değişmez" }
    );
  }
  const extraQuiz = [
    quiz("akk_07", "Ich kaufe ___ Apfel. (der)", ["den", "der", "dem", "das"], 0),
    quiz("akk_08", "Ich sehe ___ Mann. (der)", ["den", "der", "dem", "die"], 0),
    quiz("akk_09", "Ich habe ___ Katze. (die, Akk.)", ["eine", "ein", "einen", "einer"], 0),
    quiz("akk_10", "Er liest ___ Buch. (das)", ["ein", "eine", "einen", "der"], 0),
    quiz("akk_11", "Ich kaufe ___ Zeitung. (die)", ["die", "der", "den", "dem"], 0),
    quiz("akk_12", "Sie trinkt ___ Wasser. (das)", ["das", "den", "der", "die"], 0),
  ];
  for (const q of extraQuiz) {
    if (!akk.quiz.some((x) => x.id === q.id)) akk.quiz.push(q);
  }
}

if (core.grammar.akkusativ && !core.grammar.akkusativ.items.some((i) => i.de.includes("der → den"))) {
  core.grammar.akkusativ.items.push(
    { de: "der → den", tr: "Ich sehe den Mann." },
    { de: "die → die", tr: "Ich lese die Zeitung." },
    { de: "das → das", tr: "Ich kaufe das Buch." }
  );
}

core.grammar.modals = [
  {
    verb: "können",
    tr: "yapabilmek",
    conjugation: [
      { de: "ich kann", tr: "yapabilirim" },
      { de: "du kannst", tr: "yapabilirsin" },
      { de: "er/sie/es kann", tr: "yapabilir" },
      { de: "wir können", tr: "yapabiliriz" },
      { de: "ihr könnt", tr: "yapabilirsiniz" },
      { de: "Sie können", tr: "yapabilirsiniz (resmi)" },
    ],
    examples: [
      { de: "Ich kann Deutsch lernen.", tr: "Almanca öğrenebilirim." },
      { de: "Kannst du mir helfen?", tr: "Bana yardım edebilir misin?" },
    ],
  },
  {
    verb: "müssen",
    tr: "zorunda olmak",
    conjugation: [
      { de: "ich muss", tr: "zorundayım" },
      { de: "du musst", tr: "zorundasın" },
      { de: "er/sie/es muss", tr: "zorunda" },
      { de: "wir müssen", tr: "zorundayız" },
      { de: "ihr müsst", tr: "zorundasınız" },
      { de: "Sie müssen", tr: "zorundasınız (resmi)" },
    ],
    examples: [
      { de: "Ich muss arbeiten.", tr: "Çalışmak zorundayım." },
      { de: "Du musst lernen.", tr: "Öğrenmen gerekiyor." },
    ],
  },
  {
    verb: "möchten",
    tr: "istemek (kibar)",
    conjugation: [
      { de: "ich möchte", tr: "isterim" },
      { de: "du möchtest", tr: "istersin" },
      { de: "er/sie/es möchte", tr: "ister" },
      { de: "wir möchten", tr: "isteriz" },
      { de: "ihr möchtet", tr: "istersiniz" },
      { de: "Sie möchten", tr: "istersiniz (resmi)" },
    ],
    examples: [
      { de: "Ich möchte Wasser.", tr: "Su istiyorum." },
      { de: "Ich möchte einen Kaffee, bitte.", tr: "Bir kahve istiyorum, lütfen." },
    ],
  },
  {
    verb: "wollen",
    tr: "istemek",
    conjugation: [
      { de: "ich will", tr: "istiyorum" },
      { de: "du willst", tr: "istiyorsun" },
      { de: "er/sie/es will", tr: "istiyor" },
      { de: "wir wollen", tr: "istiyoruz" },
      { de: "ihr wollt", tr: "istiyorsunuz" },
      { de: "Sie wollen", tr: "istiyorsunuz (resmi)" },
    ],
    examples: [{ de: "Ich will nach Hause.", tr: "Eve gitmek istiyorum." }],
  },
  {
    verb: "dürfen",
    tr: "yapabilmek (izin)",
    conjugation: [
      { de: "ich darf", tr: "yapabilirim" },
      { de: "du darfst", tr: "yapabilirsin" },
      { de: "er/sie/es darf", tr: "yapabilir" },
      { de: "wir dürfen", tr: "yapabiliriz" },
      { de: "ihr dürft", tr: "yapabilirsiniz" },
      { de: "Sie dürfen", tr: "yapabilirsiniz (resmi)" },
    ],
    examples: [{ de: "Darf ich hereinkommen?", tr: "Girebilir miyim?" }],
  },
];

core.grammar.imperativ = {
  title: "Imperativ",
  titleTr: "Emir cümlesi",
  items: [
    { de: "Komm!", tr: "Gel! (du)" },
    { de: "Kommt!", tr: "Gelin! (ihr)" },
    { de: "Kommen Sie!", tr: "Gelin! (Sie)" },
    { de: "Geh!", tr: "Git!" },
    { de: "Gehen Sie!", tr: "Gidin! (resmi)" },
    { de: "Mach!", tr: "Yap!" },
    { de: "Nehmen Sie Platz!", tr: "Yerinize oturun!" },
    { de: "Hör zu!", tr: "Dinle!" },
  ],
  examples: [
    { de: "Komm bitte!", tr: "Lütfen gel!" },
    { de: "Machen Sie bitte die Tür auf!", tr: "Lütfen kapıyı açın!" },
  ],
};

core.grammar.negation = {
  title: "Negation",
  titleTr: "Olumsuzluk",
  items: [
    { de: "kein / keine / keinen", tr: "isim olumsuzluğu" },
    { de: "nicht", tr: "fiil, sıfat, zarf olumsuzluğu" },
    { de: "Ich habe keine Zeit.", tr: "Vaktim yok." },
    { de: "Ich arbeite nicht heute.", tr: "Bugün çalışmıyorum." },
  ],
  examples: [
    { de: "Nein, ich habe keine Zeit.", tr: "Hayır, vaktim yok." },
    { de: "Ich spreche kein Deutsch.", tr: "Almanca konuşmuyorum." },
  ],
};

core.grammar.dativBasics = {
  title: "Dativ",
  titleTr: "Dativ temel",
  items: [
    { de: "mit + Dativ", tr: "ile (mit dem Bus)" },
    { de: "bei + Dativ", tr: "yanında (bei mir)" },
    { de: "in + Dativ", tr: "içinde (in der Schule)" },
    { de: "zu / nach Hause", tr: "eve gitmek" },
  ],
  examples: [
    { de: "Ich fahre mit dem Bus.", tr: "Otobüsle gidiyorum." },
    { de: "Ich bin bei meiner Mutter.", tr: "Annemin yanındayım." },
  ],
};

core.grammar.plural = {
  title: "Plural",
  titleTr: "Çoğul",
  items: [
    { de: "die Kinder", tr: "çocuklar (-er)" },
    { de: "die Freunde", tr: "arkadaşlar (-e)" },
    { de: "die Bücher", tr: "kitaplar (Umlaut + -er)" },
    { de: "Plural → die", tr: "çoğul artikel: die" },
  ],
  examples: [
    { de: "Die Kinder spielen im Garten.", tr: "Çocuklar bahçede oynuyor." },
    { de: "Meine Eltern wohnen in Berlin.", tr: "Ailem Berlin'de oturuyor." },
  ],
};

core.grammar.konjunktionen = {
  title: "Konjunktionen",
  titleTr: "Bağlaçlar",
  items: [
    { de: "und", tr: "ve" },
    { de: "aber", tr: "ama" },
    { de: "denn", tr: "çünkü" },
    { de: "oder", tr: "veya" },
  ],
  examples: [
    { de: "Ich esse Brot und trinke Kaffee.", tr: "Ekmek yiyorum ve kahve içiyorum." },
    { de: "Ich lerne Deutsch, aber es ist schwer.", tr: "Almanca öğreniyorum ama zor." },
  ],
};

core.grammar.perfektIntro = {
  title: "Perfekt (Intro)",
  titleTr: "Geçmiş zaman tanıma",
  items: [
    { de: "haben + Partizip II", tr: "Ich habe gemacht." },
    { de: "sein + Partizip II", tr: "Ich bin gekommen." },
    { de: "ge…t / ge…en", tr: "gekauft, gegessen, gelernt" },
  ],
  examples: [
    { de: "Ich habe Deutsch gelernt.", tr: "Almanca öğrendim." },
    { de: "Wir sind nach Hause gekommen.", tr: "Eve geldik." },
  ],
};

core.grammar.regularRule = {
  title: "Düzenli fiiller",
  titleTr: "Regelmäßige Verben",
  items: [
    { de: "Stem + e/st/t/en/t", tr: "machen → ich mache, du machst" },
    { de: "arbeiten → du arbeitest", tr: "t ile biten fiillerde -e-" },
  ],
  examples: [{ de: "Ich lerne Deutsch.", tr: "Almanca öğreniyorum." }],
};

core.grammar.irregularRule = {
  title: "Düzensiz fiiller",
  titleTr: "Unregelmäßige Verben",
  items: [
    { de: "essen → du isst", tr: "kök değişimi" },
    { de: "fahren → du fährst", tr: "Umlaut" },
    { de: "sehen → du siehst", tr: "ei → ie" },
  ],
  examples: [{ de: "Er fährt mit dem Bus.", tr: "Otobüsle gidiyor." }],
};

const extraVerbs = [
  {
    infinitive: "kaufen",
    tr: "satın almak",
    forms: [
      { de: "ich kaufe", tr: "alıyorum" },
      { de: "du kaufst", tr: "alıyorsun" },
      { de: "er kauft", tr: "alıyor" },
      { de: "wir kaufen", tr: "alıyoruz" },
    ],
  },
  {
    infinitive: "fahren",
    tr: "gitmek (araçla)",
    forms: [
      { de: "ich fahre", tr: "gidiyorum" },
      { de: "du fährst", tr: "gidiyorsun" },
      { de: "er fährt", tr: "gidiyor" },
      { de: "wir fahren", tr: "gidiyoruz" },
    ],
  },
  {
    infinitive: "sehen",
    tr: "görmek",
    forms: [
      { de: "ich sehe", tr: "görüyorum" },
      { de: "du siehst", tr: "görüyorsun" },
      { de: "er sieht", tr: "görüyor" },
      { de: "wir sehen", tr: "görüyoruz" },
    ],
  },
];
for (const v of extraVerbs) {
  if (!core.grammar.verbs.some((x) => x.infinitive === v.infinitive)) {
    core.grammar.verbs.push(v);
  }
}

const newSatz = [
  {
    id: "sb_055",
    prompt_tr: "Bir elma alıyorum.",
    tokens: ["Ich", "kaufe", "einen", "Apfel", "."],
    distractors: ["ein", "die"],
    answer_de: "Ich kaufe einen Apfel.",
    hint: "Akkusativ: einen",
  },
  {
    id: "sb_056",
    prompt_tr: "Adamı görüyorum.",
    tokens: ["Ich", "sehe", "den", "Mann", "."],
    distractors: ["der", "dem"],
    answer_de: "Ich sehe den Mann.",
    hint: "der → den",
  },
  {
    id: "sb_057",
    prompt_tr: "Lütfen gel!",
    tokens: ["Komm", "bitte", "!"],
    distractors: ["Kommen", "Kommt"],
    answer_de: "Komm bitte!",
    hint: "Imperativ du",
  },
  {
    id: "sb_058",
    prompt_tr: "Lütfen yerinize oturun!",
    tokens: ["Nehmen", "Sie", "Platz", "!"],
    distractors: ["Nimm", "Nehmt"],
    answer_de: "Nehmen Sie Platz!",
    hint: "Imperativ Sie",
  },
  {
    id: "sb_059",
    prompt_tr: "Otobüsle gidiyorum.",
    tokens: ["Ich", "fahre", "mit", "dem", "Bus", "."],
    distractors: ["den", "der"],
    answer_de: "Ich fahre mit dem Bus.",
    hint: "mit + Dativ",
  },
  {
    id: "sb_060",
    prompt_tr: "Vaktim yok.",
    tokens: ["Ich", "habe", "keine", "Zeit", "."],
    distractors: ["nicht", "kein"],
    answer_de: "Ich habe keine Zeit.",
    hint: "keine Zeit",
  },
  {
    id: "sb_061",
    prompt_tr: "Bugün çalışmıyorum.",
    tokens: ["Ich", "arbeite", "heute", "nicht", "."],
    distractors: ["kein", "keine"],
    answer_de: "Ich arbeite heute nicht.",
    hint: "nicht pozisyonu",
  },
  {
    id: "sb_062",
    prompt_tr: "Almanca öğreniyorum ama zor.",
    tokens: ["Ich", "lerne", "Deutsch", ",", "aber", "es", "ist", "schwer", "."],
    distractors: ["und", "denn"],
    answer_de: "Ich lerne Deutsch, aber es ist schwer.",
    hint: "aber = ama",
  },
  {
    id: "sb_063",
    prompt_tr: "Almanca konuşabilir misin?",
    tokens: ["Kannst", "du", "Deutsch", "sprechen", "?"],
    distractors: ["Musst", "Willst"],
    answer_de: "Kannst du Deutsch sprechen?",
    hint: "können",
  },
  {
    id: "sb_064",
    prompt_tr: "Eve gitmek istiyorum.",
    tokens: ["Ich", "will", "nach", "Hause", "."],
    distractors: ["muss", "kann"],
    answer_de: "Ich will nach Hause.",
    hint: "wollen",
  },
];

for (const ex of newSatz) {
  if (!core.sentenceBuilder.exercises.some((e) => e.id === ex.id)) {
    core.sentenceBuilder.exercises.push(ex);
  }
}

fs.writeFileSync(CORE, JSON.stringify(core, null, 2), "utf8");
console.log(
  `✓ a1-core patched — grammarPack sections: ${core.grammarPack.sections.length}, satz: ${core.sentenceBuilder.exercises.length}`
);
