"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getA1Vocabulary,
  getTimurVocabulary,
  CATEGORIES_A2,
} from "@german-coach/vocabulary";
import { PageShell } from "@/components/PageShell";
import { VocabPdfCategoryHeader, VocabPdfRow } from "@/components/words/VocabPdfRow";
import { VocabPdfSheet } from "@/components/words/VocabPdfSheet";
import {
  downloadVocabPdf,
  downloadVocabPdfFromHtml,
  getWordsForPdf,
  packLabel,
  pdfFileName,
  type VocabPdfPack,
} from "@/lib/vocabPdf";

const PACKS: { id: VocabPdfPack; label: string; count: string }[] = [
  { id: "a1", label: "A1", count: "906" },
  { id: "a2", label: "A2", count: "434" },
  { id: "all", label: "A1 + A2", count: "1340" },
  { id: "mesleki", label: "Mesleki", count: "102" },
];

function parsePack(value: string | null): VocabPdfPack {
  if (value === "a2" || value === "all" || value === "mesleki") return value;
  return "a1";
}

export default function VocabPdfClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialPack = parsePack(searchParams.get("pack"));

  const [pack, setPack] = useState<VocabPdfPack>(initialPack);
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [previewMode, setPreviewMode] = useState<"sample" | "full">("sample");
  const exportRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    if (pack === "a2") return [...CATEGORIES_A2];
    if (pack === "mesleki") return [...getTimurVocabulary().categories];
    return [...getA1Vocabulary().categories];
  }, [pack]);

  const words = useMemo(
    () => getWordsForPdf({ pack, category, includeExamples }),
    [pack, category, includeExamples]
  );

  const previewWords = previewMode === "sample" ? words.slice(0, 12) : words;

  const grouped = useMemo(() => {
    if (category) return [{ category: null as string | null, words: previewWords }];
    const map = new Map<string, typeof previewWords>();
    for (const w of previewWords) {
      const list = map.get(w.category) ?? [];
      list.push(w);
      map.set(w.category, list);
    }
    return [...map.entries()].map(([cat, list]) => ({ category: cat, words: list }));
  }, [previewWords, category]);

  const handleDownload = async () => {
    if (words.length === 0) return;
    setDownloading(true);
    const opts = { pack, category, includeExamples };
    try {
      await downloadVocabPdf(words, opts);
    } catch {
      if (exportRef.current) {
        await downloadVocabPdfFromHtml(exportRef.current, opts);
      }
    } finally {
      setDownloading(false);
    }
  };

  const pdfHref = useMemo(() => {
    const q = new URLSearchParams();
    q.set("pack", pack);
    if (category) q.set("category", category);
    return `/words/pdf?${q.toString()}`;
  }, [pack, category]);

  return (
    <PageShell
      title="Kelime PDF"
      subtitle="Önizle · yazdır · indir"
      backHref="/words"
      backLabel="Kelime listesine dön"
      maxWidth="lg"
    >
      <div className="space-y-4 print:hidden">
        <section className="card-soft space-y-3 p-4">
          <p className="text-sm text-sage-600">
            Solda Almanca kelime ve örnek cümle, sağda Türkçe karşılığı. A4’e basıp keserek
            yanında taşıyabilirsin — önce önizlemeye bak, sonra indir.
          </p>

          <div className="flex flex-wrap gap-2">
            {PACKS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPack(p.id);
                  setCategory(null);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  pack === p.id
                    ? "bg-goethe-blue text-white"
                    : "bg-sage-100 text-sage-600 hover:bg-sage-200"
                }`}
              >
                {p.label} ({p.count})
              </button>
            ))}
          </div>

          <label className="block text-xs text-sage-500">
            Kategori (isteğe bağlı)
            <select
              className="mt-1 w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm"
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value || null)}
            >
              <option value="">Tümü — {words.length} kelime</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-sm text-sage-700">
            <input
              type="checkbox"
              checked={includeExamples}
              onChange={(e) => setIncludeExamples(e.target.checked)}
              className="rounded border-sage-300"
            />
            Örnek cümleleri de ekle (önerilir)
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              className="btn-primary"
              disabled={downloading || words.length === 0}
              onClick={() => void handleDownload()}
            >
              {downloading
                ? words.length > 200
                  ? "PDF hazırlanıyor…"
                  : "Hazırlanıyor…"
                : `PDF indir (${words.length})`}
            </button>
            <button type="button" className="btn-secondary" onClick={() => window.print()}>
              Yazdır
            </button>
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={() => setPreviewMode(previewMode === "sample" ? "full" : "sample")}
            >
              {previewMode === "sample"
                ? `Tümünü önizle (${words.length})`
                : "Kısa önizleme (12 kelime)"}
            </button>
          </div>
          <p className="text-[11px] text-sage-400">
            Dosya: {pdfFileName({ pack, category, includeExamples })}
            {downloading && words.length > 300 && " · Büyük liste, biraz sürebilir"}
          </p>
        </section>
      </div>

      <div
        ref={exportRef}
        className="pointer-events-none fixed left-[-10000px] top-0 w-[920px]"
        aria-hidden
      >
        <VocabPdfSheet
          words={words}
          pack={pack}
          category={category}
          includeExamples={includeExamples}
          compact
        />
      </div>

      <section
        id="vocab-pdf-preview"
        className="vocab-pdf-sheet rounded-xl border border-sage-200 bg-white p-5 shadow-sm print:border-0 print:shadow-none print:p-0"
      >
        <header className="mb-4 border-b border-sage-200 pb-3 print:mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-goethe-blue print:text-black">
            German Coach
          </p>
          <h2 className="text-xl font-bold text-goethe-blue print:text-black">
            {category ? `${packLabel(pack)} · ${category}` : `${packLabel(pack)} kelimeler`}
          </h2>
          <div className="mt-2 grid grid-cols-2 gap-4 text-[10px] font-semibold uppercase tracking-wide text-sage-400 print:text-sage-600">
            <span>Almanca</span>
            <span>Türkçe</span>
          </div>
        </header>

        {words.length === 0 ? (
          <p className="text-sm text-sage-500">Bu filtrede kelime yok.</p>
        ) : (
          <div className="space-y-0">
            {grouped.map(({ category: cat, words: list }) => (
              <div key={cat ?? "all"}>
                {cat && !category && <VocabPdfCategoryHeader name={cat} />}
                {list.map((w) => (
                  <VocabPdfRow key={w.id} word={w} includeExamples={includeExamples} />
                ))}
              </div>
            ))}
          </div>
        )}

        {previewMode === "sample" && words.length > 12 && (
          <p className="mt-4 text-center text-xs text-sage-400 print:hidden">
            Önizlemede 12 kelime gösteriliyor. PDF’de tüm {words.length} kelime var.
          </p>
        )}
      </section>

      <p className="mt-4 text-center text-sm text-sage-400 print:hidden">
        <Link href="/words" className="hover:text-goethe-blue">
          ← Kelime listesi
        </Link>
        {" · "}
        <Link href={pdfHref} className="hover:text-goethe-blue">
          Bu seçimi paylaş
        </Link>
      </p>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #vocab-pdf-preview,
          #vocab-pdf-preview * {
            visibility: visible;
          }
          #vocab-pdf-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </PageShell>
  );
}
