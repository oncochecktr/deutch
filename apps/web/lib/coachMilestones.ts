/** Öğrenme koçu — modül ziyaret işaretleri (localStorage) */

const KEY = "german-coach-milestones";

export interface CoachMilestones {
  diktatVisited: boolean;
  konusDinleVisited: boolean;
}

const DEFAULT: CoachMilestones = {
  diktatVisited: false,
  konusDinleVisited: false,
};

export function loadCoachMilestones(): CoachMilestones {
  if (typeof window === "undefined") return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const p = JSON.parse(raw) as Partial<CoachMilestones>;
    return {
      diktatVisited: p.diktatVisited === true,
      konusDinleVisited: p.konusDinleVisited === true,
    };
  } catch {
    return { ...DEFAULT };
  }
}

export function markCoachMilestone(patch: Partial<CoachMilestones>): CoachMilestones {
  const next = { ...loadCoachMilestones(), ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}
