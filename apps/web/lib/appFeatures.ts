import type { NavIconKey } from "@/components/icons";

export type AppFeatureCategory =
  | "kelime"
  | "yazma"
  | "gramer"
  | "konusma"
  | "sinav"
  | "rehber";

export interface AppFeature {
  id: string;
  href: string;
  title: string;
  description: string;
  category: AppFeatureCategory;
  icon: NavIconKey;
  badge?: string;
}

export const APP_FEATURE_CATEGORIES: {
  id: AppFeatureCategory;
  label: string;
  description: string;
}[] = [
  { id: "kelime", label: "Kelime & hafıza", description: "Ezber, dinleme, tekrar" },
  { id: "yazma", label: "Yazma", description: "Diktat ve cümle kurma" },
  { id: "gramer", label: "Gramer", description: "A1 kuralları ve drill" },
  { id: "konusma", label: "Konuşma", description: "Telaffuz ve diyalog" },
  { id: "sinav", label: "Sınav", description: "Goethe · TELC · ÖSD" },
  { id: "rehber", label: "Yolculuk", description: "Harita, blog, mesleki" },
];

/** Tüm uygulama özellikleri — tıklanınca ilgili sayfaya gider */
export const APP_FEATURES: AppFeature[] = [
  // Kelime
  {
    id: "cards",
    href: "/cards",
    title: "Kelime kartları",
    description: "852 A1 flashcard · Türkçe anlam · sesli dinleme",
    category: "kelime",
    icon: "cards",
    badge: "852",
  },
  {
    id: "cumle-motoru",
    href: "/grundlagen/cumle-motoru",
    title: "Kelime Oyunu",
    description: "Cümle hafızası · puan · streak · profil",
    category: "kelime",
    icon: "cards",
  },
  {
    id: "listen",
    href: "/listen",
    title: "Dinle",
    description: "Yürürken dinleme · MP3 · Media Session",
    category: "kelime",
    icon: "listen",
  },
  {
    id: "review",
    href: "/review",
    title: "Tekrar motoru",
    description: "SRS aralıklı tekrar · bekleyen kelimeler",
    category: "kelime",
    icon: "review",
  },
  {
    id: "quiz",
    href: "/quiz",
    title: "Quiz",
    description: "Çoktan seçmeli kelime testi",
    category: "kelime",
    icon: "cards",
  },
  {
    id: "words",
    href: "/words",
    title: "Kelime listesi",
    description: "Ara · filtrele · kategoriye göre incele",
    category: "kelime",
    icon: "list",
  },
  // Yazma
  {
    id: "diktat",
    href: "/diktat",
    title: "Diktat",
    description: "Serbest yazma defteri · 852 kelime paneli · akıllı tekrar",
    category: "yazma",
    icon: "list",
  },
  {
    id: "satz",
    href: "/grundlagen/satz",
    title: "Satz Builder",
    description: "Kelime parçalarından A1 cümlesi kur",
    category: "yazma",
    icon: "exam",
  },
  // Gramer
  {
    id: "grundlagen",
    href: "/grundlagen",
    title: "Gramer modülleri",
    description: "Tüm A1 gramer setlerine giriş",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "sentence-engine",
    href: "/grundlagen/sentence-engine",
    title: "Sentence Engine",
    description: "20 cümle kalıbı — Adjective Engine Pattern 02",
    category: "gramer",
    icon: "exam",
    badge: "Yeni",
  },
  {
    id: "das-ist-mein",
    href: "/grundlagen/sentence-engine/das-ist-mein",
    title: "Das ist mein → Er/Es/Sie",
    description: "benim · bizim · onların · iki satır",
    category: "gramer",
    icon: "exam",
    badge: "P03+",
  },
  {
    id: "das-ist",
    href: "/grundlagen/sentence-engine/das-ist",
    title: "Das ist → Er/Es/Sie",
    description: "Pattern 03: tanıştır + yorum · iki satır",
    category: "gramer",
    icon: "exam",
    badge: "P03",
  },
  {
    id: "adjektiv-engine",
    href: "/grundlagen/sentence-engine/adjektiv",
    title: "Adjective Engine",
    description: "Artikel + Sıfat + İsim · Lego · otomatik üretim",
    category: "gramer",
    icon: "exam",
    badge: "P02",
  },
  {
    id: "wo-ist",
    href: "/grundlagen/wo-ist",
    title: "Wo ist …?",
    description: "Pattern 01: Wo + ist + der/die/das + ?",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "word-order",
    href: "/grundlagen/word-order",
    title: "Kelime sırası",
    description: "SVO · Ja/Nein · W-Fragen · 100+ drill",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "artikel",
    href: "/grundlagen/artikel",
    title: "Artikel",
    description: "der · die · das · ein/eine drill",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "artikel-oyun",
    href: "/grundlagen/artikel/oyun",
    title: "Artikel Oyunu",
    description: "Sesle dinle · der/die/das seç · 15 soru ezber",
    category: "gramer",
    icon: "exam",
    badge: "Oyun",
  },
  {
    id: "conjugation",
    href: "/grundlagen/conjugation",
    title: "Fiil çekimi",
    description: "A1 fiilleri + Modalverben matrisi",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "patterns",
    href: "/grundlagen/patterns",
    title: "Kalıp trainer",
    description: "52 A1 kalıbı · kelime kelime breakdown",
    category: "gramer",
    icon: "exam",
    badge: "52",
  },
  {
    id: "possessives",
    href: "/grundlagen/possessives",
    title: "Sahiplik",
    description: "mein/dein · der/die/das uyumu",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "dativ",
    href: "/grundlagen/dativ",
    title: "Dativ",
    description: "mit · bei · in · zu/nach kalıpları",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "negation",
    href: "/grundlagen/negation",
    title: "Olumsuzluk",
    description: "kein/keine/keinen · nicht pozisyonu",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "prepositions",
    href: "/grundlagen/prepositions",
    title: "Yer edatları",
    description: "in · auf · an · bei · mit",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "grammar-pack",
    href: "/grundlagen/grammar-pack",
    title: "Grammar Pack",
    description: "A1 gramer paketi · quiz bölümleri",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "zeit",
    href: "/grundlagen/zeit",
    title: "Zeit",
    description: "Saat, gün, ay · zaman ifadeleri",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "zahlen",
    href: "/grundlagen/zahlen",
    title: "Zahlen",
    description: "Sayılar ve temel matematik Almanca",
    category: "gramer",
    icon: "exam",
  },
  {
    id: "roadmap",
    href: "/grundlagen/roadmap",
    title: "Gramer yol haritası",
    description: "24 A1 kuralı · sırayla ilerle",
    category: "gramer",
    icon: "list",
  },
  // Konuşma
  {
    id: "konus-dinle",
    href: "/konus-dinle",
    title: "Konuş-Dinle",
    description: "Dinle · tekrar et · telaffuz antrenmanı",
    category: "konusma",
    icon: "konusDinle",
  },
  {
    id: "speak",
    href: "/speak",
    title: "Sınıf",
    description: "Profesör ile AI destekli ders ve alıştırma",
    category: "konusma",
    icon: "speak",
  },
  {
    id: "dialogues",
    href: "/dialogues",
    title: "Hikayeler",
    description: "A1–B1 diyalog okuma ve dinleme",
    category: "konusma",
    icon: "cards",
  },
  // Sınav
  {
    id: "exam",
    href: "/exam",
    title: "Sınav merkezi",
    description: "Goethe · TELC · ÖSD · DTZ hazırlık",
    category: "sinav",
    icon: "exam",
  },
  {
    id: "exam-hoeren",
    href: "/exam/hoeren",
    title: "Hören",
    description: "Dinleme sınav modülü",
    category: "sinav",
    icon: "listen",
  },
  {
    id: "exam-lesen",
    href: "/exam/lesen",
    title: "Lesen",
    description: "Okuma sınav modülü",
    category: "sinav",
    icon: "list",
  },
  {
    id: "exam-schreiben",
    href: "/exam/schreiben",
    title: "Schreiben",
    description: "Yazma sınav modülü · mektup rehberi",
    category: "sinav",
    icon: "list",
  },
  {
    id: "exam-sprechen",
    href: "/exam/sprechen",
    title: "Sprechen",
    description: "Konuşma sınav simülasyonu",
    category: "sinav",
    icon: "konusDinle",
  },
  {
    id: "exam-bilgi",
    href: "/exam/bilgi",
    title: "Sınav takvimi",
    description: "Tarihler · kayıt · hazırlık bilgisi",
    category: "sinav",
    icon: "exam",
  },
  // Rehber
  {
    id: "harita",
    href: "/harita",
    title: "Öğrenme haritası",
    description: "Kelime · gramer · sınav ilerlemesi tek ekranda",
    category: "rehber",
    icon: "list",
  },
  {
    id: "mesleki",
    href: "/mesleki",
    title: "Mesleki Almanca",
    description: "İş ve lojistik kelime kartları",
    category: "rehber",
    icon: "mesleki",
  },
  {
    id: "blog",
    href: "/blog",
    title: "Blog",
    description: "Goethe A1 · der/die/das · Almanya planı rehberleri",
    category: "rehber",
    icon: "list",
  },
];

export function getFeaturesByCategory(category: AppFeatureCategory): AppFeature[] {
  return APP_FEATURES.filter((f) => f.category === category);
}

export function getFeatureByHref(href: string): AppFeature | undefined {
  return APP_FEATURES.find((f) => f.href === href);
}
