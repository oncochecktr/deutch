"use client";

import Link from "next/link";
import { useState } from "react";
import { IconCheck, IconArrowRight } from "@/components/icons";
import { ProgressBar } from "@/components/ProgressBar";
import type { LearningMapState, MapNode, MapNodeStatus } from "@/lib/learningMap";

const STATUS_STYLE: Record<
  MapNodeStatus,
  { ring: string; bg: string; text: string; dot: string }
> = {
  locked: {
    ring: "border-sage-200",
    bg: "bg-sage-50",
    text: "text-sage-400",
    dot: "bg-sage-300",
  },
  available: {
    ring: "border-sage-200",
    bg: "bg-white",
    text: "text-goethe-blue",
    dot: "bg-sage-400",
  },
  active: {
    ring: "border-goethe-gold ring-2 ring-goethe-gold/40",
    bg: "bg-goethe-gold/10",
    text: "text-goethe-blue",
    dot: "bg-goethe-gold",
  },
  done: {
    ring: "border-sage-300",
    bg: "bg-sage-50",
    text: "text-sage-700",
    dot: "bg-sage-500",
  },
  future: {
    ring: "border-dashed border-sage-200",
    bg: "bg-white/50",
    text: "text-sage-400",
    dot: "bg-sage-200",
  },
};

interface LearningMapTreeProps {
  map: LearningMapState;
}

export function LearningMapTree({ map }: LearningMapTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "branch-a1": true,
    "trunk-words": true,
    "trunk-grammar": true,
  });

  const toggle = (id: string) => {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  };

  return (
    <div className="space-y-6">
      <SummaryPanel summary={map.summary} />

      <div className="card-soft overflow-hidden border-2 border-goethe-blue/15 p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-goethe-blue text-xs font-bold text-white">
            H
          </span>
          <div>
            <p className="text-sm font-bold text-goethe-blue">{map.root.label}</p>
            <p className="text-xs text-sage-500">{map.root.description}</p>
          </div>
        </div>

        <div className="space-y-1">
          {map.root.children?.map((branch) => (
            <BranchNode
              key={branch.id}
              node={branch}
              depth={0}
              activeId={map.summary.activeNodeId}
              expanded={expanded}
              onToggle={toggle}
            />
          ))}
        </div>

        <Legend />
      </div>
    </div>
  );
}

function SummaryPanel({ summary }: { summary: LearningMapState["summary"] }) {
  return (
    <section className="card-soft border-2 border-goethe-blue/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
            Tahmini seviye
          </p>
          <h2 className="mt-1 text-2xl font-bold text-goethe-blue">{summary.levelLabel}</h2>
          <p className="mt-1 max-w-md text-sm text-sage-600">{summary.levelDetail}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums text-goethe-gold">%{summary.overallPercent}</p>
          <p className="text-xs text-sage-500">genel hazırlık</p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar value={summary.overallPercent} size="md" showPercent />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {summary.strengths.length > 0 && (
          <div className="rounded-xl bg-sage-50 p-3">
            <p className="text-[10px] font-bold uppercase text-sage-500">Güçlü alanlar</p>
            <ul className="mt-1 space-y-0.5 text-sm text-sage-700">
              {summary.strengths.map((s) => (
                <li key={s} className="flex items-center gap-1.5">
                  <IconCheck size={14} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {summary.gaps.length > 0 && (
          <div className="rounded-xl bg-goethe-gold/10 p-3">
            <p className="text-[10px] font-bold uppercase text-goethe-blue">Öğrenmen gereken</p>
            <ul className="mt-1 space-y-0.5 text-sm text-goethe-blue">
              {summary.gaps.map((g) => (
                <li key={g}>→ {g}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {summary.nextHref && (
        <Link
          href={summary.nextHref}
          className="btn-primary mt-4 flex w-full items-center justify-center gap-2 sm:w-auto"
        >
          Sonraki adım: {summary.nextLabel}
          <IconArrowRight size={18} />
        </Link>
      )}
    </section>
  );
}

function BranchNode({
  node,
  depth,
  activeId,
  expanded,
  onToggle,
}: {
  node: MapNode;
  depth: number;
  activeId: string;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const hasChildren = (node.children?.length ?? 0) > 0;
  const isOpen = expanded[node.id] ?? depth < 2;
  const style = STATUS_STYLE[node.status];
  const isActive = node.id === activeId;
  const isYouAreHere = isActive || node.children?.some((c) => c.id === activeId);

  const content = (
    <div
      className={`relative rounded-xl border p-3 transition ${style.ring} ${style.bg} ${
        node.href && node.status !== "locked" && node.status !== "future"
          ? "hover:border-goethe-blue/30"
          : ""
      }`}
    >
      {isYouAreHere && node.status !== "locked" && (
        <span className="absolute -right-1 -top-2 rounded-full bg-goethe-gold px-2 py-0.5 text-[9px] font-bold uppercase text-goethe-blue shadow-sm">
          Sen buradasın
        </span>
      )}

      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`font-semibold ${style.text}`}>{node.label}</p>
            {node.labelTr && (
              <span className="text-xs text-sage-500">{node.labelTr}</span>
            )}
            {node.status === "done" && <IconCheck size={14} className="text-sage-600" />}
            {node.status === "locked" && (
              <span className="text-[10px] text-sage-400">🔒 kilitli</span>
            )}
            {node.status === "future" && (
              <span className="text-[10px] text-sage-400">yakında</span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-sage-500">{node.description}</p>
          {node.progress > 0 && node.status !== "future" && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sage-100">
                <div
                  className="h-full rounded-full bg-goethe-blue transition-all"
                  style={{ width: `${node.progress}%` }}
                />
              </div>
              <span className="text-[10px] tabular-nums text-sage-500">%{node.progress}</span>
            </div>
          )}
        </div>
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="shrink-0 rounded-lg px-2 py-1 text-xs text-sage-500 hover:bg-sage-100"
            aria-expanded={isOpen}
          >
            {isOpen ? "−" : "+"}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={depth > 0 ? "ml-3 border-l-2 border-sage-200 pl-3 sm:ml-4 sm:pl-4" : ""}>
      <div className="py-1">
        {node.href && node.status !== "locked" && node.status !== "future" ? (
          <Link href={node.href} className="block">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="space-y-0">
          {node.children!.map((child) => (
            <BranchNode
              key={child.id}
              node={child}
              depth={depth + 1}
              activeId={activeId}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Legend() {
  const items: { status: MapNodeStatus; label: string }[] = [
    { status: "done", label: "Tamam / güçlü" },
    { status: "active", label: "Şu an buradasın" },
    { status: "available", label: "Devam edilebilir" },
    { status: "locked", label: "Önce üst dal" },
    { status: "future", label: "Yakında (B1)" },
  ];
  return (
    <div className="mt-6 flex flex-wrap gap-3 border-t border-sage-100 pt-4">
      {items.map((item) => (
        <span key={item.status} className="inline-flex items-center gap-1.5 text-[10px] text-sage-500">
          <span className={`h-2 w-2 rounded-full ${STATUS_STYLE[item.status].dot}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
