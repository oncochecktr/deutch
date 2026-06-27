"use client";

import Link from "next/link";

/** Ana sayfa — öne çıkan hikaye dinle modülü */
export function HomeStoryBanner() {
  return (
    <Link
      href="/dialogues?id=d_a2_eg_markt&level=A2&listen=1"
      className="card-soft block overflow-hidden border border-goethe-blue/20 bg-gradient-to-br from-goethe-blue/8 via-white to-amber-50/40 p-4 transition hover:border-goethe-blue/35 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-goethe-blue">
            Yeni · Hikaye dinle
          </p>
          <h2 className="mt-1 text-lg font-bold text-goethe-blue sm:text-xl">
            Einkaufen im Biomarkt
          </h2>
          <p className="mt-1 text-sm text-sage-600">
            Organik markette alışveriş — A2 · Easy German
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-sage-500">
            <li>Önce Almanca, sonra Türkçe (kadın ses)</li>
            <li>Ekran kilitli dinleme · kulaklık düğmeleri</li>
            <li>Dinle-yaz — duyduğunu kontrol et</li>
          </ul>
        </div>
        <span className="shrink-0 rounded-full bg-goethe-blue px-4 py-2 text-sm font-semibold text-white">
          Dinle →
        </span>
      </div>
    </Link>
  );
}
