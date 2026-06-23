import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sıfırdan Goethe A1: 3–6 ayda mümkün mü?",
  description:
    "Hiç Almanca bilmeyenler için gerçekçi A1 hazırlık planı. Günde 30–60 dakika ile Goethe A1 hedefi.",
  alternates: { canonical: `${SITE_URL}/blog/sifirdan-goethe-a1` },
};

export default function BlogPostA1Page() {
  return (
    <PageShell title="Sıfırdan Goethe A1" backHref="/blog" maxWidth="md">
      <article className="prose-sage space-y-4 text-sm leading-relaxed text-sage-700">
        <p>
          Evet — <strong>sıfır Almanca</strong> ile başlayıp 3–6 ayda Goethe A1 seviyesine ulaşmak
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
  );
}
