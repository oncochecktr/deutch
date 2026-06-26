import type { Metadata } from "next";
import { SEO_PAGES } from "@/lib/seoPages";

export const metadata: Metadata = {
  title: "A1 Motor Cümleleri",
  description:
    "Haben, brauchen, Wo ist, Das ist — A1 soru cevap kalıpları. German Coach gramer motoru.",
};

export default function MotorCumlelerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
