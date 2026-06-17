import type { UserProgress } from "./progress";
import { countStudiedA1Words } from "./progress";
import type { A1ReadinessReport } from "./readinessEngine";
import { A1_TARGETS } from "./dailyGoals";
import { getA1Core, getPatternTrainer, getConjugationMatrix, getPossessiveTrainer, getWordOrderTrainer } from "./grundlagen";
import { getBankMeta } from "@german-coach/exams";
import { getA1Vocabulary } from "@german-coach/vocabulary";

export type LearningStageId = "words" | "grammar" | "goethe" | "exam";

export interface LearningStage {
  id: LearningStageId;
  step: number;
  title: string;
  tagline: string;
  href: string;
  cta: string;
  progress: number;
  status: "locked" | "active" | "done";
  detail: string;
}

export interface LearningPathState {
  stages: LearningStage[];
  activeStageId: LearningStageId;
  headline: string;
  subline: string;
  primaryHref: string;
  primaryCta: string;
  persona: "building_pool" | "grammar_focus" | "exam_focus" | "ready";
}

function wordsProgress(report: A1ReadinessReport): number {
  return Math.min(100, report.moduleScores.words);
}

function grammarProgress(progress: UserProgress): number {
  const core = getA1Core();
  const patternsTotal = getPatternTrainer().patterns.length;
  const conjugationTotal = getConjugationMatrix().verbs.length;
  const possessivesTotal = getPossessiveTrainer().sets.length;
  const wordOrderTotal = getWordOrderTrainer().sections.length + 1;
  const satzTotal = core.sentenceBuilder.exercises.length;
  const satzDone = progress.grundlagen.satzCompleted.length;
  const patternsDone = progress.grundlagen.patternsCompleted.length;
  const conjugationDone = progress.grundlagen.conjugationCompleted.length;
  const possessivesDone = progress.grundlagen.possessivesCompleted.length;
  const wordOrderDone = progress.grundlagen.wordOrderCompleted.length;
  const packSections = core.grammarPack.sections.length;
  const packDone = Object.keys(progress.grundlagen.grammarPack).length;
  const satzPct = satzTotal ? (satzDone / satzTotal) * 100 : 0;
  const patternsPct = patternsTotal ? (patternsDone / patternsTotal) * 100 : 0;
  const conjugationPct = conjugationTotal ? (conjugationDone / conjugationTotal) * 100 : 0;
  const possessivesPct = possessivesTotal ? (possessivesDone / possessivesTotal) * 100 : 0;
  const wordOrderPct = wordOrderTotal ? (wordOrderDone / wordOrderTotal) * 100 : 0;
  const packPct = packSections ? (packDone / packSections) * 100 : 0;
  return Math.round(
    satzPct * 0.12 +
      conjugationPct * 0.25 +
      possessivesPct * 0.15 +
      wordOrderPct * 0.18 +
      patternsPct * 0.2 +
      packPct * 0.1
  );
}

function goetheProgress(report: A1ReadinessReport): number {
  const m = report.moduleScores;
  return Math.round((m.hoeren + m.lesen + m.schreiben + m.sprechen) / 4);
}

function examProgress(progress: UserProgress): number {
  const practice = Object.keys(progress.goethe.examResults).length;
  const real = Object.values(progress.goethe.realExamResults).filter(
    (r) => r.passed || (r.points?.total ?? 0) >= A1_TARGETS.realExamPassPoints
  ).length;
  let pct = 0;
  if (practice >= A1_TARGETS.practiceExamsMin) pct += 50;
  else pct += Math.round((practice / A1_TARGETS.practiceExamsMin) * 50);
  if (real >= A1_TARGETS.realExamsMin) pct += 50;
  else pct += Math.round((real / A1_TARGETS.realExamsMin) * 50);
  return Math.min(100, pct);
}

function nextGrammarHref(progress: UserProgress): string {
  const core = getA1Core();
  const patternsTotal = getPatternTrainer().patterns.length;
  const conjugationTotal = getConjugationMatrix().verbs.length;
  const possessivesTotal = getPossessiveTrainer().sets.length;
  const wordOrderTotal = getWordOrderTrainer().sections.length + 1;
  const patternsDone = progress.grundlagen.patternsCompleted.length;
  const conjugationDone = progress.grundlagen.conjugationCompleted.length;
  const possessivesDone = progress.grundlagen.possessivesCompleted.length;
  const wordOrderDone = progress.grundlagen.wordOrderCompleted.length;
  const satzTotal = core.sentenceBuilder.exercises.length;
  const satzDone = progress.grundlagen.satzCompleted.length;
  const packSections = core.grammarPack.sections.length;
  const packDone = Object.keys(progress.grundlagen.grammarPack).length;

  if (satzDone < Math.ceil(satzTotal * 0.3)) return "/grundlagen/satz";
  if (conjugationDone < Math.min(5, conjugationTotal)) return "/grundlagen/conjugation";
  if (possessivesDone < Math.min(3, possessivesTotal)) return "/grundlagen/possessives";
  if (wordOrderDone < Math.min(3, wordOrderTotal)) return "/grundlagen/word-order";
  if (patternsDone < Math.ceil(patternsTotal * 0.2)) return "/grundlagen/patterns";
  if (conjugationDone < conjugationTotal) return "/grundlagen/conjugation";
  if (possessivesDone < possessivesTotal) return "/grundlagen/possessives";
  if (wordOrderDone < wordOrderTotal) return "/grundlagen/word-order";
  if (patternsDone < patternsTotal) return "/grundlagen/patterns";
  if (packDone < packSections) return "/grundlagen/grammar-pack";
  if (satzDone < satzTotal) return "/grundlagen/satz";
  return "/grundlagen";
}

function nextGoetheHref(progress: UserProgress, report: A1ReadinessReport): string {
  const m = report.moduleScores;
  const bank = getBankMeta();
  const hoerenDone = Object.keys(progress.goethe.hoeren).length;

  if (m.hoeren < A1_TARGETS.hoerenPct || hoerenDone < bank.counts.hoeren * 0.15) {
    return "/exam/hoeren";
  }
  if (m.lesen < A1_TARGETS.lesenPct) return "/exam/lesen";
  if (m.schreiben < A1_TARGETS.schreibenPct) return "/exam/schreiben";
  if (m.sprechen < A1_TARGETS.sprechenPct) return "/exam/sprechen";
  return "/exam";
}

function resolveActiveStage(
  wordsDone: boolean,
  grammarDone: boolean,
  goetheDone: boolean,
  examDone: boolean
): LearningStageId {
  if (examDone) return "exam";
  if (!wordsDone) return "words";
  if (!grammarDone) return "grammar";
  if (!goetheDone) return "goethe";
  return "exam";
}

export function computeLearningPath(
  progress: UserProgress,
  report: A1ReadinessReport
): LearningPathState {
  const a1Total = getA1Vocabulary().total;
  const a1Studied = countStudiedA1Words(progress);

  const wProg = wordsProgress(report);
  const gProg = grammarProgress(progress);
  const goProg = goetheProgress(report);
  const eProg = examProgress(progress);

  const wordsDone = wProg >= A1_TARGETS.wordsKnownPct;
  const grammarDone = gProg >= A1_TARGETS.grammarPct;
  const goetheDone =
    report.moduleScores.hoeren >= A1_TARGETS.hoerenPct &&
    report.moduleScores.lesen >= A1_TARGETS.lesenPct &&
    report.moduleScores.schreiben >= A1_TARGETS.schreibenPct &&
    report.moduleScores.sprechen >= A1_TARGETS.sprechenPct;
  const examDone = report.readyForExam;

  const activeStageId = resolveActiveStage(wordsDone, grammarDone, goetheDone, examDone);
  const activeStep = { words: 1, grammar: 2, goethe: 3, exam: 4 }[activeStageId];

  const stageDefs = [
    {
      id: "words" as const,
      step: 1,
      title: "Kelime havuzu",
      tagline: "577 A1 kelime",
      href: "/cards",
      cta: "Kartlara git",
      progress: wProg,
      detail: `${a1Studied} / ${a1Total}`,
    },
    {
      id: "grammar" as const,
      step: 2,
      title: "Gramer temeli",
      tagline: "Satz · Matrix · Possessive · Sıra · Pattern · Pack",
      href: nextGrammarHref(progress),
      cta: "Gramere devam",
      progress: gProg,
      detail: "Çekim + kalıp + cümle",
    },
    {
      id: "goethe" as const,
      step: 3,
      title: "A1 sınav modülleri",
      tagline: "Hören · Lesen · Schreiben · Sprechen",
      href: nextGoetheHref(progress, report),
      cta: "Modüle git",
      progress: goProg,
      detail: "Dinleme → konuşma",
    },
    {
      id: "exam" as const,
      step: 4,
      title: "Sınav simülasyonu",
      tagline: "Gerçek mod · 60/100",
      href: "/exam/real/exam_01",
      cta: "Sınava başla",
      progress: eProg,
      detail: "65 dk · 4 bölüm",
    },
  ];

  const stages: LearningStage[] = stageDefs.map((d) => {
    let status: LearningStage["status"] = "locked";
    if (d.step < activeStep || (d.id === "words" && wordsDone) || (d.id === "grammar" && grammarDone) || (d.id === "goethe" && goetheDone) || (d.id === "exam" && examDone)) {
      status = "done";
    } else if (d.id === activeStageId) {
      status = "active";
    }
    if (d.id === activeStageId && !examDone) status = "active";
    if (examDone && d.id === "exam") status = "done";
    return { ...d, status };
  });

  const active = stages.find((s) => s.id === activeStageId)!;

  let persona: LearningPathState["persona"] = "building_pool";
  let headline = "Kelime havuzunu kur";
  let subline = "Buradan başla — kartlarla devam et.";

  if (wordsDone && !grammarDone) {
    persona = "grammar_focus";
    headline = "Havuzun hazır — gramer zamanı";
    subline = "Tek tıkla gramer modülüne geç.";
  } else if (grammarDone && !goetheDone) {
    persona = "exam_focus";
    headline = "Sınav modüllerine geç";
    subline = "Dinleme, okuma, yazma, konuşma.";
  } else if (goetheDone && !examDone) {
    persona = "exam_focus";
    headline = "Deneme sınavı zamanı";
    subline = "Gerçek mod: 65 dk, geçme 60 puan.";
  } else if (examDone) {
    persona = "ready";
    headline = "Sınava hazırsın";
    subline = "İstersen tekrar deneme çöz.";
  }

  const primaryHref = examDone ? "/exam" : active.href;
  const primaryCta = examDone ? "Sınav hub" : active.cta;

  return {
    stages,
    activeStageId,
    headline,
    subline,
    primaryHref,
    primaryCta,
    persona,
  };
}
