import { describe, expect, it } from "vitest";
import { checkB1Structure, countConnectors, MEKTUP_B1_EXAMPLES } from "./mektupB1";

describe("checkB1Structure", () => {
  it("accepts model B1 hotel complaint letter", () => {
    const body = MEKTUP_B1_EXAMPLES[0]!.sampleLetter;
    expect(countConnectors(body)).toBeGreaterThanOrEqual(2);
    expect(checkB1Structure(body, 80).ok).toBe(true);
  });

  it("rejects short text under 80 words", () => {
    const text = `Sehr geehrte Damen und Herren,
ich schreibe Ihnen, weil ich eine Frage habe.
Mit freundlichen Grüßen`;
    expect(checkB1Structure(text, 80).ok).toBe(false);
  });
});
