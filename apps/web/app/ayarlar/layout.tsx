import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.ayarlar;

export default function AyarlarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
