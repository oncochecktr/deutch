import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.cumleMotoru;

export default function CumleMotoruLayout({ children }: { children: React.ReactNode }) {
  return children;
}
