"use client";

import Link from "next/link";
import { useState } from "react";
import { IconArrowRight } from "@/components/icons";
import type { DailySmartQueue, SmartQueueItem } from "@/lib/smartQueue";
import { smartQueueKindLabel } from "@/lib/smartQueue";

const PREVIEW_COUNT = 6;

function QueueRow({ item, index }: { item: SmartQueueItem; index: number }) {
  return (
    <Link
      href={item.href}
      className="flex gap-3 rounded-lg border border-sage-100 px-3 py-2.5 transition hover:border-goethe-gold/50 hover:bg-goethe-gold/5"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-bold text-sage-600">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-goethe-blue">{item.title}</p>
          <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-sage-500">
            {smartQueueKindLabel(item.kind)}
          </span>
        </div>
        {item.subtitle && (
          <p className="mt-0.5 truncate text-xs text-sage-500">{item.subtitle}</p>
        )}
        <p className="mt-0.5 text-xs text-sage-400">{item.reason}</p>
      </div>
      <IconArrowRight size={16} className="shrink-0 self-center text-sage-400" />
    </Link>
  );
}

interface SmartQueuePanelProps {
  queue: DailySmartQueue;
}

export function SmartQueuePanel({ queue }: SmartQueuePanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (queue.total === 0) return null;

  const visible = expanded ? queue.items : queue.items.slice(0, PREVIEW_COUNT);
  const hidden = queue.total - PREVIEW_COUNT;

  return (
    <section className="card-soft overflow-hidden border border-goethe-blue/20">
      <div className="border-b border-sage-100 bg-goethe-blue/5 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          Günlük karışık kuyruk
        </p>
        <h2 className="mt-1 text-lg font-bold text-goethe-blue">
          {queue.total} madde — SRS, el kitabı, gramer
        </h2>
        <p className="mt-1 text-sm text-sage-600">
          Gecikmiş tekrarlar önce; zayıf bölümler araya serpiştirilir.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-sage-600">
          <span className="rounded-full bg-white px-2.5 py-1">
            SRS <strong className="text-goethe-blue">{queue.srsCount}</strong>
          </span>
          <span className="rounded-full bg-white px-2.5 py-1">
            El kitabı <strong className="text-goethe-blue">{queue.elKitabiCount}</strong>
          </span>
          <span className="rounded-full bg-white px-2.5 py-1">
            Gramer <strong className="text-goethe-blue">{queue.grundlagenCount}</strong>
          </span>
        </div>
      </div>

      <ol className="space-y-2 p-4">
        {visible.map((item, i) => (
          <li key={item.id}>
            <QueueRow item={item} index={i} />
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-sage-100 px-5 py-3">
        {hidden > 0 && !expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-sm font-semibold text-goethe-blue hover:underline"
          >
            +{hidden} madde daha
          </button>
        ) : expanded && queue.total > PREVIEW_COUNT ? (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-sm font-semibold text-sage-500 hover:underline"
          >
            Daralt
          </button>
        ) : (
          <span />
        )}
        <Link
          href="/review"
          className="inline-flex items-center gap-1 text-sm font-semibold text-goethe-blue hover:underline"
        >
          Tekrar motoru
          <IconArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
