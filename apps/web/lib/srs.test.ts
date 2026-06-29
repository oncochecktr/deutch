import { describe, expect, it } from "vitest";
import {
  addDays,
  buildReviewQueue,
  createSRSRecord,
  isMastered,
  processSRSReview,
  SRS_INTERVALS,
  SRS_QUEUE_MAX_NEW,
  todayISO,
} from "./srs";

describe("processSRSReview", () => {
  it("advances interval on correct answer", () => {
    const rec = createSRSRecord("2026-06-01");
    const next = processSRSReview(rec, true, "2026-06-01");
    expect(next.step).toBe(1);
    expect(next.nextReview).toBe(addDays("2026-06-01", SRS_INTERVALS[1]));
    expect(next.correctStreak).toBe(1);
  });

  it("resets to 1-day interval on wrong answer", () => {
    const rec = processSRSReview(createSRSRecord("2026-06-01"), true, "2026-06-01");
    const wrong = processSRSReview(rec, false, "2026-06-02");
    expect(wrong.step).toBe(0);
    expect(wrong.nextReview).toBe(addDays("2026-06-02", SRS_INTERVALS[0]));
    expect(wrong.correctStreak).toBe(0);
  });

  it("marks mastered at final step with streak", () => {
    const start = todayISO();
    let rec = createSRSRecord(start);
    const lastStep = SRS_INTERVALS.length - 1;
    let reviewDate = start;
    for (let i = 0; i < lastStep; i++) {
      rec = processSRSReview(rec, true, reviewDate);
      reviewDate = rec.nextReview;
    }
    rec = processSRSReview(rec, true, reviewDate);
    expect(rec.step).toBe(lastStep);
    expect(rec.correctStreak).toBeGreaterThanOrEqual(2);
    expect(isMastered(rec)).toBe(true);
  });
});

describe("buildReviewQueue", () => {
  const ids = ["w1", "w2", "w3", "w4", "w5", "w6"];

  it("puts overdue words before due-today and new", () => {
    const records = {
      w1: {
        ...createSRSRecord("2026-05-01"),
        step: 1,
        nextReview: "2026-05-10",
        lastReview: "2026-05-09",
        totalReviews: 2,
        correctStreak: 1,
        firstSeen: "2026-05-01",
      },
      w2: {
        ...createSRSRecord("2026-06-01"),
        step: 0,
        nextReview: "2026-06-29",
        lastReview: "2026-06-28",
        totalReviews: 1,
        correctStreak: 1,
        firstSeen: "2026-06-01",
      },
    };

    const queue = buildReviewQueue(ids, records, 4, "2026-06-29");
    expect(queue[0]).toBe("w1");
    expect(queue).toContain("w2");
    expect(queue.length).toBeLessThanOrEqual(4);
  });

  it("caps new words when due slots are full", () => {
    const records: Record<string, ReturnType<typeof createSRSRecord>> = {};
    for (let i = 0; i < SRS_QUEUE_MAX_NEW + 2; i++) {
      const id = `due-${i}`;
      records[id] = {
        ...createSRSRecord("2026-06-01"),
        nextReview: "2026-06-29",
        lastReview: "2026-06-28",
        totalReviews: 1,
        correctStreak: 1,
      };
    }

    const allIds = [
      ...Object.keys(records),
      "n1",
      "n2",
      "n3",
      "n4",
      "n5",
      "n6",
      "n7",
      "n8",
      "n9",
    ];
    const queue = buildReviewQueue(allIds, records, 10, "2026-06-29");
    const newInQueue = queue.filter((id) => id.startsWith("n"));
    expect(newInQueue.length).toBeLessThanOrEqual(SRS_QUEUE_MAX_NEW);
    expect(queue.length).toBe(10);
  });
});
