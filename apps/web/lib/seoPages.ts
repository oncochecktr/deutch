import { pageMetadata } from "@/lib/seo";
import { PAGE_KEYWORDS } from "@/lib/seoKeywords";

/** Merkezi sayfa SEO tanımları — layout.tsx dosyalarında kullanılır */
export const SEO_PAGES = {
  home: pageMetadata({
    title: "Sıfırdan A1 — Ücretsiz Almanca Öğrenme Uygulaması",
    description:
      "German Coach: ücretsiz Almanca A1 uygulaması — 852 kelime kartı, diktat, dinleme, Goethe/TELC sınav hazırlığı, gramer yol haritası. Sıfırdan 3–6 ayda A1.",
    path: "/",
    keywords: [...PAGE_KEYWORDS.home],
  }),
  blog: pageMetadata({
    title: "Blog — Almanca Öğrenme Rehberleri",
    description:
      "Goethe A1, TELC, der die das ve Almanya planı. Sıfırdan Almanca öğrenenler için Türkçe rehber yazıları.",
    path: "/blog",
    keywords: [...PAGE_KEYWORDS.blog],
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
      "Almanca A1 gramer dersleri Türkçe: der die das, fiil çekimi, kelime sırası, dativ. Ücretsiz interaktif alıştırmalar.",
    path: "/grundlagen",
    keywords: [...PAGE_KEYWORDS.grundlagen],
  }),
  roadmap: pageMetadata({
    title: "Gramer Yol Haritası — Sıfırdan A1",
    description:
      "Almanca gramer yol haritası: der/die/das'tan A1 sınavına kadar adım adım ilerleme. Hangi konuyu ne zaman çalışmalısınız?",
    path: "/grundlagen/roadmap",
  }),
  artikel: pageMetadata({
    title: "Artikel Trainer — der, die, das",
    description:
      "Almanca artikel alıştırması: der, die, das, ein/eine ve çoğul. A1 için interaktif artikel drill.",
    path: "/grundlagen/artikel",
  }),
  wordOrder: pageMetadata({
    title: "Word Order Trainer — Kelime Sırası",
    description:
      "Almanca kelime sırası: SVO, Ja/Nein soruları ve W-Fragen. A1 kalıplarıyla interaktif alıştırma.",
    path: "/grundlagen/word-order",
  }),
  cumleMotoru: pageMetadata({
    title: "Kelime Oyunu — Cümle Hafızası",
    description:
      "852 A1 kelimeyi cümle oyunu ile öğren: dinle, yaz, puan kazan. Duolingo alternatifi Türkçe Almanca uygulama.",
    path: "/grundlagen/cumle-motoru",
    keywords: [...PAGE_KEYWORDS.cumleMotoru],
  }),
  exam: pageMetadata({
    title: "A1 Sınav Merkezi — Goethe · TELC · ÖSD · DTZ",
    description:
      "Goethe A1, TELC A1, ÖSD ve DTZ sınav simülasyonu: dinleme, okuma, yazma, konuşma. Ücretsiz deneme modülleri.",
    path: "/exam",
    keywords: [...PAGE_KEYWORDS.exam],
  }),
  cards: pageMetadata({
    title: "Kelime Kartları — A1 Almanca Flashcard",
    description:
      "Ücretsiz Almanca A1 flashcard: 852 kelime, Türkçe anlam, sesli dinleme. Kelime ezberleme ve SRS tekrar.",
    path: "/cards",
    keywords: [...PAGE_KEYWORDS.cards],
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
      "Almanca konuşma pratiği: dinle, tekrar et, telaffuz geri bildirimi. A1 konuşma kursu online ücretsiz.",
    path: "/konus-dinle",
    keywords: [...PAGE_KEYWORDS.konusDinle],
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
  listen: pageMetadata({
    title: "Dinle — Yürüyüş Dinleme Modu",
    description:
      "Almanca dinleme pratiği A1: 852 kelime MP3, yürürken dinle. Telaffuz ve kulak eğitimi ücretsiz.",
    path: "/listen",
    keywords: [...PAGE_KEYWORDS.listen],
  }),
  words: pageMetadata({
    title: "Kelime Listesi — A1 Almanca",
    description: "Almanca A1 kelime listesi: Türkçe anlamlar, artikel ve kategoriler.",
    path: "/words",
  }),
  quiz: pageMetadata({
    title: "Quiz — Almanca Kelime Testi",
    description: "A1 Almanca kelime quizi: çoktan seçmeli test ile bilginizi ölçün.",
    path: "/quiz",
  }),
  review: pageMetadata({
    title: "Tekrar — SRS Kelime Tekrarı",
    description: "Aralıklı tekrar (SRS) ile A1 Almanca kelimeleri pekiştirin.",
    path: "/review",
  }),
  mesleki: pageMetadata({
    title: "Mesleki Almanca — İş ve Lojistik",
    description: "Depo, lojistik ve iş yerinde Almanca: mesleki kelime kartları ve dinleme.",
    path: "/mesleki",
  }),
  dialogues: pageMetadata({
    title: "Hikayeler — A1 Diyaloglar",
    description: "Almanca A1 diyalogları okuyun ve dinleyin. Günlük konuşma pratiği.",
    path: "/dialogues",
  }),
  diktat: pageMetadata({
    title: "Diktat — Almanca Dinle Yaz",
    description:
      "Almanca diktat ve yazma pratiği: haben/sehen, ein/eine/einen. Serbest defter + akıllı tekrar. 852 kelime yan listede.",
    path: "/diktat",
    keywords: [...PAGE_KEYWORDS.diktat],
  }),
  ozellikler: pageMetadata({
    title: "Tüm Özellikler — German Coach Modülleri",
    description:
      "German Coach özellik listesi: kelime kartları, diktat, gramer, konuşma, sınav simülasyonu ve daha fazlası. Tıkla, modüle git.",
    path: "/ozellikler",
    keywords: [...PAGE_KEYWORDS.home],
  }),
  sentenceEngine: pageMetadata({
    title: "Sentence Engine — 20 Cümle Kalıbı",
    description:
      "Almanca cümle motoru: Artikel + İsim, Artikel + Sıfat + İsim, W-Frage ve daha fazlası. German Coach Pattern 01–10.",
    path: "/grundlagen/sentence-engine",
    keywords: [...PAGE_KEYWORDS.grundlagen],
  }),
  adjektivEngine: pageMetadata({
    title: "Adjective Engine — Artikel + Sıfat + İsim",
    description:
      "der große Bahnhof, die nächste Apotheke: Almanca sıfat çekimi Lego oyunu. Pattern 02 otomatik cümle üretir.",
    path: "/grundlagen/sentence-engine/adjektiv",
    keywords: [...PAGE_KEYWORDS.grundlagen],
  }),
} as const;
