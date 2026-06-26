import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.words;

export default function WordsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
