import type { CalloutKind } from "@/lib/elKitabi/types";

const STYLES: Record<CalloutKind, { border: string; bg: string; label: string }> = {
  ipucu: {
    border: "border-goethe-gold",
    bg: "bg-goethe-gold/5",
    label: "Ipucu",
  },
  dikkat: {
    border: "border-goethe-blue",
    bg: "bg-goethe-blue/5",
    label: "Dikkat",
  },
  ornek: {
    border: "border-sage-400",
    bg: "bg-sage-50",
    label: "Ornek",
  },
};

export function ElKitabiCallout({
  kind,
  text,
  de,
  tr,
}: {
  kind: CalloutKind;
  text: string;
  de?: string;
  tr?: string;
}) {
  const s = STYLES[kind];
  return (
    <div className={`border-l-4 ${s.border} ${s.bg} px-4 py-3`}>
      <p className={`text-xs font-semibold uppercase ${kind === "ipucu" ? "text-goethe-gold" : kind === "dikkat" ? "text-goethe-blue" : "text-sage-500"}`}>
        {s.label}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-sage-700">{text}</p>
      {de && (
        <p className="mt-2 text-sm font-medium text-goethe-blue">{de}</p>
      )}
      {tr && <p className="mt-0.5 text-sm text-sage-600">{tr}</p>}
    </div>
  );
}
