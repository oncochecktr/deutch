"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type AppModalSize = "sm" | "md" | "full";

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  titleId?: string;
  children: ReactNode;
  header?: ReactNode;
  size?: AppModalSize;
  showClose?: boolean;
  closeLabel?: string;
  dismissOnBackdrop?: boolean;
  dismissOnEscape?: boolean;
  className?: string;
  panelClassName?: string;
  contentClassName?: string;
}

const PANEL_SIZE: Record<AppModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  full: "max-w-full sm:max-w-2xl lg:max-w-4xl",
};

export function AppModal({
  open,
  onClose,
  title,
  subtitle,
  titleId: titleIdProp,
  children,
  header,
  size = "md",
  showClose = true,
  closeLabel = "Kapat",
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  className = "",
  panelClassName = "",
  contentClassName = "",
}: AppModalProps) {
  const autoId = useId();
  const titleId = titleIdProp ?? (title ? `${autoId}-title` : undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !dismissOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, dismissOnEscape]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-end justify-center bg-goethe-blue/50 p-0 backdrop-blur-sm sm:items-center sm:p-4 ${className}`}
      role="dialog"
      aria-modal
      aria-labelledby={titleId}
      onClick={dismissOnBackdrop ? (e) => e.target === e.currentTarget && onClose() : undefined}
    >
      <div
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-sage-100 bg-cream-50 shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl ${PANEL_SIZE[size]} ${panelClassName}`}
      >
        {(header || title || showClose) && (
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-sage-100 px-4 py-3 sm:px-5 sm:py-4">
            <div className="min-w-0 flex-1">
              {header ?? (
                <>
                  {title && (
                    <h2 id={titleId} className="truncate text-lg font-bold text-goethe-blue">
                      {title}
                    </h2>
                  )}
                  {subtitle && <p className="mt-0.5 truncate text-sm text-sage-500">{subtitle}</p>}
                </>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-lg border border-sage-200 bg-white px-3 py-1.5 text-sm font-semibold text-sage-600 transition hover:border-sage-300 hover:bg-sage-50"
                aria-label={closeLabel}
              >
                {closeLabel}
              </button>
            )}
          </div>
        )}

        <div className={`min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 ${contentClassName}`}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
