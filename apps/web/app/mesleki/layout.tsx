import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.mesleki;

export default function MeslekiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
