import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.artikel;

export default function ArtikelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
