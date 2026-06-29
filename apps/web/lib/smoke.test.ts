import { describe, expect, it } from "vitest";
import { SMART_QUEUE } from "./dailyGoals";
import { getPracticeForSubsection } from "./elKitabi/practice";
import { buildDailySmartQueue } from "./smartQueue";
import { DEFAULT_PROGRESS } from "./progress";
import { createSRSRecord } from "./srs";

describe("buildDailySmartQueue", () => {
  it("respects daily size config", () => {
    const ids = ["a1_0001", "a1_0002", "a1_0003"];
    const progress = {
      ...DEFAULT_PROGRESS,
      srsRecords: {
        a1_0001: {
          ...createSRSRecord("2026-05-01"),
          nextReview: "2026-05-01",
          lastReview: "2026-04-30",
          totalReviews: 2,
          correctStreak: 0,
        },
      },
      elKitabi: {
        subsections: {
          "ch02-5": { read: true, quizBest: 1, quizTotal: 2 },
        },
      },
    };

    const queue = buildDailySmartQueue(progress, ids);
    expect(queue.total).toBeLessThanOrEqual(SMART_QUEUE.dailySize);
    expect(queue.srsCount + queue.elKitabiCount + queue.grundlagenCount).toBe(queue.total);
  });
});

describe("smoke — audit invariants", () => {
  it("SMART_QUEUE daily size is in 12–15 range", () => {
    expect(SMART_QUEUE.dailySize).toBeGreaterThanOrEqual(12);
    expect(SMART_QUEUE.dailySize).toBeLessThanOrEqual(15);
  });

  it("el-kitabi ch02-5 has practice bridge data", () => {
    const practice = getPracticeForSubsection("ch02-5");
    expect(practice?.moduleHref).toBe("/grundlagen/negation");
    expect(practice?.quiz).toBeDefined();
  });

  it("exposure path exists separate from recall in learning engine", async () => {
    const mod = await import("./learningEngine");
    expect(typeof mod.recordWordExposure).toBe("function");
    expect(typeof mod.recordWordRecall).toBe("function");
  });
});
