import {
  countByWordCount,
  filterKey,
  type KonusDinleLevel,
  type KonusDinleLengthFilter,
} from "@/lib/konusDinlePlaylist";
import type { KonusDinleProgress } from "@/lib/konusDinleStorage";

export interface KonusDinleBranchNode {
  id: string;
  level: KonusDinleLevel;
  lengthFilter: KonusDinleLengthFilter;
  label: string;
  subtitle: string;
  total: number;
  completed: number;
  percent: number;
}

export interface KonusDinleLevelNode {
  level: KonusDinleLevel;
  label: string;
  goal: string;
  total: number;
  completed: number;
  percent: number;
  branches: KonusDinleBranchNode[];
}

const LEVEL_GOALS: Record<KonusDinleLevel, string> = {
  A1: "Temel kelime ve kısa cümleler — A1 seviyesi",
  A2: "Günlük konuşma cümleleri — A2 akıcılık",
  B1: "Bağlam ve sebep cümleleri — B1 hazırlık",
};

const BRANCH_LABELS: { filter: KonusDinleLengthFilter; label: string; subtitle: string }[] = [
  { filter: 1, label: "1 kelime", subtitle: "Kelime + artikel" },
  { filter: 2, label: "2 kelime", subtitle: "Mini cümle" },
  { filter: 3, label: "3 kelime", subtitle: "Kısa ifade" },
  { filter: 4, label: "4 kelime", subtitle: "Basit cümle" },
  { filter: 5, label: "5 kelime", subtitle: "Orta cümle" },
  { filter: 6, label: "6 kelime", subtitle: "Uzun cümle" },
  { filter: "mixed", label: "Karışık", subtitle: "1–6 rastgele antrenman" },
];

function branchCompleted(progress: KonusDinleProgress, level: KonusDinleLevel, filter: KonusDinleLengthFilter): number {
  return (progress.completedByFilter[filterKey(level, filter)] ?? []).length;
}

function branchTotal(level: KonusDinleLevel, filter: KonusDinleLengthFilter): number {
  const counts = countByWordCount(level);
  if (filter === "mixed") return counts.total;
  return counts[filter] ?? 0;
}

export function buildKonusDinleGoalTree(progress: KonusDinleProgress): KonusDinleLevelNode[] {
  const levels: KonusDinleLevel[] = ["A1", "A2", "B1"];

  return levels.map((level) => {
    const counts = countByWordCount(level);
    const branches: KonusDinleBranchNode[] = BRANCH_LABELS.map(({ filter, label, subtitle }) => {
      const total = branchTotal(level, filter);
      const completed = branchCompleted(progress, level, filter);
      return {
        id: `${level}-${filter}`,
        level,
        lengthFilter: filter,
        label,
        subtitle,
        total,
        completed,
        percent: total ? Math.round((completed / total) * 100) : 0,
      };
    });

    const total = counts.total;
    const completed = branches.reduce((sum, b) => sum + b.completed, 0);
    const maxPossible = branches.reduce((sum, b) => sum + b.total, 0);

    return {
      level,
      label: level,
      goal: LEVEL_GOALS[level],
      total,
      completed,
      percent: maxPossible ? Math.min(100, Math.round((completed / maxPossible) * 100)) : 0,
      branches,
    };
  });
}

export function overallKonusDinlePercent(tree: KonusDinleLevelNode[]): number {
  let done = 0;
  let max = 0;
  for (const lv of tree) {
    for (const b of lv.branches) {
      done += b.completed;
      max += b.total;
    }
  }
  return max ? Math.round((done / max) * 100) : 0;
}

/** Sıradaki önerilen dal — en düşük tamamlanmamış, A1→B1 ve 1→6 kelime sırası */
export function suggestNextBranch(
  progress: KonusDinleProgress
): KonusDinleBranchNode | null {
  const tree = buildKonusDinleGoalTree(progress);
  for (const lv of tree) {
    for (const b of lv.branches) {
      if (b.lengthFilter === "mixed") continue;
      if (b.total > 0 && b.completed < b.total) return b;
    }
  }
  for (const lv of tree) {
    const mixed = lv.branches.find((b) => b.lengthFilter === "mixed" && b.total > 0);
    if (mixed && mixed.completed < mixed.total) return mixed;
  }
  return tree[0]?.branches[0] ?? null;
}

export function getBranchNode(
  progress: KonusDinleProgress,
  level: KonusDinleLevel,
  lengthFilter: KonusDinleLengthFilter
): KonusDinleBranchNode | undefined {
  const tree = buildKonusDinleGoalTree(progress);
  return tree
    .find((l) => l.level === level)
    ?.branches.find((b) => b.lengthFilter === lengthFilter);
}
