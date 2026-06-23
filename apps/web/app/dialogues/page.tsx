import { Suspense } from "react";
import DialoguesClient from "./DialoguesClient";

export default function DialoguesPage() {
  return (
    <Suspense
      fallback={
        <div className="card-soft p-8 text-center text-sm text-sage-500">Hikayeler yükleniyor…</div>
      }
    >
      <DialoguesClient />
    </Suspense>
  );
}
