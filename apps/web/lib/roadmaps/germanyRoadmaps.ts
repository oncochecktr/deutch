export type GermanyRoadmapSlug = "ogrenci" | "goc";

export interface GermanyRoadmapStep {
  id: string;
  level: string;
  title: string;
  summary: string;
  requirements: string[];
  nextAction: string;
}

export interface GermanyRoadmap {
  slug: GermanyRoadmapSlug;
  eyebrow: string;
  title: string;
  subtitle: string;
  audience: string;
  status: string;
  steps: GermanyRoadmapStep[];
}

export const GERMANY_ROADMAPS: Record<GermanyRoadmapSlug, GermanyRoadmap> = {
  ogrenci: {
    slug: "ogrenci",
    eyebrow: "Öğrenci yol haritası",
    title: "Almanya'da öğrencilik seçenekleri",
    subtitle:
      "Dil kursundan doktoraya kadar yolları küçükten büyüğe sırala. Hangi rota sana yakın, hangi belge sonra gelir netleşsin.",
    audience: "Dil öğrenen, okul düşünen, başvuru yolunu görmek isteyenler",
    status: "İlk taslak",
    steps: [
      {
        id: "language-course",
        level: "Başlangıç",
        title: "Dil kursu",
        summary: "A1-B1 arası temel kurulur; günlük yaşam, sınav ve okul başvurusu için zemin hazırlar.",
        requirements: ["Pasaport", "Kurs kabulü", "Konaklama planı", "Temel bütçe"],
        nextAction: "Önce A1-A2 hedefini ve haftalık çalışma saatini belirle.",
      },
      {
        id: "erasmus",
        level: "Kısa dönem",
        title: "Erasmus / değişim",
        summary: "Kayıtlı olduğun okul üzerinden kısa süreli Almanya deneyimi sağlar.",
        requirements: ["Mevcut üniversite kaydı", "Okul anlaşması", "Not ortalaması", "Dil belgesi"],
        nextAction: "Kendi okulunun Erasmus ofisinden Almanya anlaşmalarını kontrol et.",
      },
      {
        id: "studienkolleg",
        level: "Hazırlık",
        title: "Studienkolleg",
        summary: "Lisans öncesi akademik hazırlık yoludur; okul denkliği ve dil seviyesi önemlidir.",
        requirements: ["Lise diploması", "Transkript", "B1-B2 Almanca", "Giriş sınavı hazırlığı"],
        nextAction: "Diplomanın doğrudan lisansa yetip yetmediğini kontrol et.",
      },
      {
        id: "bachelor",
        level: "Üniversite",
        title: "Lisans",
        summary: "Almanya'da normal üniversite eğitimi; çoğu bölümde güçlü Almanca ister.",
        requirements: ["Okul denkliği", "Dil belgesi", "Başvuru dosyası", "Finans kanıtı"],
        nextAction: "Hedef bölüm ve şehir listesi çıkar.",
      },
      {
        id: "master",
        level: "İleri",
        title: "Yüksek lisans",
        summary: "Mevcut lisansını Almanya'da uzmanlaşmaya çevirir; bazı programlar İngilizce olabilir.",
        requirements: ["Lisans diploması", "Transkript", "Dil belgesi", "Motivasyon metni"],
        nextAction: "Program dilini, kabul şartlarını ve son başvuru tarihini yan yana yaz.",
      },
      {
        id: "phd",
        level: "Akademik",
        title: "Doktora",
        summary: "Araştırma odaklı en ileri rota; danışman, proje ve akademik geçmiş belirleyicidir.",
        requirements: ["Yüksek lisans", "Araştırma önerisi", "Danışman bağlantısı", "Akademik CV"],
        nextAction: "Araştırma alanını ve potansiyel danışman listesini oluştur.",
      },
    ],
  },
  goc: {
    slug: "goc",
    eyebrow: "Göç yol haritası",
    title: "Almanya'ya yerleşme rotaları",
    subtitle:
      "Dil, meslek, denklik, iş arama ve ilk kayıt adımlarını sıraya koy. Bu alanı birlikte derinleştireceğiz.",
    audience: "Çalışma, aile, meslek veya uzun süreli yaşam planı yapanlar",
    status: "Yakında detaylanacak",
    steps: [
      {
        id: "language",
        level: "Temel",
        title: "Dil ve günlük yaşam",
        summary: "A1-A2 günlük işleri kolaylaştırır; B1 resmi süreç ve iş görüşmeleri için güç verir.",
        requirements: ["A1 planı", "Günlük kelime rutini", "Dinleme-konuşma pratiği"],
        nextAction: "Her gün 20 dakika kart ve 10 dakika dinleme rutini kur.",
      },
      {
        id: "profession",
        level: "Meslek",
        title: "Meslek profili",
        summary: "Deneyim, diploma ve hedef meslek netleşmeden başvuru yolu bulanık kalır.",
        requirements: ["CV", "Diploma", "İş deneyimi", "Hedef meslek listesi"],
        nextAction: "Kendi mesleğini Almanca adıyla ve olası iş ilanlarıyla eşleştir.",
      },
      {
        id: "recognition",
        level: "Denklik",
        title: "Denklik ve belgeler",
        summary: "Bazı mesleklerde denklik gerekir; bazı alanlarda deneyim ve iş teklifi daha önemlidir.",
        requirements: ["Diploma çevirisi", "Transkript", "Meslek dökümü", "Yetkili kurum kontrolü"],
        nextAction: "Mesleğinin regüle olup olmadığını kontrol edilecek listeye al.",
      },
      {
        id: "job-city",
        level: "Başvuru",
        title: "İş ve şehir seçimi",
        summary: "Şehir, sektör ve maaş beklentisi birlikte düşünülür; tek bir ilanla karar verilmez.",
        requirements: ["Almanca CV", "İlan listesi", "Şehir bütçesi", "Konaklama fikri"],
        nextAction: "3 şehir ve 10 ilanlık ilk deneme listesi çıkar.",
      },
      {
        id: "arrival",
        level: "Uyum",
        title: "İlk kayıtlar",
        summary: "Adres kaydı, banka, sigorta ve randevular yerleşmenin ilk pratik adımlarıdır.",
        requirements: ["Adres", "Randevu planı", "Sigorta", "Bütçe takibi"],
        nextAction: "Varış sonrası ilk 14 gün kontrol listesi hazırlanacak.",
      },
    ],
  },
};

export function getGermanyRoadmap(slug: GermanyRoadmapSlug) {
  return GERMANY_ROADMAPS[slug];
}
