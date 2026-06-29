"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/elKitabi/types";
import { scrollElKitabiToHash } from "@/components/elKitabi/ElKitabiHashSync";
import { EL_KITABI_PRACTICE_IDS, elKitabiSubsectionQuizPassed } from "@/lib/elKitabi/practice";
import { useProgress } from "@/lib/ProgressContext";

function subsectionStatus(
  id: string,
  subsections: Record<string, { read?: boolean; quizBest?: number; quizTotal?: number; moduleVisited?: boolean }>
): string | null {
  if (!EL_KITABI_PRACTICE_IDS.includes(id)) return null;
  const s = subsections[id];
  if (!s) return null;
  if (s.moduleVisited) return "M";
  if (elKitabiSubsectionQuizPassed(s)) return "T";
  if (s.read) return "O";
  return null;
}

export function ElKitabiToc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string>("");
  const { progress } = useProgress();
  const subs = progress.elKitabi.subsections;

  useEffect(() => {
    const ids = entries.flatMap((e) => [e.id, ...(e.children?.map((c) => c.id) ?? [])]);
    const observer = new IntersectionObserver(
      (items) => {
        const visible = items
          .filter((i) => i.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav
      aria-label="Icindekiler"
      className="sticky top-16 z-10 -mx-1 mb-6 max-h-[70vh] overflow-y-auto rounded-xl border border-sage-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:top-20"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-sage-400">
        Icindekiler
      </p>
      <p className="mb-2 text-[10px] text-sage-400">O = okundu · T = test geçildi · M = modül</p>
      <ul className="space-y-1 text-sm">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className={`block rounded px-2 py-1 transition-colors ${
                active === entry.id
                  ? "bg-goethe-gold/15 font-semibold text-goethe-blue"
                  : "text-sage-600 hover:bg-sage-50 hover:text-goethe-blue"
              }`}
            >
              {entry.label}
            </a>
            {entry.children && entry.children.length > 0 && (
              <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-sage-200 pl-2">
                {entry.children.map((child) => {
                  const status = subsectionStatus(child.id, subs);
                  return (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", `#${child.id}`);
                          scrollElKitabiToHash(`#${child.id}`);
                        }}
                        className={`flex items-center justify-between gap-2 rounded px-2 py-0.5 text-xs ${
                          active === child.id
                            ? "font-semibold text-goethe-blue"
                            : "text-sage-500 hover:text-goethe-blue"
                        }`}
                      >
                        <span className="min-w-0 truncate">{child.label}</span>
                        {status && (
                          <span
                            className="shrink-0 rounded bg-sage-100 px-1.5 py-0.5 text-[10px] font-bold text-goethe-blue"
                            title={
                              status === "M"
                                ? "Modül ziyaret edildi"
                                : status === "T"
                                  ? "Test geçildi (%80+)"
                                  : "Okundu"
                            }
                          >
                            {status}
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
