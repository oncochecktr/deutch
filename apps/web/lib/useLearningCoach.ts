"use client";

import { useEffect, useMemo, useState } from "react";
import { loadCoachMilestones } from "@/lib/coachMilestones";
import { computeLearningCoach } from "@/lib/learningCoach";
import { useProgress } from "@/lib/ProgressContext";

export function useLearningCoach() {
  const { progress, hydrated } = useProgress();
  const [milestones, setMilestones] = useState(loadCoachMilestones);

  useEffect(() => {
    if (!hydrated) return;
    setMilestones(loadCoachMilestones());
  }, [hydrated, progress.lastRoute]);

  const coach = useMemo(
    () => computeLearningCoach(progress, milestones),
    [progress, milestones]
  );

  return { coach, hydrated, milestones, refreshMilestones: () => setMilestones(loadCoachMilestones()) };
}
