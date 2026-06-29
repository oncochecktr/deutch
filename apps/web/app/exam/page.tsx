"use client";

import Link from "next/link";
import { getBankMeta, getGoetheExams } from "@german-coach/exams";
import { useProgress } from "@/lib/ProgressContext";
import { EXAM_HUB_TITLE, EXAM_LABEL_DESC } from "@/lib/brand";
import { calcGoethePct } from "@/lib/goetheProgress";

const MODULES = [
  {
    href: "/exam/hoeren",
    de: "Hören",
    tr: "Dinleme",
    desc: "100 soru — dinle ve cevapla",
    target: "≥ %75",
    color: "bg-goethe-blue",
  },
  {
    href: "/exam/lesen",
    de: "Lesen",
    tr: "Okuma",
    desc: "100 soru — metin oku, anla",
    target: "≥ %80",
    color: "bg-sage-500",
  },
  {
    href: "/exam/schreiben",
    de: "Schreiben",
    tr: "Yazma",
    desc: "50 görev — form, e-posta, davet",
    target: "≥ %70",
    color: "bg-sage-600",
  },
  {
    href: "/exam/sprechen",
    de: "Sprechen",
    tr: "Konuşma",
    desc: "100 kart — tanıt, sor, cevapla",
    target: "≥ %70",
    color: "bg-goethe-gold text-goethe-blue",
  },
];

export default function ExamHubPage() {
  const { progress } = useProgress();
  const bank = getBankMeta();
  const exams = getGoetheExams();
  const g = progress.goethe;

  const hoerenDone = Object.keys(g.hoeren).length;
  const lesenDone = Object.keys(g.lesen).length;
  const schreibenDone = g.schreibenDone.length;
  const sprechenDone = g.sprechenDone.length;
  const examsDone = Object.keys(g.examResults).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card-soft overflow-hidden">
        <div className="bg-goethe-blue px-6 py-8 text-center text-white">
          <p className="text-xs uppercase tracking-widest text-white/60">{EXAM_HUB_TITLE}</p>
          <h1 className="mt-2 text-2xl font-bold">Deutsch A1 — Startniveau</h1>
          <p className="mt-2 text-sm text-white/70">{EXAM_LABEL_DESC}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-5">
          <Stat n={bank.counts.hoeren} label="Hören" done={hoerenDone} />
          <Stat n={bank.counts.lesen_questions} label="Lesen" done={lesenDone} />
          <Stat n={bank.counts.schreiben} label="Schreiben" done={schreibenDone} />
          <Stat n={bank.counts.sprechen} label="Sprechen" done={sprechenDone} />
          <Stat n={bank.counts.exams} label="Deneme" done={examsDone} />
        </div>
        {(g.moduleBest.hoeren > 0 || g.moduleBest.lesen > 0) && (
          <p className="border-t border-sage-100 px-6 py-3 text-center text-xs text-sage-500">
            En iyi: Hören %{g.moduleBest.hoeren} · Lesen %{g.moduleBest.lesen}
          </p>
        )}
      </div>

      <Link
        href="/exam/bilgi"
        className="card-soft block border-2 border-goethe-blue/20 p-5 transition hover:border-goethe-blue/40"
      >
        <p className="text-xs font-semibold uppercase text-goethe-blue">Bilgi — Ankara 2026</p>
        <h2 className="mt-1 font-bold text-goethe-blue">Sınav tarihleri & kayıt</h2>
        <p className="mt-1 text-sm text-sage-500">
          PDF takvimi · A1 tarihleri · iletişim · kurs dönemleri · resmi site linki
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-goethe-blue">Takvime bak →</span>
      </Link>

      <Link
        href="/exam/sprechen/gercek"
        className="card-soft block border-2 border-goethe-gold/40 p-5 transition hover:border-goethe-gold"
      >
        <p className="text-xs font-semibold uppercase text-goethe-gold">Yeni — Gerçek sınav</p>
        <h2 className="mt-1 font-bold text-goethe-blue">Sprechen oda simülasyonu</h2>
        <p className="mt-1 text-sm text-sage-500">
          Teil 1 (A4 + telefon + heceleme) · Tema kartları 2 tur · Bitte & Verbot kartları
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-goethe-blue">Simülasyona git →</span>
      </Link>

      <Link
        href="/exam/schreiben/gercek"
        className="card-soft block border-2 border-goethe-gold/40 p-5 transition hover:border-goethe-gold"
      >
        <p className="text-xs font-semibold uppercase text-goethe-gold">Schreiben rehberi</p>
        <h2 className="mt-1 font-bold text-goethe-blue">Gerçek Schreiben rehberi</h2>
        <p className="mt-1 text-sm text-sage-500">
          Form + mektup · kalıp cümleler
        </p>
        <span className="mt-3 inline-block text-sm font-medium text-goethe-blue">Rehbere git →</span>
      </Link>

      <Link
        href="/exam/schreiben/mektup"
        className="card-soft block border border-sage-200 p-5 transition hover:border-sage-300"
      >
        <p className="text-xs font-semibold text-sage-600">Mektup modu</p>
        <h2 className="mt-1 font-bold text-goethe-blue">A1 + B1 mektup stüdyosu</h2>
        <p className="mt-1 text-sm text-sage-500">B1 rubrik · 80 kelime · bağlaç bankası · model cevaplar</p>
        <span className="mt-3 inline-block text-sm font-medium text-goethe-blue">Mektup yaz →</span>
      </Link>

      <div className="grid gap-3 sm:grid-cols-2">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group rounded-xl border border-sage-100 bg-white p-5 transition hover:border-sage-300 hover:shadow-sm"
          >
            <span className={`inline-block rounded-lg px-2 py-1 text-xs font-bold text-white ${m.color}`}>
              {m.de}
            </span>
            <h2 className="mt-2 font-semibold text-goethe-blue group-hover:text-sage-600">
              {m.tr}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-sage-600">{m.desc}</p>
            <p className="mt-2 text-xs font-medium text-sage-500">Hedef {m.target}</p>
          </Link>
        ))}
      </div>

      <section className="card-soft overflow-hidden border-2 border-red-200">
        <div className="bg-red-700 px-6 py-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Kritik — Sınav günü simülasyonu</p>
          <h2 className="mt-1 text-lg font-bold">Gerçek Sınav Modu</h2>
          <p className="mt-1 text-sm text-white/80">
            65 dk · 4 bölüm · geri dönememe · R/F + eşleştirme · 60/100 geçme
          </p>
        </div>
        <div className="grid gap-2 p-4 sm:grid-cols-2">
          {exams.map((ex) => {
            const done = g.realExamResults[ex.id];
            const pts = done?.points?.total;
            const passed = done?.passed ?? (pts !== undefined && pts >= 60);
            return (
              <Link
                key={`real-${ex.id}`}
                href={`/exam/real/${ex.id}`}
                className="flex items-center justify-between rounded-xl border border-red-100 px-4 py-3 transition hover:bg-red-50"
              >
                <div>
                  <p className="text-sm font-medium text-goethe-blue">{ex.title}</p>
                  <p className="text-[10px] text-sage-400">Gerçek mod · {ex.time_minutes} dk</p>
                </div>
                {done ? (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      passed ? "bg-sage-100 text-sage-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {pts !== undefined ? `${pts}/100` : "Bitti"}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-red-600">Başla →</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="card-soft p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sage-400">
          20 Tam Deneme Sınavı
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {exams.map((ex) => {
            const done = g.examResults[ex.id];
            const pct = done
              ? calcGoethePct(
                  done.hoeren.correct + done.lesen.correct,
                  done.hoeren.total + done.lesen.total
                )
              : null;
            return (
              <Link
                key={ex.id}
                href={`/exam/practice/${ex.id}`}
                className="flex items-center justify-between rounded-xl border border-sage-100 px-4 py-3 transition hover:bg-sage-50"
              >
                <div>
                  <p className="text-sm font-medium text-goethe-blue">{ex.title}</p>
                  <p className="text-[10px] text-sage-400">
                    {ex.time_minutes} dk · 10 Hören · 5 Lesen · 2 Schreiben · 5 Sprechen
                  </p>
                </div>
                {done ? (
                  <span className="rounded-full bg-sage-100 px-2 py-0.5 text-xs text-sage-600">
                    %{pct}
                  </span>
                ) : (
                  <span className="text-xs text-sage-300">Başla →</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <p className="text-center text-xs text-sage-400">
        Kulaklık kullan. Sınav günü gibi sessiz ortam. Hören bölümünde sesi 2 kez dinleyebilirsin.
      </p>

      <div className="flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/a2/cards" className="text-goethe-blue hover:underline">
          A2 kelime kartları →
        </Link>
        <Link href="/a2/words" className="text-sage-500 hover:underline">
          A2 kelime listesi
        </Link>
      </div>
    </div>
  );
}

function Stat({ n, label, done }: { n: number; label: string; done: number }) {
  return (
    <div className="text-center">
      <p className="text-xl font-bold text-goethe-blue sm:text-2xl">{done}/{n}</p>
      <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-sage-500">{label}</p>
    </div>
  );
}
