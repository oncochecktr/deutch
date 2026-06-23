/** Konuş-Dinle — ana max-w-5xl sınırını genişletir */
export default function KonusDinleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 w-[min(calc(100vw-0.75rem),94rem)] max-w-none -translate-x-1/2">
      {children}
    </div>
  );
}
