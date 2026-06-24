import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.wordOrder;

export default function WordOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
