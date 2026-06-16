"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  DEFAULT_PROGRESS,
  loadProgress,
  normalizeProgress,
  saveProgress,
  type UserProgress,
} from "./progress";

interface ProgressContextValue {
  progress: UserProgress;
  updateProgress: (
    patch: Partial<UserProgress> | ((p: UserProgress) => Partial<UserProgress> | UserProgress)
  ) => void;
  hydrated: boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveProgress(progress);
  }, [progress, hydrated]);

  useEffect(() => {
    if (!hydrated || !pathname) return;
    setProgress((p) => ({ ...p, lastRoute: pathname }));
  }, [pathname, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (!progress.sessionStartTime) {
      setProgress((p) => ({
        ...p,
        sessionStartTime: new Date().toISOString(),
      }));
    }
    const interval = setInterval(() => {
      setProgress((p) => {
        const mins = p.dailyStats.minutesStudied + 1;
        return {
          ...p,
          dailyStats: { ...p.dailyStats, minutesStudied: mins },
          totalStudyMinutes: p.totalStudyMinutes + 1,
        };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [hydrated]);

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
        return normalizeProgress(next);
      });
    },
    []
  );

  const value = useMemo(
    () => ({ progress, updateProgress, hydrated }),
    [progress, updateProgress, hydrated]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
