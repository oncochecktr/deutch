export type CEFRLevel = "A1" | "A2" | "B1";

export type Article = "der" | "die" | "das" | null;

export interface VocabularyWord {
  id: string;
  level: CEFRLevel;
  category: string;
  word: string;
  article: Article;
  plural: string | null;
  translation_tr: string;
  translation_ru: string;
  example_de: string;
  example_tr: string;
  audio_word: string;
  audio_example: string;
  tags: string[];
}

export interface VocabularyPack {
  level: CEFRLevel;
  version: string;
  total: number;
  categories: string[];
  words: VocabularyWord[];
}

export const CATEGORIES_A1 = [
  "Selamlama",
  "Tanışma",
  "Aile",
  "Ev",
  "Market",
  "İş",
  "Ulaşım",
  "Saat",
  "Tarih",
  "Doktor",
  "Restoran",
  "Telefon",
  "Form doldurma",
  "Günlük ihtiyaçlar",
  "Basit yön tarifleri",
] as const;

export const CATEGORIES_TIMUR = [
  "Depo",
  "Lojistik",
  "Kommissionierung",
  "Vardiya & Mesai",
  "Maaş & Sözleşme",
  "İş güvenliği",
  "Forklift & Ekipman",
  "Şefle iletişim",
] as const;

export const CATEGORIES_A2 = [
  "Seyahat",
  "Alışveriş & Hizmetler",
  "Sağlık",
  "İş & Kariyer",
  "Günlük rutin",
  "Hava & Doğa",
  "Duygular",
  "Geçmiş zaman",
] as const;

export type A1Category = (typeof CATEGORIES_A1)[number];
export type A2Category = (typeof CATEGORIES_A2)[number];
export type TimurCategory = (typeof CATEGORIES_TIMUR)[number];
