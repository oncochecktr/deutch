"use client";

type Phase = "idle" | "platform" | "user" | "feedback";

const STEPS = [
  { id: "platform", label: "1 · Dinle", phases: ["platform"] as Phase[] },
  { id: "user", label: "2 · Konuş", phases: ["user"] as Phase[] },
  { id: "feedback", label: "3 · Geri bildirim", phases: ["feedback"] as Phase[] },
];

export function KonusDinleFlowSteps({ phase }: { phase: Phase }) {
  const activeIdx =
    phase === "platform" ? 0 : phase === "user" ? 1 : phase === "feedback" ? 2 : -1;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-sage-100 bg-white/90 px-3 py-2">
      {STEPS.map((step, i) => {
        const active = i === activeIdx;
        const done = activeIdx > i;
        return (
          <div key={step.id} className="flex items-center gap-2">
            {i > 0 && <span className="text-sage-300">→</span>}
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                active
                  ? "bg-goethe-blue text-white"
                  : done
                    ? "bg-sage-200 text-sage-700"
                    : "bg-sage-50 text-sage-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
      {activeIdx < 0 && (
        <span className="text-[10px] text-sage-400">Antrenman başlayınca adımlar burada görünür</span>
      )}
    </div>
  );
}
