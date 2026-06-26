"use client";

import Link from "next/link";
import { IconArrowRight, IconCheck } from "@/components/icons";
import { generatePattern02Examples, pattern02ForLemma } from "@/lib/adjektivDeclension";
import { SENTENCE_PATTERNS } from "@/lib/sentenceEngine";

export function SentenceEngineHub() {
  const active = SENTENCE_PATTERNS.filter((p) => p.status === "active").length;

  return (
    <div className="space-y-4">
      <div className="card-soft border border-goethe-gold/30 bg-goethe-gold/5 p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          Cümle motoru
        </p>
        <p className="mt-2 text-sm text-sage-700">
          852 kelime değil — <strong>20 yeniden kullanılabilir kalıp</strong>. Her kelime bu
          motorlara takılır; sen parçayı öğrenirsin.
        </p>
        <p className="mt-2 text-xs tabular-nums text-sage-500">
          {active} / {SENTENCE_PATTERNS.length} kalıp aktif
        </p>
      </div>

      <ol className="space-y-2">
        {SENTENCE_PATTERNS.map((p) => (
          <li key={p.id}>
            {p.href ? (
              <Link
                href={p.href}
                className="card-soft group flex items-start gap-3 border border-sage-100 p-4 transition hover:border-goethe-blue/35"
              >
                <PatternBadge id={p.id} active={p.status === "active"} />
                <PatternBody pattern={p} />
                <IconArrowRight
                  size={18}
                  className="mt-1 shrink-0 text-sage-300 transition group-hover:text-goethe-blue"
                />
              </Link>
            ) : (
              <div className="card-soft flex items-start gap-3 border border-sage-100 p-4 opacity-60">
                <PatternBadge id={p.id} active={false} />
                <PatternBody pattern={p} />
                <span className="shrink-0 text-xs text-sage-400">Yakında</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function PatternBadge({ id, active }: { id: string; active: boolean }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
        active ? "bg-goethe-blue text-white" : "bg-sage-100 text-sage-500"
      }`}
    >
      {active ? id : id}
    </span>
  );
}

function PatternBody({
  pattern: p,
}: {
  pattern: (typeof SENTENCE_PATTERNS)[number];
}) {
  return (
    <div className="min-w-0 flex-1">
      <p className="font-semibold text-goethe-blue">
        Pattern {p.id} · {p.title_tr}
      </p>
      <p className="text-xs text-sage-500">{p.formula}</p>
      <p className="mt-1 text-sm text-sage-600">
        <span className="font-medium text-goethe-blue">{p.example_de}</span>
        <span className="text-sage-400"> — {p.example_tr}</span>
      </p>
      {p.id === "02" && (
        <p className="mt-1 text-[10px] font-bold uppercase text-goethe-gold">
          Adjective Engine · Lego
        </p>
      )}
    </div>
  );
}

export function Pattern02Hint({
  lemma,
  className = "",
}: {
  lemma: string;
  className?: string;
}) {
  const adj = pattern02ForLemma(lemma);
  if (!adj) return null;
  const examples = generatePattern02Examples(adj, 3, lemma.length);

  return (
    <div className={`rounded-xl border border-goethe-gold/30 bg-goethe-gold/10 p-3 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-goethe-blue flex items-center gap-1.5">
        <IconCheck size={12} className="shrink-0" />
        Pattern 02 ile kullanılabilir
      </p>
      <ul className="mt-2 space-y-1 text-sm text-sage-700">
        {examples.map((ex) => (
          <li key={ex.de}>
            <span className="font-medium text-goethe-blue">{ex.de}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/grundlagen/sentence-engine/adjektiv"
        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-goethe-blue hover:underline"
      >
        Adjective Engine →
      </Link>
    </div>
  );
}
