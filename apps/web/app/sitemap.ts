import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Build-time static sitemap — runtime Date() Vercel'de 500'e yol açabiliyor */
export const dynamic = "force-static";
export const revalidate = false;

/** Build anında sabitlenir (force-static) */
const LAST_MOD = new Date();

type RouteEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
};

const ROUTES: RouteEntry[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/grundlagen/roadmap", priority: 0.95, changeFrequency: "weekly" },
  { path: "/grundlagen", priority: 0.85, changeFrequency: "weekly" },
  { path: "/grundlagen/artikel", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/conjugation", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/cumle-motoru", priority: 0.8, changeFrequency: "weekly" },
  { path: "/grundlagen/dativ", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/form", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/grammar", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/grammar-pack", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/negation", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/patterns", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/possessives", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/prepositions", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/satz", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/word-order", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/zeit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/zahlen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/cards", priority: 0.8, changeFrequency: "weekly" },
  { path: "/review", priority: 0.75, changeFrequency: "weekly" },
  { path: "/words", priority: 0.75, changeFrequency: "weekly" },
  { path: "/listen", priority: 0.75, changeFrequency: "weekly" },
  { path: "/quiz", priority: 0.7, changeFrequency: "weekly" },
  { path: "/exam", priority: 0.85, changeFrequency: "weekly" },
  { path: "/exam/hoeren", priority: 0.7, changeFrequency: "monthly" },
  { path: "/exam/lesen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/exam/sprechen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/exam/schreiben", priority: 0.7, changeFrequency: "monthly" },
  { path: "/exam/bilgi", priority: 0.65, changeFrequency: "monthly" },
  { path: "/konus-dinle", priority: 0.8, changeFrequency: "weekly" },
  { path: "/speak", priority: 0.8, changeFrequency: "weekly" },
  { path: "/harita", priority: 0.75, changeFrequency: "weekly" },
  { path: "/dialogues", priority: 0.7, changeFrequency: "weekly" },
  { path: "/mesleki", priority: 0.65, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog/sifirdan-goethe-a1", priority: 0.75, changeFrequency: "monthly" },
  { path: "/blog/der-die-das-rehber", priority: 0.75, changeFrequency: "monthly" },
  { path: "/blog/almanya-3-6-ay", priority: 0.75, changeFrequency: "monthly" },
  { path: "/iletisim", priority: 0.6, changeFrequency: "yearly" },
  { path: "/kvkk", priority: 0.3, changeFrequency: "yearly" },
  { path: "/gizlilik", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cerez", priority: 0.3, changeFrequency: "yearly" },
  { path: "/kullanim-kosullari", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: LAST_MOD,
    changeFrequency,
    priority,
  }));
}
