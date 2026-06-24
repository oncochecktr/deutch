import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.grundlagen;

export default function GrundlagenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
