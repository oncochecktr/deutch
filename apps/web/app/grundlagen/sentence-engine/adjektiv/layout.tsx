import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.adjektivEngine;

export default function AdjektivEngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
