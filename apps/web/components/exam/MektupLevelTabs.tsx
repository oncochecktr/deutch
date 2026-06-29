"use client";

import type { MektupLevel } from "@/lib/mektupTypes";

const LEVELS: { id: MektupLevel; label: string; sub: string }[] = [
  { id: "A1", label: "A1", sub: "~30 kelime · 3 soru" },
  { id: "B1", label: "B1", sub: "~80 kelime · 4 madde" },
];

export function MektupLevelTabs({
  level,
  onChange,
}: {
  level: MektupLevel;
  onChange: (l: MektupLevel) => void;
}) {
  return (
    <div className="flex gap-2 rounded-xl bg-sage-100 p-1">
      {LEVELS.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onChange(l.id)}
          className={`flex-1 rounded-lg px-3 py-2.5 text-left transition ${
            level === l.id
              ? "bg-white shadow-sm ring-1 ring-goethe-gold/40"
              : "text-sage-500 hover:text-sage-700"
          }`}
        >
          <span
            className={`block text-sm font-bold ${
              level === l.id ? "text-goethe-blue" : "text-sage-600"
            }`}
          >
            Goethe {l.label}
          </span>
          <span className="block text-[10px] text-sage-500">{l.sub}</span>
        </button>
      ))}
    </div>
  );
}
