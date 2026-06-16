"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CATEGORIES_A1 } from "@german-coach/vocabulary";
import { A1ControlPanel } from "@/components/A1ControlPanel";
import { ContinueSessionBanner } from "@/components/ContinueSessionBanner";
import { LearningPathHub } from "@/components/LearningPathHub";
import { NavIcon, type NavIconKey } from "@/components/icons";
import { computeLearningPath } from "@/lib/learningPath";
import { useDashboardReport } from "@/lib/useDashboardReport";

export default function HomePage() {
  const { report, srs, a1, mesleki, progress } = useDashboardReport();
  const path = useMemo(() => computeLearningPath(progress, report), [progress, report]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <LearningPathHub path={path} overallPercent={report.overallPercent} />

        <ContinueSessionBanner />

        <details className="app-collapse card-soft">
          <summary className="flex items-center justify-between p-4 text-sm font-medium text-sage-600">
            Tüm modüller
            <span className="text-xs font-normal text-sage-400">İsteğe bağlı</span>
          </summary>
          <div className="border-t border-sage-100 p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MiniTile href="/review" icon="review" label="Tekrar" stat={srs.due > 0 ? `${srs.due} bekliyor` : "OK"} />
              <MiniTile href="/cards" icon="cards" label="Kartlar" stat={`${a1.total} kelime`} />
              <MiniTile href="/grundlagen" icon="exam" label="Gramer" stat="6 modül" />
              <MiniTile href="/exam" icon="exam" label="Goethe" stat="Sınav" />
              <MiniTile href="/listen" icon="listen" label="Dinle" stat="MP3" />
              <MiniTile href="/quiz" icon="cards" label="Quiz" stat="TR anlam" />
              <MiniTile href="/words" icon="list" label="Liste" stat="Ara" />
              <MiniTile href="/mesleki" icon="mesleki" label="Mesleki" stat={`${mesleki.total} kelime`} />
            </div>
          </div>
        </details>

        <details className="app-collapse card-soft">
          <summary className="flex items-center justify-between p-4 text-sm font-medium text-sage-600">
            A1 kategorileri
            <span className="text-xs font-normal text-sage-400">{CATEGORIES_A1.length} kategori</span>
          </summary>
          <div className="border-t border-sage-100 px-4 pb-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES_A1.map((cat) => {
                const count = a1.words.filter((w) => w.category === cat).length;
                return (
                  <Link
                    key={cat}
                    href={`/words?category=${encodeURIComponent(cat)}`}
                    className="rounded-full border border-sage-100 bg-white px-3 py-1.5 text-xs text-sage-600 transition hover:border-sage-300"
                  >
                    {cat} ({count})
                  </Link>
                );
              })}
            </div>
          </div>
        </details>
      </div>

      <A1ControlPanel />
    </div>
  );
}

function MiniTile({
  href,
  icon,
  label,
  stat,
}: {
  href: string;
  icon: NavIconKey;
  label: string;
  stat: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 rounded-lg border border-sage-100 bg-white p-3 text-center transition hover:border-sage-300"
    >
      <NavIcon name={icon} size={20} />
      <span className="text-xs font-semibold text-goethe-blue">{label}</span>
      <span className="text-[10px] text-sage-400">{stat}</span>
    </Link>
  );
}
