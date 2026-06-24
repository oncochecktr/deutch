import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata = SEO_PAGES.cerez;

export default function CerezPage() {
  return (
    <PageShell title="Çerez Politikası" backHref="/" maxWidth="md">
      <article className="prose-sage space-y-4 text-base leading-relaxed text-sage-700">
        <p className="text-sm text-sage-500">Son güncelleme: Haziran 2025</p>

        <p>
          German Coach (germancoach.app) şu an için <strong>izleme veya reklam çerezi</strong>{" "}
          kullanmamaktadır.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">Yerel depolama</h2>
        <p>
          Öğrenme ilerlemeniz ve tercihleriniz tarayıcının <strong>localStorage</strong> alanında
          saklanır. Bu teknik olarak çerez değildir ancak benzer şekilde cihazınızda kalır. Veriler
          sunucuya gönderilmez.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">Gelecekteki analitik</h2>
        <p>
          Ziyaret istatistikleri için anonim analitik (ör. Plausible) eklenebilir. Bu durumda bu
          sayfa güncellenecek ve gerekirse onay mekanizması sunulacaktır.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">Çerezleri yönetme</h2>
        <p>
          Tarayıcı ayarlarınızdan site verilerini ve çerezleri silebilirsiniz. Bunu yaptığınızda
          German Coach ilerlemeniz sıfırlanır.
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
