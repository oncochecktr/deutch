// A1 Pattern Trainer data generator — run: npm run build:patterns
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "data/grundlagen/a1-patterns.json");

const core = JSON.parse(fs.readFileSync(path.join(ROOT, "data/grundlagen/a1-core.json"), "utf8"));
const vocab = JSON.parse(fs.readFileSync(path.join(ROOT, "data/a1/vocabulary.json"), "utf8"));
const artRef = JSON.parse(fs.readFileSync(path.join(ROOT, "data/a1/article-reference.json"), "utf8"));

const articleMap = {};
for (const e of Object.values(artRef.entries)) articleMap[e.word.toLowerCase()] = e.article;

function akk(de, article) {
  if (!article) return de;
  if (article === "der") return `einen ${de}`;
  if (article === "die") return `eine ${de}`;
  return `ein ${de}`;
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

function pick(pool, n, seed) {
  return shuffle(pool, seed).slice(0, n);
}

function wordEntry(word) {
  const w = vocab.words.find((x) => x.word.toLowerCase() === word.toLowerCase());
  if (!w) return { de: word, tr: word, article: articleMap[word.toLowerCase()] ?? null };
  return { de: w.word, tr: w.translation_tr, article: w.article ?? articleMap[w.word.toLowerCase()] ?? null };
}

function byCategory(...cats) {
  return vocab.words
    .filter((w) => cats.includes(w.category) && w.word.split(" ").length <= 2)
    .map((w) => ({ de: w.word, tr: w.translation_tr, article: w.article ?? articleMap[w.word.toLowerCase()] ?? null }));
}

const CONJ = {
  sein: [
    { de: "bin", tr: "…ım", person: "ich" },
    { de: "bist", tr: "…sın", person: "du" },
    { de: "ist", tr: "…", person: "er" },
    { de: "sind", tr: "…ız", person: "wir" },
  ],
  haben: [
    { de: "habe", tr: "var (benim)", person: "ich" },
    { de: "hast", tr: "var (senin)", person: "du" },
    { de: "hat", tr: "var (onun)", person: "er" },
    { de: "haben", tr: "var (bizim)", person: "wir" },
  ],
  moechten: [
    { de: "möchte", tr: "isterim", person: "ich" },
    { de: "möchtest", tr: "istersin", person: "du" },
    { de: "möchte", tr: "ister", person: "er" },
    { de: "möchten", tr: "isteriz", person: "wir" },
  ],
  koennen: [
    { de: "kann", tr: "yapabilirim", person: "ich" },
    { de: "kannst", tr: "yapabilirsin", person: "du" },
    { de: "kann", tr: "yapabilir", person: "er" },
    { de: "können", tr: "yapabiliriz", person: "wir" },
  ],
  muessen: [
    { de: "muss", tr: "zorundayım", person: "ich" },
    { de: "musst", tr: "zorundasın", person: "du" },
    { de: "muss", tr: "zorunda", person: "er" },
    { de: "müssen", tr: "zorundayız", person: "wir" },
  ],
  wollen: [
    { de: "will", tr: "istiyorum", person: "ich" },
    { de: "willst", tr: "istiyorsun", person: "du" },
    { de: "will", tr: "istiyor", person: "er" },
    { de: "wollen", tr: "istiyoruz", person: "wir" },
  ],
  brauchen: [
    { de: "brauche", tr: "ihtiyacım var", person: "ich" },
    { de: "brauchst", tr: "ihtiyacın var", person: "du" },
    { de: "braucht", tr: "ihtiyacı var", person: "er" },
    { de: "brauchen", tr: "ihtiyacımız var", person: "wir" },
  ],
  essen: [
    { de: "esse", tr: "yiyorum", person: "ich" },
    { de: "isst", tr: "yiyorsun", person: "du" },
    { de: "isst", tr: "yiyor", person: "er" },
    { de: "essen", tr: "yiyoruz", person: "wir" },
  ],
  trinken: [
    { de: "trinke", tr: "içiyorum", person: "ich" },
    { de: "trinkst", tr: "içiyorsun", person: "du" },
    { de: "trinkt", tr: "içiyor", person: "er" },
    { de: "trinken", tr: "içiyoruz", person: "wir" },
  ],
  kaufen: [
    { de: "kaufe", tr: "satın alıyorum", person: "ich" },
    { de: "kaufst", tr: "satın alıyorsun", person: "du" },
    { de: "kauft", tr: "satın alıyor", person: "er" },
    { de: "kaufen", tr: "satın alıyoruz", person: "wir" },
  ],
  lernen: [
    { de: "lerne", tr: "öğreniyorum", person: "ich" },
    { de: "lernst", tr: "öğreniyorsun", person: "du" },
    { de: "lernt", tr: "öğreniyor", person: "er" },
    { de: "lernen", tr: "öğreniyoruz", person: "wir" },
  ],
  arbeiten: [
    { de: "arbeite", tr: "çalışıyorum", person: "ich" },
    { de: "arbeitest", tr: "çalışıyorsun", person: "du" },
    { de: "arbeitet", tr: "çalışıyor", person: "er" },
    { de: "arbeiten", tr: "çalışıyoruz", person: "wir" },
  ],
  wohnen: [
    { de: "wohne", tr: "oturuyorum", person: "ich" },
    { de: "wohnst", tr: "oturuyorsun", person: "du" },
    { de: "wohnt", tr: "oturuyor", person: "er" },
    { de: "wohnen", tr: "oturuyoruz", person: "wir" },
  ],
  kommen: [
    { de: "komme", tr: "geliyorum", person: "ich" },
    { de: "kommst", tr: "geliyorsun", person: "du" },
    { de: "kommt", tr: "geliyor", person: "er" },
    { de: "kommen", tr: "geliyoruz", person: "wir" },
  ],
  sprechen: [
    { de: "spreche", tr: "konuşuyorum", person: "ich" },
    { de: "sprichst", tr: "konuşuyorsun", person: "du" },
    { de: "spricht", tr: "konuşuyor", person: "er" },
    { de: "sprechen", tr: "konuşuyoruz", person: "wir" },
  ],
  verstehen: [
    { de: "verstehe", tr: "anlıyorum", person: "ich" },
    { de: "verstehst", tr: "anlıyorsun", person: "du" },
    { de: "versteht", tr: "anlıyor", person: "er" },
    { de: "verstehen", tr: "anlıyoruz", person: "wir" },
  ],
  heissen: [
    { de: "heiße", tr: "adım …", person: "ich" },
    { de: "heißt", tr: "adın …", person: "du" },
    { de: "heißt", tr: "adı …", person: "er" },
    { de: "heißen", tr: "adımız …", person: "wir" },
  ],
  gehen: [
    { de: "gehe", tr: "gidiyorum", person: "ich" },
    { de: "gehst", tr: "gidiyorsun", person: "du" },
    { de: "geht", tr: "gidiyor", person: "er" },
    { de: "gehen", tr: "gidiyoruz", person: "wir" },
  ],
  fahren: [
    { de: "fahre", tr: "gidiyorum (araç)", person: "ich" },
    { de: "fährst", tr: "gidiyorsun (araç)", person: "du" },
    { de: "fährt", tr: "gidiyor (araç)", person: "er" },
    { de: "fahren", tr: "gidiyoruz (araç)", person: "wir" },
  ],
  duerfen: [
    { de: "darf", tr: "yapabilirim (izin)", person: "ich" },
    { de: "darfst", tr: "yapabilirsin (izin)", person: "du" },
    { de: "darf", tr: "yapabilir (izin)", person: "er" },
    { de: "dürfen", tr: "yapabiliriz (izin)", person: "wir" },
  ],
  kosten: [
    { de: "kostet", tr: "… tutar", person: "es" },
  ],
  beginnen: [
    { de: "beginnt", tr: "başlar", person: "es" },
  ],
  geben: [
    { de: "gibt", tr: "var (es gibt)", person: "es" },
  ],
};

function anchorFrom(key, infinitive, tr) {
  const forms = CONJ[key] ?? [];
  return {
    infinitive,
    tr,
    conjugation: forms.map((f) => ({ de: `${f.person === "es" ? "es" : f.person} ${f.de}`, tr: f.tr })),
  };
}

function conjQuiz(key, correctForm, promptTr) {
  const forms = CONJ[key].map((f) => f.de);
  const uniq = [...new Set(forms)];
  const options = shuffle([correctForm, ...uniq.filter((f) => f !== correctForm)].slice(0, 4), correctForm.length);
  while (options.length < 4) options.push(uniq[options.length % uniq.length]);
  const correct_index = options.indexOf(correctForm);
  return {
    type: "conjugation",
    prompt_tr: promptTr,
    blank: correctForm,
    options: options.slice(0, 4),
    correct_index: correct_index >= 0 ? correct_index : 0,
  };
}

function completionQuiz(de, tr, allDe) {
  const options = shuffle([de, ...allDe.filter((x) => x !== de).slice(0, 3)], de.length);
  while (options.length < 4) options.push(de);
  return {
    type: "completion",
    prompt_tr: tr,
    blank: de.split(" ").find((w) => w.length > 3) ?? de,
    options: options.slice(0, 4),
    correct_index: options.indexOf(de) >= 0 ? options.indexOf(de) : 0,
  };
}

function ex(id, de, tr, breakdown, quiz) {
  return { id, de, tr, breakdown, quiz };
}

function mkBreakdown(parts) {
  return parts.map((p) => ({ de: p.de, tr: p.tr, role: p.role }));
}

// Slot pools
const PROFESSIONS = [
  { de: "Student", tr: "öğrenci" },
  { de: "Lehrer", tr: "öğretmen" },
  { de: "Arzt", tr: "doktor" },
  { de: "Krankenschwester", tr: "hemşire" },
  { de: "Verkäufer", tr: "satıcı" },
  { de: "Koch", tr: "aşçı" },
  { de: "Mechaniker", tr: "tamirci" },
  { de: "Ingenieur", tr: "mühendis" },
  { de: "Kellner", tr: "garson" },
  { de: "Friseur", tr: "berber" },
  { de: "Lagerist", tr: "depo işçisi" },
  { de: "Programmierer", tr: "programcı" },
  { de: "Bäcker", tr: "fırıncı" },
  { de: "Polizist", tr: "polis" },
  { de: "Fahrer", tr: "şoför" },
  { de: "Sekretär", tr: "sekreter" },
  { de: "Elektriker", tr: "elektrikçi" },
  { de: "Maler", tr: "boyacı" },
  { de: "Architekt", tr: "mimar" },
  { de: "Kellnerin", tr: "garson (kadın)" },
];

const HABEN_SLOTS = [
  { de: "Hunger", tr: "açlık" },
  { de: "Durst", tr: "susuzluk" },
  { de: "Zeit", tr: "zaman" },
  { de: "Arbeit", tr: "iş" },
  { de: "ein Auto", tr: "bir araba" },
  { de: "einen Hund", tr: "bir köpek" },
  { de: "eine Katze", tr: "bir kedi" },
  { de: "zwei Kinder", tr: "iki çocuk" },
  { de: "eine Idee", tr: "bir fikir" },
  { de: "ein Problem", tr: "bir sorun" },
  { de: "einen Termin", tr: "bir randevu" },
  { de: "einen Bruder", tr: "bir erkek kardeş" },
  { de: "eine Schwester", tr: "bir kız kardeş" },
  { de: "einen Pass", tr: "bir pasaport" },
  { de: "eine Frage", tr: "bir soru" },
  { de: "einen Schlüssel", tr: "bir anahtar" },
  { de: "Geld", tr: "para" },
  { de: "einen Koffer", tr: "bir bavul" },
  { de: "eine Tasche", tr: "bir çanta" },
  { de: "einen Computer", tr: "bir bilgisayar" },
];

const MOECHTE_SLOTS = [
  { de: "Wasser", tr: "su", article: null },
  { de: "einen Salat", tr: "bir salata", article: null },
  { de: "einen Kaffee", tr: "bir kahve", article: null },
  { de: "eine Cola", tr: "bir kola", article: null },
  { de: "Deutsch lernen", tr: "Almanca öğrenmek", inf: true },
  { de: "schlafen", tr: "uyumak", inf: true },
  { de: "einen Apfel", tr: "bir elma", article: null },
  { de: "eine Pizza", tr: "bir pizza", article: null },
  { de: "eine Suppe", tr: "bir çorba", article: null },
  { de: "einen Tee", tr: "bir çay", article: null },
  { de: "eine Brezel", tr: "bir simit", article: null },
  { de: "einen Kuchen", tr: "bir kek", article: null },
  { de: "eine Flasche Wasser", tr: "bir şişe su", article: null },
  { de: "einen Hamburger", tr: "bir hamburger", article: null },
  { de: "eine Banane", tr: "bir muz", article: null },
  { de: "einen Orangensaft", tr: "bir portakal suyu", article: null },
  { de: "einen Tisch", tr: "bir masa", article: null },
  { de: "eine Rechnung", tr: "bir hesap", article: null },
  { de: "einen Stift", tr: "bir kalem", article: null },
  { de: "nach Hause gehen", tr: "eve gitmek", inf: true },
];

const INFINITIVES = [
  { de: "lernen", tr: "öğrenmek" },
  { de: "arbeiten", tr: "çalışmak" },
  { de: "schlafen", tr: "uyumak" },
  { de: "kochen", tr: "yemek yapmak" },
  { de: "schwimmen", tr: "yüzmek" },
  { de: "tanzen", tr: "dans etmek" },
  { de: "singen", tr: "şarkı söylemek" },
  { de: "lesen", tr: "okumak" },
  { de: "schreiben", tr: "yazmak" },
  { de: "spielen", tr: "oynamak" },
  { de: "fernsehen", tr: "televizyon izlemek" },
  { de: "einkaufen", tr: "alışveriş yapmak" },
  { de: "kochen", tr: "pişirmek" },
  { de: "laufen", tr: "koşmak" },
  { de: "helfen", tr: "yardım etmek" },
  { de: "warten", tr: "beklemek" },
  { de: "bezahlen", tr: "ödemek" },
  { de: "fragen", tr: "sormak" },
  { de: "antworten", tr: "cevap vermek" },
  { de: "telefonieren", tr: "telefon etmek" },
];

const FOODS = byCategory("Restoran", "Market").slice(0, 25);
const DRINKS = [
  wordEntry("Wasser"), wordEntry("Kaffee"), wordEntry("Tee"), wordEntry("Milch"),
  wordEntry("Saft"), wordEntry("Cola"), wordEntry("Bier"), wordEntry("Wein"),
  { de: "Orangensaft", tr: "portakal suyu", article: "der" },
  { de: "Apfelsaft", tr: "elma suyu", article: "der" },
  { de: "Mineralwasser", tr: "maden suyu", article: "das" },
  { de: "Kakao", tr: "kakao", article: "der" },
  { de: "Limonade", tr: "limonata", article: "die" },
  { de: "Eistee", tr: "soğuk çay", article: "der" },
  { de: "Heißgetränk", tr: "sıcak içecek", article: "das" },
  { de: "Rotwein", tr: "kırmızı şarap", article: "der" },
  { de: "Weißwein", tr: "beyaz şarap", article: "der" },
  { de: "Sprudelwasser", tr: "soda", article: "das" },
  { de: "Energydrink", tr: "enerji içeceği", article: "der" },
  { de: "Smoothie", tr: "smoothie", article: "der" },
  { de: "Cappuccino", tr: "kapuçino", article: "der" },
  { de: "Espresso", tr: "espresso", article: "der" },
].map((w) => ({ de: w.de, tr: w.tr, article: w.article ?? null }));

const CITIES = [
  { de: "Berlin", tr: "Berlin" }, { de: "München", tr: "Münih" }, { de: "Hamburg", tr: "Hamburg" },
  { de: "Köln", tr: "Köln" }, { de: "Frankfurt", tr: "Frankfurt" }, { de: "Ankara", tr: "Ankara" },
  { de: "Istanbul", tr: "İstanbul" }, { de: "Izmir", tr: "İzmir" }, { de: "Wien", tr: "Viyana" },
  { de: "Zürich", tr: "Zürih" }, { de: "Paris", tr: "Paris" }, { de: "London", tr: "Londra" },
  { de: "Rom", tr: "Roma" }, { de: "Madrid", tr: "Madrid" }, { de: "Amsterdam", tr: "Amsterdam" },
  { de: "Dresden", tr: "Dresden" }, { de: "Stuttgart", tr: "Stuttgart" }, { de: "Leipzig", tr: "Leipzig" },
  { de: "Bremen", tr: "Bremen" }, { de: "Dortmund", tr: "Dortmund" },
];

const COUNTRIES = [
  { de: "der Türkei", tr: "Türkiye" }, { de: "Deutschland", tr: "Almanya" },
  { de: "Österreich", tr: "Avusturya" }, { de: "der Schweiz", tr: "İsviçre" },
  { de: "Polen", tr: "Polonya" }, { de: "Frankreich", tr: "Fransa" },
  { de: "Italien", tr: "İtalya" }, { de: "Spanien", tr: "İspanya" },
  { de: "Griechenland", tr: "Yunanistan" }, { de: "Russland", tr: "Rusya" },
  { de: "Syrien", tr: "Suriye" }, { de: "dem Irak", tr: "Irak" },
  { de: "Afghanistan", tr: "Afganistan" }, { de: "Marokko", tr: "Fas" },
  { de: "Ägypten", tr: "Mısır" }, { de: "dem Iran", tr: "İran" },
  { de: "Bulgarien", tr: "Bulgaristan" }, { de: "Rumänien", tr: "Romanya" },
  { de: "Ungarn", tr: "Macaristan" }, { de: "den USA", tr: "ABD" },
];

const LANGUAGES = [
  { de: "Deutsch", tr: "Almanca" }, { de: "Türkisch", tr: "Türkçe" },
  { de: "Englisch", tr: "İngilizce" }, { de: "Russisch", tr: "Rusça" },
  { de: "Arabisch", tr: "Arapça" }, { de: "Französisch", tr: "Fransızca" },
  { de: "Spanisch", tr: "İspanyolca" }, { de: "Italienisch", tr: "İtalyanca" },
  { de: "Polnisch", tr: "Lehçe" }, { de: "Kurdisch", tr: "Kürtçe" },
  { de: "Persisch", tr: "Farsça" }, { de: "Ungarisch", tr: "Macarca" },
  { de: "Rumänisch", tr: "Romence" }, { de: "Bulgarisch", tr: "Bulgarca" },
  { de: "Griechisch", tr: "Yunanca" }, { de: "Portugiesisch", tr: "Portekizce" },
  { de: "Chinesisch", tr: "Çince" }, { de: "Japanisch", tr: "Japonca" },
  { de: "Koreanisch", tr: "Korece" }, { de: "Hindi", tr: "Hintçe" },
];

const NAMES = [
  "Timur", "Anna", "Ali", "Maria", "Mehmet", "Lisa", "Ahmet", "Sara",
  "Emre", "Julia", "Can", "Laura", "Fatma", "Max", "Ayşe", "Tom",
  "Deniz", "Sophie", "Omar", "Emma", "Yusuf", "Lena", "Hassan", "Nina",
];

const AGES = [18, 19, 20, 22, 25, 27, 30, 32, 35, 38, 40, 42, 45, 48, 50, 55, 60, 22, 28, 33];

const TIMES = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 6, 7, 8, 9];

const PRICES = [
  "2 Euro", "3 Euro", "5 Euro", "7 Euro", "10 Euro", "12 Euro", "15 Euro",
  "20 Euro", "25 Euro", "30 Euro", "4,50 Euro", "6,80 Euro", "8,90 Euro",
  "1 Euro", "50 Cent", "99 Cent", "35 Euro", "45 Euro", "100 Euro", "150 Euro",
];

const PLACES = [
  { de: "zum Supermarkt", tr: "süpermarkete" },
  { de: "zur Arbeit", tr: "işe" },
  { de: "nach Hause", tr: "eve" },
  { de: "zur Schule", tr: "okula" },
  { de: "ins Kino", tr: "sinemaya" },
  { de: "zum Arzt", tr: "doktora" },
  { de: "in die Stadt", tr: "şehre" },
  { de: "zum Bahnhof", tr: "tren istasyonuna" },
  { de: "in den Park", tr: "parka" },
  { de: "zur Post", tr: "postaneye" },
  { de: "ins Restaurant", tr: "restorana" },
  { de: "zur Uni", tr: "üniversiteye" },
  { de: "zum Flughafen", tr: "havalimanına" },
  { de: "in die Bibliothek", tr: "kütüphaneye" },
  { de: "zum Markt", tr: "markete" },
  { de: "ins Fitnessstudio", tr: "spor salonuna" },
  { de: "zur Bank", tr: "bankaya" },
  { de: "in die Apotheke", tr: "eczaneye" },
  { de: "zum Friseur", tr: "berbere" },
  { de: "ins Café", tr: "kafeye" },
];

const OBJECTS = byCategory("Market", "Ev", "Günlük ihtiyaçlar").filter((w) => w.article).slice(0, 30);

function buildPattern(def) {
  const examples = def.build();
  if (examples.length !== 20) throw new Error(`${def.id}: expected 20 examples, got ${examples.length}`);
  return {
    id: def.id,
    order: def.order,
    template_de: def.template_de,
    template_tr: def.template_tr,
    category: def.category,
    anchor: def.anchor,
    examples,
  };
}

const PATTERN_DEFS = [
  {
    id: "ich-bin", order: 1, template_de: "Ich bin …", template_tr: "Ben …ım (meslek / kimlik)", category: "statement",
    anchor: anchorFrom("sein", "sein", "olmak"),
    build() {
      const slots = pick(PROFESSIONS, 20, 1);
      return slots.map((s, i) => {
        const de = `Ich bin ${s.de}.`;
        const tr = `Ben ${s.tr}im/yim.`;
        return ex(`ich-bin-${i}`, de, tr,
          mkBreakdown([
            { de: "Ich", tr: "Ben" }, { de: "bin", tr: "…ım", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" },
          ]),
          conjQuiz("sein", "bin", "Ben …ım — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-habe", order: 2, template_de: "Ich habe …", template_tr: "Benim … var", category: "statement",
    anchor: anchorFrom("haben", "haben", "sahip olmak"),
    build() {
      const slots = pick(HABEN_SLOTS, 20, 2);
      return slots.map((s, i) => {
        const de = `Ich habe ${s.de}.`;
        const tr = s.de === "Hunger" ? "Açım var." : s.de === "Durst" ? "Susuzum." : s.de === "Zeit" ? "Vaktim var." : `Benim ${s.tr} var.`;
        return ex(`ich-habe-${i}`, de, tr,
          mkBreakdown([
            { de: "Ich", tr: "Ben" }, { de: "habe", tr: "var (benim)", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" },
          ]),
          conjQuiz("haben", "habe", "Benim … var — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-moechte", order: 3, template_de: "Ich möchte …", template_tr: "… istiyorum", category: "modal",
    anchor: anchorFrom("moechten", "möchten", "istemek (kibar)"),
    build() {
      const slots = pick(MOECHTE_SLOTS, 20, 3);
      return slots.map((s, i) => {
        const de = `Ich möchte ${s.de}.`;
        const tr = `${s.tr.charAt(0).toUpperCase() + s.tr.slice(1)} istiyorum.`;
        return ex(`ich-moechte-${i}`, de, tr,
          mkBreakdown([
            { de: "Ich", tr: "Ben" }, { de: "möchte", tr: "isterim", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" },
          ]),
          conjQuiz("moechten", "möchte", "Ben … istiyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-kann", order: 4, template_de: "Ich kann …", template_tr: "… yapabilirim", category: "modal",
    anchor: anchorFrom("koennen", "können", "yapabilmek"),
    build() {
      const slots = pick(INFINITIVES, 20, 4);
      return slots.map((s, i) => {
        const de = `Ich kann ${s.de}.`;
        return ex(`ich-kann-${i}`, de, `${s.tr.charAt(0).toUpperCase() + s.tr.slice(1)} yapabilirim.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "kann", tr: "yapabilirim", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("koennen", "kann", "Ben … yapabilirim — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-muss", order: 5, template_de: "Ich muss …", template_tr: "… zorundayım", category: "modal",
    anchor: anchorFrom("muessen", "müssen", "zorunda olmak"),
    build() {
      const slots = pick(INFINITIVES, 20, 5);
      return slots.map((s, i) => {
        const de = `Ich muss ${s.de}.`;
        return ex(`ich-muss-${i}`, de, `${s.tr.charAt(0).toUpperCase() + s.tr.slice(1)} zorundayım.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "muss", tr: "zorundayım", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("muessen", "muss", "Ben … zorundayım — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-will", order: 6, template_de: "Ich will …", template_tr: "… istiyorum", category: "modal",
    anchor: anchorFrom("wollen", "wollen", "istemek"),
    build() {
      const slots = pick(INFINITIVES, 20, 6);
      return slots.map((s, i) => {
        const de = `Ich will ${s.de}.`;
        return ex(`ich-will-${i}`, de, `${s.tr.charAt(0).toUpperCase() + s.tr.slice(1)} istiyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "will", tr: "istiyorum", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("wollen", "will", "Ben … istiyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-brauche", order: 7, template_de: "Ich brauche …", template_tr: "… lazım", category: "statement",
    anchor: anchorFrom("brauchen", "brauchen", "ihtiyaç duymak"),
    build() {
      const slots = pick([...HABEN_SLOTS, ...OBJECTS.slice(0, 10)], 20, 7);
      return slots.map((s, i) => {
        const de = `Ich brauche ${s.de}.`;
        return ex(`ich-brauche-${i}`, de, `${s.tr.charAt(0).toUpperCase() + s.tr.slice(1)} lazım.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "brauche", tr: "ihtiyacım var", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("brauchen", "brauche", "Ben … lazım — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-esse", order: 8, template_de: "Ich esse …", template_tr: "… yiyorum", category: "statement",
    anchor: anchorFrom("essen", "essen", "yemek"),
    build() {
      const slots = pick(FOODS.length >= 20 ? FOODS : MOECHTE_SLOTS, 20, 8);
      return slots.map((s, i) => {
        const obj = s.article ? akk(s.de, s.article) : s.de;
        const de = `Ich esse ${obj}.`;
        return ex(`ich-esse-${i}`, de, `${s.tr} yiyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "esse", tr: "yiyorum", role: "verb" }, { de: obj, tr: s.tr, role: "slot" }]),
          conjQuiz("essen", "esse", "Ben … yiyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-trinke", order: 9, template_de: "Ich trinke …", template_tr: "… içiyorum", category: "statement",
    anchor: anchorFrom("trinken", "trinken", "içmek"),
    build() {
      const slots = pick(DRINKS, 20, 9);
      return slots.map((s, i) => {
        const de = `Ich trinke ${s.de}.`;
        return ex(`ich-trinke-${i}`, de, `${s.tr} içiyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "trinke", tr: "içiyorum", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("trinken", "trinke", "Ben … içiyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-kaufe", order: 10, template_de: "Ich kaufe …", template_tr: "… satın alıyorum", category: "statement",
    anchor: anchorFrom("kaufen", "kaufen", "satın almak"),
    build() {
      const slots = pick(OBJECTS.length >= 20 ? OBJECTS : HABEN_SLOTS, 20, 10);
      return slots.map((s, i) => {
        const obj = s.article ? akk(s.de, s.article) : s.de;
        const de = `Ich kaufe ${obj}.`;
        return ex(`ich-kaufe-${i}`, de, `${s.tr} satın alıyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "kaufe", tr: "satın alıyorum", role: "verb" }, { de: obj, tr: s.tr, role: "slot" }]),
          conjQuiz("kaufen", "kaufe", "Ben … satın alıyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-lerne", order: 11, template_de: "Ich lerne …", template_tr: "… öğreniyorum", category: "statement",
    anchor: anchorFrom("lernen", "lernen", "öğrenmek"),
    build() {
      const slots = pick(LANGUAGES, 20, 11);
      return slots.map((s, i) => {
        const de = `Ich lerne ${s.de}.`;
        return ex(`ich-lerne-${i}`, de, `${s.tr} öğreniyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "lerne", tr: "öğreniyorum", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("lernen", "lerne", "Ben … öğreniyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-arbeite", order: 12, template_de: "Ich arbeite …", template_tr: "… çalışıyorum", category: "statement",
    anchor: anchorFrom("arbeiten", "arbeiten", "çalışmak"),
    build() {
      const slots = pick(CITIES, 20, 12);
      return slots.map((s, i) => {
        const de = `Ich arbeite in ${s.de}.`;
        return ex(`ich-arbeite-${i}`, de, `${s.tr}'de çalışıyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "arbeite", tr: "çalışıyorum", role: "verb" }, { de: "in", tr: "-de" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("arbeiten", "arbeite", "Ben … çalışıyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-wohne-in", order: 13, template_de: "Ich wohne in …", template_tr: "…de oturuyorum", category: "location",
    anchor: anchorFrom("wohnen", "wohnen", "oturmak"),
    build() {
      const slots = pick(CITIES, 20, 13);
      return slots.map((s, i) => {
        const de = `Ich wohne in ${s.de}.`;
        return ex(`ich-wohne-in-${i}`, de, `${s.tr}'de oturuyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "wohne", tr: "oturuyorum", role: "verb" }, { de: "in", tr: "-de" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("wohnen", "wohne", "Ben … oturuyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-komme-aus", order: 14, template_de: "Ich komme aus …", template_tr: "…den geliyorum", category: "location",
    anchor: anchorFrom("kommen", "kommen", "gelmek"),
    build() {
      const slots = pick(COUNTRIES, 20, 14);
      return slots.map((s, i) => {
        const de = `Ich komme aus ${s.de}.`;
        return ex(`ich-komme-aus-${i}`, de, `${s.tr}'den geliyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "komme", tr: "geliyorum", role: "verb" }, { de: "aus", tr: "-den" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("kommen", "komme", "Ben … geliyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-arbeite-als", order: 15, template_de: "Ich arbeite als …", template_tr: "… olarak çalışıyorum", category: "statement",
    anchor: anchorFrom("arbeiten", "arbeiten", "çalışmak"),
    build() {
      const slots = pick(PROFESSIONS, 20, 15);
      return slots.map((s, i) => {
        const de = `Ich arbeite als ${s.de}.`;
        return ex(`ich-arbeite-als-${i}`, de, `${s.tr} olarak çalışıyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "arbeite", tr: "çalışıyorum", role: "verb" }, { de: "als", tr: "olarak" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("arbeiten", "arbeite", "Ben … olarak çalışıyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-spreche", order: 16, template_de: "Ich spreche …", template_tr: "… konuşuyorum", category: "statement",
    anchor: anchorFrom("sprechen", "sprechen", "konuşmak"),
    build() {
      const slots = pick(LANGUAGES, 20, 16);
      return slots.map((s, i) => {
        const de = `Ich spreche ${s.de}.`;
        return ex(`ich-spreche-${i}`, de, `${s.tr} konuşuyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "spreche", tr: "konuşuyorum", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("sprechen", "spreche", "Ben … konuşuyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-verstehe", order: 17, template_de: "Ich verstehe …", template_tr: "… anlıyorum", category: "statement",
    anchor: anchorFrom("verstehen", "verstehen", "anlamak"),
    build() {
      const slots = pick(LANGUAGES, 20, 17);
      return slots.map((s, i) => {
        const de = `Ich verstehe ${s.de}.`;
        return ex(`ich-verstehe-${i}`, de, `${s.tr} anlıyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "verstehe", tr: "anlıyorum", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("verstehen", "verstehe", "Ben … anlıyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-heisse", order: 18, template_de: "Ich heiße …", template_tr: "Adım …", category: "statement",
    anchor: anchorFrom("heissen", "heißen", "adlandırılmak"),
    build() {
      const slots = pick(NAMES, 20, 18);
      return slots.map((s, i) => {
        const de = `Ich heiße ${s}.`;
        return ex(`ich-heisse-${i}`, de, `Adım ${s}.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "heiße", tr: "adım", role: "verb" }, { de: s, tr: s, role: "slot" }]),
          conjQuiz("heissen", "heiße", "Adım … — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-bin-jahre-alt", order: 19, template_de: "Ich bin … Jahre alt", template_tr: "… yaşındayım", category: "statement",
    anchor: anchorFrom("sein", "sein", "olmak"),
    build() {
      const slots = pick(AGES, 20, 19);
      return slots.map((s, i) => {
        const de = `Ich bin ${s} Jahre alt.`;
        return ex(`ich-bin-jahre-alt-${i}`, de, `${s} yaşındayım.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "bin", tr: "…ım", role: "verb" }, { de: String(s), tr: String(s), role: "slot" }, { de: "Jahre alt", tr: "yaşında" }]),
          conjQuiz("sein", "bin", "… yaşındayım — hangi fiil?"));
      });
    },
  },
  {
    id: "es-ist-uhr", order: 20, template_de: "Es ist … Uhr", template_tr: "Saat …", category: "time",
    anchor: anchorFrom("sein", "sein", "olmak"),
    build() {
      const slots = pick(TIMES, 20, 20);
      return slots.map((s, i) => {
        const de = `Es ist ${s} Uhr.`;
        return ex(`es-ist-uhr-${i}`, de, `Saat ${s}.`,
          mkBreakdown([{ de: "Es", tr: "O (zaman)" }, { de: "ist", tr: "…", role: "verb" }, { de: String(s), tr: String(s), role: "slot" }, { de: "Uhr", tr: "saat" }]),
          conjQuiz("sein", "ist", "Saat … — hangi fiil?"));
      });
    },
  },
  {
    id: "was-ist", order: 21, template_de: "Was ist …?", template_tr: "… nedir?", category: "question",
    build() {
      const slots = pick(OBJECTS.length >= 20 ? OBJECTS : HABEN_SLOTS, 20, 21);
      return slots.map((s, i) => {
        const art = s.article === "der" ? "das" : s.article === "die" ? "die" : "das";
        const de = `Was ist ${art} ${s.de}?`;
        return ex(`was-ist-${i}`, de, `${s.tr} nedir?`,
          mkBreakdown([{ de: "Was", tr: "Ne", role: "question" }, { de: "ist", tr: "…dır", role: "verb" }, { de: `${art} ${s.de}`, tr: s.tr, role: "slot" }]),
          conjQuiz("sein", "ist", "… nedir? — hangi fiil?"));
      });
    },
  },
  {
    id: "was-moechtest-du", order: 22, template_de: "Was möchtest du …?", template_tr: "Ne … istiyorsun?", category: "question",
    anchor: anchorFrom("moechten", "möchten", "istemek (kibar)"),
    build() {
      const verbs = ["essen", "trinken", "kaufen", "lernen", "machen", "sehen", "hören", "bestellen", "nehmen", "finden", "kochen", "spielen", "lesen", "schreiben", "tanzen", "schwimmen", "arbeiten", "schlafen", "warten", "bezahlen"];
      const trMap = Object.fromEntries(INFINITIVES.map((v) => [v.de, v.tr]));
      return verbs.map((v, i) => {
        const de = `Was möchtest du ${v}?`;
        const tr = `Ne ${trMap[v] ?? v} istiyorsun?`;
        return ex(`was-moechtest-du-${i}`, de, tr,
          mkBreakdown([{ de: "Was", tr: "Ne", role: "question" }, { de: "möchtest", tr: "istersin", role: "verb" }, { de: "du", tr: "sen" }, { de: v, tr: trMap[v] ?? v, role: "slot" }]),
          conjQuiz("moechten", "möchtest", "Ne … istiyorsun? — hangi fiil?"));
      });
    },
  },
  {
    id: "was-isst-du", order: 23, template_de: "Was isst du …?", template_tr: "Ne yiyorsun …?", category: "question",
    anchor: anchorFrom("essen", "essen", "yemek"),
    build() {
      const ctx = ["zum Frühstück", "zum Mittagessen", "zum Abendessen", "heute", "gern", "am Wochenende", "im Restaurant", "zu Hause", "mit Freunden", "im Büro", "schnell", "warm", "kalt", "ohne Fleisch", "mit Salat", "am Montag", "am Sonntag", "jeden Tag", "manchmal", "oft"];
      const trCtx = ["kahvaltıda", "öğle yemeğinde", "akşam yemeğinde", "bugün", "severek", "hafta sonu", "restoranda", "evde", "arkadaşlarla", "ofiste", "hızlıca", "sıcak", "soğuk", "etsiz", "salatalı", "pazartesi", "pazar", "her gün", "bazen", "sık sık"];
      return ctx.map((c, i) => {
        const de = i < 10 ? `Was isst du ${c}?` : `Was isst du ${c}?`;
        return ex(`was-isst-du-${i}`, de, `Ne yiyorsun ${trCtx[i]}?`,
          mkBreakdown([{ de: "Was", tr: "Ne", role: "question" }, { de: "isst", tr: "yiyorsun", role: "verb" }, { de: "du", tr: "sen" }, { de: c, tr: trCtx[i], role: "slot" }]),
          conjQuiz("essen", "isst", "Ne yiyorsun? — hangi fiil?"));
      });
    },
  },
  {
    id: "was-trinkst-du", order: 24, template_de: "Was trinkst du?", template_tr: "Ne içiyorsun?", category: "question",
    anchor: anchorFrom("trinken", "trinken", "içmek"),
    build() {
      const slots = pick(DRINKS, 20, 24);
      return slots.map((s, i) => {
        const de = `Trinkst du ${s.de}?`;
        return ex(`was-trinkst-du-${i}`, de, `${s.tr} içiyor musun?`,
          mkBreakdown([{ de: "Trinkst", tr: "içiyor musun", role: "verb" }, { de: "du", tr: "sen" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("trinken", "trinkst", "… içiyorsun — hangi fiil?"));
      });
    },
  },
  {
    id: "wo-ist", order: 25, template_de: "Wo ist …?", template_tr: "… nerede?", category: "question",
    build() {
      const slots = [
        { de: "der Bahnhof", tr: "tren istasyonu" }, { de: "die Toilette", tr: "tuvalet" },
        { de: "das Hotel", tr: "otel" }, { de: "der Supermarkt", tr: "süpermarket" },
        { de: "die Apotheke", tr: "eczane" }, { de: "der Arzt", tr: "doktor" },
        { de: "die Schule", tr: "okul" }, { de: "der Park", tr: "park" },
        { de: "das Restaurant", tr: "restoran" }, { de: "die Bank", tr: "banka" },
        { de: "der Eingang", tr: "giriş" }, { de: "der Ausgang", tr: "çıkış" },
        { de: "die Bushaltestelle", tr: "otobüs durağı" }, { de: "der Flughafen", tr: "havalimanı" },
        { de: "das Krankenhaus", tr: "hastane" }, { de: "die Post", tr: "postane" },
        { de: "der Markt", tr: "market" }, { de: "die Bibliothek", tr: "kütüphane" },
        { de: "das Café", tr: "kafe" }, { de: "der Bahnsteig", tr: "peron" },
      ];
      return slots.map((s, i) => {
        const de = `Wo ist ${s.de}?`;
        return ex(`wo-ist-${i}`, de, `${s.tr} nerede?`,
          mkBreakdown([{ de: "Wo", tr: "Nerede", role: "question" }, { de: "ist", tr: "…", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("sein", "ist", "… nerede? — hangi fiil?"));
      });
    },
  },
  {
    id: "wo-wohnst-du", order: 26, template_de: "Wo wohnst du?", template_tr: "Nerede oturuyorsun?", category: "question",
    anchor: anchorFrom("wohnen", "wohnen", "oturmak"),
    build() {
      return CITIES.map((s, i) => {
        const de = `Wohnst du in ${s.de}?`;
        return ex(`wo-wohnst-du-${i}`, de, `${s.tr}'de mi oturuyorsun?`,
          mkBreakdown([{ de: "Wohnst", tr: "oturuyor musun", role: "verb" }, { de: "du", tr: "sen" }, { de: "in", tr: "-de" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("wohnen", "wohnst", "Nerede oturuyorsun? — hangi fiil?"));
      });
    },
  },
  {
    id: "woher-kommst-du", order: 27, template_de: "Woher kommst du?", template_tr: "Nerelisin?", category: "question",
    anchor: anchorFrom("kommen", "kommen", "gelmek"),
    build() {
      return COUNTRIES.map((s, i) => {
        const de = `Kommst du aus ${s.de}?`;
        return ex(`woher-kommst-du-${i}`, de, `${s.tr}'den misin?`,
          mkBreakdown([{ de: "Kommst", tr: "geliyor musun", role: "verb" }, { de: "du", tr: "sen" }, { de: "aus", tr: "-den" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("kommen", "kommst", "Nerelisin? — hangi fiil?"));
      });
    },
  },
  {
    id: "wie-heisst-du", order: 28, template_de: "Wie heißt du?", template_tr: "Adın ne?", category: "question",
    anchor: anchorFrom("heissen", "heißen", "adlandırılmak"),
    build() {
      return pick(NAMES, 20, 28).map((n, i) => {
        const de = i % 2 === 0 ? "Wie heißt du?" : `Heißt du ${n}?`;
        return ex(`wie-heisst-du-${i}`, de, i % 2 === 0 ? "Adın ne?" : `Adın ${n} mi?`,
          mkBreakdown([{ de: "Wie", tr: "Nasıl/Ne", role: "question" }, { de: "heißt", tr: "adı …", role: "verb" }, { de: "du", tr: "sen" }]),
          conjQuiz("heissen", "heißt", "Adın ne? — hangi fiil?"));
      });
    },
  },
  {
    id: "wie-alt-bist-du", order: 29, template_de: "Wie alt bist du?", template_tr: "Kaç yaşındasın?", category: "question",
    anchor: anchorFrom("sein", "sein", "olmak"),
    build() {
      return AGES.map((a, i) => {
        const de = i % 3 === 0 ? "Wie alt bist du?" : `Bist du ${a} Jahre alt?`;
        return ex(`wie-alt-bist-du-${i}`, de, i % 3 === 0 ? "Kaç yaşındasın?" : `${a} yaşında mısın?`,
          mkBreakdown([{ de: "Wie alt", tr: "Kaç yaşında", role: "question" }, { de: "bist", tr: "…sın", role: "verb" }, { de: "du", tr: "sen" }]),
          conjQuiz("sein", "bist", "Kaç yaşındasın? — hangi fiil?"));
      });
    },
  },
  {
    id: "wie-viel-kostet", order: 30, template_de: "Wie viel kostet …?", template_tr: "… ne kadar?", category: "price",
    anchor: anchorFrom("kosten", "kosten", "tutmak (fiyat)"),
    build() {
      const slots = pick(OBJECTS.length >= 20 ? OBJECTS : MOECHTE_SLOTS, 20, 30);
      return slots.map((s, i) => {
        const obj = s.article ? `${s.article === "der" ? "der" : s.article === "die" ? "die" : "das"} ${s.de}` : s.de;
        const de = `Wie viel kostet ${obj}?`;
        return ex(`wie-viel-kostet-${i}`, de, `${s.tr} ne kadar?`,
          mkBreakdown([{ de: "Wie viel", tr: "Ne kadar", role: "question" }, { de: "kostet", tr: "tutar", role: "verb" }, { de: obj, tr: s.tr, role: "slot" }]),
          conjQuiz("kosten", "kostet", "Ne kadar? — hangi fiil?"));
      });
    },
  },
  {
    id: "wann-beginnt", order: 31, template_de: "Wann beginnt …?", template_tr: "… ne zaman başlar?", category: "time",
    anchor: anchorFrom("beginnen", "beginnen", "başlamak"),
    build() {
      const events = ["der Kurs", "die Schule", "der Film", "das Konzert", "der Unterricht", "die Prüfung", "der Kurs", "die Party", "das Meeting", "der Termin", "die Vorlesung", "der Workshop", "das Training", "die Pause", "der Bus", "der Zug", "die Schicht", "der Unterricht", "das Spiel", "die Messe"];
      const trEv = ["kurs", "okul", "film", "konser", "ders", "sınav", "kurs", "parti", "toplantı", "randevu", "ders", "atölye", "antrenman", "mola", "otobüs", "tren", "vardiya", "ders", "maç", "fuar"];
      return events.map((e, i) => {
        const de = `Wann beginnt ${e}?`;
        return ex(`wann-beginnt-${i}`, de, `${trEv[i]} ne zaman başlar?`,
          mkBreakdown([{ de: "Wann", tr: "Ne zaman", role: "question" }, { de: "beginnt", tr: "başlar", role: "verb" }, { de: e, tr: trEv[i], role: "slot" }]),
          conjQuiz("beginnen", "beginnt", "Ne zaman başlar? — hangi fiil?"));
      });
    },
  },
  {
    id: "wann-ist", order: 32, template_de: "Wann ist …?", template_tr: "… ne zaman?", category: "time",
    build() {
      const events = ["die Prüfung", "der Termin", "die Party", "das Treffen", "der Urlaub", "die Hochzeit", "der Geburtstag", "das Konzert", "die Messe", "der Flug", "die Pause", "der Feierabend", "das Wochenende", "der Montag", "der Dienstag", "der Mittwoch", "der Donnerstag", "der Freitag", "der Samstag", "der Sonntag"];
      const trEv = ["sınav", "randevu", "parti", "buluşma", "tatil", "düğün", "doğum günü", "konser", "fuar", "uçuş", "mola", "iş çıkışı", "hafta sonu", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi", "pazar"];
      return events.map((e, i) => {
        const de = `Wann ist ${e}?`;
        return ex(`wann-ist-${i}`, de, `${trEv[i]} ne zaman?`,
          mkBreakdown([{ de: "Wann", tr: "Ne zaman", role: "question" }, { de: "ist", tr: "…", role: "verb" }, { de: e, tr: trEv[i], role: "slot" }]),
          conjQuiz("sein", "ist", "Ne zaman? — hangi fiil?"));
      });
    },
  },
  {
    id: "hast-du", order: 33, template_de: "Hast du …?", template_tr: "… var mı (sende)?", category: "question",
    anchor: anchorFrom("haben", "haben", "sahip olmak"),
    build() {
      const slots = pick(HABEN_SLOTS, 20, 33);
      return slots.map((s, i) => {
        const de = `Hast du ${s.de}?`;
        return ex(`hast-du-${i}`, de, `${s.tr} var mı (sende)?`,
          mkBreakdown([{ de: "Hast", tr: "var mı", role: "verb" }, { de: "du", tr: "sen" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("haben", "hast", "Sende … var mı? — hangi fiil?"));
      });
    },
  },
  {
    id: "kommst-du-aus", order: 34, template_de: "Kommst du aus …?", template_tr: "…den misin?", category: "question",
    anchor: anchorFrom("kommen", "kommen", "gelmek"),
    build() {
      return COUNTRIES.map((s, i) => {
        const de = `Kommst du aus ${s.de}?`;
        return ex(`kommst-du-aus-${i}`, de, `${s.tr}'den misin?`,
          mkBreakdown([{ de: "Kommst", tr: "geliyor musun", role: "verb" }, { de: "du", tr: "sen" }, { de: "aus", tr: "-den" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("kommen", "kommst", "…den misin? — hangi fiil?"));
      });
    },
  },
  {
    id: "sprechen-sie", order: 35, template_de: "Sprechen Sie …?", template_tr: "… konuşuyor musunuz?", category: "question",
    anchor: anchorFrom("sprechen", "sprechen", "konuşmak"),
    build() {
      return LANGUAGES.map((s, i) => {
        const de = `Sprechen Sie ${s.de}?`;
        return ex(`sprechen-sie-${i}`, de, `${s.tr} konuşuyor musunuz?`,
          mkBreakdown([{ de: "Sprechen", tr: "konuşuyor musunuz", role: "verb" }, { de: "Sie", tr: "siz" }, { de: s.de, tr: s.tr, role: "slot" }]),
          { type: "conjugation", prompt_tr: "Resmi: … konuşuyor musunuz?", blank: "Sprechen", options: ["Sprechen", "Spreche", "Sprichst", "Spricht"], correct_index: 0 });
      });
    },
  },
  {
    id: "kann-ich", order: 36, template_de: "Kann ich …?", template_tr: "… yapabilir miyim?", category: "question",
    anchor: anchorFrom("koennen", "können", "yapabilmek"),
    build() {
      const reqs = ["helfen", "fragen", "bezahlen", "eintreten", "hier sitzen", "das Fenster öffnen", "telefonieren", "kurz warten", "reinkommen", "fotografieren", "mitkommen", "bleiben", "rauchen", "parken", "bestellen", "die Rechnung haben", "sprechen", "lernen", "kaufen", "sehen"];
      const trReq = ["yardım edebilir miyim", "sorabilir miyim", "ödeyebilir miyim", "girebilir miyim", "burada oturabilir miyim", "pencereyi açabilir miyim", "telefon edebilir miyim", "kısa bekleyebilir miyim", "içeri girebilir miyim", "fotoğraf çekebilir miyim", "gelebilir miyim", "kalabilir miyim", "sigara içebilir miyim", "park edebilir miyim", "sipariş verebilir miyim", "hesabı alabilir miyim", "konuşabilir miyim", "öğrenebilir miyim", "satın alabilir miyim", "görebilir miyim"];
      return reqs.map((r, i) => {
        const de = `Kann ich ${r}?`;
        return ex(`kann-ich-${i}`, de, trReq[i] + "?",
          mkBreakdown([{ de: "Kann", tr: "yapabilir miyim", role: "verb" }, { de: "ich", tr: "ben" }, { de: r, tr: trReq[i], role: "slot" }]),
          conjQuiz("koennen", "Kann", "… yapabilir miyim? — hangi fiil?"));
      });
    },
  },
  {
    id: "darf-ich", order: 37, template_de: "Darf ich …?", template_tr: "… yapabilir miyim (izin)?", category: "question",
    anchor: anchorFrom("duerfen", "dürfen", "izinli olmak"),
    build() {
      const reqs = ["reinkommen", "fragen", "helfen", "sitzen", "rauchen", "parken", "fotografieren", "telefonieren", "öffnen", "schließen", "mitkommen", "bleiben", "bestellen", "bezahlen", "warten", "lernen", "sprechen", "kaufen", "sehen", "gehen"];
      const trReq = ["içeri girebilir miyim", "sorabilir miyim", "yardım edebilir miyim", "oturabilir miyim", "sigara içebilir miyim", "park edebilir miyim", "fotoğraf çekebilir miyim", "telefon edebilir miyim", "açabilir miyim", "kapatabilir miyim", "gelebilir miyim", "kalabilir miyim", "sipariş verebilir miyim", "ödeyebilir miyim", "bekleyebilir miyim", "öğrenebilir miyim", "konuşabilir miyim", "satın alabilir miyim", "görebilir miyim", "gidebilir miyim"];
      return reqs.map((r, i) => {
        const de = `Darf ich ${r}?`;
        return ex(`darf-ich-${i}`, de, trReq[i] + " (izin)?",
          mkBreakdown([{ de: "Darf", tr: "yapabilir miyim (izin)", role: "verb" }, { de: "ich", tr: "ben" }, { de: r, tr: trReq[i], role: "slot" }]),
          conjQuiz("duerfen", "Darf", "İzin: … yapabilir miyim? — hangi fiil?"));
      });
    },
  },
  {
    id: "gibt-es", order: 38, template_de: "Gibt es …?", template_tr: "… var mı?", category: "question",
    anchor: anchorFrom("geben", "geben", "vermek (es gibt)"),
    build() {
      const slots = pick(OBJECTS.length >= 20 ? OBJECTS : HABEN_SLOTS, 20, 38);
      return slots.map((s, i) => {
        const obj = s.article ? `${s.article === "der" ? "einen" : s.article === "die" ? "eine" : "ein"} ${s.de}` : s.de;
        const de = `Gibt es ${obj}?`;
        return ex(`gibt-es-${i}`, de, `${s.tr} var mı?`,
          mkBreakdown([{ de: "Gibt es", tr: "var mı", role: "verb" }, { de: obj, tr: s.tr, role: "slot" }]),
          { type: "conjugation", prompt_tr: "… var mı? — hangi fiil?", blank: "Gibt", options: ["Gibt", "Gebe", "Gibst", "Geben"], correct_index: 0 });
      });
    },
  },
  {
    id: "ist-das", order: 39, template_de: "Ist das …?", template_tr: "Bu … mı?", category: "question",
    build() {
      const adj = [
        { de: "richtig", tr: "doğru" }, { de: "falsch", tr: "yanlış" }, { de: "teuer", tr: "pahalı" },
        { de: "billig", tr: "ucuz" }, { de: "gut", tr: "iyi" }, { de: "schlecht", tr: "kötü" },
        { de: "neu", tr: "yeni" }, { de: "alt", tr: "eski" }, { de: "schön", tr: "güzel" },
        { de: "hässlich", tr: "çirkin" }, { de: "groß", tr: "büyük" }, { de: "klein", tr: "küçük" },
        { de: "wichtig", tr: "önemli" }, { de: "interessant", tr: "ilginç" }, { de: "langweilig", tr: "sıkıcı" },
        { de: "kalt", tr: "soğuk" }, { de: "warm", tr: "sıcak" }, { de: "frisch", tr: "taze" },
        { de: "scharf", tr: "acı" }, { de: "süß", tr: "tatlı" },
      ];
      return adj.map((a, i) => {
        const de = `Ist das ${a.de}?`;
        return ex(`ist-das-${i}`, de, `Bu ${a.tr} mı?`,
          mkBreakdown([{ de: "Ist", tr: "… mı", role: "verb" }, { de: "das", tr: "bu" }, { de: a.de, tr: a.tr, role: "slot" }]),
          conjQuiz("sein", "Ist", "Bu … mı? — hangi fiil?"));
      });
    },
  },
  {
    id: "wie-geht-es-dir", order: 40, template_de: "Wie geht es dir?", template_tr: "Nasılsın?", category: "question",
    build() {
      const replies = ["gut", "sehr gut", "nicht schlecht", "super", "prima", "okay", "so lala", "nicht so gut", "schlecht", "müde", "gut, danke", "sehr gut, danke", "ganz gut", "alles klar", "ausgezeichnet", "wunderbar", "fantastisch", "ganz okay", "besser", "schlecht heute"];
      const trRep = ["iyi", "çok iyi", "fena değil", "süper", "harika", "tamam", "idare eder", "pek iyi değil", "kötü", "yorgun", "iyi, teşekkürler", "çok iyi, teşekkürler", "gayet iyi", "her şey yolunda", "mükemmel", "harika", "fantastik", "idare eder", "daha iyi", "bugün kötü"];
      return replies.map((r, i) => {
        const de = i === 0 ? "Wie geht es dir?" : `Mir geht es ${r}.`;
        const tr = i === 0 ? "Nasılsın?" : `Ben ${trRep[i]}.`;
        return ex(`wie-geht-es-dir-${i}`, de, tr,
          mkBreakdown([{ de: "Wie", tr: "Nasıl", role: "question" }, { de: "geht es dir", tr: "nasılsın", role: "verb" }]),
          { type: "completion", prompt_tr: "Nasılsın?", blank: "geht", options: ["Wie geht es dir?", "Wo geht es dir?", "Was geht es dir?", "Wie ist es dir?"], correct_index: 0 });
      });
    },
  },
  {
    id: "ja-ich", order: 41, template_de: "Ja, ich …", template_tr: "Evet, ben …", category: "statement",
    build() {
      const phrases = [
        { de: "komme aus der Türkei", tr: "Türkiye'denim", v: "komme" },
        { de: "wohne in Berlin", tr: "Berlin'de oturuyorum", v: "wohne" },
        { de: "lerne Deutsch", tr: "Almanca öğreniyorum", v: "lerne" },
        { de: "habe Zeit", tr: "vaktim var", v: "habe" },
        { de: "möchte Wasser", tr: "su istiyorum", v: "möchte" },
        { de: "bin Student", tr: "öğrenciyim", v: "bin" },
        { de: "spreche Türkisch", tr: "Türkçe konuşuyorum", v: "spreche" },
        { de: "verstehe", tr: "anlıyorum", v: "verstehe" },
        { de: "arbeite hier", tr: "burada çalışıyorum", v: "arbeite" },
        { de: "esse gern Pizza", tr: "pizza yemeyi severim", v: "esse" },
        { de: "trinke Kaffee", tr: "kahve içiyorum", v: "trinke" },
        { de: "kann helfen", tr: "yardım edebilirim", v: "kann" },
        { de: "muss arbeiten", tr: "çalışmak zorundayım", v: "muss" },
        { de: "will lernen", tr: "öğrenmek istiyorum", v: "will" },
        { de: "brauche Hilfe", tr: "yardıma ihtiyacım var", v: "brauche" },
        { de: "heiße Timur", tr: "adım Timur", v: "heiße" },
        { de: "bin 25 Jahre alt", tr: "25 yaşındayım", v: "bin" },
        { de: "komme gleich", tr: "hemen geliyorum", v: "komme" },
        { de: "gehe nach Hause", tr: "eve gidiyorum", v: "gehe" },
        { de: "fahre mit dem Bus", tr: "otobüsle gidiyorum", v: "fahre" },
      ];
      return phrases.map((p, i) => {
        const de = `Ja, ${p.de}.`;
        return ex(`ja-ich-${i}`, de, `Evet, ${p.tr}.`,
          mkBreakdown([{ de: "Ja", tr: "Evet" }, { de: "ich", tr: "ben" }, { de: p.v, tr: p.tr, role: "verb" }]),
          { type: "completion", prompt_tr: `Evet, ${p.tr}`, blank: p.v, options: [`Ja, ${p.de}.`, `Nein, ${p.de}.`, `Ja, ich nicht ${p.de}.`, `Nein, ${p.de}.`], correct_index: 0 });
      });
    },
  },
  {
    id: "nein-ich", order: 42, template_de: "Nein, ich …", template_tr: "Hayır, ben …", category: "statement",
    build() {
      const phrases = [
        { de: "habe keine Zeit", tr: "vaktim yok" }, { de: "verstehe nicht", tr: "anlamıyorum" },
        { de: "spreche kein Deutsch", tr: "Almanca konuşmuyorum" }, { de: "wohne nicht hier", tr: "burada oturmuyorum" },
        { de: "komme nicht aus Deutschland", tr: "Almanya'dan değilim" }, { de: "esse kein Fleisch", tr: "et yemiyorum" },
        { de: "trinke keinen Alkohol", tr: "alkol içmiyorum" }, { de: "arbeite heute nicht", tr: "bugün çalışmıyorum" },
        { de: "kann nicht kommen", tr: "gelemiyorum" }, { de: "muss jetzt gehen", tr: "şimdi gitmem lazım" },
        { de: "will nicht", tr: "istemiyorum" }, { de: "brauche das nicht", tr: "buna ihtiyacım yok" },
        { de: "bin nicht müde", tr: "yorgun değilim" }, { de: "habe kein Geld", tr: "param yok" },
        { de: "lerne nicht heute", tr: "bugün öğrenmiyorum" }, { de: "bin krank", tr: "hastayım" },
        { de: "habe Hunger nicht", tr: "aç değilim" }, { de: "komme morgen nicht", tr: "yarın gelmiyorum" },
        { de: "fahre nicht mit", tr: "birlikte gitmiyorum" }, { de: "gehe nicht", tr: "gitmiyorum" },
      ];
      return phrases.map((p, i) => {
        const de = `Nein, ${p.de}.`;
        return ex(`nein-ich-${i}`, de, `Hayır, ${p.tr}.`,
          mkBreakdown([{ de: "Nein", tr: "Hayır" }, { de: p.de.split(" ")[0], tr: p.tr, role: "verb" }]),
          { type: "completion", prompt_tr: `Hayır, ${p.tr}`, blank: "Nein", options: [`Nein, ${p.de}.`, `Ja, ${p.de}.`, `Nein, ich ${p.de}.`, `Ja, nicht ${p.de}.`], correct_index: 0 });
      });
    },
  },
  {
    id: "danke", order: 43, template_de: "Danke, …", template_tr: "Teşekkürler, …", category: "statement",
    build() {
      const phrases = ["schönen Tag noch", "für die Hilfe", "für das Essen", "für alles", "gleichfalls", "sehr nett", "das war lecker", "bis später", "auf Wiedersehen", "gute Nacht", "guten Appetit", "viel Erfolg", "gute Reise", "gute Besserung", "schönes Wochenende", "für den Kaffee", "für die Einladung", "das reicht", "ich komme gleich", "alles klar"];
      const trPh = ["iyi günler", "yardım için", "yemek için", "her şey için", "size de", "çok naziksiniz", "çok lezzetliydi", "sonra görüşürüz", "güle güle", "iyi geceler", "afiyet olsun", "başarılar", "iyi yolculuklar", "geçmiş olsun", "iyi hafta sonları", "kahve için", "davet için", "bu yeter", "hemen geliyorum", "tamam"];
      return phrases.map((p, i) => {
        const de = `Danke, ${p}.`;
        return ex(`danke-${i}`, de, `Teşekkürler, ${trPh[i]}.`,
          mkBreakdown([{ de: "Danke", tr: "Teşekkürler" }, { de: p, tr: trPh[i], role: "slot" }]),
          { type: "completion", prompt_tr: `Teşekkürler, ${trPh[i]}`, blank: "Danke", options: [`Danke, ${p}.`, `Bitte, ${p}.`, `Entschuldigung, ${p}.`, `Nein, ${p}.`], correct_index: 0 });
      });
    },
  },
  {
    id: "entschuldigung", order: 44, template_de: "Entschuldigung, …", template_tr: "Affedersiniz, …", category: "statement",
    build() {
      const phrases = ["wo ist die Toilette?", "wie spät ist es?", "ich verstehe nicht", "können Sie das wiederholen?", "sprechen Sie langsamer, bitte", "entschuldigen Sie bitte", "das tut mir leid", "ich bin zu spät", "ich habe eine Frage", "wo ist der Bahnhof?", "ich suche …", "können Sie mir helfen?", "ich spreche kein Deutsch", "was kostet das?", "ich bin neu hier", "ein Moment, bitte", "das ist mein Platz", "ich habe mich vertan", "können Sie schreiben?", "ich komme aus der Türkei"];
      const trPh = ["tuvalet nerede?", "saat kaç?", "anlamıyorum", "tekrar eder misiniz?", "daha yavaş konuşur musunuz?", "affedersiniz", "çok üzgünüm", "geç kaldım", "bir sorum var", "tren istasyonu nerede?", "… arıyorum", "yardım eder misiniz?", "Almanca konuşmuyorum", "bu ne kadar?", "burada yeniyim", "bir dakika lütfen", "bu benim yerim", "yanıldım", "yazar mısınız?", "Türkiye'den geliyorum"];
      return phrases.map((p, i) => {
        const de = `Entschuldigung, ${p}`;
        return ex(`entschuldigung-${i}`, de, `Affedersiniz, ${trPh[i]}`,
          mkBreakdown([{ de: "Entschuldigung", tr: "Affedersiniz" }, { de: p, tr: trPh[i], role: "slot" }]),
          { type: "completion", prompt_tr: `Affedersiniz, ${trPh[i]}`, blank: "Entschuldigung", options: [de, `Danke, ${p}`, `Bitte, ${p}`, `Ja, ${p}`], correct_index: 0 });
      });
    },
  },
  {
    id: "ich-habe-keine", order: 45, template_de: "Ich habe keine …", template_tr: "Benim … yok", category: "statement",
    anchor: anchorFrom("haben", "haben", "sahip olmak"),
    build() {
      const slots = [
        { de: "Zeit", tr: "zaman" }, { de: "Lust", tr: "heves" }, { de: "Ahnung", tr: "fikir" },
        { de: "Frage", tr: "soru" }, { de: "Probleme", tr: "sorun" }, { de: "Kinder", tr: "çocuk" },
        { de: "Idee", tr: "fikir" }, { de: "Wahl", tr: "seçenek" }, { de: "Angst", tr: "korku" },
        { de: "Hoffnung", tr: "umut" }, { de: "Geduld", tr: "sabır" }, { de: "Erfahrung", tr: "deneyim" },
        { de: "Schwester", tr: "kız kardeş" }, { de: "Bruder", tr: "erkek kardeş" },
        { de: "Katze", tr: "kedi" }, { de: "Hund", tr: "köpek" }, { de: "Auto", tr: "araba" },
        { de: "Wohnung", tr: "daire" }, { de: "Arbeit", tr: "iş" }, { de: "Schmerzen", tr: "ağrı" },
      ];
      return slots.map((s, i) => {
        const de = `Ich habe keine ${s.de}.`;
        return ex(`ich-habe-keine-${i}`, de, `Benim ${s.tr} yok.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "habe keine", tr: "yok", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("haben", "habe", "Benim … yok — hangi fiil?"));
      });
    },
  },
  {
    id: "das-ist", order: 46, template_de: "Das ist …", template_tr: "Bu …", category: "statement",
    build() {
      const slots = [
        { de: "gut", tr: "iyi" }, { de: "schlecht", tr: "kötü" }, { de: "teuer", tr: "pahalı" },
        { de: "billig", tr: "ucuz" }, { de: "mein Freund", tr: "arkadaşım" }, { de: "meine Freundin", tr: "kız arkadaşım" },
        { de: "mein Bruder", tr: "erkek kardeşim" }, { de: "meine Schwester", tr: "kız kardeşim" },
        { de: "mein Auto", tr: "arabam" }, { de: "mein Haus", tr: "evim" }, { de: "meine Wohnung", tr: "dairem" },
        { de: "mein Problem", tr: "sorunum" }, { de: "richtig", tr: "doğru" }, { de: "falsch", tr: "yanlış" },
        { de: "interessant", tr: "ilginç" }, { de: "wichtig", tr: "önemli" }, { de: "schön", tr: "güzel" },
        { de: "lecker", tr: "lezzetli" }, { de: "frisch", tr: "taze" }, { de: "neu", tr: "yeni" },
      ];
      return slots.map((s, i) => {
        const de = `Das ist ${s.de}.`;
        return ex(`das-ist-${i}`, de, `Bu ${s.tr}.`,
          mkBreakdown([{ de: "Das", tr: "Bu" }, { de: "ist", tr: "…", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("sein", "ist", "Bu … — hangi fiil?"));
      });
    },
  },
  {
    id: "das-kostet", order: 47, template_de: "Das kostet …", template_tr: "Bu … tutar", category: "price",
    anchor: anchorFrom("kosten", "kosten", "tutmak (fiyat)"),
    build() {
      return PRICES.map((p, i) => {
        const de = `Das kostet ${p}.`;
        return ex(`das-kostet-${i}`, de, `Bu ${p} tutar.`,
          mkBreakdown([{ de: "Das", tr: "Bu" }, { de: "kostet", tr: "tutar", role: "verb" }, { de: p, tr: p, role: "slot" }]),
          conjQuiz("kosten", "kostet", "Bu … tutar — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-gehe", order: 48, template_de: "Ich gehe …", template_tr: "… gidiyorum", category: "statement",
    anchor: anchorFrom("gehen", "gehen", "gitmek"),
    build() {
      return PLACES.map((s, i) => {
        const de = `Ich gehe ${s.de}.`;
        return ex(`ich-gehe-${i}`, de, `${s.tr} gidiyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "gehe", tr: "gidiyorum", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("gehen", "gehe", "Ben … gidiyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "ich-fahre", order: 49, template_de: "Ich fahre …", template_tr: "… gidiyorum (araç)", category: "statement",
    anchor: anchorFrom("fahren", "fahren", "gitmek (araç)"),
    build() {
      const trips = [
        { de: "mit dem Bus", tr: "otobüsle" }, { de: "mit dem Zug", tr: "trenle" },
        { de: "mit dem Auto", tr: "arabayla" }, { de: "mit dem Fahrrad", tr: "bisikletle" },
        { de: "nach Berlin", tr: "Berlin'e" }, { de: "nach Hause", tr: "eve" },
        { de: "zur Arbeit", tr: "işe" }, { de: "in die Stadt", tr: "şehre" },
        { de: "zum Flughafen", tr: "havalimanına" }, { de: "zum Supermarkt", tr: "süpermarkete" },
        { de: "mit der U-Bahn", tr: "metroya" }, { de: "mit dem Taxi", tr: "taksiye" },
        { de: "nach München", tr: "Münih'e" }, { de: "nach Ankara", tr: "Ankara'ya" },
        { de: "zur Schule", tr: "okula" }, { de: "ins Kino", tr: "sinemaya" },
        { de: "zum Arzt", tr: "doktora" }, { de: "in den Urlaub", tr: "tatile" },
        { de: "mit dem Bus zur Arbeit", tr: "işe otobüsle" }, { de: "mit dem Zug nach Hamburg", tr: "Hamburg'a trenle" },
      ];
      return trips.map((s, i) => {
        const de = `Ich fahre ${s.de}.`;
        return ex(`ich-fahre-${i}`, de, `${s.tr} gidiyorum.`,
          mkBreakdown([{ de: "Ich", tr: "Ben" }, { de: "fahre", tr: "gidiyorum (araç)", role: "verb" }, { de: s.de, tr: s.tr, role: "slot" }]),
          conjQuiz("fahren", "fahre", "Ben … gidiyorum — hangi fiil?"));
      });
    },
  },
  {
    id: "bitte", order: 50, template_de: "Bitte …", template_tr: "Lütfen …", category: "statement",
    build() {
      const phrases = ["einen Kaffee", "die Rechnung", "noch ein Wasser", "langsamer sprechen", "wiederholen", "helfen Sie mir", "schreiben Sie das", "kommen Sie herein", "setzen Sie sich", "warten Sie", "einen Moment", "schönen Tag", "guten Appetit", "viel Erfolg", "kommen Sie mit", "zeigen Sie mir das", "sagen Sie das noch einmal", "öffnen Sie das Fenster", "schließen Sie die Tür", "rufen Sie mich an"];
      const trPh = ["bir kahve", "hesabı", "bir su daha", "daha yavaş konuşun", "tekrarlayın", "bana yardım edin", "bunu yazın", "içeri gelin", "oturun", "bekleyin", "bir dakika", "iyi günler", "afiyet olsun", "başarılar", "benimle gelin", "bunu gösterin", "bir daha söyleyin", "pencereyi açın", "kapıyı kapatın", "beni arayın"];
      return phrases.map((p, i) => {
        const de = `Bitte ${p}.`;
        return ex(`bitte-${i}`, de, `Lütfen ${trPh[i]}.`,
          mkBreakdown([{ de: "Bitte", tr: "Lütfen" }, { de: p, tr: trPh[i], role: "slot" }]),
          { type: "completion", prompt_tr: `Lütfen ${trPh[i]}`, blank: "Bitte", options: [`Bitte ${p}.`, `Danke ${p}.`, `Entschuldigung ${p}.`, `Nein ${p}.`], correct_index: 0 });
      });
    },
  },
  {
    id: "ist-dein", order: 51, template_de: "{Name}, ist dein …?", template_tr: "…, senin … mi?", category: "question",
    anchor: anchorFrom("sein", "sein", "olmak"),
    build() {
      const NAMES = ["Anna", "David", "Maria", "Timur", "Lisa", "Ali", "Emma", "Mehmet", "Sara", "Paul", "Julia", "Can", "Nina", "Tom", "Ayşe", "Felix", "Laura", "Jonas", "Zeynep", "Max"];
      const MN_NOUNS = [
        { de: "Sohn", tr: "oğul", job: { de: "Bäcker", tr: "fırıncı" } },
        { de: "Bruder", tr: "kardeş", job: { de: "Arzt", tr: "doktor" } },
        { de: "Vater", tr: "baba", job: { de: "Lehrer", tr: "öğretmen" } },
        { de: "Kind", tr: "çocuk", job: { de: "Student", tr: "öğrenci" } },
        { de: "Name", tr: "ad", job: null },
        { de: "Beruf", tr: "meslek", job: { de: "Koch", tr: "aşçı" } },
        { de: "Sohn", tr: "oğul", job: { de: "Verkäufer", tr: "satıcı" } },
        { de: "Bruder", tr: "kardeş", job: { de: "Student", tr: "öğrenci" } },
        { de: "Vater", tr: "baba", job: { de: "Bäcker", tr: "fırıncı" } },
        { de: "Kind", tr: "çocuk", job: { de: "Arzt", tr: "doktor" } },
        { de: "Sohn", tr: "oğul", job: { de: "Koch", tr: "aşçı" } },
        { de: "Bruder", tr: "kardeş", job: { de: "Lehrer", tr: "öğretmen" } },
        { de: "Vater", tr: "baba", job: { de: "Verkäufer", tr: "satıcı" } },
        { de: "Kind", tr: "çocuk", job: { de: "Bäcker", tr: "fırıncı" } },
        { de: "Sohn", tr: "oğul", job: { de: "Arzt", tr: "doktor" } },
        { de: "Bruder", tr: "kardeş", job: { de: "Koch", tr: "aşçı" } },
        { de: "Vater", tr: "baba", job: { de: "Student", tr: "öğrenci" } },
        { de: "Kind", tr: "çocuk", job: { de: "Verkäufer", tr: "satıcı" } },
        { de: "Sohn", tr: "oğul", job: { de: "Lehrer", tr: "öğretmen" } },
        { de: "Bruder", tr: "kardeş", job: { de: "Bäcker", tr: "fırıncı" } },
      ];
      return MN_NOUNS.map((n, i) => {
        const name = NAMES[i];
        const de = n.job
          ? `${name}, ist dein ${n.de} ${n.job.de}?`
          : `${name}, ist dein ${n.de}?`;
        const tr = n.job
          ? `${name}, senin ${n.tr} ${n.job.tr} mi?`
          : `${name}, senin ${n.tr} mi?`;
        const parts = [
          { de: name, tr: name, role: "slot" },
          { de: "ist", tr: "mi", role: "verb" },
          { de: "dein", tr: "senin (der/das → dein)", role: "slot" },
          { de: n.de, tr: n.tr, role: "slot" },
        ];
        if (n.job) parts.push({ de: n.job.de, tr: n.job.tr, role: "slot" });
        const options = shuffle(["dein", "deine", "deinen", "mein"], i);
        return ex(
          `ist-dein-${i}`,
          de,
          tr,
          mkBreakdown(parts),
          {
            type: "completion",
            prompt_tr: `der/das ${n.de} — hangi sahiplik?`,
            blank: "dein",
            options,
            correct_index: options.indexOf("dein"),
          }
        );
      });
    },
  },
  {
    id: "ist-deine", order: 52, template_de: "{Name}, ist deine …?", template_tr: "…, senin … mi? (die)", category: "question",
    anchor: anchorFrom("sein", "sein", "olmak"),
    build() {
      const NAMES = ["Anna", "David", "Maria", "Timur", "Lisa", "Ali", "Emma", "Mehmet", "Sara", "Paul", "Julia", "Can", "Nina", "Tom", "Ayşe", "Felix", "Laura", "Jonas", "Zeynep", "Max"];
      const F_NOUNS = [
        { de: "Schwester", tr: "kız kardeş", job: { de: "Lehrerin", tr: "öğretmen (kadın)" } },
        { de: "Mutter", tr: "anne", job: { de: "Ärztin", tr: "doktor (kadın)" } },
        { de: "Tochter", tr: "kız", job: { de: "Studentin", tr: "öğrenci (kadın)" } },
        { de: "Familie", tr: "aile", job: null },
        { de: "Schwester", tr: "kız kardeş", job: { de: "Krankenschwester", tr: "hemşire" } },
        { de: "Adresse", tr: "adres", job: null },
        { de: "Mutter", tr: "anne", job: { de: "Lehrerin", tr: "öğretmen (kadın)" } },
        { de: "Tochter", tr: "kız", job: { de: "Ärztin", tr: "doktor (kadın)" } },
        { de: "Schwester", tr: "kız kardeş", job: { de: "Studentin", tr: "öğrenci (kadın)" } },
        { de: "Familie", tr: "aile", job: null },
        { de: "Mutter", tr: "anne", job: { de: "Krankenschwester", tr: "hemşire" } },
        { de: "Tochter", tr: "kız", job: { de: "Lehrerin", tr: "öğretmen (kadın)" } },
        { de: "Schwester", tr: "kız kardeş", job: { de: "Ärztin", tr: "doktor (kadın)" } },
        { de: "Adresse", tr: "adres", job: null },
        { de: "Mutter", tr: "anne", job: { de: "Studentin", tr: "öğrenci (kadın)" } },
        { de: "Tochter", tr: "kız", job: { de: "Krankenschwester", tr: "hemşire" } },
        { de: "Schwester", tr: "kız kardeş", job: { de: "Lehrerin", tr: "öğretmen (kadın)" } },
        { de: "Familie", tr: "aile", job: null },
        { de: "Mutter", tr: "anne", job: { de: "Ärztin", tr: "doktor (kadın)" } },
        { de: "Tochter", tr: "kız", job: { de: "Lehrerin", tr: "öğretmen (kadın)" } },
      ];
      return F_NOUNS.map((n, i) => {
        const name = NAMES[i];
        const de = n.job
          ? `${name}, ist deine ${n.de} ${n.job.de}?`
          : `${name}, ist deine ${n.de}?`;
        const tr = n.job
          ? `${name}, senin ${n.tr} ${n.job.tr} mi?`
          : `${name}, senin ${n.tr} mi?`;
        const parts = [
          { de: name, tr: name, role: "slot" },
          { de: "ist", tr: "mi", role: "verb" },
          { de: "deine", tr: "senin (die → deine)", role: "slot" },
          { de: n.de, tr: n.tr, role: "slot" },
        ];
        if (n.job) parts.push({ de: n.job.de, tr: n.job.tr, role: "slot" });
        const options = shuffle(["deine", "dein", "deinen", "meine"], i);
        return ex(`ist-deine-${i}`, de, tr, mkBreakdown(parts), {
          type: "completion",
          prompt_tr: `die ${n.de} — hangi sahiplik?`,
          blank: "deine",
          options,
          correct_index: options.indexOf("deine"),
        });
      });
    },
  },
];

function validate(data) {
  const ids = new Set();
  if (data.patterns.length !== 52) throw new Error(`Expected 52 patterns, got ${data.patterns.length}`);
  for (const p of data.patterns) {
    if (p.examples.length !== 20) throw new Error(`${p.id}: expected 20 examples, got ${p.examples.length}`);
    for (const e of p.examples) {
      if (ids.has(e.id)) throw new Error(`Duplicate example id: ${e.id}`);
      ids.add(e.id);
      if (!e.breakdown?.length) throw new Error(`${e.id}: empty breakdown`);
      if (!e.quiz?.options?.length) throw new Error(`${e.id}: empty quiz`);
    }
  }
  return { patterns: data.patterns.length, examples: ids.size };
}

const patterns = PATTERN_DEFS.map(buildPattern);
const output = {
  version: "1.0.0",
  level: "A1",
  title: "Pattern Trainer",
  titleTr: "Kalıp Ezberleme",
  description: "52 A1 kalıbı × 20 örnek — kelime kelime parçalama + fiil çekimi quiz",
  patterns,
};

const stats = validate(output);
fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");
console.log(`✓ a1-patterns.json — ${stats.patterns} patterns, ${stats.examples} examples → ${OUT}`);

