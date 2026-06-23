import Link from "next/link";
import { IletisimContact } from "@/components/iletisim/IletisimContact";
import { PageShell } from "@/components/PageShell";
import { SiteSocialLinks } from "@/components/SiteSocialLinks";
import { SITE_EMAIL } from "@/lib/site";

export default function IletisimPage() {
  return (
    <PageShell
      title="İletişim"
      subtitle="Sorularınız, önerileriniz ve iş birlikleri"
      backHref="/"
      maxWidth="lg"
    >
      <p className="mb-2 text-sm text-sage-600">
        German Coach ile ilgili her konuda bana ulaşabilirsiniz. E-posta veya WhatsApp
        üzerinden yazmanız yeterli.
      </p>
      <p className="mb-6 text-sm text-sage-500">
        E-posta:{" "}
        <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-goethe-blue hover:underline">
          {SITE_EMAIL}
        </a>
      </p>

      <IletisimContact />

      <div className="mt-10 border-t border-sage-100 pt-8">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-sage-400">
          Tüm kanallar
        </p>
        <SiteSocialLinks variant="buttons" />
      </div>

      <p className="mt-8 text-center text-sm text-sage-500">
        <Link href="/grundlagen/roadmap" className="text-goethe-blue underline">
          Gramer yol haritası
        </Link>
        {" · "}
        <Link href="/blog" className="text-goethe-blue underline">
          Blog
        </Link>
      </p>
    </PageShell>
  );
}
