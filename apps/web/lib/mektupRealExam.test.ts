import { describe, expect, it } from "vitest";
import { checkStructure } from "./mektupRealExam";

describe("checkStructure", () => {
  const closing = `
Ich bitte um eine Antwort.
Vielen Dank im Voraus.
Mit freundlichen Grüßen`;

  it("accepts ich schreibe …, weil …", () => {
    const text = `Sehr geehrte Damen und Herren,
ich schreibe Ihnen, weil ich einen Deutschkurs suchen möchte.
${closing}`;
    expect(checkStructure(text).ok).toBe(true);
  });

  it("accepts reason then Deshalb schreibe ich", () => {
    const text = `Sehr geehrte Damen und Herren,
ich möchte im Juli einen Deutschkurs machen. Deshalb schreibe ich Ihnen.
${closing}`;
    expect(checkStructure(text).ok).toBe(true);
  });

  it("rejects Deshalb alone without reason or weil", () => {
    const text = `Sehr geehrte Damen und Herren,
Deshalb schreibe ich Ihnen.
${closing}`;
    expect(checkStructure(text).ok).toBe(false);
  });
});
