import raw from "../../../data/a1/word-patterns.json";
import type { PatternBreakdownPart } from "@/lib/grundlagen";

export interface WordPatternSentence {
  patternId: string;
  de: string;
  tr: string;
  breakdown: PatternBreakdownPart[];
}

export interface WordPatternEntry {
  word: string;
  translation_tr: string;
  patterns: WordPatternSentence[];
}

export interface WordPatternsData {
  version: string;
  level: string;
  description: string;
  patternCoverage: Record<string, number>;
  totalWords: number;
  entries: Record<string, WordPatternEntry>;
}

const data = raw as WordPatternsData;

export function getWordPatternsData(): WordPatternsData {
  return data;
}

export function getWordPatterns(wordId: string): WordPatternEntry | null {
  return data.entries[wordId] ?? null;
}

export function getPatternCoverage(patternId: string): number {
  return data.patternCoverage[patternId] ?? 0;
}
