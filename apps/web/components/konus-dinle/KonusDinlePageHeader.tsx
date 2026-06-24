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
          <h1 className="text-2xl font-bold sm:text-3xl">Konuş-Dinle</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85">
            Soldan dal seç. Dinle, tekrar et, konuş.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 border-t border-white/10 bg-black/10 px-5 py-2 text-xs text-white/70 sm:px-6">
        <span>A1 · A2 · B1</span>
        <span>·</span>
        <span>1–6 kelime</span>
      </div>
    </div>
  );
}
