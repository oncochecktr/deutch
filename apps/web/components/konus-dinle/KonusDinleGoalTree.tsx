"use client";

import { useState } from "react";
import { IconCheck } from "@/components/icons";
import { buildKonusDinleGoalTree } from "@/lib/konusDinleTree";
import type { KonusDinleLevel, KonusDinleLengthFilter } from "@/lib/konusDinlePlaylist";
import type { KonusDinleProgress } from "@/lib/konusDinleStorage";

interface KonusDinleGoalTreeProps {
  progress: KonusDinleProgress;
  selectedLevel: KonusDinleLevel;
  selectedLength: KonusDinleLengthFilter;
  disabled?: boolean;
  onSelect: (level: KonusDinleLevel, length: KonusDinleLengthFilter) => void;
}

export function KonusDinleGoalTree({
  progress,
  selectedLevel,
  selectedLength,
  disabled,
  onSelect,
}: KonusDinleGoalTreeProps) {
  const tree = buildKonusDinleGoalTree(progress);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    A1: true,
    A2: false,
    B1: false,
  });

  const toggle = (level: KonusDinleLevel) => {
    setExpanded((e) => ({ ...e, [level]: !e[level] }));
  };

  return (
    <div className="card-soft overflow-hidden border-2 border-goethe-blue/15">
      <div className="border-b border-sage-100 bg-goethe-blue/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-goethe-blue text-xs font-bold text-white"
            aria-hidden
          >
            H
          </span>
          <div>
            <p className="text-sm font-bold text-goethe-blue">Hedef ağacı</p>
            <p className="text-[10px] text-sage-500">A1 → A2 → B1 · kelime & cümle</p>
          </div>
        </div>
      </div>

      <div className="max-h-[min(52vh,520px)] overflow-y-auto p-3">
        <ul className="space-y-1">
          {tree.map((levelNode) => {
            const open = expanded[levelNode.level] ?? false;
            const isLevelActive = selectedLevel === levelNode.level;

            return (
              <li key={levelNode.level}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => toggle(levelNode.level)}
                  className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition ${
                    isLevelActive ? "bg-goethe-gold/15" : "hover:bg-sage-50"
                  } ${disabled ? "opacity-60" : ""}`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${
                      levelNode.percent >= 80
                        ? "bg-sage-200 text-sage-700"
                        : isLevelActive
                          ? "bg-goethe-blue text-white"
                          : "bg-sage-100 text-goethe-blue"
                    }`}
                  >
                    {levelNode.percent >= 80 ? <IconCheck size={14} /> : levelNode.level}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-goethe-blue">{levelNode.level}</p>
                    <p className="truncate text-[10px] text-sage-500">{levelNode.goal}</p>
                    <p className="text-[10px] tabular-nums text-sage-400">
                      {levelNode.total} ifade · %{levelNode.percent}
                    </p>
                  </div>
                  <span className="text-sage-400">{open ? "▾" : "▸"}</span>
                </button>

                {open && (
                  <ul className="ml-3 border-l-2 border-sage-100 pl-2">
                    {levelNode.branches.map((branch) => {
                      const active =
                        selectedLevel === branch.level && selectedLength === branch.lengthFilter;
                      const done = branch.total > 0 && branch.completed >= branch.total;

                      return (
                        <li key={branch.id}>
                          <button
                            type="button"
                            disabled={disabled || branch.total === 0}
                            onClick={() => onSelect(branch.level, branch.lengthFilter)}
                            className={`mb-1 flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition ${
                              active
                                ? "bg-goethe-blue text-white shadow-sm"
                                : done
                                  ? "bg-sage-50 text-sage-600"
                                  : "text-sage-700 hover:bg-sage-50"
                            } ${branch.total === 0 ? "opacity-40" : ""}`}
                          >
                            <span
                              className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                                active ? "bg-goethe-gold" : done ? "bg-sage-400" : "bg-sage-200"
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-semibold">{branch.label}</p>
                              <p
                                className={`text-[10px] ${active ? "text-white/80" : "text-sage-400"}`}
                              >
                                {branch.subtitle}
                              </p>
                              <p
                                className={`text-[10px] tabular-nums ${active ? "text-white/70" : "text-sage-400"}`}
                              >
                                {branch.completed}/{branch.total}
                                {branch.total > 0 ? ` · %${branch.percent}` : ""}
                              </p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
