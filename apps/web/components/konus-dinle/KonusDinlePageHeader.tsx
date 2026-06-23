"use client";

import Link from "next/link";
import { IconArrowLeft } from "@/components/icons";

export function KonusDinlePageHeader() {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-goethe-blue/20 bg-gradient-to-br from-goethe-blue via-goethe-blue to-[#0f2840] text-white shadow-lg">
      <div className="flex flex-wrap items-start gap-4 p-5 sm:p-6">
        <Link
          href="/"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Panele dön"
        >
          <IconArrowLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
            Ana antrenman · Sınav hazırlığı
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Konuş-Dinle</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85">
            Soldaki hedef ağacından dal seç. Platform konuşur, sen dinlersin ve tekrar edersin — istediğin
            kadar tekrar dinle. AI gerekmez.
          </p>
        </div>
        <div className="hidden shrink-0 flex-col gap-1 rounded-xl bg-white/10 px-4 py-3 text-center sm:flex">
          <span className="text-2xl" aria-hidden>
            🎧
          </span>
          <span className="text-[10px] font-medium text-white/80">Dinle → Konuş</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 border-t border-white/10 bg-black/10 px-5 py-2 text-[10px] text-white/70 sm:px-6">
        <span>A1 · A2 · B1 kelime & cümle</span>
        <span>·</span>
        <span>1–6 kelime + karışık</span>
        <span>·</span>
        <span>Günlük hedef sen belirle</span>
      </div>
    </div>
  );
}
