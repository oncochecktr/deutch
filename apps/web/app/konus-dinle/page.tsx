"use client";

import { KonusDinlePageHeader } from "@/components/konus-dinle/KonusDinlePageHeader";
import { KonusDinleSession } from "@/components/konus-dinle/KonusDinleSession";

export default function KonusDinlePage() {
  return (
    <div className="space-y-5 pb-6">
      <KonusDinlePageHeader />
      <KonusDinleSession />
    </div>
  );
}
