export interface GoetheModuleScore {
  correct: number;
  total: number;
  date: string;
}

export interface GoetheModulePoints {
  hoeren: number;
  lesen: number;
  schreiben: number;
  sprechen: number;
  total: number;
  passed: boolean;
}

export interface GoetheExamResult {
  examId: string;
  mode?: "practice" | "real";
  hoeren: GoetheModuleScore;
  lesen: GoetheModuleScore;
  schreiben: {
    completed: boolean;
    date: string;
    form?: number;
    letter?: number;
    points?: number;
  };
  sprechen: {
    completed: number;
    total: number;
    date: string;
    avgScore?: number;
    points?: number;
  };
  points?: GoetheModulePoints;
  passed?: boolean;
  timeUsedSeconds?: number;
  date: string;
}

export interface GoetheProgress {
  hoeren: Record<string, boolean>;
  lesen: Record<string, boolean>;
  schreibenDone: string[];
  sprechenDone: string[];
  sprechenScores: Record<string, number>;
  examResults: Record<string, GoetheExamResult>;
  realExamResults: Record<string, GoetheExamResult>;
  moduleBest: {
    hoeren: number;
    lesen: number;
  };
}

export const DEFAULT_GOETHE: GoetheProgress = {
  hoeren: {},
  lesen: {},
  schreibenDone: [],
  sprechenDone: [],
  sprechenScores: {},
  examResults: {},
  realExamResults: {},
  moduleBest: { hoeren: 0, lesen: 0 },
};

export function calcGoethePct(correct: number, total: number): number {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

export function normalizeGoetheProgress(g: Partial<GoetheProgress> | undefined): GoetheProgress {
  const x = g ?? {};
  return {
    hoeren: x.hoeren && typeof x.hoeren === "object" ? x.hoeren : {},
    lesen: x.lesen && typeof x.lesen === "object" ? x.lesen : {},
    schreibenDone: Array.isArray(x.schreibenDone) ? x.schreibenDone : [],
    sprechenDone: Array.isArray(x.sprechenDone) ? x.sprechenDone : [],
    sprechenScores:
      x.sprechenScores && typeof x.sprechenScores === "object" ? x.sprechenScores : {},
    examResults:
      x.examResults && typeof x.examResults === "object" ? x.examResults : {},
    realExamResults:
      x.realExamResults && typeof x.realExamResults === "object" ? x.realExamResults : {},
    moduleBest: {
      hoeren: typeof x.moduleBest?.hoeren === "number" ? x.moduleBest.hoeren : 0,
      lesen: typeof x.moduleBest?.lesen === "number" ? x.moduleBest.lesen : 0,
    },
  };
}
