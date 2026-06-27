import type { ButtonHTMLAttributes, ReactNode } from "react";

interface AttentionHintButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/** Dikkat çekmesi gereken küçük aksiyonlar (Gizle, panel aç vb.) */
export function AttentionHintButton({
  children,
  className = "",
  type = "button",
  ...props
}: AttentionHintButtonProps) {
  return (
    <button
      type={type}
      className={`btn-attention-glow shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
