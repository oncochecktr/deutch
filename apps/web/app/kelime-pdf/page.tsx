import { Suspense } from "react";
import VocabPdfClient from "../words/pdf/VocabPdfClient";

/** Kısa URL — /words/pdf ile aynı sayfa */
export default function KelimePdfPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sage-400">Yükleniyor…</p>}>
      <VocabPdfClient />
    </Suspense>
  );
}
