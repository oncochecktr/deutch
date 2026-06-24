"use client";

import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import {
  daysUntil,
  formatExamDateTR,
  getNextA1ExamDate,
  GOETHE_ANKARA_INFO,
} from "@/lib/goetheAnkaraInfo";
import { useProgress } from "@/lib/ProgressContext";

export default function ExamBilgiPage() {
  const { progress, updateProgress } = useProgress();
  const nextExam = getNextA1ExamDate();
  const nextDays = nextExam ? daysUntil(nextExam) : null;

  return (
    <PageShell
      title="Sınav & Kayıt Bilgisi"
      subtitle="Ankara · 2026 sınav takvimi (PDF)"
      backHref="/exam"
      backLabel="Sınav modüllerine dön"
      maxWidth="md"
    >
      <div className="card-soft border-2 border-goethe-gold/30 p-5">
        <p className="text-xs font-semibold uppercase text-goethe-gold">Kaynak</p>
        <p className="mt-1 text-sm text-sage-600">{GOETHE_ANKARA_INFO.source.title}</p>
        <p className="mt-2 text-xs text-sage-400">{GOETHE_ANKARA_INFO.source.note}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={GOETHE_ANKARA_INFO.institute.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            Resmi site →
          </a>
          <a
            href={`mailto:${GOETHE_ANKARA_INFO.institute.emailExams}`}
            className="btn-secondary text-sm"
          >
            Sınav e-posta
          </a>
        </div>
      </div>

      {nextExam && (
        <div className="card-goethe">
          <p className="text-xs font-semibold uppercase tracking-wide text-goethe-blue/80">
            En yakın A1 sınavı (PDF listesi)
          </p>
          <p className="mt-2 text-2xl font-bold text-goethe-blue">{formatExamDateTR(nextExam)}</p>
          {nextDays !== null && nextDays >= 0 && (
            <p className="mt-1 text-sm font-medium text-sage-600">{nextDays} gün kaldı</p>
          )}
          <label className="mt-4 block text-xs font-medium text-sage-600">
            Hedef sınav tarihin (panelde de görünür)
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-sage-200 bg-white px-3 py-2 text-sm text-goethe-blue [color-scheme:light]"
              value={progress.targetExamDate ?? nextExam}
              onChange={(e) => updateProgress({ targetExamDate: e.target.value || null })}
            />
          </label>
        </div>
      )}

      <section className="card-soft p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase text-sage-400">
          Start Deutsch 1 — 2026 tarihleri
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {GOETHE_ANKARA_INFO.a1ExamDates.map((d) => {
            const isNext = d === nextExam;
            const past = d < new Date().toISOString().slice(0, 10);
            return (
              <li
                key={d}
                className={`rounded-lg px-3 py-2 text-sm ${
                  isNext
                    ? "bg-goethe-gold/20 font-semibold text-goethe-blue"
                    : past
                      ? "bg-sage-50 text-sage-400 line-through"
                      : "bg-sage-50 text-sage-700"
                }`}
              >
                {formatExamDateTR(d)}
                {isNext && <span className="ml-2 text-xs text-goethe-blue">← en yakın</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card-soft p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase text-sage-400">Önemli notlar</h2>
        <ul className="space-y-2 text-sm text-sage-600">
          {GOETHE_ANKARA_INFO.examNotes.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="text-goethe-gold">•</span>
              {n}
            </li>
          ))}
        </ul>
      </section>

      <section className="card-soft p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase text-sage-400">İletişim</h2>
        <dl className="space-y-2 text-sm text-sage-600">
          <div>
            <dt className="text-xs text-sage-400">Adres</dt>
            <dd>{GOETHE_ANKARA_INFO.institute.address}</dd>
          </div>
          <div>
            <dt className="text-xs text-sage-400">Telefon</dt>
            <dd>{GOETHE_ANKARA_INFO.institute.phone}</dd>
          </div>
          <div>
            <dt className="text-xs text-sage-400">Bilgi hattı</dt>
            <dd>
              {GOETHE_ANKARA_INFO.institute.hotline} · {GOETHE_ANKARA_INFO.institute.hotlineHours}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-sage-400">Sınav kayıt</dt>
            <dd>
              <a
                href={`mailto:${GOETHE_ANKARA_INFO.institute.emailExams}`}
                className="text-goethe-blue underline"
              >
                {GOETHE_ANKARA_INFO.institute.emailExams}
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="card-soft p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase text-sage-400">2026 kurs dönemleri</h2>
        <div className="space-y-3">
          {GOETHE_ANKARA_INFO.courseTerms.map((t) => (
            <div key={t.id} className="rounded-lg bg-sage-50 p-3 text-sm">
              <p className="font-semibold text-goethe-blue">{t.label}</p>
              <p className="text-sage-600">{t.period} · {t.weeks} hafta</p>
              {t.noClass && <p className="mt-1 text-xs text-sage-400">Ders yok: {t.noClass}</p>}
            </div>
          ))}
        </div>
      </section>

      <details className="app-collapse card-soft">
        <summary className="p-4 text-sm font-medium text-sage-600">Enstitü kapalı günler (2026)</summary>
        <ul className="space-y-1 border-t border-sage-100 px-4 pb-4 pt-2 text-sm text-sage-600">
          {GOETHE_ANKARA_INFO.closedDays.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </details>

      <p className="text-center text-xs text-sage-400">
        Bu sayfa PDF takviminden elle aktarılmıştır. Scraping/API kullanılmaz — yılda bir güncellenir.
        {" "}
        <Link href="/exam/schreiben/gercek" className="text-goethe-blue underline">
          Schreiben rehberi
        </Link>
      </p>
    </PageShell>
  );
}
