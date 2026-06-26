import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.dasIstMeinEngine;

export default function DasIstMeinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
