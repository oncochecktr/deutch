import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const text = fs.readFileSync(path.join(root, "gerceksinav.md"), "utf8");
const packs = {
  a1: JSON.parse(fs.readFileSync(path.join(root, "data/a1/vocabulary.json"), "utf8")).words,
  a2: JSON.parse(fs.readFileSync(path.join(root, "data/a2/vocabulary.json"), "utf8")).words,
  timur: JSON.parse(fs.readFileSync(path.join(root, "data/timur/vocabulary.json"), "utf8")).words,
};

const allWords = [...packs.a1, ...packs.a2, ...packs.timur];
const headwords = new Map();
for (const w of allWords) {
  headwords.set(w.word.toLowerCase(), { word: w.word, pack: w.id.startsWith("a2_") ? "a2" : w.id.startsWith("timur_") ? "timur" : "a1", tr: w.translation_tr });
}

// Key lemmas from Extra dialogue — manually curated from gerceksinav.md
const STORY_LEMMAS = [
  // Story / people / places
  ["Geschichte", "hikaye"],
  ["Nachbar", "komşu"],
  ["verliebt", "aşık"],
  ["Post", "posta"],
  ["Kissen", "yastık"],
  ["vorbei", "bitti"],
  ["heulen", "ağlamak"],
  ["Männer", "adamlar"],
  ["Telefonrechnung", "telefon faturası"],
  ["Gasrechnung", "doğalgaz faturası"],
  ["Stromrechnung", "elektrik faturası"],
  ["Brief", "mektup"],
  ["Mutter", "anne"],
  ["Pickel", "sivilce"],
  ["Amerika", "Amerika"],
  ["Brieffreund", "mektup arkadaşı"],
  ["Jahr", "yıl"],
  ["Deutsch", "Almanca"],
  ["Deutschland", "Almanya"],
  ["Amerikaner", "Amerikalı"],
  ["schlafen", "uyumak"],
  ["Bett", "yatak"],
  ["Tarantel", "tarantula"],
  ["sportlich", "atletik"],
  ["reich", "zengin"],
  ["Kontrolle", "kontrol"],
  ["Muskel", "kas"],
  ["Milch", "süt"],
  ["vergessen", "unutmak"],
  ["Cola", "kola"],
  ["männlich", "erkek (cinsiyet)"],
  ["cool", "havalı"],
  ["Fahrrad", "bisiklet"],
  ["anfassen", "dokunmak"],
  ["begründen", "gerekçelendirmek"],
  ["Hilfe", "yardım"],
  ["Schwester", "kız kardeş"],
  ["Spielzeug", "oyuncak"],
  ["Auto", "araba"],
  ["Bücherei", "kütüphane"],
  ["Buch", "kitap"],
  ["Museum", "müze"],
  ["Schlafzimmer", "yatak odası"],
  ["Zimmer", "oda"],
  ["Klappcouch", "açılır kanepe"],
  ["Fernbedienung", "kumanda"],
  ["Klamotten", "kıyafetler"],
  ["altmodisch", "modası geçmiş"],
  ["süß", "tatlı/sevimli"],
  ["höflich", "nazik"],
  ["sexy", "seksi"],
  ["Gepäck", "bagaj"],
  ["Portier", "kapıcı"],
  ["nebenan", "yan tarafta"],
  ["Hunger", "açlık"],
  ["Lieblingsessen", "favori yemek"],
  ["Currywurst", "currywurst"],
  ["Spaß", "eğlence"],
  ["Deutschunterricht", "Almanca dersi"],
  ["Ofen", "fırın"],
  ["Hund", "köpek"],
  ["stark", "güçlü"],
  ["Bein", "bacak"],
  ["Kilometer", "kilometre"],
  ["blau", "mavi"],
  ["rot", "kırmızı"],
  ["Shopping", "alışveriş"],
  ["einkaufen", "alışveriş yapmak"],
  ["Ordnung", "durum/sorun yok"],
  ["heiß", "sıcak"],
  ["duschen", "duş almak"],
  ["nett", "nazik"],
  ["Witz", "şaka"],
  ["böse", "kötü"],
  ["Junge", "çocuk/oğlan"],
  ["Zimmer", "oda"],
  ["frei", "boş"],
  ["Problem", "sorun"],
  ["sofort", "hemen"],
  ["Familie", "aile"],
  ["Dienstboten", "hizmetkârlar"],
  ["Freund", "arkadaş"],
  ["Leute", "insanlar"],
  ["schrecklich", "korkunç"],
  ["Vermieterin", "ev sahibi (kadın)"],
  ["Zeitschrift", "dergi"],
  ["Make-up", "makyaj"],
  ["Love Parade", "Love Parade"],
  ["Party", "parti"],
  ["verstecken", "saklanmak"],
  ["Miete", "kira"],
  ["Freunde", "arkadaşlar"],
  ["verpassen", "kaçırmak"],
  ["bekommen", "almak"],
  ["Lehrer", "öğretmen"],
  ["Lehrerin", "öğretmen (kadın)"],
  ["Freundin", "kız arkadaş"],
  ["Couch", "kanepe"],
  ["Wohnung", "daire"],
  ["zusammen", "birlikte"],
  ["wohnen", "oturmak"],
  ["sprechen", "konuşmak"],
  ["kommen", "gelmek"],
  ["möchten", "istemek"],
  ["übernachten", "gece kalmak"],
  ["trinken", "içmek"],
  ["fragen", "sormak"],
  ["lernen", "öğrenmek"],
  ["schlafen", "uyumak"],
  ["zeigen", "göstermek"],
  ["fahren", " sürmek"],
  ["duschen", "duş almak"],
  ["Schwesterherz", "canım kardeşim"],
  ["interessant", "ilginç"],
  ["tot", "ölü"],
  ["Chance", "şans"],
  ["Wort", "söz"],
  ["Ahnung", "fikir"],
  ["wieso", "neden"],
  ["egal", "fark etmez"],
  ["niemals", "asla"],
  ["selber", "kendi"],
  ["vielleicht", "belki"],
  ["wahr", "doğru"],
];

const inVocab = [];
const missing = [];

for (const [lemma, trHint] of STORY_LEMMAS) {
  const key = lemma.toLowerCase();
  if (headwords.has(key)) {
    const w = headwords.get(key);
    inVocab.push({ lemma, tr: w.tr, pack: w.pack });
  } else {
    // fuzzy: Deutsch -> Deutschland, Deutschunterricht
    const partial = allWords.filter((w) => w.word.toLowerCase().startsWith(key) || w.word.toLowerCase().includes(key));
    if (partial.length > 0 && key.length >= 5) {
      inVocab.push({ lemma, tr: partial[0].translation_tr, pack: "partial", note: partial[0].word });
    } else {
      missing.push({ lemma, trHint });
    }
  }
}

// dedupe missing by lemma
const seen = new Set();
const uniqueMissing = missing.filter((m) => {
  if (seen.has(m.lemma.toLowerCase())) return false;
  seen.add(m.lemma.toLowerCase());
  return true;
});

console.log("=== EXTRA DIALOG (gerceksinav.md) — Kelime kontrolü ===\n");
console.log(`Metindeki ana kelimeler (seçilmiş): ${STORY_LEMMAS.length}`);
console.log(`Bankada VAR: ${inVocab.length}`);
console.log(`Bankada YOK: ${uniqueMissing.length}\n`);

console.log("--- BANKADA OLAN (örnek) ---");
inVocab.slice(0, 25).forEach((w) => console.log(`  ✓ ${w.lemma} — ${w.tr}${w.note ? ` (yakın: ${w.note})` : ""}`));
if (inVocab.length > 25) console.log(`  … +${inVocab.length - 25} daha`);

console.log("\n--- BANKADA OLMAYAN ---");
uniqueMissing.forEach((w) => console.log(`  ✗ ${w.lemma} — ${w.trHint}`));

const outPath = path.join(root, "scripts/out/gerceksinav-vocab-audit.json");
fs.writeFileSync(outPath, JSON.stringify({ inVocab, missing: uniqueMissing }, null, 2));
