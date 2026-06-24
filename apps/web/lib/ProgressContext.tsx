"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_PROGRESS,
  ensureTodayStudySession,
  loadProgress,
  normalizeProgress,
  saveProgress,
  STORAGE_BACKUP_KEY,
  STORAGE_KEY,
  type UserProgress,
} from "./progress";
import { todayISO } from "./srs";

interface ProgressContextValue {
  progress: UserProgress;
  updateProgress: (
    patch: Partial<UserProgress> | ((p: UserProgress) => Partial<UserProgress> | UserProgress)
  ) => void;
  flushProgress: () => void;
  hydrated: boolean;
  storageOk: boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [hydrated, setHydrated] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const pathname = usePathname();
  const hasLoadedRef = useRef(false);
  const progressRef = useRef<UserProgress>(DEFAULT_PROGRESS);

  const persist = useCallback((next: UserProgress) => {
    progressRef.current = next;
    if (!hasLoadedRef.current) return;
    const ok = saveProgress(next);
    setStorageOk(ok);
  }, []);

  const flushProgress = useCallback(() => {
    if (!hasLoadedRef.current) return;
    const ok = saveProgress(progressRef.current);
    setStorageOk(ok);
  }, []);

  const updateProgress = useCallback(
    (patch: Partial<UserProgress> | ((p: UserProgress) => Partial<UserProgress> | UserProgress)) => {
      setProgress((p) => {
        const patchResult = typeof patch === "function" ? patch(p) : patch;
        if (patchResult === p) return p;
        const next =
          typeof patchResult === "object" &&
          patchResult !== null &&
          "version" in patchResult &&
          "lastRoute" in patchResult
            ? (patchResult as UserProgress)
            : { ...p, ...patchResult };
        const normalized = normalizeProgress(next);
        persist(normalized);
        return normalized;
      });
    },
    [persist]
  );

  useLayoutEffect(() => {
    const loaded = loadProgress();
    progressRef.current = loaded;
    setProgress(loaded);
    hasLoadedRef.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !pathname) return;
    updateProgress((p) => (p.lastRoute === pathname ? p : { ...p, lastRoute: pathname }));
  }, [pathname, hydrated, updateProgress]);

  useEffect(() => {
    if (!hydrated) return;

    const flush = () => flushProgress();

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      const loaded = loadProgress();
      progressRef.current = loaded;
      setProgress(loaded);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== STORAGE_BACKUP_KEY) return;
      const loaded = loadProgress();
      progressRef.current = loaded;
      setProgress(loaded);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("pagehide", flush);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hydrated, flushProgress]);

  useEffect(() => {
    if (!hydrated) return;
    updateProgress((p) => {
      const withSession = ensureTodayStudySession(p);
      if (!withSession.sessionStartTime) {
        return { ...withSession, sessionStartTime: new Date().toISOString() };
      }
      return withSession === p && p.sessionStartTime ? p : withSession;
    });
    const interval = setInterval(() => {
      updateProgress((p) => {
        const today = todayISO();
        const nextMinutes = p.dailyStats.minutesStudied + 1;
        if (p.dailyStats.date !== today) {
          return ensureTodayStudySession({
            ...p,
            dailyStats: {
              ...DEFAULT_PROGRESS.dailyStats,
              date: today,
              minutesStudied: 1,
            },
            totalStudyMinutes: p.totalStudyMinutes + 1,
          });
        }
        return {
          ...p,
          dailyStats: { ...p.dailyStats, minutesStudied: nextMinutes },
          totalStudyMinutes: p.totalStudyMinutes + 1,
        };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [hydrated, updateProgress]);

  const value = useMemo(
    () => ({ progress, updateProgress, flushProgress, hydrated, storageOk }),
    [progress, updateProgress, flushProgress, hydrated, storageOk]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
