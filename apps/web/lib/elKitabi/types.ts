export type CalloutKind = "ipucu" | "dikkat" | "ornek";

export type ElKitabiBlock =
  | { type: "p"; text: string }
  | { type: "callout"; kind: CalloutKind; text: string; de?: string; tr?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "link"; label: string; href: string; note?: string }
  | { type: "h3"; text: string };

export interface ElKitabiSubsection {
  id: string;
  title: string;
  blocks: ElKitabiBlock[];
}

export interface ElKitabiChapter {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  practiceHref?: string;
  practiceLabel?: string;
  subsections: ElKitabiSubsection[];
}

export interface ElKitabiAppendix {
  id: string;
  title: string;
  blocks: ElKitabiBlock[];
}

export interface ElKitabiIntro {
  title: string;
  blocks: ElKitabiBlock[];
  rhythmTable: { stage: string; focus: string; goal: string }[];
}

export interface ElKitabiLevelRow {
  module: string;
  topics: string;
  bookRef: string;
  href?: string;
  status?: "available" | "reference-only";
}

export interface ElKitabiLevel {
  id: "A1" | "A2" | "B1";
  title: string;
  goal: string;
  rows: ElKitabiLevelRow[];
}

export interface ElKitabiRoadmap {
  intro: ElKitabiBlock[];
  levels: ElKitabiLevel[];
  threeGates: { title: string; ref: string; text: string }[];
}

export interface ElKitabiContent {
  intro: ElKitabiIntro;
  roadmap: ElKitabiRoadmap;
  chapters: ElKitabiChapter[];
  appendices: ElKitabiAppendix[];
}

export interface TocEntry {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}
