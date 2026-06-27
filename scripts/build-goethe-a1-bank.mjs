/**
 * Goethe A1 soru bankası üretici
 * node scripts/build-goethe-a1-bank.mjs
 *
 * Hedef: 100 Hören, 100 Lesen (soru), 50 Schreiben, 100 Sprechen, 20 deneme
 */
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, "../data/goethe/a1");
mkdirSync(OUT, { recursive: true });

const a1 = JSON.parse(readFileSync(join(__dir, "../data/a1/vocabulary.json"), "utf8"));
const timur = JSON.parse(readFileSync(join(__dir, "../data/timur/vocabulary.json"), "utf8"));
const allWords = [...a1.words, ...timur.words];

function shuffle(arr, seed = 0) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(((i + 1) * (seed + i * 17)) % (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(correct, pool, n = 3) {
  const isTimeGreeting = (w) =>
    /^(iyi günler|iyi akşamlar|iyi geceler|günaydın|hoşça kal|güle güle)/i.test(
      w.translation_tr ?? ""
    );
  const correctIsTime = isTimeGreeting(correct);
  let others = pool.filter((w) => w.id !== correct.id);
  if (correctIsTime) {
    const timeOnly = others.filter(isTimeGreeting);
    if (timeOnly.length >= n) others = timeOnly;
  } else {
    const nonTime = others.filter((w) => !isTimeGreeting(w));
    if (nonTime.length >= n) others = nonTime;
  }
  return shuffle(others).slice(0, n);
}

function fmt(w) {
  return w.article ? `${w.article} ${w.word}` : w.word;
}

// ─── HÖREN (100) ───
function buildHoeren() {
  const qs = [];
  let n = 1;
  const pool = shuffle(allWords, 42);

  // 50 kelime tanıma — "Was hörst du?"
  for (let i = 0; i < 50 && i < pool.length; i++) {
    const w = pool[i];
    const distractors = pickDistractors(w, pool);
    const options = shuffle([w.translation_tr, ...distractors.map((d) => d.translation_tr)]);
    qs.push({
      id: `h_${String(n++).padStart(3, "0")}`,
      level: "A1",
      part: 1,
      type: "word",
      audio_text: fmt(w),
      question_de: "Was hörst du?",
      question_tr: "Ne duyuyorsun?",
      options,
      correct_index: options.indexOf(w.translation_tr),
      tags: ["hoeren", "word", w.category],
    });
  }

  // 30 cümle dinleme
  const sentences = [
    ["Ich heiße Timur.", "Benim adım Timur.", "Timur", "Anna", "Peter", "Maria"],
    ["Ich wohne in Berlin.", "Berlin'de yaşıyorum.", "Berlin", "Hamburg", "München", "Köln"],
    ["Ich komme aus der Türkei.", "Türkiye'den geliyorum.", "Türkei", "Polen", "Italien", "Griechenland"],
    ["Ich arbeite im Lager.", "Depoda çalışıyorum.", "Lager", "Büro", "Schule", "Restaurant"],
    ["Wie spät ist es?", "Saat kaç?", "Uhrzeit", "Datum", "Adresse", "Name"],
    ["Der Bus kommt um acht.", "Otobüs sekizde geliyor.", "acht Uhr", "zehn Uhr", "sechs Uhr", "zwölf Uhr"],
    ["Das kostet fünf Euro.", "Bu beş euro.", "5 Euro", "10 Euro", "1 Euro", "50 Euro"],
    ["Ich habe Hunger.", "Açım.", "Hunger", "Durst", "Freude", "Angst"],
    ["Wo ist der Bahnhof?", "Tren istasyonu nerede?", "Bahnhof", "Flughafen", "Parkplatz", "Supermarkt"],
    ["Meine Schicht beginnt um sechs.", "Vardiyam altıda başlıyor.", "6 Uhr", "8 Uhr", "12 Uhr", "22 Uhr"],
  ];
  for (let r = 0; qs.length < 80; r++) {
    for (const [de, tr, correct, ...wrong] of sentences) {
      if (qs.length >= 80) break;
      const options = shuffle([correct, ...wrong.slice(0, 3)]);
      qs.push({
        id: `h_${String(n++).padStart(3, "0")}`,
        level: "A1",
        part: 2,
        type: "sentence",
        audio_text: de,
        question_de: "Was ist richtig?",
        question_tr: tr,
        options,
        correct_index: options.indexOf(correct),
        tags: ["hoeren", "sentence"],
      });
    }
  }

  // 20 duyuru/dialog
  const dialogues = [
    {
      audio: "A: Guten Tag! B: Guten Tag! Ich suche die Toilette. A: Die Toilette ist links.",
      q: "Wo ist die Toilette?",
      opts: ["links", "rechts", "oben", "draußen"],
      correct: "links",
    },
    {
      audio: "Der Zug nach München fährt von Gleis 3 ab.",
      q: "Von welchem Gleis fährt der Zug?",
      opts: ["Gleis 1", "Gleis 2", "Gleis 3", "Gleis 4"],
      correct: "Gleis 3",
    },
    {
      audio: "Heute haben wir von 8 bis 16 Uhr geöffnet.",
      q: "Wann schließt das Geschäft?",
      opts: ["16 Uhr", "8 Uhr", "12 Uhr", "18 Uhr"],
      correct: "16 Uhr",
    },
    {
      audio: "Bringen Sie die Palette bitte nach hinten.",
      q: "Wohin soll die Palette?",
      opts: ["nach hinten", "nach vorne", "nach oben", "nach draußen"],
      correct: "nach hinten",
    },
    {
      audio: "Pause ist um zwölf Uhr für dreißig Minuten.",
      q: "Wann ist Pause?",
      opts: ["12 Uhr", "10 Uhr", "14 Uhr", "16 Uhr"],
      correct: "12 Uhr",
    },
  ];
  for (let r = 0; qs.length < 100; r++) {
    for (const d of dialogues) {
      if (qs.length >= 100) break;
      const options = shuffle([...d.opts]);
      qs.push({
        id: `h_${String(n++).padStart(3, "0")}`,
        level: "A1",
        part: 3,
        type: "dialogue",
        audio_text: d.audio,
        question_de: d.q,
        question_tr: d.q,
        options,
        correct_index: options.indexOf(d.correct),
        tags: ["hoeren", "dialogue"],
      });
    }
  }

  return qs.slice(0, 100);
}

// ─── LESEN (25 metin × 4 soru = 100) ───
function buildLesen() {
  const templates = [
    {
      type: "email",
      title: "E-Mail von Timur",
      text: "Hallo!\nIch heiße Timur. Ich komme aus der Türkei und wohne in Berlin. Ich arbeite in einem Lager. Meine Schicht beginnt um 6 Uhr. Ich spreche Türkisch und Deutsch.\nViele Grüße\nTimur",
      qs: [
        ["Wo wohnt Timur?", "Timur nerede yaşıyor?", ["Berlin", "Istanbul", "Ankara", "Hamburg"], 0],
        ["Wo arbeitet er?", "Nerede çalışıyor?", ["Lager", "Büro", "Schule", "Restaurant"], 0],
        ["Wann beginnt die Schicht?", "Vardiya ne zaman?", ["6 Uhr", "8 Uhr", "10 Uhr", "12 Uhr"], 0],
        ["Welche Sprachen spricht er?", "Hangi diller?", ["Türkisch und Deutsch", "Nur Deutsch", "Nur Türkisch", "Englisch"], 0],
      ],
    },
    {
      type: "notice",
      title: "Aushang im Lager",
      text: "ACHTUNG!\nSicherheitsschuhe und Helm sind Pflicht.\nPause: 12:00 – 12:30 Uhr\nFeierabend: 17:00 Uhr\nBei Fragen: Teamleiter Herr Schmidt",
      qs: [
        ["Was ist Pflicht?", "Ne zorunlu?", ["Helm und Sicherheitsschuhe", "Uniform", "Handschuhe", "Brille"], 0],
        ["Wann ist Pause?", "Mola ne zaman?", ["12:00", "10:00", "14:00", "16:00"], 0],
        ["Wann ist Feierabend?", "İş ne zaman bitiyor?", ["17:00", "15:00", "18:00", "20:00"], 0],
        ["An wen wendet man sich?", "Kime sorulur?", ["Teamleiter", "Arzt", "Kunde", "Busfahrer"], 0],
      ],
    },
    {
      type: "sign",
      title: "Schild am Bahnhof",
      text: "→ Bahnhof\n← Stadtmitte\nToilette: 200 Meter geradeaus\nTicket kaufen: Schalter 2",
      qs: [
        ["Wo ist die Toilette?", "Tuvalet nerede?", ["geradeaus", "links", "rechts", "zurück"], 0],
        ["Wo kauft man Tickets?", "Bilet nereden?", ["Schalter 2", "Schalter 1", "Im Bus", "Online"], 0],
        ["Was ist rechts?", "Sağda ne var?", ["Stadtmitte", "Bahnhof", "Flughafen", "Park"], 0],
        ["Was bedeutet der Pfeil →?", "Ok ne demek?", ["Bahnhof", "Stadt", "Toilette", "Ausgang"], 0],
      ],
    },
    {
      type: "advert",
      title: "Anzeige — Supermarkt",
      text: "SUPERMARKT ALDI\nMontag – Samstag: 8:00 – 20:00 Uhr\nSonntag: geschlossen\nBrot: 0,99 €\nMilch: 1,09 €",
      qs: [
        ["Wann ist Sonntag geöffnet?", "Pazar açık mı?", ["geschlossen", "8–20 Uhr", "nur morgens", "24 Stunden"], 0],
        ["Was kostet das Brot?", "Ekmek fiyatı?", ["0,99 €", "1,09 €", "2,00 €", "5,00 €"], 0],
        ["Wann öffnet der Markt?", "Ne zaman açılır?", ["8:00", "10:00", "12:00", "6:00"], 0],
        ["Was kostet die Milch?", "Süt fiyatı?", ["1,09 €", "0,99 €", "2,50 €", "0,50 €"], 0],
      ],
    },
    {
      type: "message",
      title: "SMS von der Firma",
      text: "Hallo Timur,\nMorgen beginnt deine Schicht um 7 Uhr. Bitte pünktlich sein. Vergiss nicht deinen Helm.\nDein Chef",
      qs: [
        ["Wann ist die Schicht?", "Vardiya ne zaman?", ["7 Uhr morgen", "6 Uhr heute", "8 Uhr morgen", "9 Uhr"], 0],
        ["Was soll Timur nicht vergessen?", "Ne unutmamalı?", ["Helm", "Essen", "Ticket", "Pass"], 0],
        ["Wer schreibt?", "Kim yazıyor?", ["Chef", "Arzt", "Lehrer", "Freund"], 0],
        ["Was ist wichtig?", "Ne önemli?", ["pünktlich sein", "lange schlafen", "Kaffee trinken", "Auto fahren"], 0],
      ],
    },
  ];

  const passages = [];
  let pq = 1;
  let passNum = 1;

  while (passages.reduce((s, p) => s + p.questions.length, 0) < 100) {
    for (const t of templates) {
      if (passages.reduce((s, p) => s + p.questions.length, 0) >= 100) break;
      const questions = t.qs.map(([qde, qtr, opts, ci]) => {
        const options = shuffle([...opts]);
        return {
          id: `lq_${String(pq++).padStart(3, "0")}`,
          question_de: qde,
          question_tr: qtr,
          options,
          correct_index: options.indexOf(opts[ci]),
        };
      });
      passages.push({
        id: `lp_${String(passNum++).padStart(3, "0")}`,
        level: "A1",
        type: t.type,
        title_de: t.title,
        text_de: t.text,
        questions,
        tags: ["lesen", t.type],
      });
    }
  }

  // trim last passage questions if over 100
  let total = 0;
  for (const p of passages) {
    total += p.questions.length;
  }
  if (total > 100) {
    const last = passages[passages.length - 1];
    const excess = total - 100;
    last.questions = last.questions.slice(0, last.questions.length - excess);
  }

  return passages;
}

// ─── SCHREIBEN (50) ───
function buildSchreiben() {
  const tasks = [];
  let n = 1;

  const formTemplates = [
    { prompt: "Füllen Sie das Anmeldeformular aus.", tr: "Kayıt formunu doldurun.", fields: ["Name", "Vorname", "Adresse", "Telefonnummer", "Geburtsdatum"] },
    { prompt: "Füllen Sie das Formular für die Arbeitsagentur aus.", tr: "İş ajansı formunu doldurun.", fields: ["Name", "Beruf", "Adresse", "Staatsangehörigkeit", "Unterschrift"] },
    { prompt: "Füllen Sie das Formular beim Arzt aus.", tr: "Doktor formunu doldurun.", fields: ["Name", "Geburtsdatum", "Adresse", "Krankenkasse", "Telefon"] },
  ];

  for (const ft of formTemplates) {
    for (let v = 0; v < 8; v++) {
      tasks.push({
        id: `sw_${String(n++).padStart(3, "0")}`,
        level: "A1",
        type: "form",
        prompt_de: ft.prompt,
        prompt_tr: ft.tr,
        fields: ft.fields.map((label, i) => ({
          id: `f${i}`,
          label,
          placeholder: `${label}...`,
          required: i < 3,
        })),
        min_words: 0,
        sample_answer: "Name: Timur Yilmaz, Adresse: Hauptstraße 5, Berlin",
        tags: ["schreiben", "form"],
      });
    }
  }

  const emailTemplates = [
    { de: "Schreiben Sie eine E-Mail an Ihren Chef. Sie sind krank.", tr: "Patronunuza e-posta yazın. Hastasınız.", sample: "Sehr geehrter Herr Schmidt, ich bin krank und kann heute nicht arbeiten. Mit freundlichen Grüßen, Timur" },
    { de: "Schreiben Sie an einen Freund. Laden Sie ihn zum Essen ein.", tr: "Arkadaşınıza yazın. Yemeğe davet edin.", sample: "Hallo Ali, möchtest du am Samstag essen gehen? Bis bald, Timur" },
    { de: "Schreiben Sie eine kurze Nachricht. Sie kommen später zur Arbeit.", tr: "Kısa mesaj yazın. İşe geç kalacaksınız.", sample: "Guten Morgen, ich komme heute um 30 Minuten später. Timur" },
  ];

  for (const et of emailTemplates) {
    for (let v = 0; v < 6; v++) {
      tasks.push({
        id: `sw_${String(n++).padStart(3, "0")}`,
        level: "A1",
        type: "email",
        prompt_de: et.de,
        prompt_tr: et.tr,
        fields: [{ id: "text", label: "Ihre Nachricht", placeholder: "Schreiben Sie hier...", required: true }],
        min_words: 20,
        sample_answer: et.sample,
        tags: ["schreiben", "email"],
      });
    }
  }

  const inviteTemplates = [
    { de: "Schreiben Sie eine Einladung zum Geburtstag.", tr: "Doğum günü davetiyesi yazın." },
    { de: "Schreiben Sie eine Einladung zum Kaffee.", tr: "Kahve daveti yazın." },
  ];
  for (const it of inviteTemplates) {
    for (let v = 0; v < 4; v++) {
      tasks.push({
        id: `sw_${String(n++).padStart(3, "0")}`,
        level: "A1",
        type: "invitation",
        prompt_de: it.de,
        prompt_tr: it.tr,
        fields: [{ id: "text", label: "Einladung", placeholder: "Liebe...", required: true }],
        min_words: 25,
        sample_answer: "Liebe Freunde, am Samstag feiere ich meinen Geburtstag. Kommt bitte um 18 Uhr. Timur",
        tags: ["schreiben", "invitation"],
      });
    }
  }

  return tasks.slice(0, 50);
}

// ─── SPRECHEN (100) ───
function buildSprechen() {
  const cards = [];
  let n = 1;

  const part1 = [
    { de: "Stellen Sie sich vor: Name, Herkunft, Wohnort, Beruf.", tr: "Kendinizi tanıtın.", ex: "Ich heiße Timur. Ich komme aus der Türkei. Ich wohne in Berlin. Ich arbeite im Lager." },
    { de: "Sagen Sie: Wie heißen Sie? Woher kommen Sie?", tr: "Adınız ve nereli olduğunuz.", ex: "Ich heiße Timur. Ich komme aus der Türkei." },
    { de: "Sprechen Sie über Ihre Familie.", tr: "Ailenizden bahsedin.", ex: "Ich habe eine Frau und zwei Kinder. Meine Familie wohnt in der Türkei." },
    { de: "Sagen Sie, welche Sprachen Sie sprechen.", tr: "Hangi dilleri konuştuğunuzu söyleyin.", ex: "Ich spreche Türkisch, Deutsch und ein bisschen Englisch." },
  ];

  for (const p of part1) {
    for (let v = 0; v < 10; v++) {
      cards.push({
        id: `sp_${String(n++).padStart(3, "0")}`,
        level: "A1",
        part: 1,
        prompt_de: p.de,
        prompt_tr: p.tr,
        example_de: p.ex,
        example_tr: p.tr,
        checklist: ["Name genannt", "Mindestens 3 Sätze", "Deutlich gesprochen"],
        tags: ["sprechen", "introduction"],
      });
    }
  }

  const part2 = [
    { de: "Fragen Sie: Wo ist der Bahnhof?", tr: "Tren istasyonunu sorun.", ex: "Entschuldigung, wo ist der Bahnhof?" },
    { de: "Fragen Sie: Was kostet das?", tr: "Fiyat sorun.", ex: "Entschuldigung, was kostet das Brot?" },
    { de: "Fragen Sie: Wann beginnt die Schicht?", tr: "Vardiya saatini sorun.", ex: "Wann beginnt meine Schicht?" },
    { de: "Fragen Sie: Wo ist die Toilette?", tr: "Tuvaleti sorun.", ex: "Wo ist die Toilette, bitte?" },
  ];

  for (const p of part2) {
    for (let v = 0; v < 8; v++) {
      cards.push({
        id: `sp_${String(n++).padStart(3, "0")}`,
        level: "A1",
        part: 2,
        prompt_de: p.de,
        prompt_tr: p.tr,
        example_de: p.ex,
        example_tr: p.tr,
        checklist: ["Höfliche Frage", "Klare Aussprache", "Antwort verstanden"],
        tags: ["sprechen", "question"],
      });
    }
  }

  const part3 = [
    { de: "Sagen Sie: Ich möchte Wasser, bitte.", tr: "Su istiyorum deyin.", ex: "Ich möchte Wasser, bitte." },
    { de: "Sagen Sie: Ich brauche Hilfe.", tr: "Yardım lazım deyin.", ex: "Entschuldigung, ich brauche Hilfe." },
    { de: "Sagen Sie: Die Palette ist schwer.", tr: "Palet ağır deyin.", ex: "Die Palette ist sehr schwer." },
    { de: "Antworten Sie: Was machen Sie beruflich?", tr: "Mesleğinizi söyleyin.", ex: "Ich arbeite als Lagerarbeiter in Berlin." },
    { de: "Sagen Sie: Ich verstehe nicht.", tr: "Anlamıyorum deyin.", ex: "Entschuldigung, ich verstehe nicht. Können Sie das wiederholen?" },
  ];

  for (const p of part3) {
    for (let v = 0; v < 6; v++) {
      if (cards.length >= 100) break;
      cards.push({
        id: `sp_${String(n++).padStart(3, "0")}`,
        level: "A1",
        part: 3,
        prompt_de: p.de,
        prompt_tr: p.tr,
        example_de: p.ex,
        example_tr: p.tr,
        checklist: ["Satz vollständig", "Höflich", "Laut und deutlich"],
        tags: ["sprechen", "response"],
      });
    }
  }

  while (cards.length < 100) {
    const w = allWords[cards.length % allWords.length];
    cards.push({
      id: `sp_${String(n++).padStart(3, "0")}`,
      level: "A1",
      part: 3,
      prompt_de: `Benutzen Sie das Wort "${fmt(w)}" in einem Satz.`,
      prompt_tr: `"${w.translation_tr}" kelimesini cümlede kullanın.`,
      example_de: w.example_de,
      example_tr: w.example_tr,
      checklist: ["Wort verwendet", "Satz korrekt", "Verstanden"],
      tags: ["sprechen", "vocabulary"],
    });
  }

  return cards.slice(0, 100);
}

// ─── 20 DENEME SINAVI ───
function buildExams(hoeren, lesen, schreiben, sprechen) {
  const exams = [];
  const hIds = hoeren.map((q) => q.id);
  const lIds = lesen.map((p) => p.id);
  const sIds = schreiben.map((t) => t.id);
  const spIds = sprechen.map((c) => c.id);

  for (let i = 1; i <= 20; i++) {
    const seed = i * 13;
    exams.push({
      id: `exam_${String(i).padStart(2, "0")}`,
      number: i,
      title: `Goethe A1 Modellprüfung ${i}`,
      hoeren: shuffle(hIds, seed).slice(0, 10),
      lesen: shuffle(lIds, seed + 1).slice(0, 5),
      schreiben: shuffle(sIds, seed + 2).slice(0, 2),
      sprechen: shuffle(spIds, seed + 3).slice(0, 5),
      time_minutes: 65,
    });
  }
  return exams;
}

const hoeren = buildHoeren();
const lesen = buildLesen();
const schreiben = buildSchreiben();
const sprechen = buildSprechen();
const exams = buildExams(hoeren, lesen, schreiben, sprechen);

const lesenQCount = lesen.reduce((s, p) => s + p.questions.length, 0);

const bank = {
  level: "A1",
  version: "1.0.0",
  counts: {
    hoeren: hoeren.length,
    lesen_questions: lesenQCount,
    lesen_passages: lesen.length,
    schreiben: schreiben.length,
    sprechen: sprechen.length,
    exams: exams.length,
  },
};

writeFileSync(join(OUT, "bank.json"), JSON.stringify(bank, null, 2));
writeFileSync(join(OUT, "hoeren.json"), JSON.stringify(hoeren, null, 2));
writeFileSync(join(OUT, "lesen.json"), JSON.stringify(lesen, null, 2));
writeFileSync(join(OUT, "schreiben.json"), JSON.stringify(schreiben, null, 2));
writeFileSync(join(OUT, "sprechen.json"), JSON.stringify(sprechen, null, 2));
writeFileSync(join(OUT, "exams.json"), JSON.stringify(exams, null, 2));

console.log("✓ Goethe A1 Soru Bankası:");
console.log(bank.counts);
