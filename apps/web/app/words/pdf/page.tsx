import { Suspense } from "react";
import VocabPdfClient from "./VocabPdfClient";

export default function VocabPdfPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sage-400">Yükleniyor…</p>}>
      <VocabPdfClient />
    </Suspense>
  );
}
