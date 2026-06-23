"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { GrundlagenItemList } from "@/components/grundlagen/GrundlagenItemList";
import { ZeitQuiz } from "@/components/grundlagen/ZeitQuiz";
import { getA1Core } from "@/lib/grundlagen";

export default function ZeitPage() {
  const { zeit } = getA1Core();
  const [tab, setTab] = useState<"quiz" | "cards">("quiz");

  return (
    <PageShell
      title={`${zeit.title} — ${zeit.titleTr}`}
      subtitle="Günün zamanları, hafta, aylar, saat söyleme"
      backHref="/grundlagen"
      backLabel="Temel modüllere dön"
      maxWidth="md"
    >
      <div className="flex rounded-xl border border-sage-200 bg-sage-50 p-1">
        <button
          type="button"
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === "quiz" ? "bg-white text-goethe-blue shadow-sm" : "text-sage-500"
          }`}
          onClick={() => setTab("quiz")}
        >
          Alıştırma
        </button>
        <button
          type="button"
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === "cards" ? "bg-white text-goethe-blue shadow-sm" : "text-sage-500"
          }`}
          onClick={() => setTab("cards")}
        >
          Ezber listesi
        </button>
      </div>
      {tab === "quiz" ? <ZeitQuiz /> : <GrundlagenItemList sections={zeit.sections} />}
    </PageShell>
  );
}
