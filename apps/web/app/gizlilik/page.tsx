import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SEO_PAGES } from "@/lib/seoPages";
import { SITE_EMAIL } from "@/lib/site";

export const metadata = SEO_PAGES.gizlilik;

export default function GizlilikPage() {
  return (
    <PageShell title="Gizlilik Politikası" backHref="/" maxWidth="md">
      <article className="prose-sage space-y-4 text-base leading-relaxed text-sage-700">
        <p className="text-sm text-sage-500">Son güncelleme: Haziran 2025</p>

        <p>
          German Coach (germancoach.app), Almanca A1 öğrenme platformudur. Gizliliğinize saygı
          duyuyoruz; bu politika verilerinizi nasıl topladığımızı ve kullandığımızı açıklar.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">Veri saklama</h2>
        <p>
          Öğrenme ilerlemeniz (kelime durumu, gramer tamamlama, sınav skorları){" "}
          <strong>yalnızca tarayıcınızın yerel deposunda</strong> tutulur. Sunucuda kullanıcı hesabı
          veya bulut yedekleme yoktur. Tarayıcı verilerini temizlerseniz ilerleme silinir.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">Üçüncü taraf hizmetler</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Ses (TTS):</strong> Kelime ve cümle seslendirmesi için sunucu tarafı TTS
            kullanılabilir; yalnızca okunacak metin gönderilir.
          </li>
          <li>
            <strong>AI API (isteğe bağlı):</strong> Sınıf modülünde kendi API anahtarınızı
            kullanırsanız istekler seçtiğiniz sağlayıcıya gider; anahtar cihazınızda kalır.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-goethe-blue">Çocuklar</h2>
        <p>
          Platform genel kitleye yöneliktir. 18 yaş altı kullanıcıların ebeveyn gözetiminde
          kullanması önerilir.
        </p>

        <h2 className="text-lg font-bold text-goethe-blue">İletişim</h2>
        <p>
          Gizlilik sorularınız için:{" "}
          <a href={`mailto:${SITE_EMAIL}`} className="text-goethe-blue underline">
            {SITE_EMAIL}
          </a>
        </p>

        <p className="text-sm text-sage-500">
          <Link href="/kvkk" className="text-goethe-blue underline">
            KVKK aydınlatma metni
          </Link>
          {" · "}
          <Link href="/kullanim-kosullari" className="text-goethe-blue underline">
            Kullanım koşulları
          </Link>
        </p>
      </article>
    </PageShell>
  );
}
