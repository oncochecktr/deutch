/**
 * Spaced Repetition Engine — Goethe A1
 * Intervals: 1 → 3 → 7 → 14 → 30 gün (Anki/Leitner mantığı)
 */

export const SRS_INTERVALS = [1, 3, 7, 14, 30] as const;

/** Oturum kuyruğunda yeni (hiç görülmemiş) kelime üst sınırı — gecikmiş tekrar öncelikli */
export const SRS_QUEUE_MAX_NEW = 8;

const DUE_SCORE_BASE = 1000;

export interface SRSRecord {
  /** 0-based index into SRS_INTERVALS; >= length-1 with streak = mastered */
  step: number;
  /** ISO date YYYY-MM-DD — next review due */
  nextReview: string;
  lastReview: string | null;
  totalReviews: number;
  correctStreak: number;
  /** First time word was studied */
  firstSeen: string;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function createSRSRecord(date = todayISO()): SRSRecord {
  return {
    step: 0,
    nextReview: date,
    lastReview: null,
    totalReviews: 0,
    correctStreak: 0,
    firstSeen: date,
  };
}

/**
 * Process a review result.
 * correct=true  → advance interval step
 * correct=false → reset to 1-day interval
 */
export function processSRSReview(
  record: SRSRecord | undefined,
  correct: boolean,
  date = todayISO()
): SRSRecord {
  const base = record ?? createSRSRecord(date);

  if (correct) {
    const newStep = Math.min(base.step + 1, SRS_INTERVALS.length - 1);
    const interval = SRS_INTERVALS[newStep];
    return {
      ...base,
      step: newStep,
      nextReview: addDays(date, interval),
      lastReview: date,
      totalReviews: base.totalReviews + 1,
      correctStreak: base.correctStreak + 1,
    };
  }

  return {
    ...base,
    step: 0,
    nextReview: addDays(date, SRS_INTERVALS[0]),
    lastReview: date,
    totalReviews: base.totalReviews + 1,
    correctStreak: 0,
  };
}

export function isDue(record: SRSRecord | undefined, date = todayISO()): boolean {
  if (!record) return true;
  return record.nextReview <= date;
}

export function isMastered(record: SRSRecord | undefined): boolean {
  if (!record) return false;
  return (
    record.step >= SRS_INTERVALS.length - 1 &&
    record.correctStreak >= 2 &&
    record.nextReview > todayISO()
  );
}

export function daysUntilReview(record: SRSRecord, date = todayISO()): number {
  const due = new Date(`${record.nextReview}T12:00:00`);
  const now = new Date(`${date}T12:00:00`);
  return Math.ceil((due.getTime() - now.getTime()) / 86400000);
}

export function getIntervalLabel(step: number): string {
  const idx = Math.min(step, SRS_INTERVALS.length - 1);
  return `${SRS_INTERVALS[idx]} gün`;
}

export interface SRSQueueStats {
  due: number;
  newWords: number;
  mastered: number;
  learning: number;
  total: number;
}

export function getSRSStats(
  allWordIds: string[],
  srsRecords: Record<string, SRSRecord> | null | undefined,
  date = todayISO()
): SRSQueueStats {
  const records = srsRecords ?? {};
  let due = 0;
  let newWords = 0;
  let mastered = 0;
  let learning = 0;

  for (const id of allWordIds) {
    const rec = records[id];
    if (!rec) {
      newWords++;
      continue;
    }
    if (isMastered(rec)) {
      mastered++;
    } else if (isDue(rec, date)) {
      due++;
      learning++;
    } else {
      learning++;
    }
  }

  return { due, newWords, mastered, learning, total: allWordIds.length };
}

/** Build prioritized review queue: overdue first, then due today, then new (capped) */
export function buildReviewQueue(
  allWordIds: string[],
  srsRecords: Record<string, SRSRecord> | null | undefined,
  limit = 20,
  date = todayISO()
): string[] {
  const records = srsRecords ?? {};
  const due: { id: string; score: number }[] = [];
  const fresh: string[] = [];

  for (const id of allWordIds) {
    const rec = records[id];
    if (!rec) {
      fresh.push(id);
      continue;
    }
    if (isMastered(rec)) continue;
    if (!isDue(rec, date)) continue;
    const daysUntil = daysUntilReview(rec, date);
    const lateness = Math.max(0, -daysUntil);
    due.push({ id, score: DUE_SCORE_BASE + lateness });
  }

  due.sort((a, b) => b.score - a.score);
  const dueIds = due.map((d) => d.id);
  const slotsAfterDue = Math.max(0, limit - dueIds.length);
  const newCap = Math.min(SRS_QUEUE_MAX_NEW, slotsAfterDue);
  const newIds = fresh.slice(0, newCap);

  return [...dueIds, ...newIds].slice(0, limit);
}

export function getNextIntervalPreview(record: SRSRecord | undefined, correct: boolean): string {
  if (!correct) return `${SRS_INTERVALS[0]} gün sonra`;
  const nextStep = Math.min((record?.step ?? -1) + 1, SRS_INTERVALS.length - 1);
  return `${SRS_INTERVALS[nextStep]} gün sonra`;
}
