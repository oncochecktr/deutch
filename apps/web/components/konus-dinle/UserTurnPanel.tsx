"use client";

interface UserTurnPanelProps {
  listening: boolean;
  supported: boolean;
  transcript: string;
  sttError: string | null;
  disabled: boolean;
  onMicToggle: () => void;
}

export function UserTurnPanel({
  listening,
  supported,
  transcript,
  sttError,
  disabled,
  onMicToggle,
}: UserTurnPanelProps) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[92%] rounded-2xl rounded-tr-md border border-emerald-200 bg-emerald-50/80 px-4 py-3 shadow-sm">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-wide text-emerald-800">
          Sen
        </span>
        {transcript ? (
          <p className="text-sm leading-relaxed text-emerald-900">{transcript}</p>
        ) : (
          <p className="text-sm text-emerald-700/70">
            {disabled ? "Önce platformu dinle…" : "Konuşmak için mikrofona bas"}
          </p>
        )}
        {sttError && <p className="mt-2 text-xs text-amber-700">{sttError}</p>}
        <button
          type="button"
          onClick={onMicToggle}
          disabled={disabled || !supported}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            listening
              ? "bg-goethe-red text-white animate-pulse"
              : disabled
                ? "cursor-not-allowed bg-sage-100 text-sage-400"
                : "bg-goethe-blue text-white hover:brightness-110 active:scale-[0.98]"
          }`}
        >
          <span className="text-lg" aria-hidden>
            {listening ? "⏹" : "🎤"}
          </span>
          {listening ? "Dinliyorum… (bitir)" : supported ? "Konuş" : "Mikrofon desteklenmiyor"}
        </button>
      </div>
    </div>
  );
}
