import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { articleMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const SLUG = "almanya-3-6-ay";
const TITLE = "Almanya'ya gitmeden önce: 3–6 ay A1 planı";
const DESCRIPTION =
  "Almanya için A1 Almanca hazırlığı — iş, eğitim ve göç adayları için plan.";

export const metadata = articleMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: `/blog/${SLUG}`,
  publishedTime: "2025-02-15",
});

export default function BlogPostPlanPage() {
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
          datePublished: "2025-02-15",
          inLanguage: "tr",
        }}
      />
      <PageShell title="3–6 ay A1 planı" backHref="/blog" maxWidth="md">
        <article className="space-y-4 text-sm leading-relaxed text-sage-700">
          <p>
            Almanya&apos;da çalışmak, okumak veya aile birleşimi için çoğu adayın{" "}
            <strong>A1 sertifikası</strong> (Goethe, TELC, ÖSD) gerekir. 3–6 ay yeterli bir pencere —
            özellikle günde 45–60 dakika ayırırsanız.
          </p>
          <h2 className="text-lg font-bold text-goethe-blue">Ay ay hedef</h2>
          <ul className="space-y-2">
            <li>
              <strong>1–2. ay:</strong> Artikel, zamirler, sein/haben, kelime (200+)
            </li>
            <li>
              <strong>3–4. ay:</strong> Fiil çekimi, sıra, Akkusativ, sınav Lesen/Hören
            </li>
            <li>
              <strong>5–6. ay:</strong> Schreiben/Sprechen pratiği, deneme sınavları
            </li>
          </ul>
          <Link href="/" className="btn-primary inline-block">
            German Coach ile başla
          </Link>
        </article>
      </PageShell>
    </>
  );
}
