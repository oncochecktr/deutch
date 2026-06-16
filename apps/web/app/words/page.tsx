import { Suspense } from "react";
import WordsPage from "./WordsClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sage-400">Yükleniyor...</p>}>
      <WordsPage />
    </Suspense>
  );
}
