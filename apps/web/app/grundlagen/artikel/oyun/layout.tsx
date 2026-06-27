import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.artikelOyun;

export default function ArtikelOyunLayout({ children }: { children: React.ReactNode }) {
  return children;
}
