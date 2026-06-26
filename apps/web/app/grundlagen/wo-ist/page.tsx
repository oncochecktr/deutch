"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { MotorDrillPanel } from "@/components/grundlagen/MotorDrillPanel";
import { WoIstLegoTrainer } from "@/components/grundlagen/WoIstLegoTrainer";
import { getMotorDrillsForPattern } from "@/lib/motorDrills";

const WO_IST_DRILLS = getMotorDrillsForPattern("wo-ist");

export default function WoIstPage() {
  return (
    <PageShell
      title="Wo ist …?"
      subtitle="Lego kalıp · der/die/das · W-Frage"
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
        <div className="card-soft mb-4 border border-goethe-blue/15 p-3">
          <p className="text-xs text-sage-600">
            <Link href="/grundlagen/sentence-engine" className="font-semibold text-goethe-blue hover:underline">
              Sentence Engine · Pattern 01
            </Link>
            {" "}— sonraki adım:{" "}
            <Link href="/grundlagen/sentence-engine/adjektiv" className="font-semibold text-goethe-blue hover:underline">
              Pattern 02 (Sıfat)
            </Link>
          </p>
        </div>
        <MotorDrillPanel groups={WO_IST_DRILLS} showAllLink />
        <WoIstLegoTrainer />
    </PageShell>
  );
}
