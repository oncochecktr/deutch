import drillsData from "../../../data/grundlagen/a1-motor-drills.json";

export type MotorDrillLineType = "dialogue" | "example";

export interface MotorDrillDialogue {
  type: "dialogue";
  question_de: string;
  question_tr: string;
  answer_de: string;
  answer_tr: string;
}

export interface MotorDrillExample {
  type: "example";
  de: string;
  tr: string;
}

export type MotorDrillLine = MotorDrillDialogue | MotorDrillExample;

export interface MotorDrillGroup {
  id: string;
  patternIds: string[];
  title: string;
  titleTr: string;
  moduleHref: string;
  lines: MotorDrillLine[];
}

export interface MotorDrillsPack {
  version: string;
  title: string;
  titleTr: string;
  groups: MotorDrillGroup[];
}

export function getMotorDrills(): MotorDrillsPack {
  return drillsData as MotorDrillsPack;
}

export function getMotorDrillGroups(): MotorDrillGroup[] {
  return getMotorDrills().groups;
}

/** patternIds içinde eşleşen grupları döndür (örn. "wo-ist", "das-ist-ein") */
export function getMotorDrillsForPattern(patternId: string): MotorDrillGroup[] {
  return getMotorDrillGroups().filter((g) => g.patternIds.includes(patternId));
}

export function getMotorDrillGroup(id: string): MotorDrillGroup | undefined {
  return getMotorDrillGroups().find((g) => g.id === id);
}
