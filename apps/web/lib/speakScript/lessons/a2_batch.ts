import type { ScriptStepDef } from "../types";
import { hasAny } from "../utils";

const mk = (
  title: string,
  intro: string,
  topicDe: string,
  topicTr: string,
  examples: { german: string; turkish: string }[],
  practiceDe: string,
  practiceTr: string,
  expected: string,
  explain: string,
  accept: (n: string) => boolean,
  praise: string,
  last = false
): ScriptStepDef[] => [
  {
    teach: {
      reply: title,
      teachingIntro: intro,
      teachingTopicGerman: topicDe,
      teachingTopicTurkish: topicTr,
      teachingExamples: examples,
      speakTextGerman: examples[0]?.german ?? topicDe,
      speakText: intro,
    },
    practice: {
      germanQuestion: practiceDe,
      turkishTranslation: practiceTr,
      speakTextGerman: practiceDe,
    },
    expectedGerman: expected,
    correctionExplanationTr: explain,
    accept,
    praiseReply: praise,
  },
  {
    teach: {
      reply: `${title} — örnek diyalog.`,
      teachingIntro: "Örnekleri dinle ve tekrarla.",
      teachingTopicGerman: `${topicDe} — Dialog`,
      teachingTopicTurkish: `${topicTr} — diyalog`,
      teachingExamples: examples,
      speakTextGerman: examples[examples.length - 1]?.german ?? topicDe,
      speakText: "Diyalogu kur.",
    },
    practice: {
      germanQuestion: "Spiel das Gespräch nach.",
      turkishTranslation: "Konuşmayı canlandır.",
      speakTextGerman: practiceDe,
    },
    expectedGerman: expected,
    correctionExplanationTr: explain,
    accept,
    praiseReply: "Sehr gut!",
  },
  {
    teach: {
      reply: "Pratik zamanı.",
      teachingIntro: "Kendi cümlelerinle dene.",
      teachingTopicGerman: `${topicDe} — Übung`,
      teachingTopicTurkish: `${topicTr} — pratik`,
      teachingExamples: examples,
      speakTextGerman: practiceDe,
      speakText: "Serbest pratik.",
    },
    practice: {
      germanQuestion: practiceDe,
      turkishTranslation: practiceTr,
      speakTextGerman: practiceDe,
    },
    expectedGerman: expected,
    correctionExplanationTr: explain,
    accept,
    praiseReply: "Harika!",
  },
  {
    teach: {
      reply: "Ders özeti.",
      teachingIntro: last ? "Ders tamamlandı." : "Bir sonraki derse hazırsın.",
      teachingTopicGerman: "Zusammenfassung",
      teachingTopicTurkish: "Özet",
      teachingExamples: examples,
      speakTextGerman: examples[0]?.german ?? "",
      speakText: "Özet konuşma.",
    },
    practice: {
      germanQuestion: "Fasse die Lektion zusammen.",
      turkishTranslation: "Dersi özetle.",
      speakTextGerman: practiceDe,
    },
    expectedGerman: expected,
    correctionExplanationTr: explain,
    accept,
    praiseReply: last ? "Tebrikler! Ders tamam." : "Tebrikler! Ders tamam.",
  },
];

export const A2_L02_STEPS: ScriptStepDef[] = mk(
  "Randevu ve telefon: Termin vereinbaren.",
  "Ich möchte einen Termin. / Können Sie …? / Am Montag um … Uhr",
  "einen Termin machen",
  "randevu almak",
  [
    { german: "Ich möchte einen Termin beim Arzt.", turkish: "Doktordan randevu istiyorum." },
    { german: "Können Sie am Montag um zehn Uhr?", turkish: "Pazartesi saat 10 olur mu?" },
  ],
  "Ich möchte einen Termin. Wann haben Sie Zeit?",
  "Randevu iste ve saat sor.",
  "Ich möchte einen Termin … Uhr",
  "Termin + gün/saat.",
  (n) => hasAny(n, "termin", "mochte", "möchte", "uhr", "konnen", "können"),
  "Gut!"
);

export const A2_L03_STEPS: ScriptStepDef[] = mk(
  "Sağlık ve doktor.",
  "Mir tut … weh. / Ich habe Fieber. / Was fehlt Ihnen?",
  "beim Arzt",
  "doktorda",
  [
    { german: "Mir tut der Kopf weh.", turkish: "Başım ağrıyor." },
    { german: "Ich habe Fieber.", turkish: "Ateşim var." },
  ],
  "Was fehlt Ihnen? — Mir tut … weh.",
  "Şikayetini söyle.",
  "Mir tut … weh / Ich habe Fieber",
  "Ağrı veya ateş kalıbı.",
  (n) => hasAny(n, "weh", "fieber", "kopf", "bauch", "fehlt"),
  "Sehr gut!"
);

export const A2_L04_STEPS: ScriptStepDef[] = mk(
  "Alışveriş — beden ve değişim.",
  "Haben Sie das in Größe M? / Ich möchte umtauschen.",
  "Größe und Umtausch",
  "beden ve değişim",
  [
    { german: "Haben Sie das in Größe M?", turkish: "M beden var mı?" },
    { german: "Das passt nicht. Ich möchte umtauschen.", turkish: "Olmadı, değiştirmek istiyorum." },
  ],
  "Haben Sie das in Größe M?",
  "Beden sor veya değişim iste.",
  "Größe M / umtauschen",
  "Größe veya umtauschen.",
  (n) => hasAny(n, "grosse", "größe", "umtauschen", "passt nicht"),
  "Gut!"
);

export const A2_L05_STEPS: ScriptStepDef[] = mk(
  "Restoran: sipariş ve hesap.",
  "Ich hätte gern … / Die Rechnung, bitte.",
  "im Restaurant",
  "restoranda",
  [
    { german: "Ich hätte gern die Suppe.", turkish: "Çorba alırım." },
    { german: "Die Rechnung, bitte.", turkish: "Hesap lütfen." },
  ],
  "Ich hätte gern … und Die Rechnung, bitte.",
  "Sipariş ver ve hesap iste.",
  "Ich hätte gern … Rechnung",
  "Sipariş + hesap.",
  (n) => hasAny(n, "hatte gern", "hätte", "rechnung", "bitte"),
  "Sehr gut!"
);

export const A2_L06_STEPS: ScriptStepDef[] = mk(
  "Ulaşım ve seyahat.",
  "Eine Fahrkarte nach … / Wann kommt der Zug?",
  "Fahrkarte · Gleis",
  "bilet · peron",
  [
    { german: "Eine Fahrkarte nach Berlin, bitte.", turkish: "Berlin'e bilet lütfen." },
    { german: "Wann kommt der Zug? — Gleis drei.", turkish: "Tren ne zaman? — 3. peron." },
  ],
  "Eine Fahrkarte nach … bitte.",
  "Bilet al.",
  "Fahrkarte nach …",
  "Fahrkarte + destinasyon.",
  (n) => hasAny(n, "fahrkarte", "zug", "gleis", "nach"),
  "Gut!"
);

export const A2_L07_STEPS: ScriptStepDef[] = mk(
  "Konut ve komşu.",
  "Die Heizung funktioniert nicht. / Ich suche eine Wohnung.",
  "Wohnung · Reparatur",
  "konut · tamir",
  [
    { german: "Die Heizung funktioniert nicht.", turkish: "Kalorifer çalışmıyor." },
    { german: "Die Miete ist 800 Euro.", turkish: "Kira 800 euro." },
  ],
  "Beschreibe ein Problem in der Wohnung.",
  "Evde bir sorun anlat.",
  "funktioniert nicht / Miete",
  "Sorun veya kira.",
  (n) => hasAny(n, "wohnung", "miete", "heizung", "funktioniert", "reparatur"),
  "Sehr gut!"
);

export const A2_L08_STEPS: ScriptStepDef[] = mk(
  "İş görüşmesi.",
  "Erzählen Sie von sich. / Ich bin zuverlässig.",
  "Bewerbungsgespräch",
  "iş görüşmesi",
  [
    { german: "Ich habe fünf Jahre Erfahrung.", turkish: "Beş yıl deneyimim var." },
    { german: "Ich bin zuverlässig und pünktlich.", turkish: "Güvenilir ve dakikim." },
  ],
  "Erzählen Sie von Ihrer Erfahrung.",
  "Deneyiminden bahset.",
  "Erfahrung / zuverlässig",
  "Deneyim veya güçlü yön.",
  (n) => hasAny(n, "erfahrung", "zuverlassig", "zuverlässig", "bewerbung", "arbeit"),
  "Harika!"
);

export const A2_L09_STEPS: ScriptStepDef[] = mk(
  "Hava durumu ve plan değişikliği.",
  "Wenn es regnet, bleiben wir zu Hause.",
  "Wetter · Plan ändern",
  "hava · plan",
  [
    { german: "Es regnet heute.", turkish: "Bugün yağmur yağıyor." },
    { german: "Wenn es regnet, bleiben wir zu Hause.", turkish: "Yağmur yağarsa evde kalırız." },
  ],
  "Was machst du, wenn es regnet?",
  "Yağmur yağarsa ne yaparsın?",
  "Wenn es regnet …",
  "Wenn + plan cümlesi.",
  (n) => hasAny(n, "wenn", "regnet", "sonnig", "bleiben", "plan"),
  "Gut!"
);

export const A2_L10_STEPS: ScriptStepDef[] = mk(
  "Görüş ve neden: weil / deshalb.",
  "Ich lerne Deutsch, weil ich in Deutschland arbeite.",
  "weil · Meinung",
  "çünkü · görüş",
  [
    { german: "Ich lerne Deutsch, weil …", turkish: "Almanca öğreniyorum çünkü …" },
    { german: "Meiner Meinung nach ist das gut.", turkish: "Bence bu iyi." },
  ],
  "Warum lernst du Deutsch? — weil …",
  "Neden öğreniyorsun? weil ile cevap.",
  "weil … / Meinung nach",
  "weil veya Meinung.",
  (n) => hasAny(n, "weil", "deshalb", "meinung", "finde"),
  "Sehr gut!"
);

export const A2_L11_STEPS: ScriptStepDef[] = mk(
  "Karşılaştırma: besser als / genauso wie.",
  "Berlin ist größer als München.",
  "Vergleichen",
  "karşılaştırma",
  [
    { german: "Deutsch ist schwerer als Englisch.", turkish: "Almanca İngilizce'den zor." },
    { german: "Mein Auto ist genauso teuer wie deins.", turkish: "Arabam seninki kadar pahalı." },
  ],
  "Vergleiche zwei Dinge: X ist … als Y.",
  "İki şeyi karşılaştır.",
  "besser als / genauso",
  "als veya genauso … wie.",
  (n) => hasAny(n, "als", "genauso", "besser", "mehr", "unterschied"),
  "Harika!"
);

export const A2_L12_STEPS: ScriptStepDef[] = mk(
  "A2 sınav simülasyonu — Sprechen.",
  "Teil 1: Planen · Teil 2: Präsentation · Teil 3: Fragen",
  "A2 Sprechen",
  "A2 konuşma",
  [
    { german: "Lass uns einen Plan machen.", turkish: "Plan yapalım." },
    { german: "Ich möchte über mein Hobby sprechen.", turkish: "Hobim hakkında konuşmak istiyorum." },
  ],
  "Plane etwas mit deinem Partner.",
  "Partnerinle bir plan yap.",
  "Plan / Präsentation",
  "Planlama veya sunum cümlesi.",
  (n) => hasAny(n, "plan", "prasentation", "präsentation", "fragen", "gemeinsam", "lass uns"),
  "Tebrikler! A2 konuşma yolculuğu tamam!",
  true
);
