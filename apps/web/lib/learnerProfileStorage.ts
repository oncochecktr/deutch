/** Öğrenci profili — tarayıcıda kalır (localStorage + session yedek) */

export const LEARNER_PROFILE_KEY = "german-coach-learner-profile";
export const LEARNER_PROFILE_BACKUP_KEY = "german-coach-learner-profile-backup";

export type LearnerGender = "female" | "male" | "other";
export type LearnerLevel = "a1" | "a2" | "b1" | "unsure";

export interface LearnerProfile {
  version: 1;
  firstName: string;
  lastName: string;
  gender: LearnerGender;
  level: LearnerLevel;
  /** Türkçe çeviri satırını göster */
  showTurkish: boolean;
  onboardingComplete: boolean;
  /** Son açılan kelime kartı */
  lastWordId: string | null;
  updatedAt: string;
}

export const DEFAULT_LEARNER_PROFILE: LearnerProfile = {
  version: 1,
  firstName: "",
  lastName: "",
  gender: "other",
  level: "a1",
  showTurkish: true,
  onboardingComplete: false,
  lastWordId: null,
  updatedAt: "",
};

function normalizeProfile(raw: Partial<LearnerProfile> | null | undefined): LearnerProfile {
  const p = raw ?? {};
  const gender =
    p.gender === "female" || p.gender === "male" || p.gender === "other" ? p.gender : "other";
  const level =
    p.level === "a1" || p.level === "a2" || p.level === "b1" || p.level === "unsure"
      ? p.level
      : "a1";
  return {
    version: 1,
    firstName: typeof p.firstName === "string" ? p.firstName.trim() : "",
    lastName: typeof p.lastName === "string" ? p.lastName.trim() : "",
    gender,
    level,
    showTurkish: p.showTurkish !== false,
    onboardingComplete: p.onboardingComplete === true,
    lastWordId: typeof p.lastWordId === "string" ? p.lastWordId : null,
    updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : "",
  };
}

function parseProfile(raw: string | null): LearnerProfile | null {
  if (!raw) return null;
  try {
    return normalizeProfile(JSON.parse(raw) as Partial<LearnerProfile>);
  } catch {
    return null;
  }
}

function persistProfile(profile: LearnerProfile): boolean {
  if (typeof window === "undefined") return false;
  const payload = { ...profile, updatedAt: new Date().toISOString() };
  const json = JSON.stringify(payload);
  try {
    localStorage.setItem(LEARNER_PROFILE_KEY, json);
    try {
      sessionStorage.setItem(LEARNER_PROFILE_BACKUP_KEY, json);
    } catch {
      /* optional */
    }
    return true;
  } catch {
    try {
      sessionStorage.setItem(LEARNER_PROFILE_BACKUP_KEY, json);
      return true;
    } catch {
      return false;
    }
  }
}

export function loadLearnerProfile(): LearnerProfile {
  if (typeof window === "undefined") return { ...DEFAULT_LEARNER_PROFILE };
  try {
    const fromLocal = parseProfile(localStorage.getItem(LEARNER_PROFILE_KEY));
    if (fromLocal) return fromLocal;
    const fromBackup = parseProfile(sessionStorage.getItem(LEARNER_PROFILE_BACKUP_KEY));
    if (fromBackup) {
      persistProfile(fromBackup);
      return fromBackup;
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_LEARNER_PROFILE };
}

export function saveLearnerProfile(patch: Partial<LearnerProfile>): LearnerProfile {
  const current = loadLearnerProfile();
  const next = normalizeProfile({ ...current, ...patch });
  persistProfile(next);
  return next;
}

export function learnerDisplayName(p: LearnerProfile): string {
  const n = [p.firstName, p.lastName].filter(Boolean).join(" ");
  return n || "Sen";
}

/** Almanca tanıtım cümlesi için cinsiyet formu */
export function learnerBerufForm(p: LearnerProfile): { de: string; tr: string } {
  if (p.gender === "female") return { de: "Studentin", tr: "öğrenciyim (kadın)" };
  if (p.gender === "male") return { de: "Student", tr: "öğrenciyim (erkek)" };
  return { de: "Schüler", tr: "öğrenciyim" };
}
