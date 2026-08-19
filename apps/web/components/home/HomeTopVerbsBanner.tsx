import Link from "next/link";
import { IconArrowRight } from "@/components/icons";

export function HomeTopVerbsBanner() {
  return (
    <Link
      href="/almanca-en-cok-kullanilan-100-fiil"
      className="card-soft group flex items-center justify-between gap-4 border-2 border-goethe-gold/50 bg-gradient-to-r from-goethe-gold/20 via-white to-sage-50 p-5 transition hover:border-goethe-gold/75 hover:shadow-md"
    >
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">
          100 temel fiil
        </p>
        <h2 className="mt-1 text-lg font-bold leading-snug text-goethe-blue sm:text-xl">
          Almancada en çok gereken fiilleri çalış
        </h2>
        <p className="mt-1 text-sm leading-6 text-sage-600">
          Günlük cümle kurmak için en önemli fiiller: anlam, üç zaman ve örneklerle.
        </p>
      </div>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-goethe-blue text-2xl text-white transition group-hover:scale-105">
        <IconArrowRight size={22} className="text-goethe-gold" />
      </span>
    </Link>
  );
}
