/** Tarayıcı localStorage — kullanıcı başına (Chrome, Edge, Safari…) */

export const PROGRESS_STORAGE_KEY = "german-coach-progress";
export const STORAGE_DISMISS_KEY = "german-coach-storage-warn-dismiss";

export { SPEAK_STORAGE_KEY } from "./speakStorage";

export function isBrowserStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const k = "__gc_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function getStorageUsageHint(): string {
  return "İlerlemen bu tarayıcıda saklanır (localStorage). Aynı cihaz ve tarayıcıda kaldığın yerden devam edersin.";
}

export function getStorageWarningText(): string {
  return "Tüm ilerlemeniz (kelimeler, gramer, sınav) bu tarayıcının yerel deposunda tutulur. Tarayıcı verilerini temizlerseniz, gizli mod kullanırsanız veya farklı bir cihaz/tarayıcıya geçerseniz verileriniz kaybolur. API anahtarınız da yalnızca bu cihazda saklanır.";
}

const ROUTE_LABELS: Record<string, string> = {
  "/": "Panel",
  "/review": "Tekrar Motoru",
  "/cards": "Kelime Kartları",
  "/quiz": "Quiz",
  "/listen": "Dinleme",
  "/konus-dinle": "Konuş-Dinle",
  "/speak": "Sınıf",
  "/words": "Kelime Listesi",
  "/mesleki": "Mesleki Almanca",
  "/grundlagen": "A1 Temel Modüller",
  "/grundlagen/zeit": "Zeit Modülü",
  "/grundlagen/zahlen": "Zahlen Modülü",
  "/grundlagen/grammar": "Grammar A1",
  "/grundlagen/satz": "Satz Builder",
  "/grundlagen/artikel": "Artikel Trainer",
  "/grundlagen/dativ": "Dativ Trainer",
  "/grundlagen/negation": "Negation Trainer",
  "/grundlagen/prepositions": "Prepositions Trainer",
  "/grundlagen/conjugation": "Conjugation Matrix",
  "/grundlagen/possessives": "Possessive Trainer",
  "/grundlagen/patterns": "Pattern Trainer",
  "/grundlagen/word-order": "Word Order Trainer",
  "/grundlagen/grammar-pack": "Grammar Pack",
  "/grundlagen/roadmap": "Gramer Yol Haritası",
  "/grundlagen/form": "Goethe Form",
  "/ayarlar": "AI API Ayarları",
  "/blog": "Blog",
  "/iletisim": "İletişim",
  "/kvkk": "KVKK",
  "/gizlilik": "Gizlilik",
  "/cerez": "Çerez Politikası",
  "/kullanim-kosullari": "Kullanım Koşulları",
  "/harita": "Öğrenme Haritası",
  "/exam": "Goethe Sınav",
  "/exam/bilgi": "Sınav Takvimi",
  "/exam/hoeren": "Hören",
  "/exam/lesen": "Lesen",
  "/exam/schreiben": "Schreiben",
  "/exam/sprechen": "Sprechen",
  "/exam/schreiben/gercek": "Schreiben Rehberi",
  "/exam/schreiben/mektup": "Mektup Yaz",
  "/exam/sprechen/gercek": "Sprechen Simülasyonu",
};

export function getRouteLabel(path: string): string {
  if (ROUTE_LABELS[path]) return ROUTE_LABELS[path];
  if (path.startsWith("/exam/practice/")) return "Deneme Sınavı";
  if (path.startsWith("/exam/real/")) return "Gerçek Sınav Modu";
  if (path.startsWith("/a2/")) return "A2 Almanca";
  if (path.startsWith("/words")) return "Kelime Listesi";
  return path;
}
