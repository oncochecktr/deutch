"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("German Coach page error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg">
      <div className="card-soft p-6 text-center">
        <h1 className="text-lg font-bold text-goethe-blue">Sayfa yüklenemedi</h1>
        <p className="mt-2 text-sm text-sage-500">{error.message}</p>
        <div className="mt-6 flex flex-col gap-2">
          <button type="button" className="btn-primary-lg w-full" onClick={reset}>
            Tekrar dene
          </button>
          <button
            type="button"
            className="btn-secondary-lg w-full"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Panele dön
          </button>
        </div>
      </div>
    </div>
  );
}
