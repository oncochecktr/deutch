"use client";

import { useEffect } from "react";

export interface ListenMediaSessionHandlers {
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

/** Kilit ekranı / kulaklık düğmeleri — ekran kapalıyken dinlemeyi sürdürür */
export function useListenMediaSession(
  active: boolean,
  meta: { title: string; subtitle: string; index: number; total: number },
  handlers: ListenMediaSessionHandlers
) {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    const ms = navigator.mediaSession;

    if (!active) {
      ms.playbackState = "none";
      ms.metadata = null;
      return;
    }

    ms.metadata = new MediaMetadata({
      title: meta.title,
      artist: "German Coach",
      album: `${meta.subtitle} · ${meta.index + 1}/${meta.total}`,
    });
    ms.playbackState = "playing";

    const safe = (fn?: () => void) => () => {
      try {
        fn?.();
      } catch {
        /* ignore */
      }
    };

    ms.setActionHandler("play", safe(handlers.onPlay));
    ms.setActionHandler("pause", safe(handlers.onPause));
    ms.setActionHandler("previoustrack", safe(handlers.onPrevious));
    ms.setActionHandler("nexttrack", safe(handlers.onNext));

    return () => {
      ms.playbackState = "none";
      ms.metadata = null;
      ms.setActionHandler("play", null);
      ms.setActionHandler("pause", null);
      ms.setActionHandler("previoustrack", null);
      ms.setActionHandler("nexttrack", null);
    };
  }, [
    active,
    meta.title,
    meta.subtitle,
    meta.index,
    meta.total,
    handlers.onPlay,
    handlers.onPause,
    handlers.onNext,
    handlers.onPrevious,
  ]);
}
