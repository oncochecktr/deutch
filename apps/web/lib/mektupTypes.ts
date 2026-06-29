export type MektupLevel = "A1" | "B1";

export interface MektupSection {
  id: string;
  labelDe: string;
  labelTr: string;
  hintTr: string;
  placeholder: string;
  phrases: { de: string; tr: string }[];
}

export interface MektupBullet {
  de: string;
  tr: string;
  hints: string[];
}

export interface MektupExample {
  id: string;
  level?: MektupLevel;
  titleTr: string;
  promptDe: string;
  promptTr: string;
  bullets: MektupBullet[];
  sections: MektupSection[];
  sampleLetter: string;
  minWords: number;
  /** B1: hedef üst sınır (fazla uzun yazı ceza riski) */
  maxWords?: number;
  register?: "formal" | "informal";
}

export interface MektupStructureResult {
  ok: boolean;
  missing: string[];
  score?: number;
  hints?: string[];
}
