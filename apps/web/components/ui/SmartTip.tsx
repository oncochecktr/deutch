"use client";

import { useEffect, useState, type ReactNode } from "react";
import { dismissSmartTip, isSmartTipDismissed } from "@/lib/smartTipStorage";

interface SmartTipProps {
  /** Kalıcı kapatma anahtarı — aynı id tekrar gösterilmez */
  id: string;
  children: ReactNode;
  className?: string;
}

/** Tek seferlik, kapatılabilir klavye / akış ipucu (localStorage) */
export function SmartTip({ id, children, className = "" }: SmartTipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!isSmartTipDismissed(id));
  }, [id]);

  if (!visible) return null;

  const dismiss = () => {
    dismissSmartTip(id);
    setVisible(false);
  };

  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-goethe-gold/35 bg-goethe-gold/10 px-3 py-2 ${className}`}
      role="note"
    >
      <span className="mt-px shrink-0 text-[10px] font-bold uppercase tracking-wide text-goethe-blue">
        İpucu
      </span>
      <p className="min-w-0 flex-1 text-xs leading-relaxed text-sage-700 sm:text-sm">{children}</p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase text-sage-500 transition hover:bg-white/70"
        aria-label="İpucunu kapat"
      >
        Tamam
      </button>
    </div>
  );
}
