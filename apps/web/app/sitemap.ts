import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES = [
  "",
  "/grundlagen/roadmap",
  "/grundlagen",
  "/cards",
  "/review",
  "/exam",
  "/konus-dinle",
  "/speak",
  "/harita",
  "/blog",
  "/blog/sifirdan-goethe-a1",
  "/blog/der-die-das-rehber",
  "/blog/almanya-3-6-ay",
  "/iletisim",
  "/ayarlar",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path.startsWith("/blog") ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/grundlagen/roadmap" ? 0.95 : 0.7,
  }));
}
