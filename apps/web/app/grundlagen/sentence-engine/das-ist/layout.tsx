import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.dasIstEngine;

export default function DasIstLayout({ children }: { children: React.ReactNode }) {
  return children;
}
