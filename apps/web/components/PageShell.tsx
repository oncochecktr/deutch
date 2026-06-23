import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowLeft } from "@/components/icons";

interface PageShellProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
  headerExtra?: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "full";
}

const WIDTH = {
  sm: "max-w-lg",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  full: "max-w-none w-full",
} as const;

export function PageShell({
  title,
  subtitle,
  backHref = "/",
  backLabel = "Panele dön",
  children,
  headerExtra,
  maxWidth = "sm",
}: PageShellProps) {
  return (
    <div className={`mx-auto ${WIDTH[maxWidth]} space-y-6`}>
      <header className="flex items-start gap-3">
        <Link
          href={backHref}
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sage-200 bg-white text-sage-600 transition hover:border-sage-300 hover:bg-sage-50"
          aria-label={backLabel}
        >
          <IconArrowLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-goethe-blue">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-sage-400">{subtitle}</p>}
        </div>
        {headerExtra}
      </header>
      {children}
    </div>
  );
}
