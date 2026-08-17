import Link from "next/link";
import type { GermanyRoadmap } from "@/lib/roadmaps/germanyRoadmaps";

export function GermanyRoadmapView({ roadmap }: { roadmap: GermanyRoadmap }) {
  return (
    <div className="space-y-5">
      <Link
        href="/"
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/20 bg-goethe-blue px-3 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.22)] transition hover:bg-[#244f78]"
        aria-label="Ana sayfaya dön"
      >
        <span aria-hidden>←</span>
        Geri
      </Link>

      <section className="rounded-2xl border border-white/15 bg-goethe-blue p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-goethe-gold">
              {roadmap.eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">{roadmap.title}</h1>
            <p className="mt-3 text-sm leading-6 text-sage-100">{roadmap.subtitle}</p>
          </div>
          <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold text-white">
            {roadmap.status}
          </span>
        </div>
        <p className="mt-5 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-sage-100">
          {roadmap.audience}
        </p>
      </section>

      <section className="space-y-3">
        {roadmap.steps.map((step, index) => (
          <article
            key={step.id}
            className="card-soft overflow-hidden border border-goethe-blue/10"
          >
            <div className="grid gap-4 p-4 sm:grid-cols-[120px_1fr] sm:p-5">
              <div className="flex items-center gap-3 sm:block">
                <span className="grid size-10 place-items-center rounded-full bg-goethe-gold/20 text-sm font-extrabold text-goethe-blue">
                  {index + 1}
                </span>
                <p className="mt-0 text-xs font-extrabold uppercase tracking-[0.12em] text-sage-500 sm:mt-3">
                  {step.level}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-goethe-blue">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-sage-600">{step.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {step.requirements.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-sage-100 bg-sage-50 px-3 py-1 text-xs font-semibold text-sage-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="mt-4 rounded-xl bg-goethe-gold/10 px-4 py-3 text-sm font-semibold text-goethe-blue">
                  {step.nextAction}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="card-soft flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-bold text-goethe-blue">Bu yol haritası büyüyecek</p>
          <p className="text-sm text-sage-500">Kartların altına kontrol listesi, belge sırası ve seviye hedefleri ekleyebiliriz.</p>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-goethe-blue px-4 py-2 text-sm font-bold text-white transition hover:bg-[#244f78]"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
