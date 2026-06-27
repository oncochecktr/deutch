/** Almanca ↔ Türkçe — dekoratif bayraklar (eğitim / dil köprüsü) */

function FlagDE({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={className}
      role="img"
      aria-label="Almanya bayrağı"
    >
      <rect width="30" height="6.67" fill="#000" />
      <rect y="6.67" width="30" height="6.67" fill="#D00" />
      <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
    </svg>
  );
}

function FlagTR({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={className}
      role="img"
      aria-label="Türkiye bayrağı"
    >
      <rect width="30" height="20" fill="#E30A17" />
      <circle cx="11" cy="10" r="5" fill="#fff" />
      <circle cx="12.2" cy="10" r="4" fill="#E30A17" />
      <polygon
        fill="#fff"
        points="17.5,10 19.2,10.9 18.6,9.1 20.3,8.2 18.4,8.2 17.5,6.4 16.6,8.2 14.7,8.2 16.4,9.1 15.8,10.9"
      />
    </svg>
  );
}

interface LanguageFlagsProps {
  className?: string;
  size?: "sm" | "md";
  showLabels?: boolean;
}

export function LanguageFlags({ className = "", size = "md", showLabels = false }: LanguageFlagsProps) {
  const flagCls = size === "sm" ? "h-3.5 w-5 rounded-[2px] shadow-sm" : "h-4 w-6 rounded-[3px] shadow-sm";

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      role="group"
      aria-label="Almanca ve Türkçe"
    >
      <span className="inline-flex items-center gap-1">
        <FlagDE className={flagCls} />
        {showLabels ? <span className="text-xs font-medium">DE</span> : null}
      </span>
      <span className="text-white/40" aria-hidden>
        ·
      </span>
      <span className="inline-flex items-center gap-1">
        <FlagTR className={flagCls} />
        {showLabels ? <span className="text-xs font-medium">TR</span> : null}
      </span>
    </span>
  );
}
