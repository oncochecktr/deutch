import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { articleMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const SLUG = "der-die-das-rehber";
const TITLE = "Der, die, das — Türk öğrenciler için rehber";
const DESCRIPTION = "Almanca artikeller: der, die, das. A1 gramerinin ilk kuralı.";

export const metadata = articleMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: `/blog/${SLUG}`,
  publishedTime: "2025-02-01",
});

export default function BlogPostArtikelPage() {
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
          datePublished: "2025-02-01",
          inLanguage: "tr",
        }}
      />
      <PageShell title="Der / Die / Das" backHref="/blog" maxWidth="md">
        <article className="space-y-4 text-sm leading-relaxed text-sage-700">
          <p>
            Almancada her ismin bir cinsiyeti vardır: <strong>der</strong> (eril),{" "}
            <strong>die</strong> (dişil), <strong>das</strong> (nötr). Türkçede bu yok — bu yüzden
            ilk hafta en çok buraya zaman ayırın.
          </p>
          <ul className="space-y-2 rounded-xl bg-sage-50 p-4">
            <li>der Mann — adam</li>
            <li>die Frau — kadın</li>
            <li>das Kind — çocuk</li>
          </ul>
          <p>
            German Coach&apos;ta artikel kuralı yol haritasının 1. adımıdır — örnekler ve drill ile
            pekiştirilir.
          </p>
          <Link href="/grundlagen/roadmap" className="btn-primary inline-block">
            Yol haritasında başla
          </Link>
        </article>
      </PageShell>
    </>
  );
}
