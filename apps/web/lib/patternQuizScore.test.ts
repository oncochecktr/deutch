import { describe, expect, it } from "vitest";
import { advancePatternQuizScore } from "./patternQuizScore";

describe("advancePatternQuizScore", () => {
  it("counts last answer once when finishing quiz", () => {
    const questions = 5;
    const correctBeforeLast = questions - 1;
    const finishScore = advancePatternQuizScore(correctBeforeLast, true);
    expect(finishScore).toBe(questions);
    expect(finishScore).not.toBe(questions + 1);
  });

  it("does not add score for wrong last answer", () => {
    expect(advancePatternQuizScore(4, false)).toBe(4);
  });
});
