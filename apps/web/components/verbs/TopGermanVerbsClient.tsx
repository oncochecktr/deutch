"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import verbs from "@/data/german-verbs/top-100-verbs.json";
import { IconArrowLeft } from "@/components/icons";

type Verb = {
  id: number;
  verb: string;
  meaningTr: string;
  level: string;
  frequencyRank: number;
  forms: {
    present: string;
    past: string;
    perfect: string;
  };
  examples: Array<{ de: string; tr: string }>;
};

type ViewMode = "daily" | "all" | "review";

const typedVerbs = verbs as Verb[];
const batchSize = 5;
const progressStorageKey = "germancoach.top100verbs.progress";

export function TopGermanVerbsClient() {
  const [view, setView] = useState<ViewMode>("daily");
  const [batchStart, setBatchStart] = useState(0);
  const [learned, setLearned] = useState<number[]>([]);
  const [review, setReview] = useState<number[]>([]);

  const visibleVerbs = useMemo(() => {
    if (view === "daily") return typedVerbs.slice(batchStart, batchStart + batchSize);
    if (view === "review") return typedVerbs.filter((verb) => review.includes(verb.id));
    return typedVerbs;
  }, [batchStart, review, view]);

  const donePercent = Math.round((learned.length / typedVerbs.length) * 100);
  const dailyEnd = Math.min(batchStart + batchSize, typedVerbs.length);

  function toggleLearned(id: number) {
    setLearned((current) => toggle(current, id));
    setReview((current) => current.filter((item) => item !== id));
  }

  function toggleReview(id: number) {
    setReview((current) => toggle(current, id));
    setLearned((current) => current.filter((item) => item !== id));
  }

  function nextBatch() {
    setBatchStart((current) => (current + batchSize >= typedVerbs.length ? 0 : current + batchSize));
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <Link
          href="/ogrenime-devam"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/20 bg-goethe-blue px-3 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.22)] transition hover:bg-[#244f78]"
          aria-label="Öğrenime devam sayfasına dön"
        >
          <IconArrowLeft size={16} />
          Geri
        </Link>
        <div className="card-soft border border-goethe-blue/15 bg-gradient-to-br from-goethe-blue/8 via-white to-amber-50/40 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_210px] lg:items-end">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-goethe-gold">
                En gerekli temel fiiller
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight text-goethe-blue sm:text-4xl">
                Almancada en çok öğrenmeniz gereken 100 fiil
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-sage-600 sm:text-base">
                Her şeyi ezberlemeye çalışma. Önce günlük cümle kurmanı sağlayan fiilleri öğren:
                anlamı, üç zamanı ve örnekleri tek yerde.
              </p>
            </div>
            <div className="rounded-xl border border-sage-100 bg-sage-50 p-4">
              <p className="text-2xl font-extrabold text-goethe-blue">{learned.length} / {typedVerbs.length}</p>
              <p className="mt-1 text-sm text-sage-500">tamamlandı</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-sage-200">
                <span className="block h-full rounded-full bg-goethe-gold" style={{ width: `${donePercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="card-soft border border-sage-100 bg-white p-4 sm:p-5" aria-label="Fiil çalışma alanı">
        <div className="flex flex-wrap gap-2">
          <ModeButton active={view === "daily"} onClick={() => setView("daily")}>Bugünkü 5 fiil</ModeButton>
          <ModeButton active={view === "all"} onClick={() => setView("all")}>100 fiilin tamamı</ModeButton>
          <ModeButton active={view === "review"} onClick={() => setView("review")}>Tekrar listem</ModeButton>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-xl border-l-4 border-goethe-gold bg-goethe-gold/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-extrabold text-goethe-blue">
              {view === "daily" ? `Bugünkü sıra: ${batchStart + 1}-${dailyEnd}. fiiller` : view === "review" ? "Tekrar listen" : "100 fiilin tamamı"}
            </p>
            <p className="mt-1 text-sm leading-6 text-sage-600">
              {view === "daily"
                ? "Beş fiil yeter. Bildiklerini işaretle, zor gelenleri tekrar listene bırak."
                : view === "review"
                  ? "Zorlandığın fiiller burada sakin sakin geri gelir."
                  : "Tüm listeyi tarayabilir, istediğin fiili hemen işaretleyebilirsin."}
            </p>
          </div>
          {view === "daily" && (
            <button
              type="button"
              onClick={nextBatch}
              className="min-h-11 rounded-xl bg-goethe-blue px-4 text-sm font-extrabold text-white transition hover:bg-[#244f78]"
            >
              Sonraki 5 fiil
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {visibleVerbs.length > 0 ? (
            visibleVerbs.map((verb) => (
              <VerbCard
                key={verb.id}
                verb={verb}
                learned={learned.includes(verb.id)}
                review={review.includes(verb.id)}
                onLearned={() => toggleLearned(verb.id)}
                onReview={() => toggleReview(verb.id)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-sage-200 bg-sage-50 p-6 text-center text-sm text-sage-600 lg:col-span-2">
              Tekrar listende fiil yok. Zorlandığın fiilleri “Tekrar et” ile buraya alabilirsin.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ModeButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "min-h-10 rounded-xl bg-goethe-blue px-4 text-sm font-extrabold text-white"
          : "min-h-10 rounded-xl border border-sage-200 bg-white px-4 text-sm font-extrabold text-goethe-blue transition hover:border-sage-300"
      }
    >
      {children}
    </button>
  );
}

function VerbCard({
  verb,
  learned,
  review,
  onLearned,
  onReview,
}: {
  verb: Verb;
  learned: boolean;
  review: boolean;
  onLearned: () => void;
  onReview: () => void;
}) {
  const example = verb.examples[0];

  return (
    <article className={`rounded-xl border p-4 ${learned ? "border-goethe-blue/35 bg-sage-50" : "border-sage-100 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-goethe-gold">#{verb.frequencyRank}</p>
          <h2 className="mt-1 text-2xl font-extrabold leading-none text-goethe-blue">{verb.verb}</h2>
          <p className="mt-1 text-sm text-sage-600">{verb.meaningTr}</p>
        </div>
        <span className="rounded-full bg-goethe-gold/25 px-3 py-1 text-xs font-extrabold text-goethe-blue">
          {verb.level}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <FormChip label="Şimdi" value={verb.forms.present} />
        <FormChip label="Geçmiş" value={verb.forms.past} />
        <FormChip label="Perfekt" value={verb.forms.perfect} />
      </div>

      <div className="mt-3 rounded-xl bg-sage-50 p-3">
        <p className="font-extrabold text-goethe-blue">{example.de}</p>
        <p className="mt-1 text-sm text-sage-600">{example.tr}</p>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onLearned}
          className="min-h-11 rounded-xl border border-goethe-blue/45 px-3 text-sm font-extrabold text-goethe-blue transition hover:bg-goethe-blue/5"
        >
          {learned ? "Öğrenildi" : "Biliyorum"}
        </button>
        <button
          type="button"
          onClick={onReview}
          className="min-h-11 rounded-xl border border-red-200 px-3 text-sm font-extrabold text-red-700 transition hover:bg-red-50"
        >
          {review ? "Tekrarda" : "Tekrar et"}
        </button>
      </div>
    </article>
  );
}

function FormChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-sage-50 p-3">
      <p className="text-xs font-extrabold text-sage-500">{label}</p>
      <p className="mt-1 break-words text-sm font-extrabold text-goethe-blue">{value}</p>
    </div>
  );
}

function toggle(list: number[], id: number) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

