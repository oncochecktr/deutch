import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.examSession;

export default function ExamPracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
