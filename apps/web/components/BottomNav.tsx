"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getA1Vocabulary, getTimurVocabulary } from "@german-coach/vocabulary";
import { NavIcon, type NavIconKey } from "@/components/icons";
import { useProgress } from "@/lib/ProgressContext";
import { getSRSStats } from "@/lib/srs";

const ITEMS: { href: string; label: string; icon: NavIconKey; match?: (p: string) => boolean }[] = [
  { href: "/", label: "Panel", icon: "panel", match: (p) => p === "/" },
  { href: "/review", label: "Tekrar", icon: "review", match: (p) => p.startsWith("/review") },
  { href: "/cards", label: "Kart", icon: "cards", match: (p) => p.startsWith("/cards") },
  { href: "/exam", label: "Goethe", icon: "exam", match: (p) => p.startsWith("/exam") },
  { href: "/listen", label: "Dinle", icon: "listen", match: (p) => p.startsWith("/listen") },
];

export function BottomNav() {
  const pathname = usePathname();
  const { progress } = useProgress();
  const srsDue = useMemo(() => {
    const ids = [
      ...getA1Vocabulary().words.map((w) => w.id),
      ...getTimurVocabulary().words.map((w) => w.id),
    ];
    return getSRSStats(ids, progress.srsRecords).due;
  }, [progress.srsRecords]);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-sage-200 bg-cream-50/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Ana menü"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pt-1">
        {ITEMS.map((item) => {
          const active = item.match ? item.match(pathname) : pathname === item.href;
          const badge = item.href === "/review" && srsDue > 0 ? srsDue : null;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-h-[56px] min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium transition ${
                active ? "bg-sage-100 text-goethe-blue" : "text-sage-400"
              }`}
            >
              <span className="relative">
                <NavIcon name={item.icon} size={22} />
                {badge !== null && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-goethe-red px-1 text-[9px] font-bold text-white">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
