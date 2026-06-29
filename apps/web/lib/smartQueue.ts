/**
 * Günlük karışık öğrenme kuyruğu — gecikmiş SRS + zayıf el-kitabı + grundlagen.
 */
import { getWordById } from "@german-coach/vocabulary";
import { SMART_QUEUE } from "./dailyGoals";
import {
  EL_KITABI_PRACTICE_IDS,
  elKitabiModuleHref,
  elKitabiSubsectionQuizPassed,
  getPracticeForSubsection,
  getSubsectionTitle,
} from "./elKitabi/practice";
import { collectWeakTopics } from "./errorEngine";
import { getPatternTrainer } from "./grundlagen";
import type { UserProgress } from "./progress";
import {
  CONJUGATION_PASS_SCORE,
  PATTERN_PASS_SCORE,
} from "./progress";
import {
  buildReviewQueue,
  daysUntilReview,
  isDue,
  isMastered,
  todayISO,
  type SRSRecord,
} from "./srs";

export type SmartQueueItemKind = "srs" | "el-kitabi" | "grundlagen";

export interface SmartQueueItem {
  id: string;
  kind: SmartQueueItemKind;
  title: string;
  subtitle: string;
  href: string;
  priority: number;
  reason: string;
}

export interface DailySmartQueue {
  items: SmartQueueItem[];
  srsCount: number;
  elKitabiCount: number;
  grundlagenCount: number;
  total: number;
}

const KIND_LABEL: Record<SmartQueueItemKind, string> = {
  srs: "SRS tekrar",
  "el-kitabi": "El kitabı",
  grundlagen: "Gramer",
};

export function smartQueueKindLabel(kind: SmartQueueItemKind): string {
  return KIND_LABEL[kind];
}

function collectSrsItems(
  allWordIds: string[],
  srsRecords: Record<string, SRSRecord> | null | undefined,
  limit: number,
  date = todayISO()
): SmartQueueItem[] {
  const records = srsRecords ?? {};
  const scored: SmartQueueItem[] = [];

  for (const id of allWordIds) {
    const rec = records[id];
    if (!rec) continue;
    if (isMastered(rec)) continue;
    if (!isDue(rec, date)) continue;

    const lateness = Math.max(0, -daysUntilReview(rec, date));
    const word = getWordById(id);
    const de = word?.word ?? id;
    const tr = word?.translation_tr ?? "";

    scored.push({
      id: `srs-${id}`,
      kind: "srs",
      title: de,
      subtitle: tr || "Kelime tekrarı",
      href: "/review",
      priority: 1000 + lateness * 10 + (rec.correctStreak === 0 ? 5 : 0),
      reason: lateness > 0 ? `${lateness} gün gecikmiş` : "Bugün tekrar zamanı",
    });
  }

  scored.sort((a, b) => b.priority - a.priority);

  if (scored.length >= limit) {
    return scored.slice(0, limit);
  }

  const queueIds = buildReviewQueue(allWordIds, srsRecords, limit, date);
  const seen = new Set(scored.map((s) => s.id));
  const merged = [...scored];

  for (const id of queueIds) {
    if (merged.length >= limit) break;
    const key = `srs-${id}`;
    if (seen.has(key)) continue;

    const word = getWordById(id);
    const rec = records[id];
    merged.push({
      id: key,
      kind: "srs",
      title: word?.word ?? id,
      subtitle: word?.translation_tr ?? "Kelime tekrarı",
      href: "/review",
      priority: rec ? 800 : 200,
      reason: rec ? "Tekrar zamanı" : "Yeni kelime",
    });
    seen.add(key);
  }

  return merged.slice(0, limit);
}

function collectElKitabiItems(progress: UserProgress, limit: number): SmartQueueItem[] {
  const items: SmartQueueItem[] = [];

  for (const subsectionId of EL_KITABI_PRACTICE_IDS) {
    const practice = getPracticeForSubsection(subsectionId);
    if (!practice) continue;

    const sub = progress.elKitabi.subsections[subsectionId];
    if (elKitabiSubsectionQuizPassed(sub)) continue;

    const title = getSubsectionTitle(subsectionId) ?? practice.moduleLabel;
    let priority = 100;
    let reason = "Test henüz geçilmedi";

    if (sub?.quizBest !== undefined && sub.quizTotal) {
      const ratio = sub.quizBest / sub.quizTotal;
      priority = 500 + Math.round((1 - ratio) * 200);
      reason = `Test ${sub.quizBest}/${sub.quizTotal} — eşik altı`;
    } else if (sub?.read) {
      priority = 350;
      reason = "Okundu, test geçilmedi";
    } else if (sub?.moduleVisited) {
      priority = 280;
      reason = "Modül ziyaret edildi, test eksik";
    }

    items.push({
      id: `el-${subsectionId}`,
      kind: "el-kitabi",
      title,
      subtitle: practice.moduleLabel,
      href: `/rehber/el-kitabi#${subsectionId}`,
      priority,
      reason,
    });
  }

  items.sort((a, b) => b.priority - a.priority);
  return items.slice(0, limit);
}

function collectGrundlagenItems(progress: UserProgress, limit: number): SmartQueueItem[] {
  const items: SmartQueueItem[] = [];
  const g = progress.grundlagen;

  for (const p of getPatternTrainer().patterns) {
    if (g.patternsCompleted.includes(p.id)) continue;
    const score = g.patternScores[p.id];
    if (score === undefined) continue;
    if (score >= PATTERN_PASS_SCORE) continue;

    items.push({
      id: `pat-${p.id}`,
      kind: "grundlagen",
      title: p.template_de,
      subtitle: p.template_tr,
      href: "/grundlagen/patterns",
      priority: 420 + (PATTERN_PASS_SCORE - score) * 40,
      reason: `Kalıp quiz ${score}/5`,
    });
  }

  for (const [verbId, score] of Object.entries(g.conjugationScores)) {
    if (g.conjugationCompleted.includes(verbId)) continue;
    if (score >= CONJUGATION_PASS_SCORE) continue;

    items.push({
      id: `conj-${verbId}`,
      kind: "grundlagen",
      title: verbId,
      subtitle: "Fiil çekimi",
      href: "/grundlagen/conjugation",
      priority: 380 + (CONJUGATION_PASS_SCORE - score) * 20,
      reason: `Çekim quiz ${score}/${CONJUGATION_PASS_SCORE}`,
    });
  }

  for (const topic of collectWeakTopics(progress)) {
    items.push({
      id: `err-${topic.tag}`,
      kind: "grundlagen",
      title: topic.label,
      subtitle: topic.cta,
      href: topic.href,
      priority: 360 + topic.count * 15,
      reason: topic.reason,
    });
  }

  items.sort((a, b) => b.priority - a.priority);

  const seen = new Set<string>();
  const unique: SmartQueueItem[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
    if (unique.length >= limit) break;
  }

  return unique;
}

function allocateSlots(
  available: { srs: number; elKitabi: number; grundlagen: number },
  config = SMART_QUEUE
): { srs: number; elKitabi: number; grundlagen: number } {
  let srs = Math.min(config.srsSlots, available.srs);
  let elKitabi = Math.min(config.elKitabiSlots, available.elKitabi);
  let grundlagen = Math.min(config.grundlagenSlots, available.grundlagen);

  let remaining = config.dailySize - (srs + elKitabi + grundlagen);

  const pools = (
    [
      { key: "srs" as const, surplus: available.srs - srs },
      { key: "elKitabi" as const, surplus: available.elKitabi - elKitabi },
      { key: "grundlagen" as const, surplus: available.grundlagen - grundlagen },
    ] as const
  )
    .slice()
    .sort((a, b) => b.surplus - a.surplus);

  for (const pool of pools) {
    if (remaining <= 0) break;
    const add = Math.min(remaining, pool.surplus);
    if (pool.key === "srs") srs += add;
    else if (pool.key === "elKitabi") elKitabi += add;
    else grundlagen += add;
    remaining -= add;
  }

  return { srs, elKitabi, grundlagen };
}

function interleaveMixed(items: SmartQueueItem[]): SmartQueueItem[] {
  const byKind: Record<SmartQueueItemKind, SmartQueueItem[]> = {
    srs: [],
    "el-kitabi": [],
    grundlagen: [],
  };

  for (const item of items) {
    byKind[item.kind].push(item);
  }

  const result: SmartQueueItem[] = [];
  const kinds: SmartQueueItemKind[] = ["srs", "el-kitabi", "grundlagen"];
  let round = 0;

  while (result.length < items.length) {
    let added = false;
    for (const kind of kinds) {
      const bucket = byKind[kind];
      if (round < bucket.length) {
        result.push(bucket[round]!);
        added = true;
      }
    }
    if (!added) break;
    round += 1;
  }

  return result;
}

/** Günlük karışık öğrenme kuyruğu */
export function buildDailySmartQueue(
  progress: UserProgress,
  allWordIds: string[],
  config = SMART_QUEUE
): DailySmartQueue {
  const srsPool = collectSrsItems(allWordIds, progress.srsRecords, config.dailySize);
  const elPool = collectElKitabiItems(progress, config.dailySize);
  const grPool = collectGrundlagenItems(progress, config.dailySize);

  const slots = allocateSlots(
    { srs: srsPool.length, elKitabi: elPool.length, grundlagen: grPool.length },
    config
  );

  const picked = [
    ...srsPool.slice(0, slots.srs),
    ...elPool.slice(0, slots.elKitabi),
    ...grPool.slice(0, slots.grundlagen),
  ];

  const items = interleaveMixed(picked).slice(0, config.dailySize);

  const srsCount = items.filter((i) => i.kind === "srs").length;
  const elKitabiCount = items.filter((i) => i.kind === "el-kitabi").length;
  const grundlagenCount = items.filter((i) => i.kind === "grundlagen").length;

  return {
    items,
    srsCount,
    elKitabiCount,
    grundlagenCount,
    total: items.length,
  };
}

/** El-kitabı maddesi için modül linki (varsa) */
export function smartQueueElKitabiModuleHref(item: SmartQueueItem): string | null {
  if (item.kind !== "el-kitabi") return null;
  const subsectionId = item.id.replace(/^el-/, "");
  const practice = getPracticeForSubsection(subsectionId);
  if (!practice) return null;
  return elKitabiModuleHref(practice.moduleHref, subsectionId);
}
