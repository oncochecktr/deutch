import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_PROGRESS,
  STORAGE_BACKUP_KEY,
  STORAGE_KEY,
  calcAccuracy,
  loadProgress,
  recordAnswer,
  resetStudyProfile,
  resolveNewerProgress,
  type UserProgress,
} from "./progress";

function progressWithSavedAt(iso: string, marker: string): UserProgress {
  return {
    ...DEFAULT_PROGRESS,
    lastSavedAt: iso,
    knownWordIds: [marker],
  };
}

describe("resolveNewerProgress", () => {
  it("prefers backup when lastSavedAt is newer", () => {
    const local = progressWithSavedAt("2026-06-01T10:00:00.000Z", "local");
    const backup = progressWithSavedAt("2026-06-02T10:00:00.000Z", "backup");
    const { progress, promoteBackup } = resolveNewerProgress(local, backup);
    expect(progress?.knownWordIds).toEqual(["backup"]);
    expect(promoteBackup).toBe(true);
  });

  it("keeps local when it is newer or equal", () => {
    const local = progressWithSavedAt("2026-06-03T10:00:00.000Z", "local");
    const backup = progressWithSavedAt("2026-06-02T10:00:00.000Z", "backup");
    const { progress, promoteBackup } = resolveNewerProgress(local, backup);
    expect(progress?.knownWordIds).toEqual(["local"]);
    expect(promoteBackup).toBe(false);
  });

  it("uses backup when local is missing", () => {
    const backup = progressWithSavedAt("2026-06-01T10:00:00.000Z", "backup");
    const { progress, promoteBackup } = resolveNewerProgress(null, backup);
    expect(progress?.knownWordIds).toEqual(["backup"]);
    expect(promoteBackup).toBe(true);
  });
});

describe("loadProgress", () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    for (const key of Object.keys(store)) delete store[key];
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    });
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => store[`session:${key}`] ?? null,
      setItem: (key: string, value: string) => {
        store[`session:${key}`] = value;
      },
      removeItem: (key: string) => {
        delete store[`session:${key}`];
      },
    });
  });

  it("promotes newer session backup to localStorage", () => {
    const older = { ...DEFAULT_PROGRESS, lastSavedAt: "2026-06-01T10:00:00.000Z", knownWordIds: ["old"] };
    const newer = { ...DEFAULT_PROGRESS, lastSavedAt: "2026-06-02T10:00:00.000Z", knownWordIds: ["new"] };
    store[STORAGE_KEY] = JSON.stringify(older);
    store[`session:${STORAGE_BACKUP_KEY}`] = JSON.stringify(newer);

    const loaded = loadProgress();
    expect(loaded.knownWordIds).toEqual(["new"]);
    expect(JSON.parse(store[STORAGE_KEY]!).knownWordIds).toEqual(["new"]);
  });
});

describe("resetStudyProfile", () => {
  it("clears SRS, grundlagen and el-kitabi progress", () => {
    const dirty: UserProgress = {
      ...DEFAULT_PROGRESS,
      knownWordIds: ["a1_0001"],
      srsRecords: { a1_0001: { step: 1, nextReview: "2026-06-29", lastReview: null, totalReviews: 1, correctStreak: 1, firstSeen: "2026-06-01" } },
      grundlagen: {
        ...DEFAULT_PROGRESS.grundlagen,
        patternsCompleted: ["ich-bin"],
      },
      elKitabi: {
        subsections: { "ch02-5": { read: true, quizBest: 1, quizTotal: 2 } },
      },
    };

    const reset = resetStudyProfile(dirty);
    expect(reset.knownWordIds).toEqual([]);
    expect(reset.srsRecords).toEqual({});
    expect(reset.grundlagen?.patternsCompleted).toEqual([]);
    expect(reset.elKitabi?.subsections).toEqual({});
  });
});

describe("calcAccuracy", () => {
  it("uses daily correct/wrong counts only", () => {
    const p: UserProgress = {
      ...DEFAULT_PROGRESS,
      dailyStats: {
        ...DEFAULT_PROGRESS.dailyStats,
        correct: 8,
        wrong: 2,
      },
    };
    expect(calcAccuracy(p)).toBe(80);
  });

  it("returns 0 when no answers today", () => {
    expect(calcAccuracy(DEFAULT_PROGRESS)).toBe(0);
  });
});

describe("recordAnswer", () => {
  it("increments newWordsLearned for first correct a1 word", () => {
    const updated = recordAnswer(DEFAULT_PROGRESS, "a1_0001", true);
    expect(updated.dailyStats.newWordsLearned).toBe(1);
    expect(updated.knownWordIds).toContain("a1_0001");
  });
});
