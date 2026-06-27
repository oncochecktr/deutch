/** Kart altı altın parıltılı ayırıcı — WordCard ile aynı stil */
export function GoldCueLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`gold-cue-line h-1 w-28 max-w-[70%] rounded-full bg-gradient-to-r from-goethe-gold/20 via-goethe-gold to-goethe-gold/20 ${className}`}
      aria-hidden
    />
  );
}
