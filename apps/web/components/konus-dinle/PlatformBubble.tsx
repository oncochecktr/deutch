"use client";

import { playGermanAudio } from "@/lib/audio";
import type { KonusDinleItem } from "@/lib/konusDinlePlaylist";
import { IconPlay } from "@/components/icons";

interface PlatformBubbleProps {
  item: KonusDinleItem;
  playing: boolean;
  onReplay: () => void;
}

export function PlatformBubble({ item, playing, onReplay }: PlatformBubbleProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] rounded-2xl rounded-tl-md border border-goethe-blue/20 bg-white px-4 py-3 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-goethe-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-goethe-blue">
            Platform
          </span>
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-1 rounded-lg border border-sage-200 bg-sage-50 px-2.5 py-1 text-[11px] font-medium text-goethe-blue transition hover:bg-sage-100 active:scale-[0.98]"
          >
            <IconPlay size={12} />
            {playing ? "Dinleniyor…" : "Tekrar dinle"}
          </button>
        </div>
        <p className="text-base font-medium leading-relaxed text-goethe-blue sm:text-lg">
          {item.textDe}
        </p>
        <p className="mt-1.5 text-sm italic leading-relaxed text-sage-600">{item.textTr}</p>
      </div>
    </div>
  );
}

export async function playPlatformItem(item: KonusDinleItem): Promise<void> {
  await playGermanAudio(item.textDe, item.audioSrc);
}
