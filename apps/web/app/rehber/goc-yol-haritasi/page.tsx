import { GermanyRoadmapView } from "@/components/roadmaps/GermanyRoadmapView";
import { getGermanyRoadmap } from "@/lib/roadmaps/germanyRoadmaps";

export const metadata = {
  title: "Göç Yol Haritası | German Coach",
  description: "Almanya'ya yerleşme için dil, meslek, denklik, iş ve ilk kayıt adımları.",
};

export default function MigrationRoadmapPage() {
  return <GermanyRoadmapView roadmap={getGermanyRoadmap("goc")} />;
}
