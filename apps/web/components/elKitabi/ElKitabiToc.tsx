"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/elKitabi/types";

export function ElKitabiToc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const ids = entries.flatMap((e) => [e.id, ...(e.children?.map((c) => c.id) ?? [])]);
    const observer = new IntersectionObserver(
      (items) => {
        const visible = items.filter((i) => i.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
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
                {entry.children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      className={`block rounded px-2 py-0.5 text-xs ${
                        active === child.id
                          ? "font-semibold text-goethe-blue"
                          : "text-sage-500 hover:text-goethe-blue"
                      }`}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
