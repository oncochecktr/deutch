/** gerceksinav.md — Goethe A1 Schreiben (Form + Mektup) kuralları ve örnekler */

export const SCHREIBEN_OVERVIEW = {
  duration: "20 dakika",
  tasks: [
    { id: "teil1", de: "Teil 1: Formular", tr: "Form doldurma", points: 5, detail: "5 boşluk · her biri 1 puan" },
    { id: "teil2", de: "Teil 2: Brief", tr: "Mektup / e-posta", points: 20, detail: "~30+ kelime · 3 soruya cevap" },
  ],
  warning:
    "Kitapçıkta yazmak yetmez! Cevap kağıdında Teil 1 (1–5) ve Teil 2 alanlarını mutlaka doldur. Kitapçıklar çöpe gider.",
};

export const SCHREIBEN_GOLDEN_RULES = [
  {
    title: "Cevap kağıdına geçir",
    text: "Form ve mektubu mutlaka Antwortbogen’a yaz. Kitapçıkta %100 doğru olsa bile puan yok.",
  },
  {
    title: "Form: 1–2–3–4–5",
    text: "5 boşluğu cevap kağıdında 0 ile karıştırma, kaydırma. Her kutu 1 puan.",
  },
  {
    title: "Metni oku, kişiyi bul",
    text: "Anmeldung = kayıt formu. Metinde kimin hakkında yazılıyorsa onun bilgisini yaz (bazen kızı/ oğlu sorulur).",
  },
  {
    title: "kein = tam tersi",
    text: "Metinde kein Kreditkarte varsa formda ödeme sorusu çıkar → Bar (nakit) işaretle.",
  },
  {
    title: "Ort = yer",
    text: "Urlaubsort, Geburtsort, Wohnort… Ort her zaman yer. İkamet yeri soruluyorsa memleketi değil, bulunduğu şehri yaz.",
  },
  {
    title: "Tarih ön eki",
    text: "nächsten Sonntag — sadece Sonntag değil; metindeki gün/ay ifadesini olduğu gibi yaz.",
  },
  {
    title: "Mektup noktalama",
    text: "Selamlamadan sonra virgül, alt satır küçük harf, paragraflar arası boş satır. Soru → ?, cümle sonu → .",
  },
  {
    title: "Artikel affetilir, anlam affedilmez",
    text: "der/die karışsa sorun değil. Konuyu anlamadan ezber cümle yazarsan sıfır.",
  },
];

export const FORM_FIELD_GLOSSARY = [
  { de: "Familienname / Name", tr: "Soyadı" },
  { de: "Vorname", tr: "Ad" },
  { de: "Anmeldung", tr: "Kayıt (form türü)" },
  { de: "Anzahl der Personen", tr: "Kaç kişi?" },
  { de: "Davon Kinder", tr: "Bunlardan kaç çocuk? (sadece rakam)" },
  { de: "Urlaub / Urlaubsadresse", tr: "Tatil / tatil adresi" },
  { de: "Straße / Hausnummer", tr: "Sokak / bina no" },
  { de: "PLZ", tr: "Posta kodu" },
  { de: "Ort", tr: "Yer / şehir (ikamet veya sorulan yer)" },
  { de: "Zahlungsart: Bar / Kreditkarte", tr: "Ödeme: nakit / kredi kartı" },
  { de: "Reise Termin / Kurs Termin", tr: "Seyahat veya kurs tarihi/süresi" },
  { de: "Geburtsdatum / Geburtsort", tr: "Doğum tarihi / yeri" },
  { de: "Muttersprache / andere Sprache", tr: "Ana dil / diğer dil" },
  { de: "Familienstand: ledig / verheiratet", tr: "Medeni hal" },
  { de: "männlich / weiblich", tr: "Erkek / kadın" },
  { de: "Unterschrift", tr: "İmza" },
];

export interface FormField {
  id: string;
  labelDe: string;
  labelTr: string;
  hintTr: string;
  answer: string;
  acceptAlso?: string[];
}

export interface FormExample {
  id: string;
  titleTr: string;
  textDe: string;
  textTr: string;
  tips: string[];
  fields: FormField[];
}

export const FORM_EXAMPLES: FormExample[] = [
  {
    id: "form_eva",
    titleTr: "Otobüs rezervasyonu (Eva Kadavi)",
    textDe:
      "Eva Kadavi ist mit ihrem Mann und zwei Kindern (8 und 11 Jahre alt) im Urlaub in Siem. Das Reisebüro soll für nächsten Sonntag eine Busfahrt zu einem See reservieren. Eva hat keinen Kreditkarte.",
    textTr:
      "Eva Kadavi kocası ve 2 çocuğuyla (8 ve 11 yaş) Siem’de tatilde. Seyahat acentesi gelecek Pazar göl turu için otobüs rezervasyonu yapacak. Eva’nın kredi kartı yok.",
    tips: [
      "Eva + Mann + 2 Kinder = 4 kişi",
      "Davon Kinder = sadece 2 yaz (rakam)",
      "kein Kreditkarte → Bar işaretle",
      "nächsten Sonntag — ön ekli yaz",
    ],
    fields: [
      {
        id: "f1",
        labelDe: "Anzahl der Personen",
        labelTr: "Kaç kişi?",
        hintTr: "Eva + koca + 2 çocuk",
        answer: "4",
      },
      {
        id: "f2",
        labelDe: "Davon Kinder",
        labelTr: "Kaç çocuk?",
        hintTr: "Sadece rakam: 2",
        answer: "2",
      },
      {
        id: "f3",
        labelDe: "Urlaubsort (Ort)",
        labelTr: "Tatil yeri",
        hintTr: "Metinde geçen şehir",
        answer: "Siem",
        acceptAlso: ["siem"],
      },
      {
        id: "f4",
        labelDe: "Zahlungsart",
        labelTr: "Ödeme biçimi",
        hintTr: "Kredi kartı yok → Bar",
        answer: "Bar",
        acceptAlso: ["bar"],
      },
      {
        id: "f5",
        labelDe: "Reise Termin",
        labelTr: "Seyahat tarihi",
        hintTr: "Metindeki gün ifadesi tam",
        answer: "nächsten Sonntag",
        acceptAlso: ["naechsten sonntag", "nächster sonntag"],
      },
    ],
  },
  {
    id: "form_yvon",
    titleTr: "Kurs kaydı (Yvon — tuzaklı sorular)",
    textDe:
      "Yvon meldet seine Tochter an. Die Tochter ist 1993 in Lyon geboren. Muttersprache: Französisch. Andere Sprache: Englisch. Der Kurs dauert sechs Monate, vom 1. bis 28. August, vormittags von 9 bis 12 Uhr.",
    textTr:
      "Yvon kızını kaydediyor. Kız 1993’te Lyon’da doğmuş. Ana dil Fransızca, diğer dil İngilizce. Kurs 6 ay, 1–28 Ağustos, sabah 9–12.",
    tips: [
      "Geburtsort = kızının doğum yeri (Lyon) — Yvon’un değil!",
      "Wie lange? → sechs Monate (metinden kopyala)",
      "Kurs Termin → vom 1. bis 28. August",
      "vormittags = öğleden önce (9–12)",
    ],
    fields: [
      {
        id: "f1",
        labelDe: "Geburtsort (Tochter)",
        labelTr: "Doğum yeri (kız)",
        hintTr: "Metinde kimin doğum yeri soruluyor?",
        answer: "Lyon",
      },
      {
        id: "f2",
        labelDe: "Muttersprache",
        labelTr: "Ana dil",
        hintTr: "Französisch",
        answer: "Französisch",
        acceptAlso: ["franzoesisch"],
      },
      {
        id: "f3",
        labelDe: "Andere Sprache",
        labelTr: "Diğer dil",
        hintTr: "Englisch",
        answer: "Englisch",
        acceptAlso: ["englisch"],
      },
      {
        id: "f4",
        labelDe: "Wie lange?",
        labelTr: "Ne kadar süre?",
        hintTr: "Ay ifadesi aynen",
        answer: "sechs Monate",
        acceptAlso: ["6 monate", "sechs monate"],
      },
      {
        id: "f5",
        labelDe: "Kurs Termin",
        labelTr: "Kurs tarihi / süresi",
        hintTr: "vom … bis … ile yaz",
        answer: "vom 1. bis 28. August",
        acceptAlso: ["1. bis 28. august", "vom 1 bis 28 august"],
      },
    ],
  },
];

export interface MektupTemplate {
  label: string;
  greeting: string;
  /** A1 giriş — weil ile neden (Goethe kalıbı) */
  opening: string;
  /** Önce neden, sonra deshalb (PDF örnekleri) */
  followUp: string;
  closing: string[];
  note?: string;
}

/** Neden cümlesi kuralı — intro’da gösterilir */
export const MEKTUP_WHY_RULE =
  "Deshalb «bu yüzden» demektir; tek başına kullanılamaz. Önce nedeni yaz, sonra Deshalb — " +
  "veya doğrudan: ich schreibe …, weil …";

export const MEKTUP_TEMPLATES: Record<string, MektupTemplate> = {
  formal: {
    label: "Resmi (kurum / otel / kurs)",
    greeting: "Sehr geehrte Damen und Herren,",
    opening: "ich schreibe Ihnen, weil …",
    followUp: "ich möchte … . Deshalb schreibe ich Ihnen.",
    closing: ["Ich bitte um eine Antwort.", "Vielen Dank im Voraus.", "Mit freundlichen Grüßen"],
    note: "Erkek kişi: Sehr geehrter Herr [Nachname], — geehrter (R dikkat)",
  },
  friendOne: {
    label: "Samimi (tek arkadaş)",
    greeting: "Liebe Marianne,",
    opening: "ich schreibe dir, weil …",
    followUp: "ich habe … . Deshalb schreibe ich dir.",
    closing: ["Ich bitte um eine Antwort.", "Vielen Dank im Voraus.", "Viele Grüße"],
  },
  friendTwo: {
    label: "Samimi (iki arkadaş)",
    greeting: "Liebe Susanne und lieber Paul,",
    opening: "ich schreibe euch, weil …",
    followUp: "ich möchte … . Deshalb schreibe ich euch.",
    closing: ["Ich bitte um eine Antwort.", "Vielen Dank im Voraus.", "Viele Grüße"],
    note: "lieber erkek isimden sonra küçük harf",
  },
};

export const MEKTUP_PUNCTUATION_RULES = [
  "Selamlama satırı sonunda virgül: Sehr geehrte Damen und Herren,",
  "Alt satırda cümle küçük harfle başlar: ich schreibe Ihnen, weil…",
  "weil = çünkü (neden) · deshalb = bu yüzden (önce neden cümlesi gerekir)",
  "Paragraflar arasında bir boş satır",
  "Soru cümlesi → ? · Bildirim → .",
  "Information büyük I ile — information yanlış",
  "Kapanışta isimden önce virgül yok",
];

export const MEKTUP_PHRASE_BANK = [
  {
    de: "Können Sie mir bitte Informationen über … geben?",
    tr: "… hakkında bilgi verir misiniz? (Uber = hakkında)",
    tag: "soru",
  },
  {
    de: "Wann ist die Prüfung?",
    tr: "Sınav ne zaman?",
    tag: "soru",
  },
  {
    de: "Wann beginnt der Kurs?",
    tr: "Kurs ne zaman başlıyor?",
    tag: "soru",
  },
  {
    de: "Wann ist die Anmeldung?",
    tr: "Kayıt ne zaman? (Anmeldung = isim, anmelden = fiil)",
    tag: "soru",
  },
  {
    de: "Wie viel kostet der Kurs?",
    tr: "Kurs ne kadar?",
    tag: "soru",
  },
  {
    de: "Wann kann ich … abholen?",
    tr: "… ne zaman alabilirim?",
    tag: "soru",
  },
  {
    de: "Die Party ist am … um … Uhr im …",
    tr: "Parti … günü saat …’de …’de",
    tag: "davet",
  },
  {
    de: "Wir kommen mit fünf Personen.",
    tr: "Beş kişi geliyoruz",
    tag: "davet",
  },
  {
    de: "Ich ziehe nach Berlin um.",
    tr: "Berlin’e taşınıyorum (umziehen → ich ziehe … um)",
    tag: "taşınma",
  },
  {
    de: "Wo kann ich Möbel kaufen?",
    tr: "Mobilyayı nereden alabilirim?",
    tag: "taşınma",
  },
  {
    de: "Ich kann leider nicht kommen, weil ich krank bin.",
    tr: "Maalesef gelemiyorum, hastayım",
    tag: "olumsuz",
  },
  {
    de: "Geht das?",
    tr: "Bu uygun mu? / Olur mu?",
    tag: "davet",
  },
  {
    de: "Wie geht es?",
    tr: "Nasılsın? (samimi giriş — küçük w)",
    tag: "samimi",
  },
];

export const MEKTUP_VERB_NOUN_PAIRS = [
  { verb: "anmelden", noun: "Anmeldung", tr: "kayıt olmak / kayıt" },
  { verb: "kosten", noun: "Preis / Kosten", tr: "fiyatı olmak / fiyat" },
  { verb: "umziehen", noun: "Umzug", tr: "taşınmak" },
  { verb: "bezahlen", noun: "Zahlung", tr: "ödemek / ödeme" },
  { verb: "suchen", noun: "Suche", tr: "aramak" },
];

import { germanTextsMatch, normalizeGermanText } from "./germanTextCompare";

export function normalizeFormAnswer(s: string): string {
  return normalizeGermanText(s);
}

export function checkFormAnswer(field: FormField, userInput: string): boolean {
  if (!userInput.trim()) return false;
  const answers = [field.answer, ...(field.acceptAlso ?? [])];
  return answers.some((a) => germanTextsMatch(userInput, a));
}
