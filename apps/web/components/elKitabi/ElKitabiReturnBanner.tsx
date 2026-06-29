"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getSubsectionTitle } from "@/lib/elKitabi/practice";

function ElKitabiReturnBannerInner() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const section = searchParams.get("section");

  if (from !== "el-kitabi" || !section) return null;

  const title = getSubsectionTitle(section) ?? section;
  const backHref = `/rehber/el-kitabi#${section}`;

  return (
    <div className="mb-4 rounded-xl border border-goethe-gold/40 bg-goethe-gold/10 px-4 py-3 text-sm text-goethe-blue">
      <span className="text-sage-600">El kitabından geldin — </span>
      <Link href={backHref} className="font-semibold underline hover:no-underline">
        {title}&apos;a dön
      </Link>
    </div>
  );
}

export function ElKitabiReturnBanner() {
  return (
    <Suspense fallback={null}>
      <ElKitabiReturnBannerInner />
    </Suspense>
  );
}
