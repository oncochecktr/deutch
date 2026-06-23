import type { UserProgress } from "./progress";
import {
  getA1Core,
  getPatternTrainer,
  getConjugationMatrix,
  getPossessiveTrainer,
  getWordOrderTrainer,
  getArtikelTrainer,
  getDativTrainer,
  getNegationTrainer,
  getPrepositionsTrainer,
} from "./grundlagen";

/** Sonraki gramer modülü — learning path + harita için ortak */
export function nextGrammarHref(progress: UserProgress): string {
  const core = getA1Core();
  const patternsTotal = getPatternTrainer().patterns.length;
  const conjugationTotal = getConjugationMatrix().verbs.length;
  const possessivesTotal = getPossessiveTrainer().sets.length;
  const wordOrderTotal = getWordOrderTrainer().sections.length + 1;
  const artikelTotal = getArtikelTrainer().sets.length;
  const dativTotal = getDativTrainer().sets.length;
  const negationTotal = getNegationTrainer().sets.length;
  const prepTotal = getPrepositionsTrainer().sets.length;
  const patternsDone = progress.grundlagen.patternsCompleted.length;
  const conjugationDone = progress.grundlagen.conjugationCompleted.length;
  const possessivesDone = progress.grundlagen.possessivesCompleted.length;
  const wordOrderDone = progress.grundlagen.wordOrderCompleted.length;
  const artikelDone = progress.grundlagen.articlesCompleted.length;
  const dativDone = progress.grundlagen.dativCompleted.length;
  const negationDone = progress.grundlagen.negationCompleted.length;
  const prepDone = progress.grundlagen.prepositionsCompleted.length;
  const satzTotal = core.sentenceBuilder.exercises.length;
  const satzDone = progress.grundlagen.satzCompleted.length;
  const packSections = core.grammarPack.sections.length;
  const packDone = Object.keys(progress.grundlagen.grammarPack).length;
  const zeitDone = progress.grundlagen.zeitQuizBest >= 50;

  if (wordOrderDone < Math.min(2, wordOrderTotal)) return "/grundlagen/word-order";
  if (satzDone < Math.ceil(satzTotal * 0.3)) return "/grundlagen/satz";
  if (wordOrderDone < Math.min(3, wordOrderTotal)) return "/grundlagen/word-order";
  if (conjugationDone < Math.min(5, conjugationTotal)) return "/grundlagen/conjugation";
  if (artikelDone < Math.min(3, artikelTotal)) return "/grundlagen/artikel";
  if (possessivesDone < Math.min(3, possessivesTotal)) return "/grundlagen/possessives";
  if (patternsDone < Math.ceil(patternsTotal * 0.2)) return "/grundlagen/patterns";
  if (dativDone < Math.min(2, dativTotal)) return "/grundlagen/dativ";
  if (negationDone < Math.min(1, negationTotal)) return "/grundlagen/negation";
  if (prepDone < Math.min(2, prepTotal)) return "/grundlagen/prepositions";
  if (conjugationDone < conjugationTotal) return "/grundlagen/conjugation";
  if (artikelDone < artikelTotal) return "/grundlagen/artikel";
  if (possessivesDone < possessivesTotal) return "/grundlagen/possessives";
  if (wordOrderDone < wordOrderTotal) return "/grundlagen/word-order";
  if (patternsDone < patternsTotal) return "/grundlagen/patterns";
  if (dativDone < dativTotal) return "/grundlagen/dativ";
  if (negationDone < negationTotal) return "/grundlagen/negation";
  if (prepDone < prepTotal) return "/grundlagen/prepositions";
  if (packDone < packSections) return "/grundlagen/grammar-pack";
  if (!zeitDone) return "/grundlagen/zeit";
  if (satzDone < satzTotal) return "/grundlagen/satz";
  return "/grundlagen";
}
