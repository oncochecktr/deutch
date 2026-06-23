"use client";

import { useEffect, useState } from "react";
import { STORAGE_DISMISS_KEY, getStorageWarningText } from "@/lib/browserStorage";

export function StorageWarningBanner({ className = "" }: { className?: string }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 ${className}`}
      role="status"
    >
      <span className="shrink-0 text-base" aria-hidden>
        ⚠
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">İlerleme bu tarayıcıda saklanır</p>
        <p className="mt-0.5 text-xs leading-relaxed opacity-90">{getStorageWarningText()}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(STORAGE_DISMISS_KEY, "1");
          } catch {
            /* ignore */
          }
          setDismissed(true);
        }}
        className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
      >
        Anladım
      </button>
    </div>
  );
}
