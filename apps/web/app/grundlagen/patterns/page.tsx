"use client";

import { getPatterns, getPatternTrainer } from "@/lib/grundlagen";
import { PageShell } from "@/components/PageShell";
import { MotorDrillPanel } from "@/components/grundlagen/MotorDrillPanel";
import { PatternTrainer } from "@/components/grundlagen/PatternTrainer";
import { getMotorDrillsForPattern } from "@/lib/motorDrills";

const PATTERN_DRILLS = [
  ...getMotorDrillsForPattern("patterns"),
  ...getMotorDrillsForPattern("haben-qa"),
  ...getMotorDrillsForPattern("brauchen"),
  ...getMotorDrillsForPattern("sehen-pronomen"),
].filter((g, i, arr) => arr.findIndex((x) => x.id === g.id) === i);

export default function PatternsPage() {
  const meta = getPatternTrainer();
  const patterns = getPatterns();

  return (
    <PageShell
      title={meta.title}
      subtitle={meta.titleTr}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <MotorDrillPanel groups={PATTERN_DRILLS} showAllLink />
      <PatternTrainer patterns={patterns} />
    </PageShell>
  );
}
