"use client";

import { useEffect } from "react";
import { markCoachMilestone, type CoachMilestones } from "@/lib/coachMilestones";

type MilestoneKey = keyof CoachMilestones;

export function CoachMilestoneOnMount({ milestone }: { milestone: MilestoneKey }) {
  useEffect(() => {
    markCoachMilestone({ [milestone]: true });
  }, [milestone]);
  return null;
}
