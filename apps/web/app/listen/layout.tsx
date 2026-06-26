import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.listen;

export default function ListenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
