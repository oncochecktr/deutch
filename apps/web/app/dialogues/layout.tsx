import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.dialogues;

export default function DialoguesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
