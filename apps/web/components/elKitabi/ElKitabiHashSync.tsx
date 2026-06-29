"use client";

import { useEffect } from "react";

export function scrollElKitabiToHash(hash?: string): boolean {
  if (typeof window === "undefined") return false;
  const id = decodeURIComponent((hash ?? window.location.hash).replace(/^#/, ""));
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  let node: HTMLElement | null = el;
  while (node) {
    if (node instanceof HTMLDetailsElement) node.open = true;
    node = node.parentElement;
  }

  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  return true;
}

export function ElKitabiHashSync() {
  useEffect(() => {
    const run = () => {
      scrollElKitabiToHash();
    };

    run();
    const retry = window.setTimeout(run, 150);
    window.addEventListener("hashchange", run);
    return () => {
      window.clearTimeout(retry);
      window.removeEventListener("hashchange", run);
    };
  }, []);

  return null;
}
