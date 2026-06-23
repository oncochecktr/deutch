"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";
import { APP_NAME, APP_TAGLINE, EXAM_LABEL_DESC, EXAM_PROVIDERS } from "@/lib/brand";

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
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-gold">
            Almanya yolculuğu
          </p>
          <h2 id="welcome-title" className="mt-1 text-2xl font-bold">
            {APP_NAME}
          </h2>
          <p className="mt-1 text-sm text-white/80">{APP_TAGLINE}</p>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm leading-relaxed text-sage-600">
            İş veya eğitim için Almanya&apos;ya gidenler için A1 Almanca — kelime, gramer ve
            sınav pratiği tek uygulamada.
          </p>

          <div className="flex flex-wrap gap-2">
            {EXAM_PROVIDERS.map((p) => (
              <span
                key={p}
                className="rounded-full border border-goethe-blue/20 bg-white px-3 py-1 text-xs font-semibold text-goethe-blue"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="text-xs text-sage-500">{EXAM_LABEL_DESC}</p>

          <div className="rounded-xl border border-sage-100 bg-white p-4">
            <p className="mb-2 text-xs font-semibold text-goethe-blue">İlerleme nasıl görünür?</p>
            <ProgressBar value={35} size="lg" variant="gold" showPercent />
            <p className="mt-2 text-[11px] text-sage-400">
              Altın çubuk = seviyen · Her modülde yüzde ve hedef çizgisi
            </p>
          </div>

          <ul className="space-y-2 text-sm text-sage-600">
            <li className="flex gap-2">
              <span className="text-goethe-gold">1.</span>
              Gramer yol haritasından başla (der/die/das)
            </li>
            <li className="flex gap-2">
              <span className="text-goethe-gold">2.</span>
              Kelime kartları ile devam et
            </li>
            <li className="flex gap-2">
              <span className="text-goethe-gold">3.</span>
              Dinle · Oku · Yaz · Konuş pratiği
            </li>
          </ul>

          <p className="rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            İlerlemeniz bu tarayıcıda saklanır. Verileri temizlerseniz veya gizli mod kullanırsanız
            kaybolur.
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <Link href="/grundlagen/roadmap" className="btn-primary-lg text-center" onClick={dismiss}>
              Gramer yol haritası →
            </Link>
            <Link href="/cards" className="btn-secondary-lg text-center" onClick={dismiss}>
              Kelime kartları
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
