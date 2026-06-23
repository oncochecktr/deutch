import { nextGrammarHref } from "../learningPathGrammar";
import type { UserProgress } from "../progress";
import { A1_GRAMMAR_MANIFEST, A2_GRAMMAR_MANIFEST } from "./manifest";
import { countDrills, countQuizzes } from "./counts";
import { cardStatus, ruleCompletionPct } from "./completion";
import { extractRuleContent } from "./extract";
import type { GrammarRoadmapState, GrammarRuleCard, RoadmapLevel } from "./types";

function buildHref(ref: { href: string; hrefQuery?: string }): string {
  return ref.hrefQuery ? `${ref.href}?${ref.hrefQuery}` : ref.href;
}

export function buildGrammarRoadmap(
  progress: UserProgress,
  level: RoadmapLevel = "A1"
): GrammarRoadmapState {
  const manifest = level === "A2" ? A2_GRAMMAR_MANIFEST : A1_GRAMMAR_MANIFEST;
  let prevDone = true;
  const cards: GrammarRuleCard[] = manifest.map((ref) => {
    const completionPct = ruleCompletionPct(progress.grundlagen, ref);
    const status = cardStatus(completionPct, ref.order, prevDone, ref.level);
    if (completionPct < 100) prevDone = false;

    const content = extractRuleContent(ref);
    return {
      id: ref.id,
      level: ref.level,
      order: ref.order,
      title: content.title,
      titleDe: content.titleDe,
      summary: content.summary,
      exampleDe: content.exampleDe,
      exampleTr: content.exampleTr,
      quizCount: countQuizzes(ref.sources),
      drillCount: countDrills(ref.sources),
      completionPct,
      status,
      href: buildHref(ref),
    };
  });

  const completedCount = cards.filter((c) => c.status === "done").length;
  const totalCount = cards.length;
  const completionPct =
    totalCount > 0 ? Math.round(cards.reduce((s, c) => s + c.completionPct, 0) / totalCount) : 0;

  const activeCard =
    cards.find((c) => c.status === "in_progress") ??
    cards.find((c) => c.status === "available") ??
    null;

  return {
    level,
    cards,
    completedCount,
    totalCount,
    completionPct,
    activeCardId: activeCard?.id ?? null,
    continueHref: nextGrammarHref(progress),
  };
}

export function buildAllLevelsSummary(progress: UserProgress) {
  const a1 = buildGrammarRoadmap(progress, "A1");
  const a2 = buildGrammarRoadmap(progress, "A2");
  return { a1, a2 };
}

export { A1_GRAMMAR_MANIFEST, A2_GRAMMAR_MANIFEST } from "./manifest";
export type { GrammarRuleCard, GrammarRoadmapState, RoadmapLevel } from "./types";
