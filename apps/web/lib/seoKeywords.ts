/** Sayfa bazlı SEO anahtar kelimeleri — site.ts ile birleştirilir */

export const PAGE_KEYWORDS = {
  home: [
    "almanca öğrenme uygulaması",
    "ücretsiz almanca kursu",
    "sıfırdan almanca",
    "almanca a1 ücretsiz",
    "goethe a1 hazırlık",
    "telc a1 türkiye",
    "almanca kelime kartı",
    "almanca gramer türkçe",
  ],
  cards: [
    "almanca flashcard",
    "almanca kelime ezberleme",
    "a1 kelime listesi",
    "almanca kelime kartları ücretsiz",
    "anki alternatif almanca",
  ],
  listen: [
    "almanca dinleme pratiği",
    "almanca dinleme a1",
    "yürüyüş dinleme almanca",
    "almanca telaffuz dinle",
  ],
  diktat: [
    "almanca dikte",
    "almanca dinle yaz",
    "diktat almanca a1",
    "almanca yazma pratiği",
    "haben sehen almanca",
    "ein eine einen",
  ],
  cumleMotoru: [
    "almanca cümle kurma",
    "almanca kelime oyunu",
    "almanca cümle ezberleme",
    "a1 cümle kalıpları",
  ],
  exam: [
    "goethe a1 sınavı",
    "telc a1 deneme",
    "ösd a1 hazırlık",
    "dtz sınavı almanca",
    "a1 sınav simülasyonu",
  ],
  grundlagen: [
    "almanca gramer dersleri",
    "der die das almanca",
    "almanca fiil çekimi",
    "a1 gramer türkçe",
  ],
  konusDinle: [
    "almanca konuşma pratiği",
    "almanca konuş öğren",
    "telaffuz çalışması almanca",
    "almanca tekrar et",
  ],
  blog: [
    "almanca öğrenme rehberi",
    "almanya a1 planı",
    "goethe sınav ipuçları",
  ],
} as const;

/** Tüm sayfalarda kullanılan geniş anahtar kelime havuzu */
export const SITE_KEYWORDS_EXTENDED: string[] = [
  // Temel arama
  "Almanca kursu",
  "Almanca öğren",
  "Almanca öğrenme",
  "Almanca öğrenme uygulaması",
  "ücretsiz Almanca öğrenme",
  "ücretsiz Almanca kursu",
  "Almanca online",
  "Almanca online kurs",
  "Almanca başlangıç",
  "sıfırdan Almanca",
  "sıfır Almanca",
  "Almanca A1",
  "Almanca A1 ücretsiz",
  "A1 Almanca",
  // Sınav markaları (aranan terimler)
  "Goethe A1",
  "Goethe Institut A1",
  "Goethe Zertifikat A1",
  "TELC A1",
  "TELC Deutsch A1",
  "TELC A1 hazırlık",
  "ÖSD A1",
  "DTZ Almanca",
  "A1 sınav hazırlığı",
  "Almanca A1 sınavı",
  "A1 sınav Türkiye",
  "Almanya A1 sınavı",
  // Beceriler
  "Almanca kelime",
  "Almanca kelime kartları",
  "Almanca kelime ezberleme",
  "Almanca gramer",
  "Almanca gramer Türkçe",
  "der die das",
  "Almanca dinleme A1",
  "Almanca dinleme pratiği",
  "Almanca dikte",
  "Almanca konuşma pratiği",
  "Almanca yazma pratiği",
  "Almanca telaffuz",
  "Almanca cümle kurma",
  "Almanca kelime oyunu",
  // Hedef kitle
  "Almanya'ya gitmek için Almanca",
  "Almanya göç Almanca",
  "iş için Almanca A1",
  "Almanca işçi",
  "Almanya 3 ay Almanca",
  // Rakip / alternatif aramalar (organik)
  "Duolingo Almanca alternatif",
  "Babbel alternatif Türkçe",
  "Almanca uygulama Türkçe",
  "Almanca flashcard",
  // Almanca arama (diaspora)
  "Deutsch lernen A1",
  "Deutsch A1 kostenlos",
];

export function mergeKeywords(...groups: (readonly string[])[]): string[] {
  return [...new Set(groups.flat())];
}
