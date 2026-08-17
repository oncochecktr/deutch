import { GermanyRoadmapView } from "@/components/roadmaps/GermanyRoadmapView";
import { getGermanyRoadmap } from "@/lib/roadmaps/germanyRoadmaps";

export const metadata = {
  title: "Öğrenci Yol Haritası | German Coach",
  description: "Almanya'da dil kursu, Erasmus, Studienkolleg, lisans, yüksek lisans ve doktora yolları.",
};

export default function StudentRoadmapPage() {
  return <GermanyRoadmapView roadmap={getGermanyRoadmap("ogrenci")} />;
}
