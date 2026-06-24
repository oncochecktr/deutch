"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";

const STORAGE_KEY = "german-coach-welcome-v1";

export function WelcomeIntro() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-goethe-blue/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal
      aria-labelledby="welcome-title"
    >
      <div className="welcome-pop max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-goethe-gold/30 bg-cream-50 shadow-2xl">
        <div className="bg-goethe-blue px-6 py-5 text-white">
          <p className="text-label font-bold uppercase tracking-widest text-goethe-gold">
            Hoş geldin
          </p>
          <h2 id="welcome-title" className="mt-1 text-2xl font-bold">
            {APP_NAME}
          </h2>
          <p className="mt-1 text-sm text-white/80">{APP_TAGLINE}</p>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm text-sage-600">
            A1 Almanca — kelime, gramer ve sınav tek yerde.
          </p>

          <div className="rounded-xl border border-sage-100 bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-goethe-blue">İlerleme</p>
            <ProgressBar value={35} size="lg" variant="gold" showPercent />
          </div>

          <ul className="space-y-2 text-sm text-sage-600">
            <li className="flex gap-2">
              <span className="text-goethe-gold">1.</span>
              Gramer yol haritası
            </li>
            <li className="flex gap-2">
              <span className="text-goethe-gold">2.</span>
              Kelime kartları
            </li>
            <li className="flex gap-2">
              <span className="text-goethe-gold">3.</span>
              Sınav modülleri
            </li>
          </ul>

          <div className="flex flex-col gap-2 pt-1">
            <Link href="/grundlagen/roadmap" className="btn-primary-lg text-center" onClick={dismiss}>
              Başla →
            </Link>
            <button type="button" className="btn-secondary-lg" onClick={dismiss}>
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
