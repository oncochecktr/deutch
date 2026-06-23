import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Almanya'ya gitmeden önce: 3–6 ay A1 planı",
  description: "Almanya için A1 Almanca hazırlığı — iş, eğitim ve göç adayları için plan.",
  alternates: { canonical: `${SITE_URL}/blog/almanya-3-6-ay` },
};

export default function BlogPostPlanPage() {
  return (
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
  );
}
