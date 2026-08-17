"use client";

import { HomeGermanyGuideCards } from "@/components/home/HomeGermanyGuideCards";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeMatchPairs } from "@/components/home/HomeMatchPairs";

export function HomePageClient() {
  return (
    <div className="space-y-6">
      <HomeHero />
      <HomeMatchPairs />
      <HomeGermanyGuideCards />
    </div>
  );
}
