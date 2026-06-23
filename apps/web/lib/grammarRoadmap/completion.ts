import type { GrundlagenProgress } from "../progress";
import {
  getA1Core,
  getArtikelTrainer,
  getConjugationMatrix,
  getDativTrainer,
  getNegationTrainer,
  getPatternTrainer,
  getPossessiveTrainer,
  getPrepositionsTrainer,
  getWordOrderTrainer,
} from "../grundlagen";
import type { GrammarRuleRef, GrammarSource, RoadmapCardStatus } from "./types";

const MODAL_IDS = new Set(["koennen", "muessen", "moechten", "wollen", "duerfen"]);

function pct(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

function sourceCompletion(progress: GrundlagenProgress, src: GrammarSource): number {
  const g = progress;
  switch (src.kind) {
    case "grammar-pack": {
      const sec = getA1Core().grammarPack.sections.find((s) => s.id === src.sectionId);
      if (!sec?.quiz.length) return 0;
      const correct = g.grammarPack[src.sectionId] ?? 0;
      return pct(correct, sec.quiz.length);
    }
    case "conjugation": {
      const verbs = getConjugationMatrix().verbs.filter((v) => {
        if (src.verbIds?.length) return src.verbIds.includes(v.id);
        return v.id !== "sein" && v.id !== "haben" && !MODAL_IDS.has(v.id);
      });
      if (!verbs.length) return 0;
      const done = verbs.filter((v) => g.conjugationCompleted.includes(v.id)).length;
      return pct(done, verbs.length);
    }
    case "trainer-set": {
      const { completedKey, sets } = getTrainerProgressKeys(src.trainer, src.setIds);
      const completed = g[completedKey] as string[];
      const done = sets.filter((id) => completed.includes(id)).length;
      return pct(done, sets.length);
    }
    case "word-order": {
      const wo = getWordOrderTrainer();
      const ids: string[] = [...(src.sectionIds ?? [])];
      if (src.includeMega) ids.push("mega");
      const total = ids.length;
      if (!total) return 0;
      const done = ids.filter((id) => g.wordOrderCompleted.includes(id)).length;
      return pct(done, total);
    }
    case "patterns":
      return pct(g.patternsCompleted.length, getPatternTrainer().patterns.length);
    case "satz":
      return pct(g.satzCompleted.length, getA1Core().sentenceBuilder.exercises.length);
    case "grammar-block":
    case "fragewoerter":
    case "a2-section":
      return 0;
    default:
      return 0;
  }
}

function getTrainerProgressKeys(
  trainer: "artikel" | "dativ" | "negation" | "prepositions" | "possessives",
  setIds?: string[]
): { completedKey: keyof GrundlagenProgress; sets: string[] } {
  switch (trainer) {
    case "artikel":
      return {
        completedKey: "articlesCompleted",
        sets: (setIds ?? getArtikelTrainer().sets.map((s) => s.id)),
      };
    case "dativ":
      return {
        completedKey: "dativCompleted",
        sets: (setIds ?? getDativTrainer().sets.map((s) => s.id)),
      };
    case "negation":
      return {
        completedKey: "negationCompleted",
        sets: (setIds ?? getNegationTrainer().sets.map((s) => s.id)),
      };
    case "prepositions":
      return {
        completedKey: "prepositionsCompleted",
        sets: (setIds ?? getPrepositionsTrainer().sets.map((s) => s.id)),
      };
    case "possessives":
      return {
        completedKey: "possessivesCompleted",
        sets: (setIds ?? getPossessiveTrainer().sets.map((s) => s.id)),
      };
  }
}

export function ruleCompletionPct(progress: GrundlagenProgress, ref: GrammarRuleRef): number {
  if (ref.level === "A2") return 0;
  if (!ref.sources.length) return 0;

  const measurable = ref.sources.filter(
    (s) =>
      s.kind !== "grammar-block" &&
      s.kind !== "fragewoerter" &&
      s.kind !== "a2-section"
  );

  if (!measurable.length) {
    const packSources = ref.sources.filter((s) => s.kind === "grammar-pack");
    if (packSources.length) {
      const scores = packSources.map((s) => sourceCompletion(progress, s));
      return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
    return 0;
  }

  const scores = measurable.map((s) => sourceCompletion(progress, s));
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function cardStatus(
  completionPct: number,
  order: number,
  prevDone: boolean,
  level: GrammarRuleRef["level"]
): RoadmapCardStatus {
  if (level === "B1") return "locked";
  if (completionPct >= 100) return "done";
  if (completionPct > 0) return "in_progress";
  if (order === 1 || prevDone) return "available";
  return "available";
}
