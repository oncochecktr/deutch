"use client";

import { CoachMilestoneOnMount } from "@/components/CoachMilestoneOnMount";
import { KonusDinlePageHeader } from "@/components/konus-dinle/KonusDinlePageHeader";
import { KonusDinleSession } from "@/components/konus-dinle/KonusDinleSession";

export default function KonusDinlePage() {
  return (
    <div className="space-y-5 pb-6">
      <CoachMilestoneOnMount milestone="konusDinleVisited" />
      <KonusDinlePageHeader />
      <KonusDinleSession />
    </div>
  );
}
