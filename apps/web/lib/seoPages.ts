import { pageMetadata } from "@/lib/seo";

/** Merkezi sayfa SEO tanımları — layout.tsx dosyalarında kullanılır */
export const SEO_PAGES = {
  home: pageMetadata({
    title: "Sıfırdan Goethe A1 — Ücretsiz Almanca Öğrenme",
    description:
      "German Coach ile sıfırdan Almanca A1: kelime kartları, gramer yol haritası, Goethe sınav simülasyonu ve konuşma pratiği. 3–6 ayda A1 hedefi.",
    path: "/",
  }),
  blog: pageMetadata({
    title: "Blog — Almanca Öğrenme Rehberleri",
    description:
      "Goethe A1 hazırlık, der die das rehberi ve Almanya planı. Sıfırdan Almanca öğrenenler için Türkçe blog yazıları.",
    path: "/blog",
  }),
  iletisim: pageMetadata({
    title: "İletişim",
    description:
      "German Coach ile iletişime geçin. Almanca A1 platformu hakkında sorularınız, önerileriniz ve iş birlikleri için e-posta veya WhatsApp.",
    path: "/iletisim",
  }),
  ayarlar: pageMetadata({
    title: "AI API Ayarları",
    description: "Profesör modülü için kişisel AI API anahtarı ayarları.",
    path: "/ayarlar",
    noindex: true,
  }),
  grundlagen: pageMetadata({
    title: "Gramer Modülleri — A1 Temel Bilgiler",
    description:
      "Almanca A1 gramer: artikel, fiil çekimi, kelime sırası, dativ, edatlar ve daha fazlası. Türkçe açıklamalı interaktif dersler.",
    path: "/grundlagen",
  }),
  roadmap: pageMetadata({
    title: "Gramer Yol Haritası — Sıfırdan A1",
    description:
      "Almanca gramer yol haritası: der/die/das'tan Goethe A1 sınavına kadar adım adım ilerleme. Hangi konuyu ne zaman çalışmalısınız?",
    path: "/grundlagen/roadmap",
  }),
  artikel: pageMetadata({
    title: "Artikel Trainer — der, die, das",
    description:
      "Almanca artikel alıştırması: der, die, das, ein/eine ve çoğul. Goethe A1 için interaktif artikel drill.",
    path: "/grundlagen/artikel",
  }),
  wordOrder: pageMetadata({
    title: "Word Order Trainer — Kelime Sırası",
    description:
      "Almanca kelime sırası: SVO, Ja/Nein soruları ve W-Fragen. Goethe A1 kalıplarıyla interaktif alıştırma.",
    path: "/grundlagen/word-order",
  }),
  exam: pageMetadata({
    title: "A1 Sınav Merkezi — Goethe · TELC · ÖSD",
    description:
      "Goethe A1 sınav simülasyonu: dinleme, okuma, yazma ve konuşma modülleri. Gerçek sınav formatında pratik.",
    path: "/exam",
  }),
  cards: pageMetadata({
    title: "Kelime Kartları — A1 Almanca",
    description:
      "Almanca A1 kelime kartları: görsel flashcard ile kelime öğrenin. Goethe A1 kelime hazırlığı.",
    path: "/cards",
  }),
  speak: pageMetadata({
    title: "Sınıf — Profesör ile Almanca Dersi",
    description:
      "German Coach Sınıf modülü: yapay zeka destekli Profesör ile A1/A2 Almanca konuşma ve gramer dersleri.",
    path: "/speak",
  }),
  konusDinle: pageMetadata({
    title: "Konuş-Dinle — Almanca Konuşma Pratiği",
    description:
      "Dinle, tekrar et, geri bildirim al. A1'den B1'e Almanca konuşma antrenmanı ve telaffuz pratiği.",
    path: "/konus-dinle",
  }),
  harita: pageMetadata({
    title: "Öğrenme Haritası",
    description:
      "Almanca öğrenme haritası: kelime, gramer ve sınav ilerlemenizi tek ekranda görün. A1'den B1'e yolculuk.",
    path: "/harita",
  }),
  kvkk: pageMetadata({
    title: "KVKK Aydınlatma Metni",
    description:
      "German Coach KVKK aydınlatma metni: kişisel verilerin işlenmesi, saklanması ve haklarınız hakkında bilgi.",
    path: "/kvkk",
  }),
  gizlilik: pageMetadata({
    title: "Gizlilik Politikası",
    description:
      "German Coach gizlilik politikası: veri saklama, tarayıcı deposu ve üçüncü taraf hizmetler hakkında bilgi.",
    path: "/gizlilik",
  }),
  cerez: pageMetadata({
    title: "Çerez Politikası",
    description: "German Coach çerez politikası ve web sitesinde kullanılan çerezler hakkında bilgi.",
    path: "/cerez",
  }),
  kullanim: pageMetadata({
    title: "Kullanım Koşulları",
    description:
      "German Coach kullanım koşulları: platform kullanımı, eğitim içeriği ve sorumluluk sınırları.",
    path: "/kullanim-kosullari",
  }),
  examSession: pageMetadata({
    title: "Sınav Oturumu",
    description: "A1 sınav pratiği oturumu.",
    path: "/exam",
    noindex: true,
  }),
} as const;
