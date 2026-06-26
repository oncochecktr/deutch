import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.review;

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
