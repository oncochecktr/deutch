import Link from "next/link";
import { getArtikelTrainer } from "@/lib/grundlagen";
import { ElKitabiReturnBanner } from "@/components/elKitabi/ElKitabiReturnBanner";
import { PageShell } from "@/components/PageShell";
import { ArtikelTrainer } from "@/components/grundlagen/ArtikelTrainer";

export default function ArtikelPage() {
  const data = getArtikelTrainer();

  return (
    <PageShell
      title={data.title}
      subtitle={data.titleTr}
      backHref="/grundlagen"
      backLabel="A1 modüllere dön"
      maxWidth="md"
    >
      <ElKitabiReturnBanner />
      <Link
        href="/grundlagen/artikel/oyun"
        className="card-soft mb-4 flex flex-wrap items-center justify-between gap-3 border-2 border-goethe-gold/50 bg-goethe-gold/10 p-4 transition hover:border-goethe-gold/70"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue">Oyun</p>
          <p className="mt-1 font-bold text-goethe-blue">Artikel Oyunu</p>
          <p className="mt-0.5 text-sm text-sage-600">
            Sesle dinle, der/die/das seç · 15 soru
          </p>
        </div>
        <span className="shrink-0 text-sm font-semibold text-goethe-blue">Oyna →</span>
      </Link>
      <ArtikelTrainer data={data} />
    </PageShell>
  );
}
