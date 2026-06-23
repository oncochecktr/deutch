export type RoadmapLevel = "A1" | "A2" | "B1";

export type GrammarSource =
  | { kind: "grammar-pack"; sectionId: string }
  | { kind: "grammar-block"; block: string }
  | { kind: "fragewoerter" }
  | { kind: "conjugation"; verbIds?: string[] }
  | { kind: "trainer-set"; trainer: "artikel" | "dativ" | "negation" | "prepositions" | "possessives"; setIds?: string[] }
  | { kind: "word-order"; sectionIds?: string[]; includeMega?: boolean }
  | { kind: "patterns" }
  | { kind: "satz" }
  | { kind: "a2-section"; sectionId: string };

export interface GrammarRuleRef {
  id: string;
  level: RoadmapLevel;
  order: number;
  titleTr: string;
  titleDe?: string;
  sources: GrammarSource[];
  href: string;
  hrefQuery?: string;
}

export type RoadmapCardStatus = "locked" | "available" | "in_progress" | "done";

export interface GrammarRuleCard {
  id: string;
  level: RoadmapLevel;
  order: number;
  title: string;
  titleDe?: string;
  summary: string;
  exampleDe: string;
  exampleTr: string;
  quizCount: number;
  drillCount: number;
  completionPct: number;
  status: RoadmapCardStatus;
  href: string;
}

export interface GrammarRoadmapState {
  level: RoadmapLevel;
  cards: GrammarRuleCard[];
  completedCount: number;
  totalCount: number;
  completionPct: number;
  activeCardId: string | null;
  continueHref: string;
}
