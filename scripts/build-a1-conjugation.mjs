// A1 Conjugation Matrix — run: npm run build:conjugation
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../data/grundlagen/a1-conjugation.json");

const PERSON_META = [
  { personId: "ich", pronoun_de: "ich", pronoun_tr: "ben", weight: 15 },
  { personId: "du", pronoun_de: "du", pronoun_tr: "sen", weight: 35 },
  { personId: "er", pronoun_de: "er", pronoun_tr: "o (erkek)", weight: 12 },
  { personId: "sie_she", pronoun_de: "sie", pronoun_tr: "o (kadın)", weight: 12 },
  { personId: "es", pronoun_de: "es", pronoun_tr: "o (nötr)", weight: 11 },
  { personId: "wir", pronoun_de: "wir", pronoun_tr: "biz", weight: 4 },
  { personId: "ihr", pronoun_de: "ihr", pronoun_tr: "siz (çoğul)", weight: 4 },
  { personId: "Sie", pronoun_de: "Sie", pronoun_tr: "siz (resmi)", weight: 4 },
  { personId: "sie_pl", pronoun_de: "sie", pronoun_tr: "onlar", weight: 3 },
];

const VERB_FORMS = {
  sein: ["bin", "bist", "ist", "ist", "ist", "sind", "seid", "sind", "sind"],
  haben: ["habe", "hast", "hat", "hat", "hat", "haben", "habt", "haben", "haben"],
  machen: ["mache", "machst", "macht", "macht", "macht", "machen", "macht", "machen", "machen"],
  kommen: ["komme", "kommst", "kommt", "kommt", "kommt", "kommen", "kommt", "kommen", "kommen"],
  wohnen: ["wohne", "wohnst", "wohnt", "wohnt", "wohnt", "wohnen", "wohnt", "wohnen", "wohnen"],
  arbeiten: ["arbeite", "arbeitest", "arbeitet", "arbeitet", "arbeitet", "arbeiten", "arbeitet", "arbeiten", "arbeiten"],
  lernen: ["lerne", "lernst", "lernt", "lernt", "lernt", "lernen", "lernt", "lernen", "lernen"],
  gehen: ["gehe", "gehst", "geht", "geht", "geht", "gehen", "geht", "gehen", "gehen"],
  essen: ["esse", "isst", "isst", "isst", "isst", "essen", "esst", "essen", "essen"],
  trinken: ["trinke", "trinkst", "trinkt", "trinkt", "trinkt", "trinken", "trinkt", "trinken", "trinken"],
  sprechen: ["spreche", "sprichst", "spricht", "spricht", "spricht", "sprechen", "sprecht", "sprechen", "sprechen"],
  koennen: ["kann", "kannst", "kann", "kann", "kann", "koennen", "koennt", "koennen", "koennen"],
  muessen: ["muss", "musst", "muss", "muss", "muss", "muessen", "muesst", "muessen", "muessen"],
  moechten: ["moechte", "moechtest", "moechte", "moechte", "moechte", "moechten", "moechtet", "moechten", "moechten"],
  wollen: ["will", "willst", "will", "will", "will", "wollen", "wollt", "wollen", "wollen"],
  duerfen: ["darf", "darfst", "darf", "darf", "darf", "duerfen", "duerft", "duerfen", "duerfen"],
  kaufen: ["kaufe", "kaufst", "kauft", "kauft", "kauft", "kaufen", "kauft", "kaufen", "kaufen"],
  spielen: ["spiele", "spielst", "spielt", "spielt", "spielt", "spielen", "spielt", "spielen", "spielen"],
  heissen: ["heisse", "heisst", "heisst", "heisst", "heisst", "heissen", "heisst", "heissen", "heissen"],
  fahren: ["fahre", "faehrst", "faehrt", "faehrt", "faehrt", "fahren", "fahrt", "fahren", "fahren"],
  nehmen: ["nehme", "nimmst", "nimmt", "nimmt", "nimmt", "nehmen", "nehmt", "nehmen", "nehmen"],
  sehen: ["sehe", "siehst", "sieht", "sieht", "sieht", "sehen", "seht", "sehen", "sehen"],
  schlafen: ["schlafe", "schlaefst", "schlaeft", "schlaeft", "schlaeft", "schlafen", "schlaft", "schlafen", "schlafen"],
};

const VERB_META = [
  { id: "sein", infinitive: "sein", tr: "olmak", order: 1 },
  { id: "haben", infinitive: "haben", tr: "sahip olmak", order: 2 },
  { id: "machen", infinitive: "machen", tr: "yapmak", order: 3 },
  { id: "kommen", infinitive: "kommen", tr: "gelmek", order: 4 },
  { id: "wohnen", infinitive: "wohnen", tr: "oturmak", order: 5 },
  { id: "arbeiten", infinitive: "arbeiten", tr: "çalışmak", order: 6 },
  { id: "lernen", infinitive: "lernen", tr: "öğrenmek", order: 7 },
  { id: "gehen", infinitive: "gehen", tr: "gitmek", order: 8 },
  { id: "essen", infinitive: "essen", tr: "yemek", order: 9 },
  { id: "trinken", infinitive: "trinken", tr: "içmek", order: 10 },
  { id: "sprechen", infinitive: "sprechen", tr: "konuşmak", order: 11 },
  { id: "koennen", infinitive: "können", tr: "yapabilmek", order: 12 },
  { id: "muessen", infinitive: "müssen", tr: "zorunda olmak", order: 13 },
  { id: "moechten", infinitive: "möchten", tr: "istemek (kibar)", order: 14 },
  { id: "wollen", infinitive: "wollen", tr: "istemek", order: 15 },
  { id: "duerfen", infinitive: "dürfen", tr: "yapabilmek (izin)", order: 16 },
  { id: "kaufen", infinitive: "kaufen", tr: "satın almak", order: 17 },
  { id: "spielen", infinitive: "spielen", tr: "oynamak", order: 18 },
  { id: "heissen", infinitive: "heißen", tr: "adını … koymak", order: 19 },
  { id: "fahren", infinitive: "fahren", tr: "gitmek (araçla)", order: 20 },
  { id: "nehmen", infinitive: "nehmen", tr: "almak", order: 21 },
  { id: "sehen", infinitive: "sehen", tr: "görmek", order: 22 },
  { id: "schlafen", infinitive: "schlafen", tr: "uyumak", order: 23 },
];

const EXAMPLE_TEMPLATES = {
  sein: {
    ich: { de: "Ich bin Student.", tr: "Ben öğrenciyim." },
    du: { de: "Du bist müde.", tr: "Sen yorgunsun." },
    er: { de: "Er ist Lehrer.", tr: "O (erkek) öğretmen." },
    sie_she: { de: "Sie ist Ärztin.", tr: "O (kadın) doktor." },
    es: { de: "Es ist kalt.", tr: "Soğuk." },
    wir: { de: "Wir sind aus der Türkei.", tr: "Biz Türkiye'deniz." },
    ihr: { de: "Ihr seid nett.", tr: "Siz (çoğul) naziksiniz." },
    Sie: { de: "Sie sind freundlich.", tr: "Siz (resmi) kibar." },
    sie_pl: { de: "Sie sind Studenten.", tr: "Onlar öğrenci." },
  },
  haben: {
    ich: { de: "Ich habe Zeit.", tr: "Vaktim var." },
    du: { de: "Du hast Hunger.", tr: "Açsın." },
    er: { de: "Er hat ein Auto.", tr: "Onun (erkek) arabası var." },
    sie_she: { de: "Sie hat eine Katze.", tr: "Onun (kadın) kedisi var." },
    es: { de: "Es hat vier Beine.", tr: "Dört ayağı var." },
    wir: { de: "Wir haben einen Hund.", tr: "Bir köpeğimiz var." },
    ihr: { de: "Ihr habt Glück.", tr: "Şansınız var." },
    Sie: { de: "Sie haben eine Frage.", tr: "Bir sorunuz var." },
    sie_pl: { de: "Sie haben Kinder.", tr: "Onların çocukları var." },
  },
  machen: {
    ich: { de: "Ich mache Sport.", tr: "Spor yapıyorum." },
    du: { de: "Was machst du?", tr: "Ne yapıyorsun?" },
    er: { de: "Er macht Pause.", tr: "O (erkek) mola veriyor." },
    sie_she: { de: "Sie macht Hausaufgaben.", tr: "O (kadın) ödev yapıyor." },
    es: { de: "Es macht Spaß.", tr: "Eğlenceli." },
    wir: { de: "Wir machen Musik.", tr: "Müzik yapıyoruz." },
    ihr: { de: "Ihr macht Fehler.", tr: "Hata yapıyorsunuz." },
    Sie: { de: "Sie machen Kaffee.", tr: "Kahve yapıyorsunuz (resmi)." },
    sie_pl: { de: "Sie machen Sport.", tr: "Onlar spor yapıyor." },
  },
  kommen: {
    ich: { de: "Ich komme aus der Türkei.", tr: "Türkiye'den geliyorum." },
    du: { de: "Du kommst aus Berlin.", tr: "Berlin'den geliyorsun." },
    er: { de: "Er kommt morgen.", tr: "O (erkek) yarın geliyor." },
    sie_she: { de: "Sie kommt aus Ankara.", tr: "O (kadın) Ankara'dan geliyor." },
    es: { de: "Es kommt später.", tr: "Sonra geliyor." },
    wir: { de: "Wir kommen zusammen.", tr: "Birlikte geliyoruz." },
    ihr: { de: "Ihr kommt zu spät.", tr: "Geç kalıyorsunuz." },
    Sie: { de: "Sie kommen aus Deutschland.", tr: "Almanya'dan geliyorsunuz." },
    sie_pl: { de: "Sie kommen heute.", tr: "Onlar bugün geliyor." },
  },
  wohnen: {
    ich: { de: "Ich wohne in Berlin.", tr: "Berlin'de oturuyorum." },
    du: { de: "Du wohnst in Ankara.", tr: "Ankara'da oturuyorsun." },
    er: { de: "Er wohnt hier.", tr: "O (erkek) burada oturuyor." },
    sie_she: { de: "Sie wohnt in München.", tr: "O (kadın) Münih'te oturuyor." },
    es: { de: "Es wohnt im Zentrum.", tr: "Merkezde oturuyor." },
    wir: { de: "Wir wohnen zusammen.", tr: "Birlikte oturuyoruz." },
    ihr: { de: "Ihr wohnt in der Stadt.", tr: "Şehirde oturuyorsunuz." },
    Sie: { de: "Sie wohnen in Hamburg.", tr: "Hamburg'da oturuyorsunuz." },
    sie_pl: { de: "Sie wohnen in Köln.", tr: "Onlar Köln'de oturuyor." },
  },
  arbeiten: {
    ich: { de: "Ich arbeite hier.", tr: "Burada çalışıyorum." },
    du: { de: "Du arbeitest viel.", tr: "Çok çalışıyorsun." },
    er: { de: "Er arbeitet als Lehrer.", tr: "O (erkek) öğretmen olarak çalışıyor." },
    sie_she: { de: "Sie arbeitet im Krankenhaus.", tr: "O (kadın) hastanede çalışıyor." },
    es: { de: "Es arbeitet gut.", tr: "İyi çalışıyor." },
    wir: { de: "Wir arbeiten zusammen.", tr: "Birlikte çalışıyoruz." },
    ihr: { de: "Ihr arbeitet heute.", tr: "Bugün çalışıyorsunuz." },
    Sie: { de: "Sie arbeiten in Berlin.", tr: "Berlin'de çalışıyorsunuz." },
    sie_pl: { de: "Sie arbeiten im Supermarkt.", tr: "Onlar süpermarkette çalışıyor." },
  },
  lernen: {
    ich: { de: "Ich lerne Deutsch.", tr: "Almanca öğreniyorum." },
    du: { de: "Du lernst schnell.", tr: "Hızlı öğreniyorsun." },
    er: { de: "Er lernt Englisch.", tr: "O (erkek) İngilizce öğreniyor." },
    sie_she: { de: "Sie lernt Türkisch.", tr: "O (kadın) Türkçe öğreniyor." },
    es: { de: "Es lernt leicht.", tr: "Kolay öğreniyor." },
    wir: { de: "Wir lernen zusammen.", tr: "Birlikte öğreniyoruz." },
    ihr: { de: "Ihr lernt viel.", tr: "Çok öğreniyorsunuz." },
    Sie: { de: "Sie lernen Deutsch.", tr: "Almanca öğreniyorsunuz." },
    sie_pl: { de: "Sie lernen in der Schule.", tr: "Onlar okulda öğreniyor." },
  },
  gehen: {
    ich: { de: "Ich gehe nach Hause.", tr: "Eve gidiyorum." },
    du: { de: "Du gehst zur Arbeit.", tr: "İşe gidiyorsun." },
    er: { de: "Er geht ins Kino.", tr: "O (erkek) sinemaya gidiyor." },
    sie_she: { de: "Sie geht zum Arzt.", tr: "O (kadın) doktora gidiyor." },
    es: { de: "Es geht gut.", tr: "İyi gidiyor." },
    wir: { de: "Wir gehen spazieren.", tr: "Yürüyüşe gidiyoruz." },
    ihr: { de: "Ihr geht einkaufen.", tr: "Alışverişe gidiyorsunuz." },
    Sie: { de: "Sie gehen nach Hause.", tr: "Eve gidiyorsunuz." },
    sie_pl: { de: "Sie gehen in den Park.", tr: "Onlar parka gidiyor." },
  },
  essen: {
    ich: { de: "Ich esse Brot.", tr: "Ekmek yiyorum." },
    du: { de: "Du isst gern Pizza.", tr: "Pizza yemeyi seviyorsun." },
    er: { de: "Er isst Fleisch.", tr: "O (erkek) et yiyor." },
    sie_she: { de: "Sie isst Salat.", tr: "O (kadın) salata yiyor." },
    es: { de: "Es schmeckt gut.", tr: "Tadı iyi." },
    wir: { de: "Wir essen zusammen.", tr: "Birlikte yiyoruz." },
    ihr: { de: "Ihr esst zu viel.", tr: "Çok yiyorsunuz." },
    Sie: { de: "Sie essen im Restaurant.", tr: "Restoranda yiyorsunuz." },
    sie_pl: { de: "Sie essen Obst.", tr: "Onlar meyve yiyor." },
  },
  trinken: {
    ich: { de: "Ich trinke Wasser.", tr: "Su içiyorum." },
    du: { de: "Du trinkst Kaffee.", tr: "Kahve içiyorsun." },
    er: { de: "Er trinkt Tee.", tr: "O (erkek) çay içiyor." },
    sie_she: { de: "Sie trinkt Milch.", tr: "O (kadın) süt içiyor." },
    es: { de: "Es ist kalt.", tr: "Soğuk." },
    wir: { de: "Wir trinken Saft.", tr: "Meyve suyu içiyoruz." },
    ihr: { de: "Ihr trinkt Bier.", tr: "Bira içiyorsunuz." },
    Sie: { de: "Sie trinken Wasser.", tr: "Su içiyorsunuz." },
    sie_pl: { de: "Sie trinken Cola.", tr: "Onlar kola içiyor." },
  },
  sprechen: {
    ich: { de: "Ich spreche Deutsch.", tr: "Almanca konuşuyorum." },
    du: { de: "Du sprichst Türkisch.", tr: "Türkçe konuşuyorsun." },
    er: { de: "Er spricht Englisch.", tr: "O (erkek) İngilizce konuşuyor." },
    sie_she: { de: "Sie spricht langsam.", tr: "O (kadın) yavaş konuşuyor." },
    es: { de: "Es ist wichtig.", tr: "Önemli." },
    wir: { de: "Wir sprechen zusammen.", tr: "Birlikte konuşuyoruz." },
    ihr: { de: "Ihr sprecht laut.", tr: "Yüksek konuşuyorsunuz." },
    Sie: { de: "Sie sprechen Deutsch.", tr: "Almanca konuşuyorsunuz." },
    sie_pl: { de: "Sie sprechen Arabisch.", tr: "Onlar Arapça konuşuyor." },
  },
};

function defaultExamples(verbId, infinitive, tr) {
  const tpl = EXAMPLE_TEMPLATES.machen;
  const out = {};
  for (const p of PERSON_META) {
    const base = tpl[p.personId];
    if (base) {
      out[p.personId] = {
        de: base.de.replace(/mach\w*/gi, VERB_FORMS[verbId][PERSON_META.indexOf(p)]),
        tr: `${tr} — ${p.pronoun_tr}`,
      };
    }
  }
  return out;
}

for (const v of VERB_META) {
  if (!EXAMPLE_TEMPLATES[v.id]) {
    EXAMPLE_TEMPLATES[v.id] = defaultExamples(v.id, v.infinitive, v.tr);
  }
}

const DRILL_CONTEXT = {
  sein: { du: "Du ___ Student.", er: "Er ___ Lehrer.", sie_she: "Sie ___ Ärztin.", es: "Es ___ kalt.", ich: "Ich ___ müde." },
  haben: { du: "Du ___ Zeit.", er: "Er ___ ein Auto.", sie_she: "Sie ___ Hunger.", ich: "Ich ___ Hunger.", wir: "Wir ___ einen Hund." },
  machen: { du: "Was ___ du?", er: "Er ___ Pause.", sie_she: "Sie ___ Sport.", ich: "Ich ___ Sport." },
  kommen: { du: "Du ___ aus Berlin.", er: "Er ___ morgen.", sie_she: "Sie ___ aus Ankara.", ich: "Ich ___ aus der Türkei." },
  wohnen: { du: "Du ___ in Ankara.", er: "Er ___ hier.", sie_she: "Sie ___ in München.", ich: "Ich ___ in Berlin." },
  arbeiten: { du: "Du ___ viel.", er: "Er ___ als Lehrer.", sie_she: "Sie ___ im Krankenhaus.", ich: "Ich ___ hier." },
  lernen: { du: "Du ___ Deutsch.", er: "Er ___ Englisch.", sie_she: "Sie ___ Türkisch.", ich: "Ich ___ Deutsch." },
  gehen: { du: "Du ___ zur Arbeit.", er: "Er ___ ins Kino.", sie_she: "Sie ___ zum Arzt.", ich: "Ich ___ nach Hause." },
  essen: { du: "Du ___ Pizza.", er: "Er ___ Brot.", sie_she: "Sie ___ Salat.", ich: "Ich ___ Brot." },
  trinken: { du: "Du ___ Kaffee.", er: "Er ___ Tee.", sie_she: "Sie ___ Wasser.", ich: "Ich ___ Wasser." },
  sprechen: { du: "Du ___ Türkisch.", er: "Er ___ Englisch.", sie_she: "Sie ___ langsam.", ich: "Ich ___ Deutsch." },
  koennen: { du: "Du ___ mir helfen.", er: "Er ___ Deutsch sprechen.", ich: "Ich ___ Deutsch lernen.", wir: "Wir ___ helfen." },
  muessen: { du: "Du ___ arbeiten.", er: "Er ___ lernen.", ich: "Ich ___ arbeiten.", wir: "Wir ___ gehen." },
  moechten: { du: "Du ___ Wasser.", ich: "Ich ___ Kaffee.", er: "Er ___ Tee.", wir: "Wir ___ essen." },
  wollen: { du: "Du ___ nach Hause.", ich: "Ich ___ lernen.", er: "Er ___ schlafen.", wir: "Wir ___ gehen." },
  duerfen: { du: "Du ___ hereinkommen.", ich: "Ich ___ gehen.", er: "Er ___ rauchen.", wir: "Wir ___ helfen." },
  kaufen: { du: "Du ___ Brot.", ich: "Ich ___ einen Apfel.", er: "Er ___ Milch.", wir: "Wir ___ Obst." },
  spielen: { du: "Du ___ Fußball.", ich: "Ich ___ Tennis.", er: "Er ___ gern.", wir: "Wir ___ zusammen." },
  heissen: { du: "Du ___ Timur.", ich: "Ich ___ Anna.", er: "Er ___ Max.", wir: "Wir ___ Freunde." },
  fahren: { du: "Du ___ mit dem Bus.", ich: "Ich ___ nach Hause.", er: "Er ___ schnell.", wir: "Wir ___ nach Berlin." },
  nehmen: { du: "Du ___ Platz.", ich: "Ich ___ den Bus.", er: "Er ___ das Buch.", wir: "Wir ___ Kaffee." },
  sehen: { du: "Du ___ den Film.", ich: "Ich ___ den Mann.", er: "Er ___ fern.", wir: "Wir ___ uns." },
  schlafen: { du: "Du ___ viel.", ich: "Ich ___ gut.", er: "Er ___ spät.", wir: "Wir ___ heute." },
};

function shuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWeightedPersons(n, seed) {
  const pool = [];
  PERSON_META.forEach((p) => {
    for (let i = 0; i < p.weight; i++) pool.push(p.personId);
  });
  const picked = [];
  let s = seed;
  for (let i = 0; i < n; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const id = pool[s % pool.length];
    picked.push(id);
  }
  return picked;
}

function buildRows(verbId, forms) {
  return PERSON_META.map((p, i) => ({
    personId: p.personId,
    pronoun_de: p.pronoun_de,
    pronoun_tr: p.pronoun_tr,
    form: forms[i],
    form_tr: `${p.pronoun_tr} → ${forms[i]}`,
  }));
}

function buildDrills(verbId, forms, order) {
  const allForms = [...new Set(forms)];
  const personIds = pickWeightedPersons(10, order * 97);
  const drills = [];

  personIds.forEach((personId, idx) => {
    const pIdx = PERSON_META.findIndex((p) => p.personId === personId);
    const correct = forms[pIdx];
    const meta = PERSON_META[pIdx];
    const ctx = DRILL_CONTEXT[verbId]?.[personId];
    const prompt_de = ctx ?? `${meta.pronoun_de} ___ .`;
    const distractors = shuffle(allForms.filter((f) => f !== correct), idx + order).slice(0, 3);
    const options = shuffle([correct, ...distractors], idx);
    while (options.length < 4) options.push(allForms[options.length % allForms.length]);

    drills.push({
      id: `drill-${verbId}-${String(idx + 1).padStart(2, "0")}`,
      verbId,
      personId,
      prompt_tr: `${meta.pronoun_tr} — boşluğu doldur (${VERB_META.find((v) => v.id === verbId).tr})`,
      prompt_de,
      blank: correct,
      options: options.slice(0, 4),
      correct_index: options.indexOf(correct),
    });
  });

  return drills;
}

const verbs = VERB_META.map((v) => {
  const forms = VERB_FORMS[v.id];
  const examples = PERSON_META.map((p) => ({
    personId: p.personId,
    ...EXAMPLE_TEMPLATES[v.id][p.personId],
  })).filter((e) => e.de);
  const drills = buildDrills(v.id, forms, v.order);
  return {
    id: v.id,
    infinitive: v.infinitive,
    tr: v.tr,
    order: v.order,
    rows: buildRows(v.id, forms),
    examples: examples.slice(0, 5),
    drills,
  };
});

const allDrills = verbs.flatMap((v) => v.drills);

function validate(data) {
  const n = data.verbs.length;
  if (n < 11) throw new Error(`Expected at least 11 verbs, got ${n}`);
  const ids = new Set();
  for (const v of data.verbs) {
    if (v.rows.length !== 9) throw new Error(`${v.id}: expected 9 rows`);
    if (v.drills.length !== 10) throw new Error(`${v.id}: expected 10 drills`);
    for (const d of v.drills) {
      if (ids.has(d.id)) throw new Error(`Duplicate drill ${d.id}`);
      ids.add(d.id);
    }
  }
}

const output = {
  version: "1.0.0",
  level: "A1",
  title: "Conjugation Matrix",
  titleTr: "Fiil Çekim Matrisi",
  description: "A1 fiilleri + Modalverben × 9 kişi — du/er/sie ağırlıklı drill",
  passThreshold: 8,
  drillsPerVerb: 10,
  verbs,
  drills: allDrills,
};

validate(output);
const totalRows = output.verbs.reduce((a, v) => a + v.rows.length, 0);
fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");
console.log(`✓ a1-conjugation.json — ${output.verbs.length} verbs, ${totalRows} rows, ${allDrills.length} drills → ${OUT}`);
