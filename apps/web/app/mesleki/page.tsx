"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconListen, IconReview } from "@/components/icons";
import { getMeslekiVocabulary } from "@german-coach/vocabulary";
import { A1ControlPanel } from "@/components/A1ControlPanel";
import { AudioButton } from "@/components/AudioButton";
import { formatWord } from "@/lib/audio";
import { useProgress } from "@/lib/ProgressContext";
import { recordWordRecall } from "@/lib/learningEngine";
import { WordCard } from "@/components/WordCard";

const MODULE_GROUPS = [
  { label: "Depo", desc: "Lager, Wareneingang, Regal" },
  { label: "Lojistik", desc: "Transport, LKW, Versand" },
  { label: "Kommissionierung", desc: "Pickliste, Barcode, Paket" },
  { label: "Vardiya & Mesai", desc: "Schicht, Pause, Feierabend" },
  { label: "Maaş & Sözleşme", desc: "Lohn, Vertrag, Urlaub" },
  { label: "İş güvenliği", desc: "Helm, Sicherheit, Gefahr" },
  { label: "Forklift & Ekipman", desc: "Stapler, Palette, Hubwagen" },
  { label: "Şefle iletişim", desc: "Anweisung, Achtung, Hilfe" },
];

export default function MeslekiPage() {
  const { progress, updateProgress } = useProgress();
  const vocab = getMeslekiVocabulary();
  const [category, setCategory] = useState<string | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState<"overview" | "cards">("overview");

  const words = useMemo(() => {
    if (!category) return vocab.words;
    return vocab.words.filter((w) => w.category === category);
  }, [vocab.words, category]);

  const word = words[cardIndex % Math.max(words.length, 1)];
  const meslekiKnown = progress.knownWordIds.filter((id) => id.startsWith("timur_")).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <section className="card-soft overflow-hidden">
          <div className="bg-gradient-to-br from-sage-600 to-goethe-blue px-6 py-8 text-white">
            <span className="mb-2 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              Mesleki Almanca
            </span>
            <h1 className="text-2xl font-bold">İş & Kariyer Paketi</h1>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Genel A1&apos;in ötesinde — depo, lojistik, vardiya ve iş görüşmesi Almancası.
              A1 sınavına ek olarak Almanya iş hayatına hazırlık.
            </p>
          </div>
          <div className="grid gap-3 p-6 sm:grid-cols-3">
            <StatBox label="Kelime" value={String(vocab.total)} />
            <StatBox label="Bilinen" value={String(meslekiKnown)} />
            <StatBox label="Modül" value={String(MODULE_GROUPS.length)} />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-sage-100 p-4">
            <Link href="/listen?pack=mesleki" className="btn-primary inline-flex items-center gap-2 text-sm">
              <IconListen size={16} />
              Dinleme modu
            </Link>
            <Link href="/review" className="btn-secondary inline-flex items-center gap-2 text-sm">
              <IconReview size={16} />
              Tekrar
            </Link>
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={() => setMode(mode === "cards" ? "overview" : "cards")}
            >
              {mode === "cards" ? "Liste" : "Kart modu"}
            </button>
          </div>
        </section>

        {mode === "cards" && word ? (
          <div className="space-y-4">
            <WordCard
              word={word}
              flipped={flipped}
              onFlip={() => setFlipped((f) => !f)}
              showActions={flipped}
              onKnow={() => {
                updateProgress(recordWordRecall(progress, word.id, true, "srs"));
                setCardIndex((i) => (i + 1) % words.length);
                setFlipped(false);
              }}
              onDontKnow={() => {
                updateProgress(recordWordRecall(progress, word.id, false, "srs"));
                setFlipped(false);
              }}
            />
            <p className="text-center text-sm text-sage-400">
              {cardIndex + 1} / {words.length}
              {category ? ` · ${category}` : ""}
            </p>
          </div>
        ) : (
          <>
            <section className="card-soft p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sage-400">
                Mesleki modüller
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {MODULE_GROUPS.map((g) => {
                  const count = vocab.words.filter((w) => w.category === g.label).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={g.label}
                      type="button"
                      onClick={() => {
                        setCategory(g.label);
                        setCardIndex(0);
                      }}
                      className={`rounded-xl border p-3 text-left transition ${
                        category === g.label
                          ? "border-sage-400 bg-sage-50"
                          : "border-sage-100 hover:border-sage-300"
                      }`}
                    >
                      <p className="font-medium text-goethe-blue">{g.label}</p>
                      <p className="text-[10px] text-sage-400">{g.desc}</p>
                      <p className="mt-1 text-xs text-sage-500">{count} kelime</p>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setCategory(null)}
                className="mt-3 text-xs text-sage-400 underline"
              >
                Tüm kelimeler ({vocab.total})
              </button>
            </section>

            <section className="space-y-2">
              {words.slice(0, 40).map((w) => (
                <article key={w.id} className="card-soft flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold text-goethe-blue">
                      {formatWord(w.word, w.article)}
                    </p>
                    <p className="text-sm text-sage-500">{w.translation_tr}</p>
                    <p className="text-xs italic text-sage-400">{w.example_de}</p>
                  </div>
                  <AudioButton
                    text={formatWord(w.word, w.article)}
                    audioSrc={w.audio_word}
                    size="sm"
                  />
                </article>
              ))}
            </section>
          </>
        )}

        <section className="card-soft p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase text-sage-400">
            İş yerinde sık cümleler
          </h2>
          <ul className="space-y-2 text-sm text-sage-700">
            {[
              ["Palette nach hinten bringen.", "Paleti arkaya götür."],
              ["Schneller arbeiten!", "Daha hızlı çalış!"],
              ["Stapler vorsichtig fahren.", "Forklifti dikkatli sür."],
              ["Ich brauche Hilfe.", "Yardım lazım."],
              ["Verstanden!", "Anladım!"],
            ].map(([de, tr]) => (
              <li key={de} className="flex items-center justify-between gap-2 rounded-lg bg-sage-50 p-3">
                <span>
                  <strong>{de}</strong>
                  <span className="block text-xs text-sage-400">{tr}</span>
                </span>
                <AudioButton text={de} size="sm" />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <A1ControlPanel />
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-sage-50 p-4 text-center">
      <p className="text-2xl font-bold text-goethe-blue">{value}</p>
      <p className="text-xs text-sage-400">{label}</p>
    </div>
  );
}
