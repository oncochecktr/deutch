import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ayarlar", "/exam/practice/", "/exam/real/", "/timur"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
