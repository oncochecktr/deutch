import { JsonLd } from "@/components/JsonLd";
import { SEO_PAGES } from "@/lib/seoPages";
import { SITE_URL } from "@/lib/site";

export const metadata = SEO_PAGES.roadmap;

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: "Almanca A1 Gramer Yol Haritası",
          description:
            "Sıfırdan A1 gramer yol haritası: der/die/das, fiil çekimi, kelime sırası ve sınav hazırlığı.",
          provider: { "@type": "Organization", name: "German Coach", url: SITE_URL },
          inLanguage: ["tr", "de"],
          educationalLevel: "Beginner",
        }}
      />
      {children}
    </>
  );
}
