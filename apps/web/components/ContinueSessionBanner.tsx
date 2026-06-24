"use client";

import Link from "next/link";
import { getRouteLabel } from "@/lib/browserStorage";
import { useProgress } from "@/lib/ProgressContext";

export function ContinueSessionBanner() {
  const { progress, hydrated } = useProgress();

  if (!hydrated) return null;

  const route = progress.lastRoute;
  if (!route || route === "/") return null;

  const label = getRouteLabel(route);
  const saved = progress.lastSavedAt
    ? new Date(progress.lastSavedAt).toLocaleString("tr-TR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Link
      href={route}
      className="card-soft block border-2 border-goethe-blue/20 p-4 transition hover:border-goethe-blue/40"
    >
      <p className="text-xs font-semibold uppercase text-goethe-blue">Devam et</p>
      <p className="mt-1 font-semibold text-sage-700">{label}</p>
      {saved && <p className="mt-1 text-xs text-sage-400">Son kayıt: {saved}</p>}
      <span className="mt-2 inline-block text-sm font-medium text-goethe-blue">Devam et →</span>
    </Link>
  );
}
