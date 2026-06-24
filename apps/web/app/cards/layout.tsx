import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.cards;

export default function CardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
