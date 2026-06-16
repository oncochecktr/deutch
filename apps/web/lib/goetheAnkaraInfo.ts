import raw from "../../../data/goethe/ankara-2026.json";

export interface GoetheAnkaraInfo {
  source: {
    title: string;
    document: string;
    updated: string;
    note: string;
  };
  institute: {
    name: string;
    address: string;
    phone: string;
    hotline: string;
    hotlineHours: string;
    website: string;
    emailExams: string;
    emailCourses: string;
  };
  examNotes: string[];
  a1ExamDates: string[];
  courseTerms: {
    id: string;
    label: string;
    period: string;
    weeks: number;
    noClass?: string;
  }[];
  closedDays: string[];
}

export const GOETHE_ANKARA_INFO = raw as GoetheAnkaraInfo;

const MONTHS_TR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

export function formatExamDateTR(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS_TR[m - 1]} ${y}`;
}

export function getNextA1ExamDate(dates: string[] = GOETHE_ANKARA_INFO.a1ExamDates, today = new Date()): string | null {
  const todayStr = today.toISOString().slice(0, 10);
  return dates.find((d) => d >= todayStr) ?? null;
}

export function daysUntil(iso: string, today = new Date()): number {
  const target = new Date(`${iso}T12:00:00`);
  const now = new Date(`${today.toISOString().slice(0, 10)}T12:00:00`);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}
