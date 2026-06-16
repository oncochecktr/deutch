"use client";

import { useEffect } from "react";

interface ExamLockGuardProps {
  active: boolean;
  children: React.ReactNode;
}

export function ExamLockGuard({ active, children }: ExamLockGuardProps) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    history.pushState(null, "", window.location.href);
    const blockBack = () => {
      history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", blockBack);
    return () => window.removeEventListener("popstate", blockBack);
  }, [active]);

  return <>{children}</>;
}
