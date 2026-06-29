import { JsonLd } from "@/components/JsonLd";
import { ElKitabiView } from "@/components/elKitabi/ElKitabiView";
import { PageShell } from "@/components/PageShell";
import { SITE_URL } from "@/lib/site";

export default function ElKitabiPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "A1–B1 Almanca El Kitabi — Dilbilgisi Rehberi",
          description:
            "A1'den B1'e Almanca dilbilgisi rehberi: artikel, kasus, zamanlar, edatlar, yazma ve konusma kalıplari.",
          url: `${SITE_URL}/rehber/el-kitabi`,
          author: { "@type": "Organization", name: "German Coach", url: SITE_URL },
          publisher: { "@type": "Organization", name: "German Coach", url: SITE_URL },
          inLanguage: "tr",
        }}
      />
      <PageShell
        title="A1–B1 El Kitabi"
        subtitle="Yol haritasi ve dilbilgisi rehberi"
        backHref="/harita"
        backLabel="Ogrenme haritasina don"
        maxWidth="md"
      >
        <ElKitabiView />
      </PageShell>
    </>
  );
}
