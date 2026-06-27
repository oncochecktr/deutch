"use client";

import { useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { FormFillSimulator } from "@/components/exam/FormFillSimulator";
import { MektupWriterInner } from "@/components/exam/MektupWriter";
import {
  MEKTUP_PHRASE_BANK,
  MEKTUP_PUNCTUATION_RULES,
  MEKTUP_TEMPLATES,
  MEKTUP_VERB_NOUN_PAIRS,
  SCHREIBEN_GOLDEN_RULES,
  SCHREIBEN_OVERVIEW,
} from "@/lib/gerceksinavSchreiben";

type Tab = "intro" | "form" | "mektup";

export function SchreibenRealSimulator() {
  const [tab, setTab] = useState<Tab>("intro");

  return (
    <PageShell
      title="Gerçek Schreiben Sınavı"
      subtitle="Form + mektup rehberi"
      backHref="/exam/schreiben"
      backLabel="Schreiben modülüne dön"
      maxWidth="md"
    >
      <div className="flex gap-1 rounded-xl bg-sage-100 p-1">
        {(
          [
            ["intro", "Kurallar"],
            ["form", "Teil 1 Form"],
            ["mektup", "Teil 2 Mektup"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-lg py-2.5 text-[11px] font-semibold transition sm:text-xs ${
              tab === id ? "bg-white text-goethe-blue shadow-sm" : "text-sage-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "intro" && (
        <div className="space-y-4">
          <div className="card-soft border-2 border-goethe-gold/40 p-5">
            <p className="text-sm text-sage-600">
              Schreiben <strong>{SCHREIBEN_OVERVIEW.duration}</strong> sürer.{" "}
              {SCHREIBEN_OVERVIEW.tasks.map((t) => `${t.tr} (${t.points} puan)`).join(" + ")}.
            </p>
            <p className="mt-3 rounded-lg bg-goethe-red/10 px-3 py-2 text-sm font-medium text-goethe-red">
              Dikkat: {SCHREIBEN_OVERVIEW.warning}
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {SCHREIBEN_OVERVIEW.tasks.map((t) => (
              <div key={t.id} className="rounded-xl border border-sage-100 bg-white p-4">
                <p className="text-xs font-bold text-goethe-blue">{t.de}</p>
                <p className="text-sm text-sage-600">{t.tr}</p>
                <p className="mt-1 text-lg font-bold text-sage-700">{t.points} Puan</p>
                <p className="text-xs text-sage-400">{t.detail}</p>
              </div>
            ))}
          </div>

          <section className="card-soft p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase text-sage-400">Altın kurallar</h2>
            <ul className="space-y-3">
              {SCHREIBEN_GOLDEN_RULES.map((r) => (
                <li key={r.title} className="text-sm">
                  <span className="font-semibold text-goethe-blue">{r.title}:</span>{" "}
                  <span className="text-sage-600">{r.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card-soft p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase text-sage-400">Mektup kalıpları (ezberle)</h2>
            <div className="space-y-3">
              {Object.entries(MEKTUP_TEMPLATES).map(([key, t]) => (
                <div key={key} className="rounded-lg bg-sage-50 p-3 text-xs">
                  <p className="font-semibold text-goethe-blue">{t.label}</p>
                  <p className="mt-1 font-mono text-sage-700">{t.greeting}</p>
                  <p className="font-mono text-sage-600">{t.deshalb}</p>
                  <p className="mt-1 font-mono text-sage-600">{t.closing.join(" ")}</p>
                  {"note" in t && t.note && <p className="mt-1 text-sage-400">{t.note}</p>}
                </div>
              ))}
            </div>
          </section>

          <section className="card-soft p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase text-sage-400">Noktalama</h2>
            <ul className="list-inside list-disc space-y-1 text-xs text-sage-600">
              {MEKTUP_PUNCTUATION_RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <div className="flex gap-2">
            <button type="button" className="btn-primary flex-1" onClick={() => setTab("form")}>
              Form çalış →
            </button>
            <button type="button" className="btn-secondary flex-1" onClick={() => setTab("mektup")}>
              Mektup yaz →
            </button>
          </div>
        </div>
      )}

      {tab === "form" && <FormFillSimulator onBack={() => setTab("intro")} />}

      {tab === "mektup" && (
        <div className="space-y-4">
          <details className="card-soft p-4">
            <summary className="cursor-pointer text-sm font-semibold text-goethe-blue">
              Kalıp cümle bankası
            </summary>
            <div className="mt-3 space-y-2">
              {MEKTUP_PHRASE_BANK.map((p) => (
                <div key={p.de} className="rounded-lg bg-sage-50 p-2 text-xs">
                  <p className="font-medium text-sage-800">{p.de}</p>
                  <p className="text-sage-500">{p.tr}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-sage-100 pt-3">
              <p className="text-xs font-semibold text-sage-400">Fiil ↔ isim</p>
              {MEKTUP_VERB_NOUN_PAIRS.map((p) => (
                <p key={p.verb} className="mt-1 text-xs text-sage-600">
                  <span className="text-goethe-blue">{p.verb}</span> / {p.noun} — {p.tr}
                </p>
              ))}
            </div>
          </details>
          <MektupWriterInner embedded onBack={() => setTab("intro")} />
        </div>
      )}

      <Link href="/exam" className="block text-center text-sm text-sage-400">
        ← Tüm modüller
      </Link>
    </PageShell>
  );
}
