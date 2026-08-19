import type { Metadata } from "next";
import { TopGermanVerbsClient } from "@/components/verbs/TopGermanVerbsClient";

export const metadata: Metadata = {
  title: "Almancada En Çok Kullanılan 100 Fiil | German Coach",
  description:
    "Almanca öğrenirken en çok kullanılan 100 fiili Türkçe anlamları, üç zaman halleri ve örnek cümlelerle adım adım öğrenin.",
  alternates: {
    canonical: "/almanca-en-cok-kullanilan-100-fiil",
  },
  openGraph: {
    title: "Almancada En Çok Kullanılan 100 Fiil | German Coach",
    description:
      "Günlük Almanca için önce en gerekli fiilleri öğrenin. Anlam, zamanlar, örnekler ve tekrar akışı tek ekranda.",
    url: "/almanca-en-cok-kullanilan-100-fiil",
  },
};

export default function TopGermanVerbsPage() {
  return <TopGermanVerbsClient />;
}
