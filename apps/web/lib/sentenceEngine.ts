export type SentencePatternId =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";

export type SentencePatternStatus = "active" | "soon";

export interface SentencePattern {
  id: SentencePatternId;
  order: number;
  title_de: string;
  title_tr: string;
  formula: string;
  example_de: string;
  example_tr: string;
  href: string | null;
  status: SentencePatternStatus;
  relatedHrefs?: string[];
}

export const SENTENCE_PATTERNS: SentencePattern[] = [
  {
    id: "01",
    order: 1,
    title_de: "Artikel + Nomen",
    title_tr: "Artikel + İsim",
    formula: "der / die / das + İsim",
    example_de: "der Bahnhof",
    example_tr: "tren istasyonu",
    href: "/grundlagen/wo-ist",
    status: "active",
  },
  {
    id: "02",
    order: 2,
    title_de: "Artikel + Adjektiv + Nomen",
    title_tr: "Artikel + Sıfat + İsim",
    formula: "der + große + Bahnhof",
    example_de: "der große Bahnhof",
    example_tr: "büyük tren istasyonu",
    href: "/grundlagen/sentence-engine/adjektiv",
    status: "active",
  },
  {
    id: "03",
    order: 3,
    title_de: "Das ist → Er / Es / Sie",
    title_tr: "Tanıştır + yorum",
    formula: "Das ist ein Hotel. Es ist sehr schön.",
    example_de: "Das ist ein Supermarkt. Er ist sehr gut.",
    example_tr: "Bu bir süpermarket. Çok iyi.",
    href: "/grundlagen/sentence-engine/das-ist",
    status: "active",
  },
  {
    id: "12",
    order: 4,
    title_de: "Das ist mein → Er / Es / Sie",
    title_tr: "Sahiplik + yorum",
    formula: "Das ist mein Zimmer. Es ist sehr groß.",
    example_de: "Das ist unser Zimmer. Es ist sehr klein.",
    example_tr: "Bu bizim odamız. Çok küçük.",
    href: "/grundlagen/sentence-engine/das-ist-mein",
    status: "active",
  },
  {
    id: "04",
    order: 5,
    title_de: "Pronomen + Verb",
    title_tr: "Özne + Fiil",
    formula: "Ich + arbeite",
    example_de: "Ich arbeite.",
    example_tr: "Çalışıyorum.",
    href: "/grundlagen/conjugation",
    status: "active",
    relatedHrefs: ["/grundlagen/patterns"],
  },
  {
    id: "05",
    order: 5,
    title_de: "Modal + Infinitiv",
    title_tr: "Modal fiil + mastar",
    formula: "Ich + möchte + schlafen",
    example_de: "Ich möchte schlafen.",
    example_tr: "Uyumak istiyorum.",
    href: "/grundlagen/conjugation",
    status: "active",
  },
  {
    id: "06",
    order: 6,
    title_de: "Verb + Akkusativ",
    title_tr: "Fiil + akkusativ nesne",
    formula: "Ich + sehe + einen Mann",
    example_de: "Ich sehe einen Mann.",
    example_tr: "Bir adam görüyorum.",
    href: "/diktat",
    status: "active",
    relatedHrefs: ["/grundlagen/artikel"],
  },
  {
    id: "07",
    order: 7,
    title_de: "W-Frage",
    title_tr: "W-Frage",
    formula: "Wo + ist + …?",
    example_de: "Wo ist der Bahnhof?",
    example_tr: "Tren istasyonu nerede?",
    href: "/grundlagen/wo-ist",
    status: "active",
  },
  {
    id: "08",
    order: 8,
    title_de: "Ja/Nein-Frage",
    title_tr: "Evet/hayır sorusu",
    formula: "Ist + das + gut?",
    example_de: "Ist das gut?",
    example_tr: "Bu iyi mi?",
    href: "/grundlagen/word-order",
    status: "active",
  },
  {
    id: "09",
    order: 9,
    title_de: "Negation",
    title_tr: "Olumsuzluk",
    formula: "nicht / kein",
    example_de: "Ich habe kein Auto.",
    example_tr: "Arabam yok.",
    href: "/grundlagen/negation",
    status: "active",
  },
  {
    id: "10",
    order: 10,
    title_de: "Dativ",
    title_tr: "Dativ kalıbı",
    formula: "mit + dem Freund",
    example_de: "mit dem Freund",
    example_tr: "arkadaşla",
    href: "/grundlagen/dativ",
    status: "active",
  },
  {
    id: "11",
    order: 11,
    title_de: "Es gibt",
    title_tr: "Var (es gibt)",
    formula: "Es + gibt + …",
    example_de: "Es gibt einen Park.",
    example_tr: "Bir park var.",
    href: "/grundlagen/patterns",
    status: "active",
  },
];

export function getSentencePattern(id: SentencePatternId): SentencePattern | undefined {
  return SENTENCE_PATTERNS.find((p) => p.id === id);
}

export function getActivePatterns(): SentencePattern[] {
  return SENTENCE_PATTERNS.filter((p) => p.status === "active");
}
