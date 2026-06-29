"use client";

import {
  type CardsListenSettings,
  type CardsSpeechSpeed,
  SPEECH_LABEL,
  saveCardsListenSettings,
} from "@/lib/cardsSettings";

interface CardsListenPanelProps {
  settings: CardsListenSettings;
  onChange: (next: CardsListenSettings) => void;
}

export function CardsListenPanel({ settings, onChange }: CardsListenPanelProps) {
  const patch = (partial: Partial<CardsListenSettings>) => {
    const next = { ...settings, ...partial };
    onChange(next);
    saveCardsListenSettings(next);
  };

  return (
    <details className="app-collapse card-soft group">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-goethe-blue marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          Dinleme ayarları
          <span className="text-xs font-normal text-sage-400 group-open:hidden">Aç</span>
        </span>
      </summary>
      <div className="space-y-4 border-t border-sage-100 px-4 py-4">
        <div>
          <label className="text-xs font-medium text-sage-500">Ses hızı</label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(["normal", "slow", "slower"] as CardsSpeechSpeed[]).map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => patch({ speechSpeed: speed })}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  settings.speechSpeed === speed
                    ? "bg-goethe-blue text-white"
                    : "bg-sage-100 text-sage-600"
                }`}
              >
                {SPEECH_LABEL[speed]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-sage-500">
            Tekrar sayısı: {settings.repeatCount}
          </label>
          <input
            type="range"
            min={1}
            max={5}
            value={settings.repeatCount}
            onChange={(e) => patch({ repeatCount: Number(e.target.value) })}
            className="mt-1 w-full"
          />
        </div>

        <label className="flex items-center justify-between gap-3 text-sm text-sage-700">
          <span>Çevirisini de dinle (TR)</span>
          <input
            type="checkbox"
            checked={settings.playTranslation}
            onChange={(e) => patch({ playTranslation: e.target.checked })}
            className="h-4 w-4 rounded border-sage-300"
          />
        </label>

        <div>
          <label className="text-xs font-medium text-sage-500">
            Günlük kelime hedefi: {settings.dailyGoal}
          </label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={settings.dailyGoal}
            onChange={(e) => patch({ dailyGoal: Number(e.target.value) })}
            className="mt-1 w-full"
          />
        </div>

      </div>
    </details>
  );
}
