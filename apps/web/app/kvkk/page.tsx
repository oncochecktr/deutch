import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SEO_PAGES } from "@/lib/seoPages";
import { SITE_EMAIL } from "@/lib/site";

export const metadata = SEO_PAGES.kvkk;

export default function KvkkPage() {
  return (
    <PageShell title="KVKK Aydınlatma Metni" backHref="/" maxWidth="md">
      <article className="prose-sage space-y-4 text-base leading-relaxed text-sage-700">
        <p className="text-sm text-sage-500">Son güncelleme: Haziran 2025</p>

        <h2 className="text-lg font-bold text-goethe-blue">Veri sorumlusu</h2>
        <p>
          German Coach (germancoach.app) kapsamında kişisel verileriniz, 6698 sayılı Kişisel Verilerin
          Korunması Kanunu (&quot;KVKK&quot;) uyarınca Timur Sadullayev tarafından veri sorumlusu
          sıfatıyla işlenmektedir.
        </p>
        <p>
          İletişim:{" "}
          <a href={`mailto:${SITE_EMAIL}`} className="text-goethe-blue underline">
            {SITE_EMAIL}
          </a>
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">İşlenen veriler</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Tarayıcı yerel deposu (localStorage):</strong> Öğrenme ilerlemeniz (kelimeler,
            gramer, sınav sonuçları) yalnızca cihazınızda saklanır; sunucuya gönderilmez.
          </li>
          <li>
            <strong>AI API anahtarı (isteğe bağlı):</strong> Sınıf modülü için girdiğiniz anahtar
            yalnızca tarayıcınızda tutulur.
          </li>
          <li>
            <strong>İletişim:</strong> Bize e-posta veya WhatsApp ile yazdığınızda paylaştığınız
            bilgiler (ad, mesaj içeriği).
          </li>
        </ul>

        <h2 className="text-lg font-bold text-goethe-blue">İşleme amaçları</h2>
        <p>
          Veriler; eğitim hizmetinin sunulması, teknik destek, iletişim taleplerinin yanıtlanması ve
          yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">Haklarınız (KVKK md. 11)</h2>
        <p>
          Kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep
          etme, işleme faaliyetine itiraz etme haklarına sahipsiniz. Talepleriniz için{" "}
          <a href={`mailto:${SITE_EMAIL}`} className="text-goethe-blue underline">
            {SITE_EMAIL}
          </a>{" "}
          adresine yazabilirsiniz.
        </p>

        <p className="text-sm text-sage-500">
          <Link href="/gizlilik" className="text-goethe-blue underline">
            Gizlilik politikası
          </Link>
          {" · "}
          <Link href="/cerez" className="text-goethe-blue underline">
            Çerez politikası
          </Link>
        </p>
      </article>
    </PageShell>
  );
}
