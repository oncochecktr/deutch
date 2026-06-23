import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Der, die, das — Türk öğrenciler için rehber",
  description: "Almanca artikeller: der, die, das. A1 gramerinin ilk kuralı.",
  alternates: { canonical: `${SITE_URL}/blog/der-die-das-rehber` },
};

export default function BlogPostArtikelPage() {
  return (
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
  );
}
