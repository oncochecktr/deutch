import type { SpeakLevel } from "./speakTypes";

export interface LessonStep {
  title: string;
  instruction: string;
}

export interface SpeakLesson {
  id: string;
  level: SpeakLevel;
  order: number;
  title: string;
  goal: string;
  phrases: string[];
  steps: LessonStep[];
}

export const SPEAK_LESSONS: SpeakLesson[] = [
  {
    id: "a1_l01",
    level: "A1",
    order: 1,
    title: "Selamlama & tanışma",
    goal: "Kendini tanıtabilirsin: isim, nereli, nerede yaşıyorsun.",
    phrases: ["Hallo", "Guten Tag", "Ich heiße …", "Ich komme aus …", "Ich wohne in …", "Woher kommst du?"],
    steps: [
      { title: "Hoş geldin", instruction: "Ders planını 4 maddede anlat; bugünkü hedefi söyle." },
      { title: "Selamlaşma", instruction: "Hallo / Guten Tag öğret; tekrar ettir." },
      { title: "İsim", instruction: "Ich heiße … kalıbını öğret; kullanıcı kendi adıyla söylesin." },
      { title: "Nereli", instruction: "Woher kommst du? sor; Ich komme aus … cevabını öğret." },
      { title: "Nerede yaşıyorsun", instruction: "Ich wohne in … öğret; mini diyalog yap." },
      { title: "Özet", instruction: "3 cümlelik tanışma diyalogunu birlikte tekrarla; dersi bitir." },
    ],
  },
  {
    id: "a1_l02",
    level: "A1",
    order: 2,
    title: "Nasılsın & ne iş yapıyorsun",
    goal: "Hal-hatır sorar, işini söylersin.",
    phrases: ["Wie geht es dir?", "Mir geht es gut.", "Ich arbeite …", "Was machst du beruflich?"],
    steps: [
      { title: "Isınma", instruction: "Önceki dersten Ich heiße / Ich komme aus tekrarı." },
      { title: "Hal hatır", instruction: "Wie geht es dir? / Mir geht es gut öğret." },
      { title: "Meslek", instruction: "Ich arbeite im Lager / als … öğret." },
      { title: "Diyalog", instruction: "Tanışma + meslek mini konuşma." },
      { title: "Özet", instruction: "5 cümlelik öz konuşma; dersi bitir." },
    ],
  },
  {
    id: "a1_l03",
    level: "A1",
    order: 3,
    title: "Aile",
    goal: "Ailen hakkında 3–4 cümle kurabilirsin.",
    phrases: ["die Familie", "Ich habe …", "Meine Frau / Mein Mann", "Kinder"],
    steps: [
      { title: "Kelime", instruction: "Familie, Frau, Mann, Kind kelimelerini öğret." },
      { title: "Ich habe", instruction: "Ich habe eine Frau und zwei Kinder kalıbı." },
      { title: "Pratik", instruction: "Kullanıcı ailesini anlatsın." },
      { title: "Özet", instruction: "Aile paragrafı; dersi bitir." },
    ],
  },
  {
    id: "a1_l04",
    level: "A1",
    order: 4,
    title: "Sayılar & saat",
    goal: "1–20 sayıları ve saati söylersin.",
    phrases: ["eins … zwanzig", "Wie spät ist es?", "Es ist … Uhr"],
    steps: [
      { title: "Sayılar", instruction: "1–10 sonra 11–20 sayılarını öğret." },
      { title: "Saat", instruction: "Wie spät ist es? / Es ist drei Uhr." },
      { title: "Pratik", instruction: "Saat ve sayı soruları sor." },
      { title: "Özet", instruction: "Mini sınav: 3 saat + 3 sayı; dersi bitir." },
    ],
  },
  {
    id: "a1_l05",
    level: "A1",
    order: 5,
    title: "Market alışverişi",
    goal: "Basit alışveriş cümleleri kurarsın.",
    phrases: ["Ich möchte …", "Was kostet das?", "Das kostet … Euro"],
    steps: [
      { title: "Kalıplar", instruction: "Ich möchte / Was kostet das öğret." },
      { title: "Kelime", instruction: "Brot, Milch, Kaffee, Euro." },
      { title: "Diyalog", instruction: "Market sahnesi canlandır." },
      { title: "Özet", instruction: "Alışveriş diyalogu; dersi bitir." },
    ],
  },
  {
    id: "a1_l06",
    level: "A1",
    order: 6,
    title: "Yön sorma",
    goal: "Yol tarifi sorar ve anlarsın.",
    phrases: ["Wo ist …?", "Entschuldigung", "der Bahnhof", "links / rechts / geradeaus"],
    steps: [
      { title: "Soru", instruction: "Wo ist der Bahnhof? / Entschuldigung öğret." },
      { title: "Yön", instruction: "links, rechts, geradeaus." },
      { title: "Pratik", instruction: "Kullanıcı yön sorsun." },
      { title: "Özet", instruction: "Sprechen tarzı mini sınav; dersi bitir." },
    ],
  },
  {
    id: "a2_l01",
    level: "A2",
    order: 7,
    title: "Geçmiş zaman — tanışma",
    goal: "Geçen hafta sonu ve dün yaptıklarını anlatırsın.",
    phrases: ["gestern", "letztes Wochenende", "Ich habe … gemacht", "Warst du …?"],
    steps: [
      { title: "Isınma", instruction: "A1 tekrar: Wie geht es dir? / Was machst du beruflich?" },
      { title: "Perfekt tanıt", instruction: "Ich habe … gemacht kalıbını öğret; 3 örnek." },
      { title: "Pratik", instruction: "Was hast du gestern gemacht? sor; cevap al." },
      { title: "Özet", instruction: "Mini diyalog; dersi bitir." },
    ],
  },
  {
    id: "a2_l02",
    level: "A2",
    order: 8,
    title: "Randevu & telefon",
    goal: "Telefonda randevu alır veya saat söylersin.",
    phrases: ["Termin", "anrufen", "Können Sie …?", "Am Montag um … Uhr"],
    steps: [
      { title: "Kalıplar", instruction: "Ich möchte einen Termin. / Können Sie …? öğret." },
      { title: "Örnek diyalog", instruction: "Arzt/diş hekimi randevu örneği." },
      { title: "Pratik", instruction: "Öğrenci randevu alsın." },
      { title: "Özet", instruction: "Telefon diyalogu; dersi bitir." },
    ],
  },
  {
    id: "a2_l03",
    level: "A2",
    order: 9,
    title: "Sağlık & doktor",
    goal: "Şikayetini söylersin ve tavsiye anlarsın.",
    phrases: ["Ich habe … Schmerzen", "Mir tut … weh", "zum Arzt", "Medikament"],
    steps: [
      { title: "Kelime", instruction: "Kopf, Bauch, Fieber, Schmerzen kelimeleri." },
      { title: "Kalıp", instruction: "Mir tut der … weh. / Ich habe Fieber." },
      { title: "Pratik", instruction: "Was fehlt Ihnen? rol oyunu." },
      { title: "Özet", instruction: "Doktor diyalogu; dersi bitir." },
    ],
  },
  {
    id: "a2_l04",
    level: "A2",
    order: 10,
    title: "Alışveriş — detay",
    goal: "Beden, renk, değişim talep edersin.",
    phrases: ["Größe", "Farbe", "umtauschen", "Das passt nicht"],
    steps: [
      { title: "Kalıplar", instruction: "Haben Sie das in Größe M? / Ich möchte umtauschen." },
      { title: "Örnekler", instruction: "Mağaza diyalogu 3 tur." },
      { title: "Pratik", instruction: "Öğrenci ürün değiştirsin." },
      { title: "Özet", instruction: "Alışveriş diyalogu; dersi bitir." },
    ],
  },
  {
    id: "a2_l05",
    level: "A2",
    order: 11,
    title: "Restoran",
    goal: "Sipariş verir, hesap istersin.",
    phrases: ["bestellen", "Ich hätte gern …", "Die Rechnung, bitte", "schmeckt"],
    steps: [
      { title: "Menü", instruction: "Ich hätte gern … / Was empfehlen Sie?" },
      { title: "Sipariş", instruction: "2 yemek + içecek sipariş örneği." },
      { title: "Pratik", instruction: "Garson rolü — sipariş al." },
      { title: "Özet", instruction: "Restoran diyalogu; dersi bitir." },
    ],
  },
  {
    id: "a2_l06",
    level: "A2",
    order: 12,
    title: "Ulaşım & seyahat",
    goal: "Bilet alır, gecikme/ankunft konuşursun.",
    phrases: ["Fahrkarte", "Gleis", "Ankunft", "Verspätung", "Anschluss"],
    steps: [
      { title: "Bilet", instruction: "Eine Fahrkarte nach …, bitte." },
      { title: "Durak", instruction: "Wann kommt der Zug? / Verspätung." },
      { title: "Pratik", instruction: "Öğrenci bilet alsın." },
      { title: "Özet", instruction: "İstasyon diyalogu; dersi bitir." },
    ],
  },
  {
    id: "a2_l07",
    level: "A2",
    order: 13,
    title: "Konut & komşu",
    goal: "Ev ve komşuluk konularında konuşursun.",
    phrases: ["Miete", "Nachbar", "Reparatur", "Die Heizung funktioniert nicht"],
    steps: [
      { title: "Ev", instruction: "Ich suche eine Wohnung. / Die Miete ist …" },
      { title: "Sorun", instruction: "Reparatur talebi kalıpları." },
      { title: "Pratik", instruction: "Komşuya/vermiyete mesaj." },
      { title: "Özet", instruction: "Konut diyalogu; dersi bitir." },
    ],
  },
  {
    id: "a2_l08",
    level: "A2",
    order: 14,
    title: "İş görüşmesi",
    goal: "Kendini iş için tanıtırsın.",
    phrases: ["Bewerbung", "Erfahrung", "Stärken", "Ich bin zuverlässig"],
    steps: [
      { title: "Tanışma", instruction: "Erzählen Sie von sich. / Meine Stärken sind …" },
      { title: "Deneyim", instruction: "Ich habe … Jahre Erfahrung." },
      { title: "Pratik", instruction: "Mini Bewerbungsgespräch." },
      { title: "Özet", instruction: "İş görüşmesi; dersi bitir." },
    ],
  },
  {
    id: "a2_l09",
    level: "A2",
    order: 15,
    title: "Hava & plan değişikliği",
    goal: "Hava durumuna göre plan değiştirirsin.",
    phrases: ["Wenn es regnet", "deshalb", "Wir bleiben zu Hause", "Plan ändern"],
    steps: [
      { title: "Hava", instruction: "Es regnet / Es ist sonnig + plan cümleleri." },
      { title: "Wenn", instruction: "Wenn es regnet, bleiben wir …" },
      { title: "Pratik", instruction: "Hafta sonu planı — hava senaryosu." },
      { title: "Özet", instruction: "Plan diyalogu; dersi bitir." },
    ],
  },
  {
    id: "a2_l10",
    level: "A2",
    order: 16,
    title: "Görüş & neden",
    goal: "Fikrini weil/deshalb ile açıklarsın.",
    phrases: ["weil", "deshalb", "Meiner Meinung nach", "Ich finde …"],
    steps: [
      { title: "weil", instruction: "Ich lerne Deutsch, weil … örnekleri." },
      { title: "Meinung", instruction: "Meiner Meinung nach … / Ich finde …" },
      { title: "Pratik", instruction: "Öğrenci fikir + neden söylesin." },
      { title: "Özet", instruction: "Tartışma mini; dersi bitir." },
    ],
  },
  {
    id: "a2_l11",
    level: "A2",
    order: 17,
    title: "Karşılaştırma",
    goal: "İki şeyi karşılaştırırsın.",
    phrases: ["besser als", "mehr als", "genauso … wie", "der Unterschied"],
    steps: [
      { title: "Kalıplar", instruction: "X ist besser als Y. / genauso … wie" },
      { title: "Örnek", instruction: "Berlin vs İstanbul / iki meslek karşılaştır." },
      { title: "Pratik", instruction: "Was ist besser? sor." },
      { title: "Özet", instruction: "Karşılaştırma konuşması; dersi bitir." },
    ],
  },
  {
    id: "a2_l12",
    level: "A2",
    order: 18,
    title: "A2 sınav simülasyonu",
    goal: "A2 Sprechen Teil 1–3 formatında konuşursun.",
    phrases: ["Gemeinsam planen", "Präsentation", "Fragen stellen", "Zusammenfassung"],
    steps: [
      { title: "Teil 1", instruction: "Planlama: gemeinsam etwas planen (ör. doğum günü)." },
      { title: "Teil 2", instruction: "Präsentation: bir fotoğraf/konu anlat (2 dk)." },
      { title: "Teil 3", instruction: "Fragen beantworten — sınav soruları." },
      { title: "Özet", instruction: "Tam A2 Sprechen provası; dersi bitir." },
    ],
  },
];

export function getLessonById(id: string): SpeakLesson | undefined {
  return SPEAK_LESSONS.find((l) => l.id === id);
}

export function getFirstLesson(): SpeakLesson {
  return SPEAK_LESSONS[0];
}

export function resolveCurrentLesson(lessonId: string): SpeakLesson {
  return getLessonById(lessonId) ?? SPEAK_LESSONS[0];
}

export function getNextLesson(afterId: string): SpeakLesson | undefined {
  const idx = SPEAK_LESSONS.findIndex((l) => l.id === afterId);
  if (idx === -1 || idx >= SPEAK_LESSONS.length - 1) return undefined;
  return SPEAK_LESSONS[idx + 1];
}

export function getLessonsForLevel(level: SpeakLevel): SpeakLesson[] {
  return SPEAK_LESSONS.filter((l) => l.level === level);
}

export function formatLessonContext(lesson: SpeakLesson, stepIndex: number): string {
  const step = lesson.steps[stepIndex] ?? lesson.steps[0];
  const total = lesson.steps.length;
  return [
    `DERS: ${lesson.title} (${lesson.level}) — Adım ${stepIndex + 1}/${total}: ${step.title}`,
    `Hedef: ${lesson.goal}`,
    `Bu adımda: ${step.instruction}`,
    `Kalıplar: ${lesson.phrases.join(", ")}`,
  ].join("\n");
}
