import type { Metadata } from "next";
import { APP_NAME } from "@/lib/brand";
import { SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  ogType?: "website" | "article";
  keywords?: string[];
}

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  ogType = "website",
  keywords,
}: PageMetadataInput): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title.includes(APP_NAME) ? title : title;

  return {
    title: fullTitle,
    description,
    keywords: keywords ?? SITE_KEYWORDS,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: ogType,
      locale: "tr_TR",
      url,
      siteName: SITE_NAME,
      title: `${fullTitle} | ${APP_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullTitle} | ${APP_NAME}`,
      description,
    },
  };
}

export function articleMetadata(
  input: Omit<PageMetadataInput, "ogType"> & { publishedTime?: string }
): Metadata {
  const base = pageMetadata({ ...input, ogType: "article" });
  if (input.publishedTime && base.openGraph) {
    return {
      ...base,
      openGraph: {
        ...base.openGraph,
        type: "article",
        publishedTime: input.publishedTime,
      },
    };
  }
  return base;
}
