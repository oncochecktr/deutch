import { APP_FEATURES } from "@/lib/appFeatures";

export type SitemapChangeFrequency = "weekly" | "monthly" | "yearly";

export type SitemapRoute = {
  path: string;
  priority: number;
  changeFrequency: SitemapChangeFrequency;
};

/** robots.ts ile uyumlu — sitemap'e eklenmez */
export const SITEMAP_EXCLUDED_PREFIXES = ["/ayarlar", "/exam/practice/", "/exam/real/", "/timur"];

const DEFAULT: Pick<SitemapRoute, "priority" | "changeFrequency"> = {
  priority: 0.7,
  changeFrequency: "monthly",
};

/** APP_FEATURES'ta olmayan ama indexlenebilir sayfalar */
const EXTRA_ROUTES: SitemapRoute[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/ozellikler", priority: 0.85, changeFrequency: "weekly" },
  { path: "/grundlagen/motor-cumleler", priority: 0.75, changeFrequency: "monthly" },
  { path: "/grundlagen/form", priority: 0.7, changeFrequency: "monthly" },
  { path: "/grundlagen/grammar", priority: 0.7, changeFrequency: "monthly" },
  { path: "/a2/cards", priority: 0.65, changeFrequency: "weekly" },
  { path: "/a2/words", priority: 0.65, changeFrequency: "weekly" },
  { path: "/words/pdf", priority: 0.7, changeFrequency: "monthly" },
  { path: "/kelime-pdf", priority: 0.7, changeFrequency: "monthly" },
  { path: "/exam/schreiben/mektup", priority: 0.6, changeFrequency: "monthly" },
  { path: "/exam/schreiben/gercek", priority: 0.6, changeFrequency: "monthly" },
  { path: "/exam/sprechen/gercek", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog/sifirdan-goethe-a1", priority: 0.75, changeFrequency: "monthly" },
  { path: "/blog/der-die-das-rehber", priority: 0.75, changeFrequency: "monthly" },
  { path: "/blog/almanya-3-6-ay", priority: 0.75, changeFrequency: "monthly" },
  { path: "/rehber/el-kitabi", priority: 0.9, changeFrequency: "monthly" },
  { path: "/iletisim", priority: 0.6, changeFrequency: "yearly" },
  { path: "/kvkk", priority: 0.3, changeFrequency: "yearly" },
  { path: "/gizlilik", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cerez", priority: 0.3, changeFrequency: "yearly" },
  { path: "/kullanim-kosullari", priority: 0.3, changeFrequency: "yearly" },
  { path: "/grundlagen/artikel/oyun", priority: 0.75, changeFrequency: "weekly" },
];

const FEATURE_OVERRIDES: Record<string, Partial<SitemapRoute>> = {
  "/grundlagen/roadmap": { priority: 0.95, changeFrequency: "weekly" },
  "/grundlagen": { priority: 0.85, changeFrequency: "weekly" },
  "/grundlagen/cumle-motoru": { priority: 0.8, changeFrequency: "weekly" },
  "/grundlagen/sentence-engine": { priority: 0.8, changeFrequency: "weekly" },
  "/grundlagen/sentence-engine/adjektiv": { priority: 0.8, changeFrequency: "weekly" },
  "/grundlagen/sentence-engine/das-ist": { priority: 0.8, changeFrequency: "weekly" },
  "/grundlagen/sentence-engine/das-ist-mein": { priority: 0.8, changeFrequency: "weekly" },
  "/grundlagen/wo-ist": { priority: 0.8, changeFrequency: "weekly" },
  "/grundlagen/artikel/oyun": { priority: 0.75, changeFrequency: "weekly" },
  "/cards": { priority: 0.8, changeFrequency: "weekly" },
  "/diktat": { priority: 0.8, changeFrequency: "weekly" },
  "/review": { priority: 0.75, changeFrequency: "weekly" },
  "/words": { priority: 0.75, changeFrequency: "weekly" },
  "/listen": { priority: 0.75, changeFrequency: "weekly" },
  "/quiz": { priority: 0.7, changeFrequency: "weekly" },
  "/exam": { priority: 0.85, changeFrequency: "weekly" },
  "/exam/bilgi": { priority: 0.65, changeFrequency: "monthly" },
  "/konus-dinle": { priority: 0.8, changeFrequency: "weekly" },
  "/speak": { priority: 0.8, changeFrequency: "weekly" },
  "/harita": { priority: 0.75, changeFrequency: "weekly" },
  "/dialogues": { priority: 0.7, changeFrequency: "weekly" },
  "/mesleki": { priority: 0.65, changeFrequency: "monthly" },
  "/blog": { priority: 0.8, changeFrequency: "weekly" },
};

const CATEGORY_DEFAULTS: Record<
  (typeof APP_FEATURES)[number]["category"],
  Pick<SitemapRoute, "priority" | "changeFrequency">
> = {
  kelime: { priority: 0.75, changeFrequency: "weekly" },
  yazma: { priority: 0.75, changeFrequency: "weekly" },
  gramer: { priority: 0.7, changeFrequency: "monthly" },
  konusma: { priority: 0.75, changeFrequency: "weekly" },
  sinav: { priority: 0.7, changeFrequency: "monthly" },
  rehber: { priority: 0.7, changeFrequency: "weekly" },
};

function isExcluded(path: string): boolean {
  return SITEMAP_EXCLUDED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(prefix)
  );
}

function routeFromFeature(href: string, category: (typeof APP_FEATURES)[number]["category"]): SitemapRoute {
  const override = FEATURE_OVERRIDES[href];
  const base = CATEGORY_DEFAULTS[category];
  return {
    path: href,
    priority: override?.priority ?? base.priority,
    changeFrequency: override?.changeFrequency ?? base.changeFrequency,
  };
}

/** Tek kaynak: sitemap + footer site haritası doğrulaması */
export function getSitemapRoutes(): SitemapRoute[] {
  const byPath = new Map<string, SitemapRoute>();

  for (const extra of EXTRA_ROUTES) {
    byPath.set(extra.path || "/", extra);
  }

  for (const feature of APP_FEATURES) {
    if (isExcluded(feature.href)) continue;
    byPath.set(feature.href, routeFromFeature(feature.href, feature.category));
  }

  return [...byPath.values()].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.path.localeCompare(b.path);
  });
}
