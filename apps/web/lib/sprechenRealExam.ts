/** Gerçek Goethe A1 Sprechen akışı — gerceksinav.md özeti */

export const SPRECHEN_EXAM_RULES = [
  {
    title: "Sadece Almanca",
    text: "Masaya oturduktan sonra tek kelime Türkçe yok. “Anlamadım” bile Türkçe — puan düşer.",
  },
  {
    title: "4 kişi + 2 öğretmen",
    text: "Lesen, Hören, Schreiben bittikten sonra ayrı odada 4 aday yan yana; karşıda 2 Almanca öğretmeni.",
  },
  {
    title: "Basit sor, kısa cevapla",
    text: "Yanınızdakini zorlamayın. A1 dışı soru → hoca soruyu alır, puan yok.",
  },
  {
    title: "Tek kalıp yeter",
    text: "Rica: “Ja, natürlich. Hier.” · Yasak: “Oh, Entschuldigung.” — ezberleyin, yeter.",
  },
];

export const TEIL1_FORM = {
  title: "Teil 1 — Selbstvorstellung (Teil Eins)",
  fields: [
    { de: "Name", tr: "Adınız", example: "Ich heiße …" },
    { de: "Alter", tr: "Yaşınız", example: "Ich bin … Jahre alt." },
    { de: "Herkunft", tr: "Memleket / ülke", example: "Ich komme aus der Türkei." },
    { de: "Wohnort", tr: "Nerede oturuyorsunuz", example: "Ich wohne in Izmir." },
    { de: "Sprachen", tr: "Konuştuğunuz diller", example: "Ich spreche Türkisch und Deutsch." },
    { de: "Beruf", tr: "Meslek", example: "Ich bin Lagerarbeiter." },
    { de: "Hobby", tr: "Hobiler", example: "Mein Hobby ist Fußball." },
  ],
  examinerTasks: [
    {
      de: "Telefonnummer",
      tr: "Telefon numaranızı rakam rakam söyleyin (0 ile başlayabilir, doğru olması şart değil — telaffuz önemli).",
      example: "Null – eins – fünf – zwei – …",
    },
    {
      de: "Buchstabieren (Vorname / Familienname / Nachname)",
      tr: "İsim veya soyisim heceleyin. “Wie buchstabiert man Ihren Vornamen?” → harf harf.",
      example: "C – Ü – N – E – Y – T",
    },
  ],
  tip: "Bu bölüme iyi hazırlanırsanız yaklaşık 25 puanlık kısım netleşir.",
};

export const THEMA_TOPICS = [
  { de: "Einkaufen", tr: "Alışveriş", words: ["Obst", "Brot", "Milch", "Kaffee", "Zeitung", "Buch"] },
  { de: "Wohnen", tr: "Konut", words: ["Wohnung", "Zimmer", "Miete", "Haus"] },
  { de: "Freizeit", tr: "Boş zaman", words: ["Sport", "Tanzen", "Musik", "Foto"] },
  { de: "Essen & Trinken", tr: "Yeme-içme", words: ["Frühstück", "Mittagessen", "Abendessen", "Wasser"] },
  { de: "Reisen / Urlaub", tr: "Seyahat / tatil", words: ["Reise", "Urlaub", "Koffer", "Taxi"] },
  { de: "Familie / Schule", tr: "Aile / okul", words: ["Familie", "Schule", "Lehrer", "Freund"] },
  { de: "Bank", tr: "Banka", words: ["Bank", "Konto", "Geld"] },
];

export const THEMA_PATTERNS = [
  {
    pattern: "… gern in der Freizeit?",
    tr: "Boş zamanında … sever misin?",
    exampleQ: "Tanzen Sie gern in der Freizeit?",
    exampleA: "Ja, ich tanze gern. / Nein, nicht gern.",
  },
  {
    pattern: "Haben Sie …?",
    tr: "… var mı?",
    exampleQ: "Haben Sie einen Einkaufszettel?",
    exampleA: "Ja, ich habe einen Einkaufszettel.",
  },
  {
    pattern: "Wie viel kostet …?",
    tr: "… ne kadar?",
    exampleQ: "Wie viel kostet die Zeitung?",
    exampleA: "Fünf Euro. / Die Zeitung kostet fünf Euro.",
  },
  {
    pattern: "Wo ist …?",
    tr: "… nerede?",
    exampleQ: "Wo ist das Haus?",
    exampleA: "Dort links. / Das Haus ist dort.",
  },
];

export const BITTE_CARDS = [
  { item: "Apfel", tr: "elma", ask: "Können Sie mir bitte einen Apfel geben?", answer: "Ja, natürlich. Hier." },
  { item: "Wasser (Glas)", tr: "bardak su", ask: "Können Sie mir bitte ein Glas Wasser geben?", answer: "Ja, natürlich. Hier." },
  { item: "Tasche", tr: "çanta", ask: "Können Sie mir bitte die Tasche geben?", answer: "Ja, natürlich. Hier." },
  { item: "Heft", tr: "defter", ask: "Können Sie mir bitte das Heft geben?", answer: "Ja, natürlich. Hier." },
  { item: "Stift", tr: "kalem", ask: "Können Sie mir bitte einen Stift geben?", answer: "Ja, natürlich. Hier." },
];

export const VERBOT_CARDS = [
  { item: "Parken", tr: "park etmek", say: "Bitte hier parken ist verboten.", answer: "Oh, Entschuldigung." },
  { item: "Foto", tr: "fotoğraf çekmek", say: "Bitte Fotos machen ist verboten.", answer: "Oh, Entschuldigung." },
  { item: "Rauchen", tr: "sigara içmek", say: "Bitte hier rauchen ist verboten.", answer: "Oh, Entschuldigung." },
  { item: "Auto", tr: "araba ile girmek", say: "Bitte mit dem Auto fahren ist verboten.", answer: "Oh, Entschuldigung." },
  { item: "Essen", tr: "yemek yemek", say: "Bitte hier essen ist verboten.", answer: "Oh, Entschuldigung." },
];

export const SPRECHEN_FLOW = [
  {
    id: "teil1",
    step: 1,
    title: "Teil 1 — Tanıtım",
    subtitle: "A4 form + telefon + heceleme",
    rounds: "Her aday sırayla okur; sonra öğretmen sorar.",
  },
  {
    id: "thema",
    step: 2,
    title: "Teil 2 — Thema-Karten",
    subtitle: "Tema kelimesiyle sol komşuya sor",
    rounds: "2 tur — kişi başı 2 soru + 2 cevap",
  },
  {
    id: "bitte",
    step: 3,
    title: "Teil 3a — Bitte-Karten",
    subtitle: "Rica kartı — bir şey iste",
    rounds: "1 tur — herkes bir kez sorar ve cevaplar",
  },
  {
    id: "verbot",
    step: 4,
    title: "Teil 3b — Verbot-Karten",
    subtitle: "Yasak kartı (üzerinde ✕)",
    rounds: "1 tur — yasak de, özür dile",
  },
];

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
