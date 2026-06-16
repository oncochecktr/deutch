"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useProgress } from "@/lib/ProgressContext";

/** Sayfa scroll konumunu localStorage (progress) içinde saklar */
export function ScrollRestoration() {
  const pathname = usePathname();
  const { updateProgress, hydrated } = useProgress();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated || !pathname) return;

    const previous = prevPath.current;
    if (previous && previous !== pathname) {
      const y = window.scrollY;
      updateProgress((p) => ({
        scrollPositions: { ...p.scrollPositions, [previous]: y },
      }));
    }
    prevPath.current = pathname;

    updateProgress((p) => {
      const y = p.scrollPositions[pathname];
      if (typeof y === "number" && y > 0) {
        requestAnimationFrame(() => window.scrollTo(0, y));
      }
      return p;
    });
  }, [pathname, hydrated, updateProgress]);

  useEffect(() => {
    if (!hydrated || !pathname) return;

    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const y = window.scrollY;
        updateProgress((p) => {
          if (p.scrollPositions[pathname] === y) return p;
          return {
            scrollPositions: { ...p.scrollPositions, [pathname]: y },
          };
        });
      }, 350);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hydrated, pathname, updateProgress]);

  return null;
}
