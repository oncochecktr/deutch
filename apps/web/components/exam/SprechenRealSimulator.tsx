"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AudioButton } from "@/components/AudioButton";
import { PageShell } from "@/components/PageShell";
import {
  BITTE_CARDS,
  pickRandom,
  SPRECHEN_EXAM_RULES,
  SPRECHEN_FLOW,
  TEIL1_FORM,
  THEMA_PATTERNS,
  THEMA_TOPICS,
  VERBOT_CARDS,
} from "@/lib/sprechenRealExam";

type Phase = "intro" | "teil1" | "thema" | "bitte" | "verbot" | "done";

export function SprechenRealSimulator() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(1);
  const [spoken, setSpoken] = useState(false);

  const themaDraw = useMemo(() => {
    const topic = pickRandom(THEMA_TOPICS);
    const word = pickRandom(topic.words);
    const pattern = pickRandom(THEMA_PATTERNS);
    return { topic, word, pattern };
  }, [phase, round]);

  const bitteDraw = useMemo(() => pickRandom(BITTE_CARDS), [phase, round]);
  const verbotDraw = useMemo(() => pickRandom(VERBOT_CARDS), [phase, round]);

  const resetRound = () => setSpoken(false);

  return (
    <PageShell
      title="Gerçek Sprechen Sınavı"
      subtitle="A1 konuşma simülasyonu"
      backHref="/exam/sprechen"
      backLabel="Sprechen modülüne dön"
      maxWidth="md"
    >
      {phase === "intro" && (
        <div className="space-y-4">
          <div className="card-soft border-2 border-goethe-gold/40 p-5">
            <p className="text-sm text-sage-600">
              Yazılı bölümler (Lesen, Hören, Schreiben) bittikten sonra <strong>4 aday</strong> ayrı
              odada yan yana oturur. Karşınızda <strong>2 Almanca öğretmeni</strong> vardır. Konuşma 3
              ana bölümden oluşur.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {SPRECHEN_FLOW.map((f) => (
              <div key={f.id} className="rounded-xl border border-sage-100 bg-white p-4">
                <p className="text-xs font-bold text-goethe-blue">{f.step}. {f.title}</p>
                <p className="mt-1 text-sm text-sage-600">{f.subtitle}</p>
                <p className="mt-1 text-xs text-sage-400">{f.rounds}</p>
              </div>
            ))}
          </div>

          <section className="card-soft p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase text-sage-400">Altın kurallar</h2>
            <ul className="space-y-3">
              {SPRECHEN_EXAM_RULES.map((r) => (
                <li key={r.title} className="text-sm">
                  <span className="font-semibold text-goethe-blue">{r.title}:</span>{" "}
                  <span className="text-sage-600">{r.text}</span>
                </li>
              ))}
            </ul>
          </section>

          <button type="button" className="btn-primary-lg w-full" onClick={() => setPhase("teil1")}>
            Simülasyonu başlat — Teil 1
          </button>
        </div>
      )}

      {phase === "teil1" && (
        <div className="space-y-4">
          <PhaseHeader step={1} title={TEIL1_FORM.title} hint={TEIL1_FORM.tip} />

          <div className="card-soft p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-sage-400">A4 form — sırayla söyle</p>
            <ul className="space-y-2">
              {TEIL1_FORM.fields.map((f) => (
                <li key={f.de} className="rounded-lg bg-sage-50 px-3 py-2 text-sm">
                  <span className="font-medium text-goethe-blue">{f.de}</span>
                  <span className="text-sage-400"> — {f.tr}</span>
                  <p className="mt-0.5 text-xs italic text-sage-500">{f.example}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-soft p-4">
            <p className="mb-3 text-xs font-semibold uppercase text-sage-400">Öğretmen sorar</p>
            {TEIL1_FORM.examinerTasks.map((t) => (
              <div key={t.de} className="mb-3 last:mb-0">
                <p className="font-medium text-goethe-blue">{t.de}</p>
                <p className="text-sm text-sage-600">{t.tr}</p>
                <p className="mt-1 text-xs italic text-sage-500">{t.example}</p>
                <AudioButton text={t.example} label="Örnek dinle" size="sm" />
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={spoken} onChange={(e) => setSpoken(e.target.checked)} />
            Yüksek sesle prova yaptım (sadece Almanca)
          </label>

          <button
            type="button"
            className="btn-primary-lg w-full"
            disabled={!spoken}
            onClick={() => {
              setPhase("thema");
              setRound(1);
              resetRound();
            }}
          >
            Teil 2 — Tema kartları
          </button>
        </div>
      )}

      {phase === "thema" && (
        <div className="space-y-4">
          <PhaseHeader
            step={2}
            title="Thema-Karten"
            hint={`Tur ${round}/2 — Kartı çevir (gösterme), sol komşuna sor.`}
          />

          <div className="card-soft p-6 text-center">
            <p className="text-xs uppercase text-sage-400">Tema</p>
            <p className="mt-1 text-lg font-bold text-goethe-blue">{themaDraw.topic.de}</p>
            <p className="text-sm text-sage-500">{themaDraw.topic.tr}</p>
            <p className="mt-4 text-3xl font-bold text-goethe-gold">{themaDraw.word}</p>
            <p className="mt-4 text-sm text-sage-600">{themaDraw.pattern.tr}</p>
            <p className="mt-2 rounded-xl bg-sage-50 p-3 text-sm italic text-sage-700">
              Örnek: {themaDraw.pattern.exampleQ.replace("…", themaDraw.word)}
            </p>
            <p className="mt-2 text-xs text-sage-500">Cevap: {themaDraw.pattern.exampleA}</p>
            <div className="mt-4 flex justify-center">
              <AudioButton
                text={themaDraw.pattern.exampleQ.replace("…", themaDraw.word)}
                label="Soruyu dinle"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={spoken} onChange={(e) => setSpoken(e.target.checked)} />
            Soruyu sordum / cevapladım (basit A1)
          </label>

          <div className="flex gap-3">
            {round < 2 ? (
              <button
                type="button"
                className="btn-primary-lg flex-1"
                disabled={!spoken}
                onClick={() => {
                  setRound(2);
                  resetRound();
                }}
              >
                2. tur
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary-lg flex-1"
                disabled={!spoken}
                onClick={() => {
                  setPhase("bitte");
                  setRound(1);
                  resetRound();
                }}
              >
                Teil 3 — Bitte kartları
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "bitte" && (
        <div className="space-y-4">
          <PhaseHeader step={3} title="Bitte-Karten (Rica)" hint="Resimli kart — bir şey iste." />

          <div className="card-soft p-6 text-center">
            <p className="text-xs uppercase text-sage-400">Rica kartı</p>
            <p className="mt-2 text-xl font-bold text-goethe-blue">{bitteDraw.item}</p>
            <p className="text-sm text-sage-500">{bitteDraw.tr}</p>
            <p className="mt-4 rounded-xl bg-goethe-gold/10 p-4 text-left text-sm text-sage-700">
              <strong>Sen sor:</strong> {bitteDraw.ask}
            </p>
            <p className="mt-2 rounded-xl bg-sage-50 p-4 text-left text-sm text-sage-700">
              <strong>Komşu cevap:</strong> {bitteDraw.answer}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <AudioButton text={bitteDraw.ask} label="Soru" size="sm" />
              <AudioButton text={bitteDraw.answer} label="Cevap" size="sm" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={spoken} onChange={(e) => setSpoken(e.target.checked)} />
            Rica cümlesini yüksek sesle söyledim
          </label>

          <button
            type="button"
            className="btn-primary-lg w-full"
            disabled={!spoken}
            onClick={() => {
              setPhase("verbot");
              resetRound();
            }}
          >
            Verbot kartları
          </button>
        </div>
      )}

      {phase === "verbot" && (
        <div className="space-y-4">
          <PhaseHeader
            step={4}
            title="Verbot-Karten (Yasak ✕)"
            hint="Kartta çarpı var — yasak olduğunu söyle."
          />

          <div className="card-soft p-6 text-center">
            <span className="inline-block rounded-full bg-goethe-red/10 px-3 py-1 text-xs font-bold text-goethe-red">
              VERBOTEN
            </span>
            <p className="mt-3 text-xl font-bold text-goethe-blue">{verbotDraw.item}</p>
            <p className="text-sm text-sage-500">{verbotDraw.tr}</p>
            <p className="mt-4 rounded-xl bg-red-50 p-4 text-left text-sm text-sage-700">
              <strong>Sen de:</strong> {verbotDraw.say}
            </p>
            <p className="mt-2 rounded-xl bg-sage-50 p-4 text-left text-sm text-sage-700">
              <strong>Komşu:</strong> {verbotDraw.answer}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <AudioButton text={verbotDraw.say} label="Yasak cümlesi" size="sm" />
              <AudioButton text={verbotDraw.answer} label="Özür" size="sm" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={spoken} onChange={(e) => setSpoken(e.target.checked)} />
            Yasak + Entschuldigung provası yaptım
          </label>

          <button
            type="button"
            className="btn-primary-lg w-full"
            disabled={!spoken}
            onClick={() => setPhase("done")}
          >
            Simülasyonu bitir
          </button>
        </div>
      )}

      {phase === "done" && (
        <div className="card-soft space-y-4 p-6 text-center">
          <span className="goethe-badge">Sprechen tamamlandı</span>
          <h2 className="text-lg font-bold text-goethe-blue">Gerçek sınav akışını prova ettin</h2>
          <p className="text-sm text-sage-600">
            Sırada: normal kart bankası ile tekrar et. Her gün 1 tur simülasyon + 5 kart hedefi iyi bir
            ritim.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/exam/sprechen" className="btn-primary-lg text-center">
              Kart bankasına git
            </Link>
            <button
              type="button"
              className="btn-secondary-lg"
              onClick={() => {
                setPhase("intro");
                setRound(1);
                resetRound();
              }}
            >
              Baştan tekrar
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function PhaseHeader({ step, title, hint }: { step: number; title: string; hint: string }) {
  return (
    <div className="rounded-xl border border-sage-100 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase text-goethe-gold">Adım {step}/4</p>
      <h2 className="text-lg font-bold text-goethe-blue">{title}</h2>
      <p className="text-sm text-sage-500">{hint}</p>
    </div>
  );
}
