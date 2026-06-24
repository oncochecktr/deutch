import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { articleMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const SLUG = "sifirdan-goethe-a1";
const TITLE = "Sıfırdan A1: 3–6 ayda mümkün mü?";
const DESCRIPTION =
  "Hiç Almanca bilmeyenler için gerçekçi A1 hazırlık planı. Günde 30–60 dakika ile A1 hedefi.";

export const metadata = articleMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: `/blog/${SLUG}`,
  publishedTime: "2025-01-15",
});

export default function BlogPostA1Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          url: `${SITE_URL}/blog/${SLUG}`,
          author: { "@type": "Person", name: "Timur Sadullayev" },
          publisher: { "@type": "Organization", name: "German Coach", url: SITE_URL },
          datePublished: "2025-01-15",
          inLanguage: "tr",
        }}
      />
      <PageShell title="Sıfırdan A1" backHref="/blog" maxWidth="md">
        <article className="prose-sage space-y-4 text-sm leading-relaxed text-sage-700">
          <p>
            Evet — <strong>sıfır Almanca</strong> ile başlayıp 3–6 ayda A1 seviyesine ulaşmak
            mümkün. Anahtar: her gün küçük ama tutarlı çalışma.
          </p>
          <h2 className="text-lg font-bold text-goethe-blue">Önerilen günlük rutin (45 dk)</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>10 dk — Kelime kartları</li>
            <li>15 dk — Gramer yol haritası (der/die/das → sein → fiil)</li>
            <li>10 dk — Dinleme veya Konuş-Dinle</li>
            <li>10 dk — Sınav modülü (Lesen/Hören)</li>
          </ol>
          <p>
            German Coach bu rutini tek uygulamada toplar: ilerlemeniz tarayıcıda saklanır, kaldığınız
            yerden devam edersiniz.
          </p>
          <Link href="/grundlagen/roadmap" className="btn-primary inline-block">
            Gramer yol haritasını aç
          </Link>
        </article>
      </PageShell>
    </>
  );
}
