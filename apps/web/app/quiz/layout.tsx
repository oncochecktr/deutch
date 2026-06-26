import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = SEO_PAGES.quiz;

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
