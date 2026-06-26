"use client";

import { PageShell } from "@/components/PageShell";
import { DasIstPossessiveLegoTrainer } from "@/components/grundlagen/DasIstPossessiveLegoTrainer";
import { MotorDrillPanel } from "@/components/grundlagen/MotorDrillPanel";
import { getMotorDrillsForPattern } from "@/lib/motorDrills";

const DAS_IST_MEIN_DRILLS = getMotorDrillsForPattern("das-ist-mein");

export default function DasIstMeinPage() {
  return (
    <PageShell
      title="Das ist mein … → Er / Es / Sie"
      subtitle="benim · senin · bizim · onların"
      backHref="/grundlagen/sentence-engine"
      backLabel="Sentence Engine"
      maxWidth="md"
    >
      <MotorDrillPanel groups={DAS_IST_MEIN_DRILLS} showAllLink />
      <DasIstPossessiveLegoTrainer />
    </PageShell>
  );
}
