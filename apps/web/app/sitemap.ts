import type { MetadataRoute } from "next";
import { getSitemapRoutes } from "@/lib/sitemapRoutes";
import { SITE_URL } from "@/lib/site";

/** Build-time static sitemap — runtime Date() Vercel'de 500'e yol açabiliyor */
export const dynamic = "force-static";
export const revalidate = false;

/** Build anında sabitlenir (force-static) */
const LAST_MOD = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapRoutes().map(({ path, priority, changeFrequency }) => ({
    url: path ? `${SITE_URL}${path}` : SITE_URL,
    lastModified: LAST_MOD,
    changeFrequency,
    priority,
  }));
}
