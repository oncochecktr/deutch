import { HomePageClient } from "@/components/HomePageClient";
import { JsonLd } from "@/components/JsonLd";
import { SEO_PAGES } from "@/lib/seoPages";
import { SITE_EMAIL, SITE_URL } from "@/lib/site";

export const metadata = SEO_PAGES.home;

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "German Coach",
            url: SITE_URL,
            description: "Sıfırdan Goethe A1 — Almanca öğrenme platformu",
            inLanguage: "tr",
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "German Coach",
            url: SITE_URL,
            email: SITE_EMAIL,
            founder: { "@type": "Person", name: "Timur Sadullayev" },
          },
        ]}
      />
      <HomePageClient />
    </>
  );
}
