import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.harita;

export default function HaritaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
