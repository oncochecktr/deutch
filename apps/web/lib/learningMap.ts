import type { CEFRLevel } from "@german-coach/vocabulary";
import { getA1Vocabulary, getA2Vocabulary } from "@german-coach/vocabulary";
import { A1_TARGETS } from "./dailyGoals";
import type { A1ReadinessReport } from "./readinessEngine";
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
  GRUNDLAGEN_MODULES,
} from "./grundlagen";
import { nextGrammarHref } from "./learningPathGrammar";
import type { UserProgress } from "./progress";
import { countStudiedA1Words } from "./progress";
import { calcAccuracy } from "./progress";

export type MapNodeStatus = "locked" | "available" | "active" | "done" | "future";

export interface MapNode {
  id: string;
  label: string;
  labelTr: string;
  description: string;
  href?: string;
  progress: number;
  status: MapNodeStatus;
  cefr: CEFRLevel | "root";
  children?: MapNode[];
}

export interface LearningMapSummary {
  estimatedLevel: CEFRLevel;
  levelLabel: string;
  levelDetail: string;
  overallPercent: number;
  activeNodeId: string;
  nextHref: string;
  nextLabel: string;
  strengths: string[];
  gaps: string[];
}

export interface LearningMapState {
  summary: LearningMapSummary;
  root: MapNode;
}

const A1_WORD_TIERS = {
  easy: {
    id: "words-easy",
    label: "Kolay kelimeler",
    labelTr: "Stufe 1",
    categories: ["Selamlama", "Tanışma", "Aile", "Ev"] as const,
  },
  medium: {
    id: "words-medium",
    label: "Orta kelimeler",
    labelTr: "Stufe 2",
    categories: ["Market", "İş", "Ulaşım", "Saat", "Tarih", "Restoran", "Telefon"] as const,
  },
  hard: {
    id: "words-hard",
    label: "İleri kelimeler",
    labelTr: "Stufe 3",
    categories: ["Doktor", "Form doldurma", "Günlük ihtiyaçlar", "Basit yön tarifleri"] as const,
  },
} as const;

function studiedIds(progress: UserProgress, prefix: string): Set<string> {
  const ids = new Set<string>();
  for (const id of progress.knownWordIds) {
    if (id.startsWith(prefix)) ids.add(id);
  }
  for (const id of Object.keys(progress.wordProgress)) {
    if (id.startsWith(prefix)) ids.add(id);
  }
  for (const id of Object.keys(progress.srsRecords)) {
    if (id.startsWith(prefix)) ids.add(id);
  }
  return ids;
}

function pct(done: number, total: number): number {
  return total ? Math.min(100, Math.round((done / total) * 100)) : 0;
}

function nodeStatus(progressPct: number, unlocked: boolean, isActive: boolean): MapNodeStatus {
  if (!unlocked) return "locked";
  if (isActive) return "active";
  if (progressPct >= 100) return "done";
  if (progressPct >= 70) return "done";
  if (progressPct > 0) return "available";
  return "available";
}

function categoryTierProgress(
  progress: UserProgress,
  categories: readonly string[]
): number {
  const vocab = getA1Vocabulary();
  const studied = studiedIds(progress, "a1_");
  let total = 0;
  let known = 0;
  for (const cat of categories) {
    const inCat = vocab.words.filter((w) => w.category === cat);
    total += inCat.length;
    known += inCat.filter((w) => studied.has(w.id)).length;
  }
  return pct(known, total);
}

function grammarModuleProgress(
  progress: UserProgress,
  moduleId: string
): number {
  const g = progress.grundlagen;
  switch (moduleId) {
    case "word-order":
      return pct(g.wordOrderCompleted.length, getWordOrderTrainer().sections.length + 1);
    case "satz": {
      const total = getA1Core().sentenceBuilder.exercises.length;
      return pct(g.satzCompleted.length, total);
    }
    case "conjugation":
      return pct(g.conjugationCompleted.length, getConjugationMatrix().verbs.length);
    case "artikel":
      return pct(g.articlesCompleted.length, getArtikelTrainer().sets.length);
    case "possessives":
      return pct(g.possessivesCompleted.length, getPossessiveTrainer().sets.length);
    case "patterns":
      return pct(g.patternsCompleted.length, getPatternTrainer().patterns.length);
    case "dativ":
      return pct(g.dativCompleted.length, getDativTrainer().sets.length);
    case "negation":
      return pct(g.negationCompleted.length, getNegationTrainer().sets.length);
    case "prepositions":
      return pct(g.prepositionsCompleted.length, getPrepositionsTrainer().sets.length);
    case "grammar-pack": {
      const sections = getA1Core().grammarPack.sections;
      if (!sections.length) return 0;
      const scores = sections.map((s) => {
        const correct = g.grammarPack[s.id] ?? 0;
        return Math.min(100, Math.round((correct / s.quiz.length) * 100));
      });
      return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
    case "zeit":
      return g.zeitQuizBest;
    default:
      return 0;
  }
}

function estimateLevel(
  report: A1ReadinessReport,
  a1Studied: number,
  a1Total: number,
  a2Studied: number
): { level: CEFRLevel; label: string; detail: string } {
  if (report.readyForExam) {
    return {
      level: "A1",
      label: "A1 — Sınav hazır",
      detail: "Goethe A1 hedeflerini karşılıyorsun. A2 dalına geçebilirsin.",
    };
  }
  const a1WordsPct = report.moduleScores.words;
  const grammarPct = report.moduleScores.grammar;

  if (a2Studied >= 80 && a1WordsPct >= A1_TARGETS.wordsKnownPct) {
    return {
      level: "A2",
      label: "A2 — Orta seviye",
      detail: "A1 kelime havuzu güçlü; A2 kelimelerinde ilerliyorsun.",
    };
  }
  if (a2Studied >= 20) {
    return {
      level: "A2",
      label: "A2 — Başlangıç",
      detail: "A1 temeli üzerine A2 kelime dalını açıyorsun.",
    };
  }
  if (a1WordsPct >= 85 && grammarPct >= 70) {
    return {
      level: "A1",
      label: "A1 — İleri",
      detail: "Kelime ve gramer güçlü; sınav modüllerine odaklan.",
    };
  }
  if (a1Studied >= Math.ceil(a1Total * 0.3)) {
    return {
      level: "A1",
      label: "A1 — Orta",
      detail: `~${a1Studied}/${a1Total} kelime çalışıldı; gramer dalını güçlendir.`,
    };
  }
  return {
    level: "A1",
    label: "A1 — Başlangıç",
    detail: "Kökten başla: kolay kelimeler → kelime sırası → cümle.",
  };
}

function pickActiveNode(
  flat: { id: string; progress: number; status: MapNodeStatus; href?: string; label?: string }[]
) {
  const active = flat.find((n) => n.status === "active");
  if (active) return active;
  const next = flat.find((n) => n.status === "available" && n.progress < 70 && n.href);
  if (next) return next;
  return flat.find((n) => n.href && n.progress < 100) ?? flat[0];
}

export function computeLearningMap(
  progress: UserProgress,
  report: A1ReadinessReport
): LearningMapState {
  const a1 = getA1Vocabulary();
  const a2 = getA2Vocabulary();
  const a1Studied = countStudiedA1Words(progress);
  const a2Studied = studiedIds(progress, "a2_").size;
  const a1Known = progress.knownWordIds.filter((id) => id.startsWith("a1_")).length;
  const wordsPct = report.moduleScores.words;
  const srsPct = report.moduleScores.srs;
  const grammarPct = report.moduleScores.grammar;

  const levelInfo = estimateLevel(report, a1Studied, a1.total, a2Studied);
  const grammarNext = nextGrammarHref(progress);

  const wordsUnlocked = true;
  const grammarUnlocked = wordsPct >= 15 || a1Studied >= 30;
  const practiceUnlocked = grammarPct >= 25 || grammarUnlocked;
  const examUnlocked = practiceUnlocked && (wordsPct >= 40 || grammarPct >= 40);
  const a2Unlocked = wordsPct >= A1_TARGETS.wordsKnownPct || report.readyForExam;
  const b1Future = a2Studied >= 100;

  const easyPct = categoryTierProgress(progress, A1_WORD_TIERS.easy.categories);
  const mediumPct = categoryTierProgress(progress, A1_WORD_TIERS.medium.categories);
  const hardPct = categoryTierProgress(progress, A1_WORD_TIERS.hard.categories);

  const grammarChildren: MapNode[] = GRUNDLAGEN_MODULES.filter((m) =>
    ["word-order", "satz", "conjugation", "artikel", "possessives", "patterns", "dativ", "negation", "prepositions", "grammar-pack", "zeit"].includes(
      m.id
    )
  ).map((m) => {
    const p = grammarModuleProgress(progress, m.id);
    return {
      id: `grammar-${m.id}`,
      label: m.de,
      labelTr: m.tr,
      description: m.desc,
      href: m.href,
      progress: p,
      status: nodeStatus(p, grammarUnlocked, grammarNext === m.href),
      cefr: "A1" as const,
    };
  });

  const examModules: MapNode[] = [
    {
      id: "exam-hoeren",
      label: "Hören",
      labelTr: "Dinleme",
      description: "Sınav dinleme bölümü",
      href: "/exam/hoeren",
      progress: report.moduleScores.hoeren,
      status: nodeStatus(report.moduleScores.hoeren, examUnlocked, false),
      cefr: "A1",
    },
    {
      id: "exam-lesen",
      label: "Lesen",
      labelTr: "Okuma",
      description: "Sınav okuma bölümü",
      href: "/exam/lesen",
      progress: report.moduleScores.lesen,
      status: nodeStatus(report.moduleScores.lesen, examUnlocked, false),
      cefr: "A1",
    },
    {
      id: "exam-schreiben",
      label: "Schreiben",
      labelTr: "Yazma",
      description: "Form, mektup, kısa metin",
      href: "/exam/schreiben",
      progress: report.moduleScores.schreiben,
      status: nodeStatus(report.moduleScores.schreiben, examUnlocked, false),
      cefr: "A1",
    },
    {
      id: "exam-sprechen",
      label: "Sprechen",
      labelTr: "Konuşma",
      description: "Sınav konuşma kartları",
      href: "/exam/sprechen",
      progress: report.moduleScores.sprechen,
      status: nodeStatus(report.moduleScores.sprechen, examUnlocked, false),
      cefr: "A1",
    },
    {
      id: "exam-real",
      label: "Gerçek sınav",
      labelTr: "Simülasyon",
      description: "65 dk · 4 bölüm · geçme 60",
      href: "/exam/real/exam_01",
      progress: report.moduleScores.exams,
      status: nodeStatus(report.moduleScores.exams, examUnlocked && report.moduleScores.hoeren >= 50, false),
      cefr: "A1",
    },
  ];

  const a1Branch: MapNode = {
    id: "branch-a1",
    label: "A1 Dalı",
    labelTr: "Temel seviye",
    description: "Goethe A1 — kelime, gramer, sınav",
    progress: report.overallPercent,
    status: "available",
    cefr: "A1",
    children: [
      {
        id: "trunk-words",
        label: "1 · Kelimeler",
        labelTr: "Kök — kelime havuzu",
        description: "Önce kelime; sonra cümle kurarsın",
        progress: wordsPct,
        status: nodeStatus(wordsPct, wordsUnlocked, wordsPct < A1_TARGETS.wordsKnownPct && grammarPct < 30),
        cefr: "A1",
        children: [
          {
            id: "words-pool",
            label: "A1 kelime havuzu",
            labelTr: `${a1Known} / ${a1.total} bilinen`,
            description: "577 kelime — kart, quiz, liste",
            href: "/cards",
            progress: wordsPct,
            status: nodeStatus(wordsPct, wordsUnlocked, wordsPct < 40),
            cefr: "A1",
          },
          {
            id: A1_WORD_TIERS.easy.id,
            label: A1_WORD_TIERS.easy.label,
            labelTr: A1_WORD_TIERS.easy.labelTr,
            description: "Selamlama, tanışma, aile, ev",
            href: "/words?category=Selamlama",
            progress: easyPct,
            status: nodeStatus(easyPct, wordsUnlocked, easyPct < 70 && wordsPct < 50),
            cefr: "A1",
          },
          {
            id: A1_WORD_TIERS.medium.id,
            label: A1_WORD_TIERS.medium.label,
            labelTr: A1_WORD_TIERS.medium.labelTr,
            description: "Market, iş, ulaşım, saat, restoran…",
            href: "/words?category=Market",
            progress: mediumPct,
            status: nodeStatus(mediumPct, easyPct >= 40, mediumPct < 70 && easyPct >= 40),
            cefr: "A1",
          },
          {
            id: A1_WORD_TIERS.hard.id,
            label: A1_WORD_TIERS.hard.label,
            labelTr: A1_WORD_TIERS.hard.labelTr,
            description: "Doktor, form, günlük ihtiyaçlar, yön tarifi",
            href: "/words?category=Doktor",
            progress: hardPct,
            status: nodeStatus(hardPct, mediumPct >= 30, hardPct < 70 && mediumPct >= 30),
            cefr: "A1",
          },
          {
            id: "words-srs",
            label: "SRS tekrar motoru",
            labelTr: "Uzun süreli hafıza",
            description: "Biliyorum / tekrar et — hedef %80 doğruluk",
            href: "/review",
            progress: srsPct,
            status: nodeStatus(srsPct, a1Studied >= 10, false),
            cefr: "A1",
          },
        ],
      },
      {
        id: "trunk-grammar",
        label: "2 · Gramer & cümle",
        labelTr: "Dal — yapı kuralları",
        description: "Kelime sırası, çekim, artikel, kalıp",
        progress: grammarPct,
        status: nodeStatus(grammarPct, grammarUnlocked, grammarPct < A1_TARGETS.grammarPct),
        cefr: "A1",
        children: grammarChildren,
      },
      {
        id: "trunk-practice",
        label: "3 · Pratik & akıcılık",
        labelTr: "Dal — kullanım",
        description: "Konuş, dinle, diyalog oku",
        progress: Math.round(
          (report.moduleScores.sprechen +
            Math.min(100, progress.dailyStats.dialoguesRead * 20) +
            Math.min(100, progress.dailyStats.minutesStudied)) /
            3
        ),
        status: nodeStatus(50, practiceUnlocked, false),
        cefr: "A1",
        children: [
          {
            id: "practice-konus-dinle",
            label: "Konuş-Dinle",
            labelTr: "Ana antrenman",
            description: "Dinle, tekrar et, konuş",
            href: "/konus-dinle",
            progress: Math.min(100, progress.dailyStats.konusDinleTurns * 10),
            status: nodeStatus(50, practiceUnlocked, false),
            cefr: "A1",
          },
          {
            id: "practice-speak",
            label: "Konuşma sınıfı",
            labelTr: "AI profesör",
            description: "A1/A2/B1 dersleri",
            href: "/speak",
            progress: Math.min(100, progress.dailyStats.speakSteps * 15),
            status: nodeStatus(50, practiceUnlocked, false),
            cefr: "A1",
          },
          {
            id: "practice-dialogues",
            label: "Diyalog & hikaye",
            labelTr: "Bağlam",
            description: "Gerçek konuşma metinleri",
            href: "/dialogues",
            progress: Math.min(100, progress.dailyStats.dialoguesRead * 25),
            status: nodeStatus(50, practiceUnlocked, false),
            cefr: "A1",
          },
          {
            id: "practice-listen",
            label: "Dinleme",
            labelTr: "Kulak alıştırması",
            description: "MP3 dinleme modülü",
            href: "/listen",
            progress: Math.min(100, progress.dailyStats.hoerenSessions * 30),
            status: nodeStatus(50, practiceUnlocked, false),
            cefr: "A1",
          },
          {
            id: "practice-quiz",
            label: "Quiz",
            labelTr: "Hızlı test",
            description: "TR → DE anlam kontrolü",
            href: "/quiz",
            progress: Math.min(100, calcAccuracy(progress) || 0),
            status: nodeStatus(50, practiceUnlocked, false),
            cefr: "A1",
          },
        ],
      },
      {
        id: "trunk-exam",
        label: "4 · Sınav hazırlığı",
        labelTr: "Meyve — Goethe A1",
        description: "Hören · Lesen · Schreiben · Sprechen",
        progress: Math.round(
          (report.moduleScores.hoeren +
            report.moduleScores.lesen +
            report.moduleScores.schreiben +
            report.moduleScores.sprechen +
            report.moduleScores.exams) /
            5
        ),
        status: nodeStatus(70, examUnlocked, report.overallPercent >= 60 && !report.readyForExam),
        cefr: "A1",
        children: examModules,
      },
    ],
  };

  const a2Branch: MapNode = {
    id: "branch-a2",
    label: "A2 Dalı",
    labelTr: "Orta seviye",
    description: "400 kelime + ileri gramer (yakında genişler)",
    progress: pct(a2Studied, a2.total),
    status: a2Unlocked ? nodeStatus(pct(a2Studied, a2.total), true, a2Studied < 20 && a2Unlocked) : "locked",
    cefr: "A2",
    children: [
      {
        id: "a2-words",
        label: "A2 kelime havuzu",
        labelTr: `${a2Studied} / ${a2.total}`,
        description: "Seyahat, sağlık, geçmiş zaman…",
        href: "/a2/cards",
        progress: pct(a2Studied, a2.total),
        status: a2Unlocked ? nodeStatus(pct(a2Studied, a2.total), true, a2Studied < 30) : "locked",
        cefr: "A2",
      },
      {
        id: "a2-grammar",
        label: "A2 gramer",
        labelTr: "Perfekt · Nebensatz",
        description: "Yakında tam modül",
        href: "/grundlagen/grammar",
        progress: 0,
        status: a2Studied >= 50 ? "available" : "locked",
        cefr: "A2",
      },
    ],
  };

  const b1Branch: MapNode = {
    id: "branch-b1",
    label: "B1 Dalı",
    labelTr: "İleri seviye",
    description: "Orta-ileri Almanca — yakında",
    progress: 0,
    status: b1Future ? "future" : "locked",
    cefr: "B1",
    children: [
      {
        id: "b1-words",
        label: "B1 kelime havuzu",
        labelTr: "Planlanıyor",
        description: "A2 tamamlandıktan sonra açılacak",
        progress: 0,
        status: "future",
        cefr: "B1",
      },
    ],
  };

  const root: MapNode = {
    id: "root",
    label: "Almanca öğrenme ağacı",
    labelTr: "A1 → A2 → B1",
    description: "Kökten meyveye: kelime → gramer → sınav",
    progress: report.overallPercent,
    status: "available",
    cefr: "root",
    children: [a1Branch, a2Branch, b1Branch],
  };

  const flat: { id: string; progress: number; status: MapNodeStatus; href?: string; label: string }[] = [];
  function walk(n: MapNode) {
    flat.push({ id: n.id, progress: n.progress, status: n.status, href: n.href, label: n.label });
    n.children?.forEach(walk);
  }
  walk(root);

  const active = pickActiveNode(flat);
  const nextHref = active?.href ?? grammarNext;
  const nextLabel = active?.label ?? "Devam et";

  const strengths: string[] = [];
  const gaps: string[] = [];
  if (wordsPct >= 70) strengths.push("Kelime havuzu");
  else if (wordsPct < A1_TARGETS.wordsKnownPct) gaps.push("Kelime havuzu");
  if (grammarPct >= 60) strengths.push("Gramer");
  else if (grammarPct < A1_TARGETS.grammarPct) gaps.push("Gramer & kelime sırası");
  if (easyPct >= 80) strengths.push("Kolay kelimeler");
  if (report.moduleScores.hoeren >= A1_TARGETS.hoerenPct) strengths.push("Dinleme");
  else gaps.push("Hören (dinleme)");
  if (report.moduleScores.lesen >= A1_TARGETS.lesenPct) strengths.push("Okuma");
  else gaps.push("Lesen (okuma)");

  return {
    summary: {
      estimatedLevel: levelInfo.level,
      levelLabel: levelInfo.label,
      levelDetail: levelInfo.detail,
      overallPercent: report.overallPercent,
      activeNodeId: active?.id ?? "words-pool",
      nextHref,
      nextLabel,
      strengths: strengths.slice(0, 4),
      gaps: gaps.slice(0, 4),
    },
    root,
  };
}
