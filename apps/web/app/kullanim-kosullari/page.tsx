import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SEO_PAGES } from "@/lib/seoPages";
import { SITE_EMAIL } from "@/lib/site";

export const metadata = SEO_PAGES.kullanim;

export default function KullanimKosullariPage() {
  return (
    <PageShell title="Kullanım Koşulları" backHref="/" maxWidth="md">
      <article className="prose-sage space-y-4 text-base leading-relaxed text-sage-700">
        <p className="text-sm text-sage-500">Son güncelleme: Haziran 2025</p>

        <p>
          German Coach (germancoach.app) web sitesini ve uygulamasını kullanarak aşağıdaki koşulları
          kabul etmiş sayılırsınız.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">Hizmetin niteliği</h2>
        <p>
          Platform, Almanca A1 seviyesine hazırlık için eğitim içeriği, alıştırmalar ve sınav
          simülasyonu sunar. Resmi A1 sınavı veya sertifika programı değildir (TELC, ÖSD vb.); sertifika vermez.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">İçerik ve doğruluk</h2>
        <p>
          İçerikler eğitim amaçlıdır; hata veya eksiklik olabilir. Sınav başarısı garanti edilmez.
          Kritik kararlar için resmi kaynaklara ve öğretmen desteğine başvurun.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">AI API anahtarı (BYOK)</h2>
        <p>
          Sınıf modülünde kendi API anahtarınızı kullanırsanız, kullanım ücretleri ve sağlayıcı
          koşulları size aittir. Anahtarınızın güvenliğinden siz sorumlusunuz.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">Sorumluluk sınırı</h2>
        <p>
          Platform &quot;olduğu gibi&quot; sunulur. Veri kaybı (tarayıcı temizliği vb.) veya üçüncü
          taraf API kesintilerinden doğan zararlardan German Coach sorumlu tutulamaz.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">İletişim</h2>
        <p>
          Sorularınız için:{" "}
          <a href={`mailto:${SITE_EMAIL}`} className="text-goethe-blue underline">
            {SITE_EMAIL}
          </a>
        </p>

        <p className="text-sm text-sage-500">
          <Link href="/gizlilik" className="text-goethe-blue underline">
            Gizlilik politikası
          </Link>
          {" · "}
          <Link href="/kvkk" className="text-goethe-blue underline">
            KVKK
          </Link>
        </p>
      </article>
    </PageShell>
  );
}
