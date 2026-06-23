"use client";

import { formatLogTime, type SessionLogEntry } from "@/lib/speakSessionLog";

interface SpeakSessionLogPanelProps {
  logs: SessionLogEntry[];
  onClear?: () => void;
}

const LEVEL_STYLE: Record<SessionLogEntry["level"], string> = {
  info: "text-sage-600 bg-sage-50",
  ok: "text-emerald-800 bg-emerald-50",
  warn: "text-amber-900 bg-amber-50",
  error: "text-red-800 bg-red-50",
};

export function SpeakSessionLogPanel({ logs, onClear }: SpeakSessionLogPanelProps) {
  return (
    <details className="card-soft group p-3" open={logs.some((l) => l.level === "error")}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-medium text-sage-500">
        <span>Sınıf günlüğü ({logs.length})</span>
        {onClear && logs.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClear();
            }}
            className="text-[10px] text-sage-400 hover:text-goethe-red"
          >
            Temizle
          </button>
        )}
      </summary>
      {logs.length === 0 ? (
        <p className="mt-2 text-[11px] italic text-sage-400">
          API istekleri, adım ilerlemesi ve hatalar burada görünür.
        </p>
      ) : (
        <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">
          {logs.map((entry) => (
            <li
              key={entry.id}
              className={`rounded-md px-2 py-1.5 text-[11px] leading-snug ${LEVEL_STYLE[entry.level]}`}
            >
              <span className="font-mono text-[10px] opacity-70">{formatLogTime(entry.at)}</span>{" "}
              {entry.message}
              {entry.detail && (
                <p className="mt-0.5 font-mono text-[10px] opacity-80">{entry.detail}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
