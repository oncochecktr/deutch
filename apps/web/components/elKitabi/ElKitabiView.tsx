import Link from "next/link";
import { ElKitabiHashSync } from "@/components/elKitabi/ElKitabiHashSync";
import { ElKitabiBlocks } from "@/components/elKitabi/ElKitabiBlocks";
import { ElKitabiProgressSummary } from "@/components/elKitabi/ElKitabiProgressSummary";
import { ElKitabiSection } from "@/components/elKitabi/ElKitabiSection";
import { ElKitabiTable } from "@/components/elKitabi/ElKitabiTable";
import { ElKitabiToc } from "@/components/elKitabi/ElKitabiToc";
import { EL_KITABI, EL_KITABI_TOC } from "@/lib/elKitabi";

export function ElKitabiView() {
  const { intro, roadmap, chapters, appendices } = EL_KITABI;

  return (
    <div className="space-y-8">
      <ElKitabiHashSync />
      <div className="card-goethe p-5">
        <p className="text-sm leading-relaxed text-sage-700">
          A1&apos;den B1&apos;e Almanca dilbilgisi rehberi — German Coach uygulamasinin eslikci
          kaynagi. Videolarda ogrendigin konulari hizlica bul, tablolari tekrar et, sinav
          oncesi kalıplari gozden gecir.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/harita" className="btn-secondary text-sm">
            Ogrenme haritasi
          </Link>
          <Link href="/grundlagen/roadmap" className="btn-secondary text-sm">
            Gramer yol haritasi
          </Link>
        </div>
      </div>

      <ElKitabiProgressSummary />

      <ElKitabiToc entries={EL_KITABI_TOC} />

      <section id="kullanim" className="scroll-mt-20">
        <div className="card-soft p-5 sm:p-6">
          <h2 className="text-lg font-bold text-goethe-blue">{intro.title}</h2>
          <div className="mt-4">
            <ElKitabiBlocks blocks={intro.blocks} />
          </div>
          <h3 className="mt-6 text-sm font-bold text-goethe-blue">
            A1 → B1 icin onerilen calisma ritmi
          </h3>
          <div className="mt-3">
            <ElKitabiTable
              headers={["Asama", "Odak bolumler", "Hedef"]}
              rows={intro.rhythmTable.map((r) => [r.stage, r.focus, r.goal])}
            />
          </div>
        </div>
      </section>

      <section id="yol-haritasi" className="scroll-mt-20">
        <div className="card-soft p-5 sm:p-6">
          <h2 className="text-lg font-bold text-goethe-blue">A1 → B1 Yol Haritasi</h2>
          <div className="mt-4">
            <ElKitabiBlocks blocks={roadmap.intro} />
          </div>
          {roadmap.levels.map((level) => (
            <div key={level.id} className="mt-6">
              <h3 className="text-sm font-bold text-goethe-blue">
                {level.id} — {level.title}
              </h3>
              <p className="mt-1 text-sm text-sage-600">{level.goal}</p>
              <div className="mt-3 overflow-x-auto">
                <ElKitabiTable
                  headers={["Konu", "Islenen ana konular", "Kitap", "German Coach"]}
                  rows={level.rows.map((r) => [
                    r.module,
                    r.topics,
                    r.bookRef,
                    r.href ? (r.status === "reference-only" ? "Rehber (yakinda)" : "Modul var") : "—",
                  ])}
                />
              </div>
              {level.rows.some((r) => r.href) && (
                <ul className="mt-2 space-y-1">
                  {level.rows
                    .filter((r) => r.href && r.status !== "reference-only")
                    .map((r) => (
                      <li key={r.module}>
                        <Link
                          href={r.href!}
                          className="text-sm font-medium text-goethe-blue hover:underline"
                        >
                          {r.module} →
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
          <h3 className="mt-6 text-sm font-bold text-goethe-blue">
            Almancanin uc buyuk kapisi
          </h3>
          <ul className="mt-3 space-y-3">
            {roadmap.threeGates.map((gate) => (
              <li
                key={gate.title}
                className="rounded-lg border border-sage-200 bg-white px-4 py-3 text-sm text-sage-700"
              >
                <span className="font-semibold text-goethe-blue">{gate.title}</span>
                <span className="text-sage-400"> ({gate.ref})</span>
                <p className="mt-1">{gate.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {chapters.map((chapter, i) => (
        <ElKitabiSection
          key={chapter.id}
          chapter={chapter}
          index={i}
          total={chapters.length}
        />
      ))}

      <section id="ekler" className="scroll-mt-20">
        <div className="card-soft p-5 sm:p-6">
          <h2 className="text-lg font-bold text-goethe-blue">Ekler (Anhang)</h2>
          <p className="mt-2 text-sm text-sage-600">
            Bu listeler ezberlenip birakilacak degil, defalarca donulecek referanslardir. Her
            hafta kucuk porsiyonlar hedefle.
          </p>
          <div className="mt-6 space-y-6">
            {appendices.map((app) => (
              <div key={app.id} id={app.id} className="scroll-mt-20">
                <h3 className="text-sm font-bold text-goethe-blue">{app.title}</h3>
                <div className="mt-3">
                  <ElKitabiBlocks blocks={app.blocks} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
