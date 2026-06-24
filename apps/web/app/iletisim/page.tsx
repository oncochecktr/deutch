import { IletisimContact } from "@/components/iletisim/IletisimContact";
import { PageShell } from "@/components/PageShell";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata = SEO_PAGES.iletisim;

export default function IletisimPage() {
  return (
    <PageShell
      title="İletişim"
      subtitle="Sorular, öneriler ve iş birlikleri"
      backHref="/"
      maxWidth="md"
    >
      <IletisimContact />
    </PageShell>
  );
}
