import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.sentenceEngine;

export default function SentenceEngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
