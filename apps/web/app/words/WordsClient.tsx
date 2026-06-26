"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getA1Vocabulary } from "@german-coach/vocabulary";
import { AudioButton } from "@/components/AudioButton";
import { IconArrowRight, IconCheck, IconX } from "@/components/icons";
import { PageShell } from "@/components/PageShell";
import { ProgressBar } from "@/components/ProgressBar";
import { formatWord } from "@/lib/audio";
import { computeLearningMap } from "@/lib/learningMap";
import { useProgress } from "@/lib/ProgressContext";
import { useDashboardReport } from "@/lib/useDashboardReport";
import {
  A1_WORD_TIERS,
  categoryProgressPct,
  categoryStudiedCounts,
  getTierCategories,
  getTierForCategory,
  isTierUnlocked,
  resolveWordsListNextStep,
  tierProgressPct,
  type A1WordTierId,
} from "@/lib/wordTiers";

export default function WordsPage() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const { progress } = useProgress();
  const { report } = useDashboardReport();
  const [search, setSearch] = useState("");
  const vocab = getA1Vocabulary();

  const tierId = categoryFilter ? getTierForCategory(categoryFilter) : null;
  const tierTabs = tierId ? getTierCategories(tierId) : null;
  const categoryPct = categoryFilter ? categoryProgressPct(progress, categoryFilter) : 0;
  const tierPct = tierId ? tierProgressPct(progress, tierId) : 0;
  const nextStep = useMemo(
    () => resolveWordsListNextStep(categoryFilter, progress),
    [categoryFilter, progress]
  );
  const map = useMemo(() => computeLearningMap(progress, report), [progress, report]);

  const words = useMemo(() => {
    let list = vocab.words;
    if (categoryFilter) list = list.filter((w) => w.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.translation_tr.toLowerCase().includes(q) ||
          w.translation_ru.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vocab.words, categoryFilter, search]);

  const title = categoryFilter ?? "Kelime Listesi";
  const subtitle = categoryFilter
    ? tierId
      ? `${A1_WORD_TIERS[tierId].label} · ${words.length} kelime`
      : `${words.length} kelime`
    : `${vocab.total} kelime · referans listesi`;

  return (
    <PageShell
      title={title}
      subtitle={subtitle}
      backHref={categoryFilter ? "/harita" : "/"}
      backLabel={categoryFilter ? "Haritaya dön" : "Panele dön"}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <JourneyBanner
          categoryFilter={categoryFilter}
          tierId={tierId}
          categoryPct={categoryPct}
          tierPct={tierPct}
          nextStep={nextStep}
          mapNextHref={map.summary.nextHref}
          mapNextLabel={map.summary.nextLabel}
        />

        {tierTabs && tierId && (
          <TierCategoryTabs
            tierId={tierId}
            categories={tierTabs}
            activeCategory={categoryFilter!}
            progress={progress}
          />
        )}

        {!categoryFilter && (
          <section className="card-soft space-y-3 border border-goethe-blue/15 p-4">
            <p className="text-sm font-semibold text-goethe-blue">Stufe 1 — Kolay kelimeler</p>
            <p className="text-sm text-sage-500">
              Selamlama, tanışma, aile ve ev. Haritadan buraya geldiysen aşağıdaki sekmelerle devam et.
            </p>
            <TierCategoryTabs
              tierId="easy"
              categories={getTierCategories("easy")}
              activeCategory=""
              progress={progress}
            />
          </section>
        )}

        <TrainingActions categoryFilter={categoryFilter} />

        <input
          type="search"
          placeholder="Kelime ara (DE / TR / RU)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-sage-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-sage-400"
        />

        {categoryFilter && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-sage-500">
              <span>Bu kategoride ilerleme</span>
              <span className="tabular-nums">%{categoryPct}</span>
            </div>
            <ProgressBar value={categoryPct} size="sm" />
          </div>
        )}

        <div className="space-y-2">
          {words.map((w) => {
            const known = progress.knownWordIds.includes(w.id);
            const wp = progress.wordProgress[w.id];
            return (
              <article
                key={w.id}
                className={`card-soft flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between ${
                  known ? "border-sage-200" : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-goethe-blue">
                      {formatWord(w.word, w.article)}
                    </span>
                    {known && (
                      <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] text-sage-600">
                        bilinen
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-sage-500">
                    {w.translation_tr} · {w.translation_ru}
                  </p>
                  <p className="mt-1 text-xs italic text-sage-400">{w.example_de}</p>
                  {!categoryFilter && (
                    <span className="mt-1 inline-block text-[10px] text-sage-300">{w.category}</span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {wp && (
                    <span className="inline-flex items-center gap-2 text-xs text-sage-400">
                      <span className="inline-flex items-center gap-0.5">
                        <IconCheck size={11} /> {wp.correct}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <IconX size={11} /> {wp.wrong}
                      </span>
                    </span>
                  )}
                  <AudioButton
                    text={formatWord(w.word, w.article)}
                    size="sm"
                    audioSrc={w.audio_word}
                  />
                </div>
              </article>
            );
          })}
        </div>

        <footer className="card-soft flex flex-col gap-3 border border-goethe-blue/15 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-goethe-blue">Sıradaki adım</p>
            {nextStep.hint && <p className="mt-0.5 text-xs text-sage-500">{nextStep.hint}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/cards" className="btn-secondary text-sm">
              Kartlarla çalış
            </Link>
            <Link
              href={nextStep.href}
              className={`btn-primary inline-flex items-center gap-2 text-sm ${nextStep.locked ? "opacity-90" : ""}`}
            >
              {nextStep.label}
              <IconArrowRight size={16} />
            </Link>
          </div>
        </footer>
      </div>
    </PageShell>
  );
}

function JourneyBanner({
  categoryFilter,
  tierId,
  categoryPct,
  tierPct,
  nextStep,
  mapNextHref,
  mapNextLabel,
}: {
  categoryFilter: string | null;
  tierId: A1WordTierId | null;
  categoryPct: number;
  tierPct: number;
  nextStep: ReturnType<typeof resolveWordsListNextStep>;
  mapNextHref: string;
  mapNextLabel: string;
}) {
  return (
    <section className="card-soft space-y-3 border-2 border-goethe-blue/15 p-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          Öğrenme yolu
        </p>
        <p className="mt-1 text-sm text-sage-600">
          Bu sayfa <strong className="font-semibold text-goethe-blue">referans listesi</strong> — ses
          dinlemek tek başına ilerleme saymaz. Kelimeyi kart, quiz ve tekrar ile pekiştir.
        </p>
      </div>

      {categoryFilter && tierId && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-sage-50 px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-sage-500">{categoryFilter}</p>
            <p className="text-lg font-bold tabular-nums text-goethe-blue">%{categoryPct}</p>
          </div>
          <div className="rounded-xl bg-goethe-gold/10 px-3 py-2">
            <p className="text-[10px] font-bold uppercase text-goethe-blue">
              {A1_WORD_TIERS[tierId].label}
            </p>
            <p className="text-lg font-bold tabular-nums text-goethe-blue">%{tierPct}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Link href="/harita" className="btn-secondary text-sm">
          Öğrenme haritası
        </Link>
        <Link href="/cards" className="btn-primary text-sm">
          Kartlarla çalış
        </Link>
        <Link
          href={nextStep.href}
          className="btn-secondary inline-flex items-center gap-1.5 text-sm"
        >
          {nextStep.label}
          <IconArrowRight size={14} />
        </Link>
      </div>

      {mapNextHref && mapNextHref !== nextStep.href && (
        <p className="text-xs text-sage-500">
          Haritadaki genel sıra:{" "}
          <Link href={mapNextHref} className="font-medium text-goethe-blue hover:underline">
            {mapNextLabel} →
          </Link>
        </p>
      )}
    </section>
  );
}

function TierCategoryTabs({
  tierId,
  categories,
  activeCategory,
  progress,
}: {
  tierId: A1WordTierId;
  categories: readonly string[];
  activeCategory: string;
  progress: ReturnType<typeof useProgress>["progress"];
}) {
  const tierUnlocked = isTierUnlocked(tierId, progress);
  const tierMeta = A1_WORD_TIERS[tierId];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-sage-500">
          {tierMeta.labelTr} · {tierMeta.label}
        </span>
        {!tierUnlocked && tierId !== "easy" && (
          <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] text-sage-500">
            Kilitli — önceki seviye %{tierMeta.unlockFromPrevPct}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const { known, total } = categoryStudiedCounts(progress, cat);
          const active = cat === activeCategory;
          const disabled = !tierUnlocked;

          if (disabled) {
            return (
              <span
                key={cat}
                title={`${tierMeta.label} henüz açılmadı`}
                className="cursor-not-allowed rounded-full bg-sage-50 px-3 py-1.5 text-xs text-sage-300"
              >
                {cat} ({known}/{total})
              </span>
            );
          }

          return (
            <Link
              key={cat}
              href={`/words?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-goethe-blue text-white shadow-sm"
                  : "border border-sage-200 bg-white text-sage-600 hover:border-sage-300 hover:bg-sage-50"
              }`}
            >
              {cat} ({known}/{total})
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function TrainingActions({ categoryFilter }: { categoryFilter: string | null }) {
  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <TrainingTile href="/cards" label="Kart" hint="Ezberle" primary />
      <TrainingTile href="/quiz" label="Quiz" hint="TR → DE test" />
      <TrainingTile href="/review" label="Tekrar" hint="SRS motoru" />
      <TrainingTile href="/diktat" label="Diktat" hint="Dinle, yaz" />
      {categoryFilter && (
        <p className="col-span-full text-center text-[11px] text-sage-400">
          Antrenman modülleri tüm A1 havuzundan sorar — bu kategorideki kelimeler de dahil.
        </p>
      )}
    </section>
  );
}

function TrainingTile({
  href,
  label,
  hint,
  primary,
}: {
  href: string;
  label: string;
  hint: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 rounded-xl border p-3 text-center transition ${
        primary
          ? "border-goethe-blue/25 bg-goethe-blue/5 hover:border-goethe-blue/40"
          : "border-sage-100 bg-white hover:border-sage-300"
      }`}
    >
      <span className="text-sm font-semibold text-goethe-blue">{label}</span>
      <span className="text-[10px] text-sage-400">{hint}</span>
    </Link>
  );
}
