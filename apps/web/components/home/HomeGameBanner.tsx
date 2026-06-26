import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

export function HomeGameBanner() {
  return (
    <Link
      href="/grundlagen/cumle-motoru"
      className="card-soft group flex items-center justify-between gap-4 border-2 border-goethe-gold/45 bg-gradient-to-r from-goethe-gold/15 to-white p-5 transition hover:border-goethe-gold/70 hover:shadow-md"
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">Oyun</p>
        <h2 className="mt-1 text-lg font-bold text-goethe-blue">
          Kelime oyunu ile cümle hafızanı geliştir
        </h2>
        <p className="mt-1 text-sm text-sage-600">
          852 kelime · gerçek cümle · puan kazan — sıkılmadan öğren
        </p>
      </div>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-goethe-blue text-2xl text-white transition group-hover:scale-105">
        <IconArrowRight size={22} className="text-goethe-gold" />
      </span>
    </Link>
  );
}
