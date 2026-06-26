"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { CATEGORIES_A1 } from "@german-coach/vocabulary";
import { ContinueSessionBanner } from "@/components/ContinueSessionBanner";
import { HomeGameBanner } from "@/components/home/HomeGameBanner";
import { HomeHero } from "@/components/home/HomeHero";
import { HomePathPicker } from "@/components/home/HomePathPicker";
import { LearningMethodGuide } from "@/components/home/LearningMethodGuide";
import { LearningPathHub } from "@/components/LearningPathHub";
import { StorageWarningBanner } from "@/components/StorageWarningBanner";
import { NavIcon, type NavIconKey } from "@/components/icons";
import { resolveRecommendedIntent, isEarlyLearner } from "@/lib/homeLearningPath";
import { computeLearningPath } from "@/lib/learningPath";
import { countStudiedA1Words } from "@/lib/progress";
import { useDashboardReport } from "@/lib/useDashboardReport";

const A1ControlPanel = dynamic(
  () => import("@/components/A1ControlPanel").then((m) => ({ default: m.A1ControlPanel })),
  {
    loading: () => (
      <aside className="card-soft hidden min-h-[420px] animate-pulse rounded-xl bg-sage-50 lg:block" />
    ),
  }
);

export function HomePageClient() {
  const { report, srs, a1, mesleki, progress } = useDashboardReport();
  const path = useMemo(() => computeLearningPath(progress, report), [progress, report]);
  const a1Studied = countStudiedA1Words(progress);
  const early = isEarlyLearner(report.overallPercent, a1Studied);
  const recommended = useMemo(
    () =>
      resolveRecommendedIntent({
        activeStageId: path.activeStageId,
        a1Studied,
        srsDue: srs.due,
        primaryHref: path.primaryHref,
      }),
    [path.activeStageId, path.primaryHref, a1Studied, srs.due]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="space-y-6">
        <HomeHero />
        <HomeGameBanner />
        <LearningMethodGuide />
        <HomePathPicker recommended={recommended} progress={progress} />

        <StorageWarningBanner />
        <ContinueSessionBanner />

        {early ? (
          <div className="card-soft flex flex-wrap items-center justify-between gap-3 border border-goethe-blue/15 p-4">
            <p className="text-sm text-sage-600">Kart açınca ilerleme burada artar.</p>
            <Link
              href="/harita"
              className="shrink-0 rounded-full border border-goethe-blue/25 px-4 py-2 text-sm font-semibold text-goethe-blue transition hover:bg-goethe-blue/5"
            >
              Öğrenme haritası →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <LearningPathHub path={path} overallPercent={report.overallPercent} />
            <Link
              href="/grundlagen/roadmap"
              className="block text-center text-sm font-medium text-goethe-blue underline-offset-2 hover:underline"
            >
              Gramer haritası →
            </Link>
          </div>
        )}

        <Link
          href="/ozellikler"
          className="card-soft flex items-center justify-between gap-3 border border-goethe-gold/30 bg-goethe-gold/5 p-4 transition hover:border-goethe-gold/50"
        >
          <div>
            <p className="text-sm font-bold text-goethe-blue">Tüm özellikler</p>
            <p className="text-sm text-sage-500">Modüllere tek tıkla git</p>
          </div>
          <span className="shrink-0 text-goethe-blue">→</span>
        </Link>

        <Link
          href="/harita"
          className="card-soft flex items-center justify-between gap-3 border border-goethe-blue/20 p-4 transition hover:border-goethe-blue/40"
        >
          <div>
            <p className="text-sm font-bold text-goethe-blue">Öğrenme haritası</p>
            <p className="text-sm text-sage-500">Kelime · gramer · sınav</p>
          </div>
          <span className="shrink-0 rounded-full bg-goethe-gold/20 px-3 py-1 text-xs font-bold text-goethe-blue">
            %{report.overallPercent}
          </span>
        </Link>

        <details className="app-collapse card-soft">
          <summary className="flex items-center justify-between p-4 text-sm font-medium text-sage-600">
            Tüm modüller
            <span className="text-xs font-normal text-sage-400">İsteğe bağlı</span>
          </summary>
          <div className="border-t border-sage-100 p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MiniTile href="/diktat" icon="list" label="Diktat" stat="Yazarak öğren" />
              <MiniTile href="/grundlagen/cumle-motoru" icon="cards" label="Oyun" stat="852 kelime" />
              <MiniTile href="/review" icon="review" label="Tekrar" stat={srs.due > 0 ? `${srs.due} bekliyor` : "OK"} />
              <MiniTile href="/cards" icon="cards" label="Kartlar" stat={`${a1.total} kelime`} />
              <MiniTile href="/grundlagen" icon="exam" label="Gramer" stat="6 modül" />
              <MiniTile href="/exam" icon="exam" label="Sınav" stat="A1 modül" />
              <MiniTile href="/konus-dinle" icon="konusDinle" label="Konuş-Dinle" stat="Antrenman" />
              <MiniTile href="/speak" icon="speak" label="Sınıf" stat="Profesör" />
              <MiniTile href="/dialogues" icon="cards" label="Hikayeler" stat="Diyalog" />
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
