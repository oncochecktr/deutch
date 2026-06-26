"use client";

import { PageShell } from "@/components/PageShell";
import { DasIstLegoTrainer } from "@/components/grundlagen/DasIstLegoTrainer";
import { MotorDrillPanel } from "@/components/grundlagen/MotorDrillPanel";
import { getMotorDrillsForPattern } from "@/lib/motorDrills";

const DAS_IST_DRILLS = getMotorDrillsForPattern("das-ist-ein");

export default function DasIstPage() {
  return (
    <PageShell
      title="Das ist … → Er / Es / Sie"
      subtitle="Tanıştır · yorum · iki satır"
      backHref="/grundlagen/sentence-engine"
      backLabel="Sentence Engine"
      maxWidth="md"
    >
      <MotorDrillPanel groups={DAS_IST_DRILLS} showAllLink />
      <DasIstLegoTrainer />
    </PageShell>
  );
}
