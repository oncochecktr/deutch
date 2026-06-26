import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.diktat;

export default function DiktatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
