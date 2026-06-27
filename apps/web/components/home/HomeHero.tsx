import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { LanguageFlags } from "@/components/ui/LanguageFlags";

export function HomeHero() {
  return (
    <section className="card-soft overflow-hidden border-2 border-goethe-blue/20 bg-gradient-to-br from-goethe-blue via-goethe-blue to-goethe-blue/95 p-6 text-white shadow-md sm:p-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <LanguageFlags />
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-gold">
          Almanca · Türkçe · 4 adım · A1
        </p>
      </div>
      <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
        Önce cümleyle öğren.
      </h1>
      <p className="mt-2 max-w-md text-sm text-white/85">
        5 dakika kart aç — gerisi gelir.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/cards"
          className="btn-primary-lg inline-flex items-center justify-center gap-2 bg-goethe-gold text-goethe-blue shadow-md transition hover:brightness-105 active:scale-[0.98]"
        >
          Hemen dene
          <IconArrowRight size={18} />
        </Link>
        <a
          href="#nasil-ogrenilir"
          className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Nasıl çalışır?
        </a>
      </div>
    </section>
  );
}
