import { describe, expect, it } from "vitest";
import { DEFAULT_PROGRESS } from "./progress";
import { recordWordExposure, recordWordRecall } from "./learningEngine";

const WORD = "a1_0001";

function progressWithWord(): typeof DEFAULT_PROGRESS {
  return {
    ...DEFAULT_PROGRESS,
    wordProgress: {
      [WORD]: {
        correct: 0,
        wrong: 0,
        lastSeen: "2026-06-01T10:00:00.000Z",
        mastered: false,
      },
    },
  };
}

describe("recordWordExposure", () => {
  it("does not change SRS, knownWordIds or daily newWordsLearned", () => {
    const before = progressWithWord();
    const after = recordWordExposure(before, WORD);

    expect(after.srsRecords).toEqual(before.srsRecords);
    expect(after.knownWordIds).toEqual(before.knownWordIds);
    expect(after.dailyStats.newWordsLearned).toBe(before.dailyStats.newWordsLearned);
    expect(after.dailyStats.wordsReviewed).toBe(before.dailyStats.wordsReviewed);
    expect(after.wordProgress[WORD]?.lastSeen).not.toBe(before.wordProgress[WORD]?.lastSeen);
  });

  it("no-ops when word has no progress entry", () => {
    expect(recordWordExposure(DEFAULT_PROGRESS, WORD)).toBe(DEFAULT_PROGRESS);
  });
});

describe("recordWordRecall", () => {
  it("updates SRS and daily counters on quiz recall", () => {
    const after = recordWordRecall(DEFAULT_PROGRESS, WORD, true, "quiz");
    expect(after.srsRecords[WORD]).toBeDefined();
    expect(after.dailyStats.wordsReviewed).toBe(1);
    expect(after.dailyStats.newWordsLearned).toBe(1);
  });

  it("increments srsReviews for srs kind", () => {
    const after = recordWordRecall(DEFAULT_PROGRESS, WORD, false, "srs");
    expect(after.dailyStats.srsReviews).toBe(1);
  });
});
