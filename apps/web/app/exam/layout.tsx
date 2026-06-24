import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.exam;

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
