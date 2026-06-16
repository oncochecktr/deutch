import { getBankMeta } from "@german-coach/exams";
import { getA1Vocabulary } from "@german-coach/vocabulary";
import type { UserProgress } from "./progress";
import { calcAccuracy } from "./progress";
import { calcGoethePct } from "./goetheProgress";
import { A1_TARGETS, DEFAULT_DAILY_GOALS, type DailyGoals } from "./dailyGoals";
import { getSRSStats, todayISO } from "./srs";
import { getTaskMeta, taskFields } from "./dailyTaskLabels";
import { getA1Core, getPatternTrainer, getConjugationMatrix, getPossessiveTrainer, getWordOrderTrainer } from "./grundlagen";

export { A1_TARGETS, DEFAULT_DAILY_GOALS, type DailyGoals };

export interface ModuleScores {
  words: number;
  srs: number;
  grammar: number;
  hoeren: number;
  lesen: number;
  schreiben: number;
  sprechen: number;
  exams: number;
}

export interface TodayTask {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  href: string;
  done: boolean;
  progress: string;
  priority: number;
}

export interface GuideStep {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  cta: string;
  instruction: string;
  href: string;
  done: boolean;
  progress: string;
  estMinutes: number;
}

export interface A1ReadinessReport {
  overallPercent: number;
  estimatedExamDate: string;
  estimatedExamDateISO: string;
  daysUntilExam: number;
  moduleScores: ModuleScores;
  weakAreas: { key: keyof ModuleScores; label: string; score: number; target: number }[];
  focusMessage: string;
  remaining: {
    words: number;
    hoerenQuestions: number;
    lesenPassages: number;
    schreibenTasks: number;
    sprechenCards: number;
    exams: number;
  };
  todayGoals: DailyGoals;
  todayTasks: TodayTask[];
  dailyPlan: GuideStep[];
  nextStep: GuideStep | null;
  allDailyDone: boolean;
  readyForExam: boolean;
}

const GUIDE_COPY: Record<
  string,
  { cta: string; instruction: string; estMinutes: number }
> = {
  srs: {
    cta: "Tekrar Motoruna Git",
    instruction: "SRS = aralıklı tekrar. Kartları çevir → Biliyorum / Tekrar et. Hedef: 80 kelime.",
    estMinutes: 25,
  },
  new: {
    cta: "Kelime Kartlarına Git",
    instruction: "Yeni A1 kelimeleri öğren. Kartı çevir, anlamı gör, Biliyorum de. Hedef: 40 kelime.",
    estMinutes: 20,
  },
  hoeren: {
    cta: "Hören (Dinleme) Oturumuna Git",
    instruction: "Hören = dinleme. Sesi dinle → soruları işaretle → en altta Auswerten (değerlendir).",
    estMinutes: 15,
  },
  lesen: {
    cta: "Lesen (Okuma) Metnine Git",
    instruction: "Lesen = okuma. Metni oku → soruları cevapla → Auswerten ile bitir.",
    estMinutes: 15,
  },
  schreiben: {
    cta: "Schreiben (Yazma) Görevine Git",
    instruction: "Schreiben = yazma. Form veya kısa metin yaz → Tamamladım'a bas.",
    estMinutes: 10,
  },
  sprechen: {
    cta: "Sprechen (Konuşma) Kartlarına Git",
    instruction: "Sprechen = konuşma. Soruyu yüksek sesle cevapla → checklist işaretle.",
    estMinutes: 15,
  },
  listen: {
    cta: "Dinleme (MP3) Moduna Git",
    instruction: "Kulaklık tak, Başlat'a bas. Yürürken A1 kelimeleri dinle. Hedef: ~30 dk.",
    estMinutes: 30,
  },
  exam: {
    cta: "Deneme Sınavına Git",
    instruction: "Bugünkü hedefler bitti. Tam Goethe denemesi çöz.",
    estMinutes: 45,
  },
  rest: {
    cta: "Mesleki Almancaya Git",
    instruction: "Bugünkü A1 hedefleri tamam. İstersen mesleki kelime çalış.",
    estMinutes: 15,
  },
};

const WORKFLOW_ORDER = [
  "srs",
  "new",
  "hoeren",
  "lesen",
  "schreiben",
  "sprechen",
  "listen",
] as const;

function buildDailyPlan(
  todayTasks: TodayTask[],
  srsDue: number,
  examsDone: number
): { dailyPlan: GuideStep[]; nextStep: GuideStep | null; allDailyDone: boolean } {
  const pending = todayTasks.filter((t) => !t.done);
  const allDailyDone = pending.length === 0;

  const ordered = [...WORKFLOW_ORDER]
    .sort((a, b) => {
      if (srsDue > 0) {
        if (a === "srs") return -1;
        if (b === "srs") return 1;
      }
      const ta = todayTasks.find((t) => t.id === a);
      const tb = todayTasks.find((t) => t.id === b);
      return (ta?.priority ?? 99) - (tb?.priority ?? 99);
    })
    .map((id) => todayTasks.find((t) => t.id === id))
    .filter((t): t is TodayTask => !!t && !t.done);

  const dailyPlan: GuideStep[] = ordered.map((task, i) => {
    const copy = GUIDE_COPY[task.id] ?? GUIDE_COPY.new;
    const meta = getTaskMeta(task.id);
    let instruction = copy.instruction;
    if (task.id === "srs" && srsDue > 0) {
      instruction = `${srsDue} kelime bekliyor. Tekrar Motoru → kartları çevir, Biliyorum / Tekrar et.`;
    }
    return {
      id: task.id,
      order: i + 1,
      title: meta.title,
      subtitle: meta.subtitle,
      cta: copy.cta,
      instruction,
      href: task.href,
      done: task.done,
      progress: task.progress,
      estMinutes: copy.estMinutes,
    };
  });

  if (dailyPlan.length === 0) {
    if (examsDone < A1_TARGETS.practiceExamsMin) {
      const copy = GUIDE_COPY.exam;
      const meta = getTaskMeta("exam");
      const step: GuideStep = {
        id: "exam",
        order: 1,
        title: meta.title,
        subtitle: meta.subtitle,
        cta: copy.cta,
        instruction: copy.instruction,
        href: "/exam",
        done: false,
        progress: `${examsDone}/${A1_TARGETS.practiceExamsMin} deneme`,
        estMinutes: copy.estMinutes,
      };
      return { dailyPlan: [step], nextStep: step, allDailyDone: true };
    }
    const copy = GUIDE_COPY.rest;
    const meta = getTaskMeta("rest");
    const step: GuideStep = {
      id: "rest",
      order: 1,
      title: meta.title,
      subtitle: meta.subtitle,
      cta: copy.cta,
      instruction: "A1 günlük planın bitti. Mola ver veya Mesleki Almanca çalış.",
      href: "/mesleki",
      done: true,
      progress: "Tamamlandı",
      estMinutes: copy.estMinutes,
    };
    return { dailyPlan: [step], nextStep: step, allDailyDone: true };
  }

  return { dailyPlan, nextStep: dailyPlan[0], allDailyDone };
}

const MODULE_LABELS: Record<keyof ModuleScores, string> = {
  words: "Kelime",
  srs: "SRS Tekrar",
  grammar: "Gramer",
  hoeren: "Hören (Dinleme)",
  lesen: "Lesen (Okuma)",
  schreiben: "Schreiben (Yazma)",
  sprechen: "Sprechen (Konuşma)",
  exams: "Deneme Sınavı",
};

const MODULE_TARGETS: Record<keyof ModuleScores, number> = {
  words: A1_TARGETS.wordsKnownPct,
  srs: A1_TARGETS.srsAccuracyPct,
  grammar: A1_TARGETS.grammarPct,
  hoeren: A1_TARGETS.hoerenPct,
  lesen: A1_TARGETS.lesenPct,
  schreiben: A1_TARGETS.schreibenPct,
  sprechen: A1_TARGETS.sprechenPct,
  exams: A1_TARGETS.practiceExamPassPct,
};

function calcGrammarScore(progress: UserProgress): number {
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
  const satzPct = satzTotal ? Math.min(100, Math.round((satzDone / satzTotal) * 100)) : 0;
  const patternsPct = patternsTotal
    ? Math.min(100, Math.round((patternsDone / patternsTotal) * 100))
    : 0;
  const conjugationPct = conjugationTotal
    ? Math.min(100, Math.round((conjugationDone / conjugationTotal) * 100))
    : 0;
  const possessivesPct = possessivesTotal
    ? Math.min(100, Math.round((possessivesDone / possessivesTotal) * 100))
    : 0;
  const wordOrderPct = wordOrderTotal
    ? Math.min(100, Math.round((wordOrderDone / wordOrderTotal) * 100))
    : 0;

  const sections = core.grammarPack.sections;
  let packPct = 0;
  if (sections.length > 0) {
    const scores = sections.map((s) => {
      const correct = progress.grundlagen.grammarPack[s.id] ?? 0;
      return Math.min(100, Math.round((correct / s.quiz.length) * 100));
    });
    packPct = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  if (
    satzDone === 0 &&
    patternsDone === 0 &&
    conjugationDone === 0 &&
    possessivesDone === 0 &&
    wordOrderDone === 0 &&
    Object.keys(progress.grundlagen.grammarPack).length === 0
  )
    return 0;
  return Math.round(
    satzPct * 0.12 +
      conjugationPct * 0.25 +
      possessivesPct * 0.15 +
      wordOrderPct * 0.18 +
      patternsPct * 0.2 +
      packPct * 0.1
  );
}

function calcHoerenScore(progress: UserProgress): number {
  const g = progress.goethe;
  const answered = Object.values(g.hoeren);
  if (answered.length >= 10) {
    return Math.round((answered.filter(Boolean).length / answered.length) * 100);
  }
  return g.moduleBest.hoeren;
}

function calcLesenScore(progress: UserProgress): number {
  const g = progress.goethe;
  const answered = Object.values(g.lesen);
  if (answered.length >= 8) {
    return Math.round((answered.filter(Boolean).length / answered.length) * 100);
  }
  return g.moduleBest.lesen;
}

function calcSchreibenScore(progress: UserProgress): number {
  const bank = getBankMeta();
  const done = progress.goethe.schreibenDone.length;
  if (done === 0) return 0;
  return Math.min(100, Math.round((done / bank.counts.schreiben) * 100));
}

function calcSprechenScore(progress: UserProgress): number {
  const g = progress.goethe;
  const scoreValues = Object.values(g.sprechenScores);
  if (scoreValues.length >= 5) {
    return Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);
  }
  const bank = getBankMeta();
  const done = g.sprechenDone.length;
  if (done === 0) return 0;
  return Math.min(100, Math.round((done / bank.counts.sprechen) * 100));
}

function calcExamScore(progress: UserProgress): number {
  const practice = Object.values(progress.goethe.examResults);
  const real = Object.values(progress.goethe.realExamResults);
  const pcts: number[] = [];
  for (const r of practice) {
    if (r.points?.total !== undefined) {
      pcts.push(r.points.total);
    } else {
      const total = r.hoeren.total + r.lesen.total;
      const correct = r.hoeren.correct + r.lesen.correct;
      pcts.push(calcGoethePct(correct, total));
    }
  }
  for (const r of real) {
    if (r.points?.total !== undefined) pcts.push(r.points.total);
  }
  if (pcts.length === 0) return 0;
  return Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
}

function calcWordsScore(progress: UserProgress): number {
  const a1Total = getA1Vocabulary().total;
  const a1Known = progress.knownWordIds.filter((id) => id.startsWith("a1_")).length;
  return Math.min(100, Math.round((a1Known / a1Total) * 100));
}

function calcSrsScore(progress: UserProgress, allWordIds: string[]): number {
  const srs = getSRSStats(allWordIds, progress.srsRecords);
  const masteredPct = allWordIds.length
    ? Math.round((srs.mastered / allWordIds.length) * 100)
    : 0;
  const accuracy = calcAccuracy(progress);
  if (progress.dailyStats.srsReviews === 0 && srs.mastered === 0) return 0;
  return Math.round(masteredPct * 0.5 + accuracy * 0.5);
}

function addDaysISO(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateTR(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function estimateExamDate(progress: UserProgress, remaining: A1ReadinessReport["remaining"]): string {
  if (progress.targetExamDate) return progress.targetExamDate;

  const daysFromWords = Math.ceil(remaining.words / DEFAULT_DAILY_GOALS.newWords);
  const daysFromSrs = Math.ceil(
    Math.max(0, remaining.words) / (DEFAULT_DAILY_GOALS.srsReviews / 2)
  );
  const daysFromGoethe =
    (remaining.hoerenQuestions > 0 ? 14 : 0) +
    (remaining.lesenPassages > 0 ? 10 : 0) +
    (remaining.exams > 0 ? remaining.exams * 2 : 0);

  const days = Math.max(14, daysFromWords, daysFromSrs, daysFromGoethe);
  return addDaysISO(todayISO(), days);
}

export function computeA1Readiness(
  progress: UserProgress,
  allWordIds: string[]
): A1ReadinessReport {
  const bank = getBankMeta();
  const a1Total = getA1Vocabulary().total;
  const a1Known = progress.knownWordIds.filter((id) => id.startsWith("a1_")).length;
  const ds = progress.dailyStats;
  const goals = progress.dailyGoals ?? DEFAULT_DAILY_GOALS;
  const srsStats = getSRSStats(allWordIds, progress.srsRecords);

  const moduleScores: ModuleScores = {
    words: calcWordsScore(progress),
    srs: calcSrsScore(progress, allWordIds),
    grammar: calcGrammarScore(progress),
    hoeren: calcHoerenScore(progress),
    lesen: calcLesenScore(progress),
    schreiben: calcSchreibenScore(progress),
    sprechen: calcSprechenScore(progress),
    exams: calcExamScore(progress),
  };

  const weights = {
    words: 0.2,
    srs: 0.16,
    grammar: 0.08,
    hoeren: 0.18,
    lesen: 0.18,
    schreiben: 0.1,
    sprechen: 0.1,
  };

  let overallPercent = 0;
  overallPercent += moduleScores.words * weights.words;
  overallPercent += moduleScores.srs * weights.srs;
  overallPercent += moduleScores.grammar * weights.grammar;
  overallPercent += moduleScores.hoeren * weights.hoeren;
  overallPercent += moduleScores.lesen * weights.lesen;
  overallPercent += moduleScores.schreiben * weights.schreiben;
  overallPercent += moduleScores.sprechen * weights.sprechen;
  if (moduleScores.exams > 0) {
    overallPercent = overallPercent * 0.85 + moduleScores.exams * 0.15;
  }
  overallPercent = Math.round(Math.min(100, overallPercent));

  const hoerenDone = Object.keys(progress.goethe.hoeren).length;
  const lesenDone = Object.keys(progress.goethe.lesen).length;
  const examsDone = Object.keys(progress.goethe.examResults).length;
  const realExamsDone = Object.values(progress.goethe.realExamResults).filter(
    (r) => r.passed || (r.points?.total ?? 0) >= A1_TARGETS.realExamPassPoints
  ).length;
  const lesenPassagesDone = Math.floor(lesenDone / 4);

  const remaining = {
    words: Math.max(0, Math.ceil(a1Total * 0.85) - a1Known),
    hoerenQuestions: Math.max(0, bank.counts.hoeren - hoerenDone),
    lesenPassages: Math.max(0, bank.counts.lesen_passages - lesenPassagesDone),
    schreibenTasks: Math.max(0, bank.counts.schreiben - progress.goethe.schreibenDone.length),
    sprechenCards: Math.max(0, bank.counts.sprechen - progress.goethe.sprechenDone.length),
    exams: Math.max(0, A1_TARGETS.practiceExamsMin - examsDone),
  };

  const realExamsRemaining = Math.max(0, A1_TARGETS.realExamsMin - realExamsDone);

  const estimatedExamDateISO = estimateExamDate(progress, remaining);
  const daysUntilExam = Math.max(
    0,
    Math.ceil(
      (new Date(`${estimatedExamDateISO}T12:00:00`).getTime() -
        new Date(`${todayISO()}T12:00:00`).getTime()) /
        86400000
    )
  );

  const weakAreas = (Object.keys(moduleScores) as (keyof ModuleScores)[])
    .filter((k) => k !== "exams" || moduleScores.exams > 0)
    .map((key) => ({
      key,
      label: MODULE_LABELS[key],
      score: moduleScores[key],
      target: MODULE_TARGETS[key],
    }))
    .filter((m) => m.score < m.target)
    .sort((a, b) => a.score / a.target - b.score / b.target);

  const weakest = weakAreas[0];
  const focusMessage = realExamsRemaining > 0
    ? `Gerçek sınav modunda en az ${A1_TARGETS.realExamsMin} kez ≥${A1_TARGETS.realExamPassPoints}/100 al (${realExamsDone}/${A1_TARGETS.realExamsMin})`
    : weakest
      ? `Bugün öncelik: ${weakest.label} (%${weakest.score} → hedef %${weakest.target})`
      : "Tüm modüller hedefte — deneme sınavı çöz.";

  const todayTasks: TodayTask[] = [
    {
      id: "srs",
      ...taskFields("srs"),
      href: "/review",
      done: ds.srsReviews >= goals.srsReviews,
      progress: `${ds.srsReviews}/${goals.srsReviews}`,
      priority:
        ds.srsReviews >= goals.srsReviews ? 10 : srsStats.due > 0 ? -1 : 1,
    },
    {
      id: "new",
      ...taskFields("new"),
      href: "/cards",
      done: ds.newWordsLearned >= goals.newWords,
      progress: `${ds.newWordsLearned}/${goals.newWords}`,
      priority: ds.newWordsLearned >= goals.newWords ? 10 : 2,
    },
    {
      id: "hoeren",
      ...taskFields("hoeren"),
      href: "/exam/hoeren",
      done: ds.hoerenSessions >= goals.hoerenSessions,
      progress: `${ds.hoerenSessions}/${goals.hoerenSessions}`,
      priority: moduleScores.hoeren < A1_TARGETS.hoerenPct ? 0 : 5,
    },
    {
      id: "lesen",
      ...taskFields("lesen"),
      href: "/exam/lesen",
      done: ds.lesenPassages >= goals.lesenPassages,
      progress: `${ds.lesenPassages}/${goals.lesenPassages}`,
      priority: moduleScores.lesen < A1_TARGETS.lesenPct ? 1 : 5,
    },
    {
      id: "schreiben",
      ...taskFields("schreiben"),
      href: "/exam/schreiben",
      done: ds.schreibenTasks >= goals.schreibenTasks,
      progress: `${ds.schreibenTasks}/${goals.schreibenTasks}`,
      priority: moduleScores.schreiben < A1_TARGETS.schreibenPct ? 2 : 6,
    },
    {
      id: "sprechen",
      ...taskFields("sprechen"),
      href: "/exam/sprechen",
      done: ds.sprechenCards >= goals.sprechenCards,
      progress: `${ds.sprechenCards}/${goals.sprechenCards}`,
      priority: moduleScores.sprechen < A1_TARGETS.sprechenPct ? 3 : 6,
    },
    {
      id: "listen",
      ...taskFields("listen"),
      href: "/listen",
      done: ds.minutesStudied >= 30,
      progress: `${ds.minutesStudied} dk`,
      priority: 4,
    },
  ].sort((a, b) => a.priority - b.priority);

  const readyForExam =
    overallPercent >= 85 &&
    moduleScores.hoeren >= A1_TARGETS.hoerenPct &&
    moduleScores.lesen >= A1_TARGETS.lesenPct &&
    examsDone >= A1_TARGETS.practiceExamsMin &&
    realExamsDone >= A1_TARGETS.realExamsMin;

  const { dailyPlan, nextStep, allDailyDone } = buildDailyPlan(
    todayTasks,
    srsStats.due,
    examsDone
  );

  return {
    overallPercent,
    estimatedExamDate: formatDateTR(estimatedExamDateISO),
    estimatedExamDateISO,
    daysUntilExam,
    moduleScores,
    weakAreas,
    focusMessage,
    remaining,
    todayGoals: goals,
    todayTasks,
    dailyPlan,
    nextStep,
    allDailyDone,
    readyForExam,
  };
}

export { MODULE_LABELS, MODULE_TARGETS };
