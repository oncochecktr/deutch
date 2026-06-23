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
import type { GrammarSource } from "./types";

const MODAL_IDS = new Set(["koennen", "muessen", "moechten", "wollen", "duerfen"]);

export function countQuizzesForSource(src: GrammarSource): number {
  switch (src.kind) {
    case "grammar-pack": {
      const sec = getA1Core().grammarPack.sections.find((s) => s.id === src.sectionId);
      return sec?.quiz.length ?? 0;
    }
    case "patterns":
      return getPatternTrainer().patterns.reduce((n, p) => n + p.examples.length, 0);
    default:
      return 0;
  }
}

export function countDrillsForSource(src: GrammarSource): number {
  switch (src.kind) {
    case "conjugation": {
      const verbs = getConjugationMatrix().verbs.filter((v) => {
        if (src.verbIds?.length) return src.verbIds.includes(v.id);
        return v.id !== "sein" && v.id !== "haben" && !MODAL_IDS.has(v.id);
      });
      return verbs.reduce((n, v) => n + v.drills.length, 0);
    }
    case "trainer-set": {
      const trainer = getTrainerById(src.trainer);
      const sets = src.setIds?.length
        ? trainer.sets.filter((s) => src.setIds!.includes(s.id))
        : trainer.sets;
      return sets.reduce((n, s) => n + s.drills.length, 0);
    }
    case "word-order": {
      const wo = getWordOrderTrainer();
      let n = 0;
      if (src.sectionIds?.length) {
        for (const id of src.sectionIds) {
          const sec = wo.sections.find((s) => s.id === id);
          n += sec?.drill.length ?? 0;
        }
      }
      if (src.includeMega) n += wo.megaDrill.length;
      return n;
    }
    case "patterns":
      return 0;
    case "satz":
      return getA1Core().sentenceBuilder.exercises.length;
    default:
      return 0;
  }
}

function getTrainerById(trainer: "artikel" | "dativ" | "negation" | "prepositions" | "possessives") {
  switch (trainer) {
    case "artikel":
      return getArtikelTrainer();
    case "dativ":
      return getDativTrainer();
    case "negation":
      return getNegationTrainer();
    case "prepositions":
      return getPrepositionsTrainer();
    case "possessives":
      return getPossessiveTrainer();
  }
}

export function countQuizzes(sources: GrammarSource[]): number {
  const packIds = new Set<string>();
  let total = 0;
  for (const src of sources) {
    if (src.kind === "grammar-pack") {
      if (packIds.has(src.sectionId)) continue;
      packIds.add(src.sectionId);
    }
    total += countQuizzesForSource(src);
  }
  return total;
}

export function countDrills(sources: GrammarSource[]): number {
  return sources.reduce((n, src) => n + countDrillsForSource(src), 0);
}
