/** Diktat taslakları — tarayıcıda kalır */

export const DIKTAT_STORAGE_KEY = "german-coach-diktat";
export const DIKTAT_BACKUP_KEY = "german-coach-diktat-backup";

export interface DiktatStore {
  version: 1;
  freeText: string;
  sidebarCategory: string | null;
  showTurkish: boolean;
  updatedAt: string;
  smartCorrect: number;
}

export const DEFAULT_DIKTAT: DiktatStore = {
  version: 1,
  freeText: "",
  sidebarCategory: null,
  showTurkish: true,
  updatedAt: "",
  smartCorrect: 0,
};

function normalize(raw: Partial<DiktatStore> | null | undefined): DiktatStore {
  const r = raw ?? {};
  return {
    version: 1,
    freeText: typeof r.freeText === "string" ? r.freeText : "",
    sidebarCategory: typeof r.sidebarCategory === "string" ? r.sidebarCategory : null,
    showTurkish: r.showTurkish !== false,
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : "",
    smartCorrect: typeof r.smartCorrect === "number" ? r.smartCorrect : 0,
  };
}

function persist(store: DiktatStore): boolean {
  if (typeof window === "undefined") return false;
  const payload = { ...store, updatedAt: new Date().toISOString() };
  const json = JSON.stringify(payload);
  try {
    localStorage.setItem(DIKTAT_STORAGE_KEY, json);
    try {
      sessionStorage.setItem(DIKTAT_BACKUP_KEY, json);
    } catch {
      /* optional */
    }
    return true;
  } catch {
    try {
      sessionStorage.setItem(DIKTAT_BACKUP_KEY, json);
      return true;
    } catch {
      return false;
    }
  }
}

export function loadDiktatStore(): DiktatStore {
  if (typeof window === "undefined") return { ...DEFAULT_DIKTAT };
  try {
    const parse = (raw: string | null) => {
      if (!raw) return null;
      return normalize(JSON.parse(raw) as Partial<DiktatStore>);
    };
    const fromLocal = parse(localStorage.getItem(DIKTAT_STORAGE_KEY));
    if (fromLocal) return fromLocal;
    const fromBackup = parse(sessionStorage.getItem(DIKTAT_BACKUP_KEY));
    if (fromBackup) {
      persist(fromBackup);
      return fromBackup;
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_DIKTAT };
}

export function saveDiktatStore(patch: Partial<DiktatStore>): DiktatStore {
  const next = normalize({ ...loadDiktatStore(), ...patch });
  persist(next);
  return next;
}
