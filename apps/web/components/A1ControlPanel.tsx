"use client";

import Link from "next/link";
import { getBankMeta } from "@german-coach/exams";
import { getA1Vocabulary, getTimurVocabulary } from "@german-coach/vocabulary";
import { IconArrowRight } from "@/components/icons";
import { APP_FEATURES } from "@/lib/appFeatures";
import { ProgressBar } from "@/components/ProgressBar";
import { ResetSRSButton } from "@/components/ResetSRSButton";
import { useProgress } from "@/lib/ProgressContext";
import { READINESS_LABEL } from "@/lib/brand";
import { getA1Core, getPatternTrainer, getConjugationMatrix, getPossessiveTrainer, getWordOrderTrainer, getArtikelTrainer, getDativTrainer } from "@/lib/grundlagen";
import {
  A1_TARGETS,
  computeA1Readiness,
  MODULE_LABELS,
  MODULE_TARGETS,
  type ModuleScores,
} from "@/lib/readinessEngine";
import { countStudiedA1Words, getStudyMinutesSinceBreak } from "@/lib/progress";
import { getSRSStats } from "@/lib/srs";

function PanelSection({
  title,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="app-collapse border-t border-sage-100" open={defaultOpen}>
      <summary className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-goethe-blue">
        <span>{title}</span>
        {badge && (
          <span className="rounded-full bg-goethe-gold/15 px-2 py-0.5 text-[10px] font-bold text-goethe-blue">
            {badge}
          </span>
        )}
      </summary>
      <div className="px-4 pb-4">{children}</div>
    </details>
  );
}

export function A1ControlPanel() {
  const { progress, updateProgress, storageOk } = useProgress();
  const a1 = getA1Vocabulary();
  const mesleki = getTimurVocabulary();
  const allIds = [...a1.words.map((w) => w.id), ...mesleki.words.map((w) => w.id)];
  const report = computeA1Readiness(progress, allIds);
  const srs = getSRSStats(allIds, progress.srsRecords);
  const studyMin = getStudyMinutesSinceBreak(progress);
  const bank = getBankMeta();
  const grundlagenCore = getA1Core();
  const a1Studied = countStudiedA1Words(progress);
  const a1Known = progress.knownWordIds.filter((id) => id.startsWith("a1_")).length;
  const satzDone = progress.grundlagen.satzCompleted.length;
  const satzTotal = grundlagenCore.sentenceBuilder.exercises.length;
  const patternsDone = progress.grundlagen.patternsCompleted.length;
  const patternsTotal = getPatternTrainer().patterns.length;
  const conjugationDone = progress.grundlagen.conjugationCompleted.length;
  const conjugationTotal = getConjugationMatrix().verbs.length;
  const possessivesDone = progress.grundlagen.possessivesCompleted.length;
  const possessivesTotal = getPossessiveTrainer().sets.length;
  const wordOrderDone = progress.grundlagen.wordOrderCompleted.length;
  const wordOrderTotal = getWordOrderTrainer().sections.length + 1;
  const grammarPackDone = Object.keys(progress.grundlagen.grammarPack).length;
  const grammarPackTotal = grundlagenCore.grammarPack.sections.length;
  const hoerenDone = Object.keys(progress.goethe.hoeren).length;
  const lesenPassagesDone = Math.floor(Object.keys(progress.goethe.lesen).length / 4);
  const schreibenDone = progress.goethe.schreibenDone.length;
  const sprechenDone = progress.goethe.sprechenDone.length;
  const examsDone = Object.keys(progress.goethe.examResults).length;

  return (
    <aside className="animate-fade-in-up space-y-4">
      <div className="card-soft overflow-hidden">
        <div className="bg-goethe-blue px-5 py-5 text-white">
          <p className="text-[10px] uppercase tracking-widest text-white/60">A1 Geçiş Kontrol</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-4xl font-bold tabular-nums">%{report.overallPercent}</p>
            {report.readyForExam && (
              <span className="rounded-full bg-goethe-gold px-2.5 py-1 text-[10px] font-bold text-goethe-blue">
                Hazır
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-white/80">{READINESS_LABEL}</p>
          {!report.readyForExam && (
            <div className="mt-4">
              <ProgressBar
                value={report.overallPercent}
                target={60}
                size="lg"
                variant="hero"
                showPercent
              />
            </div>
          )}
        </div>

        <PanelSection title="İstatistikler" badge={`${a1Studied} kelime`} defaultOpen>
          <div className="space-y-2 text-sm">
            <Row label="Tahmini sınav" value={report.estimatedExamDate} />
            <Row label="Kalan gün" value={`${report.daysUntilExam} gün`} />
            <Row label="Kelime" value={`${a1Studied} / ${a1.total}`} />
            <Row label="Satz Builder" value={`${satzDone} / ${satzTotal}`} />
            <Row label="Conjugation" value={`${conjugationDone} / ${conjugationTotal}`} />
            <Row label="Artikel" value={`${progress.grundlagen.articlesCompleted.length} / ${getArtikelTrainer().sets.length}`} />
            <Row label="Dativ" value={`${progress.grundlagen.dativCompleted.length} / ${getDativTrainer().sets.length}`} />
            <Row label="Grammar Pack" value={`${grammarPackDone} / ${grammarPackTotal}`} />
            <Row label="Zeit quiz" value={`${progress.grundlagen.zeitQuizBest}%`} />
            <Row label="Word Order" value={`${wordOrderDone} / ${wordOrderTotal}`} />
            <Row label="Hören" value={`${hoerenDone} / ${bank.counts.hoeren}`} />
            <Row label="Lesen" value={`${lesenPassagesDone} / ${bank.counts.lesen_passages}`} />
            <Row label="Tekrar bekleyen" value={`${srs.due}`} highlight={srs.due > 0} />
          </div>
        </PanelSection>

        <PanelSection title="Modül seviyeleri" badge={`%${report.overallPercent}`}>
          <div className="space-y-3">
            {(Object.keys(report.moduleScores) as (keyof ModuleScores)[])
              .filter((k) => k !== "exams" || report.moduleScores.exams > 0)
              .map((key) => (
                <ProgressBar
                  key={key}
                  label={MODULE_LABELS[key]}
                  value={report.moduleScores[key]}
                  target={MODULE_TARGETS[key]}
                  size="md"
                  variant="gold"
                  showPercent
                />
              ))}
          </div>
          {report.weakAreas.length > 0 && (
            <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">
              {report.focusMessage}
            </p>
          )}
        </PanelSection>

        <PanelSection title="Bugünkü hedef">
          <ul className="space-y-2">
            {report.todayTasks.map((task) => {
              const isNext = report.nextStep?.id === task.id && !task.done;
              return (
                <li key={task.id}>
                  <Link
                    href={task.href}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                      task.done
                        ? "bg-sage-100 text-sage-600 line-through"
                        : isNext
                          ? "border-2 border-goethe-gold bg-goethe-gold/10"
                          : "border border-sage-100 bg-white hover:border-sage-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex min-w-0 flex-1 items-start gap-1">
                        {isNext && (
                          <IconArrowRight size={14} className="mt-0.5 shrink-0 text-goethe-gold" />
                        )}
                        <span>
                          <span
                            className={`block font-semibold ${isNext ? "text-goethe-blue" : ""}`}
                          >
                            {task.title}
                          </span>
                          {task.subtitle && (
                            <span className="mt-0.5 block text-xs text-sage-500">
                              {task.subtitle}
                            </span>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-sage-400">
                        {task.progress}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </PanelSection>

        <PanelSection title="Özellikler" badge={`${APP_FEATURES.length} modül`}>
          <Link
            href="/ozellikler"
            className="flex items-center justify-between rounded-lg border border-goethe-blue/20 bg-goethe-blue/5 px-3 py-2.5 text-sm font-semibold text-goethe-blue transition hover:border-goethe-blue/40"
          >
            Tüm modülleri gör
            <IconArrowRight size={14} />
          </Link>
        </PanelSection>

        <PanelSection title="Ayarlar">
          <div className="space-y-3 text-xs text-sage-500">
            <label className="block">
              <span className="text-sage-400">Hedef sınav tarihi</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-sage-200 px-2 py-1.5 text-sm"
                value={progress.targetExamDate ?? report.estimatedExamDateISO}
                onChange={(e) =>
                  updateProgress({ targetExamDate: e.target.value || null })
                }
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={progress.breakReminderEnabled}
                onChange={(e) =>
                  updateProgress({ breakReminderEnabled: e.target.checked })
                }
                className="h-4 w-4 rounded border-sage-300"
              />
              <span>Mola hatırlatıcısı ({progress.studyBlockMinutes} dk)</span>
            </label>
            <p>
              Çalışma: {studyMin}/{progress.studyBlockMinutes} dk
            </p>
            <p className="rounded-lg bg-sage-50 p-2 text-sage-600">
              {storageOk
                ? `${a1Studied} kelime kayıtlı · ${a1Known} bilinen${
                    progress.lastSavedAt
                      ? ` · ${new Date(progress.lastSavedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`
                      : ""
                  }`
                : "Kayıt uyarısı: gizli mod veya depolama dolu."}
            </p>
            <ResetSRSButton className="w-full rounded-xl border border-sage-200 py-2 text-sm font-semibold text-sage-600 hover:bg-sage-50" />
          </div>
        </PanelSection>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-sage-400">{label}</span>
      <span className={highlight ? "font-semibold text-sage-700" : ""}>{value}</span>
    </div>
  );
}
