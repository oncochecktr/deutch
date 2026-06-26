import { AppFeaturesList } from "@/components/AppFeaturesList";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { APP_FEATURES } from "@/lib/appFeatures";
import { SEO_PAGES } from "@/lib/seoPages";
import { SITE_URL } from "@/lib/site";

export const metadata = SEO_PAGES.ozellikler;

export default function OzelliklerPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "German Coach Özellikleri",
          description: "Almanca A1 öğrenme platformunun tüm modülleri",
          numberOfItems: APP_FEATURES.length,
          itemListElement: APP_FEATURES.map((f, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: f.title,
            url: `${SITE_URL}${f.href}`,
            description: f.description,
          })),
        }}
      />
      <PageShell
        title="Tüm özellikler"
        subtitle={`${APP_FEATURES.length} modül — tıkla, doğrudan git`}
        backHref="/"
        backLabel="Panele dön"
        maxWidth="lg"
      >
        <div className="card-soft mb-4 border border-goethe-blue/15 p-4">
          <p className="text-sm text-sage-600">
            German Coach&apos;ta kelime, gramer, diktat, konuşma ve sınav modüllerinin tamamı
            burada. Bir özelliğe dokun — ilgili sayfaya gidersin.
          </p>
        </div>
        <AppFeaturesList />
      </PageShell>
    </>
  );
}
