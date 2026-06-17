"use client";

import Link from "next/link";
import { getBankMeta } from "@german-coach/exams";
import { getA1Vocabulary, getTimurVocabulary } from "@german-coach/vocabulary";
import { IconArrowRight } from "@/components/icons";
import { ResetSRSButton } from "@/components/ResetSRSButton";
import { useProgress } from "@/lib/ProgressContext";
import { getA1Core, getPatternTrainer, getConjugationMatrix, getPossessiveTrainer, getWordOrderTrainer } from "@/lib/grundlagen";
import {
  A1_TARGETS,
  computeA1Readiness,
  MODULE_LABELS,
  MODULE_TARGETS,
  type ModuleScores,
} from "@/lib/readinessEngine";
import { countStudiedA1Words, getStudyMinutesSinceBreak } from "@/lib/progress";
import { getSRSStats } from "@/lib/srs";

export function A1ControlPanel() {
  const { progress, updateProgress, hydrated, storageOk } = useProgress();
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
    <aside className="space-y-4">
      <div className="card-soft overflow-hidden">
        <div className="bg-goethe-blue px-5 py-6 text-white">
          <p className="text-[10px] uppercase tracking-widest text-white/60">A1 Geçiş Kontrol</p>
          <p className="mt-2 text-4xl font-bold">%{report.overallPercent}</p>
          <p className="text-sm text-white/80">Goethe A1 hazırlık</p>
          {report.readyForExam ? (
            <span className="mt-3 inline-block rounded-full bg-goethe-gold px-3 py-1 text-xs font-bold text-goethe-blue">
              Sınava hazır adayı
            </span>
          ) : (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-goethe-gold transition-all"
                style={{ width: `${report.overallPercent}%` }}
              />
            </div>
          )}
          <ResetSRSButton
            label="İstatistiği sıfırla"
            className="mt-4 w-full rounded-xl border-2 border-goethe-gold/60 bg-goethe-gold/20 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-goethe-gold/30 active:scale-[0.98]"
          />
        </div>
        <div className="space-y-2 p-4 text-sm">
          <Row label="Tahmini sınav" value={report.estimatedExamDate} />
          <Row label="Kalan gün" value={`${report.daysUntilExam} gün`} />
          <Row label="Kelime" value={`${a1Studied} / ${a1.total} çalışıldı`} />
          <Row label="Satz Builder" value={`${satzDone} / ${satzTotal} cümle`} />
          <Row label="Conjugation Matrix" value={`${conjugationDone} / ${conjugationTotal} fiil`} />
          <Row label="Possessive Trainer" value={`${possessivesDone} / ${possessivesTotal} set`} />
          <Row label="Word Order Trainer" value={`${wordOrderDone} / ${wordOrderTotal} bölüm`} />
          <Row label="Pattern Trainer" value={`${patternsDone} / ${patternsTotal} kalıp`} />
          <Row label="Grammar Pack" value={`${grammarPackDone} / ${grammarPackTotal} bölüm`} />
          <Row label="Hören" value={`${hoerenDone} / ${bank.counts.hoeren} soru`} />
          <Row label="Lesen" value={`${lesenPassagesDone} / ${bank.counts.lesen_passages} metin`} />
          <Row label="Schreiben" value={`${schreibenDone} / ${bank.counts.schreiben} görev`} />
          <Row label="Sprechen" value={`${sprechenDone} / ${bank.counts.sprechen} kart`} />
          <Row label="Deneme sınavı" value={`${examsDone} / ${A1_TARGETS.practiceExamsMin} yapıldı`} />
          <Row label="Tekrar bekleyen" value={`${srs.due} kelime`} highlight={srs.due > 0} />
        </div>
      </div>

      <div className="card-soft p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase text-sage-400">Modül puanları</h3>
        <div className="space-y-2">
          {(Object.keys(report.moduleScores) as (keyof ModuleScores)[])
            .filter((k) => k !== "exams" || report.moduleScores.exams > 0)
            .map((key) => (
              <ModuleBar
                key={key}
                label={MODULE_LABELS[key]}
                score={report.moduleScores[key]}
                target={MODULE_TARGETS[key]}
              />
            ))}
        </div>
        {report.weakAreas.length > 0 && (
          <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-900">
            {report.focusMessage}
          </p>
        )}
      </div>

      <div className="card-soft p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase text-sage-400">Bugünkü hedef</h3>
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
                      <span className={`block font-semibold ${isNext ? "text-goethe-blue" : ""}`}>
                        {task.title}
                      </span>
                      {task.subtitle && (
                        <span className="mt-0.5 block text-xs leading-snug text-sage-500">
                          {task.subtitle}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-sage-400">{task.progress}</span>
                </div>
              </Link>
            </li>
            );
          })}
        </ul>
      </div>

      <div className="card-soft p-4 text-xs text-sage-500">
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
        <p className="mt-2">Çalışma bloğu: {studyMin}/{progress.studyBlockMinutes} dk</p>
        <p className="mt-2 rounded-lg bg-sage-50 p-2 text-sage-600">
          {hydrated
            ? storageOk
              ? `İlerleme bu telefonda kayıtlı (${a1Studied} kelime çalışıldı, ${a1Known} bilinen).${
                  progress.lastSavedAt
                    ? ` Son kayıt: ${new Date(progress.lastSavedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`
                    : ""
                }`
              : "Uyarı: tarayıcı kaydı başarısız — gizli mod veya depolama dolu olabilir."
            : "İlerleme yükleniyor…"}
        </p>
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

function ModuleBar({
  label,
  score,
  target,
}: {
  label: string;
  score: number;
  target: number;
}) {
  const ok = score >= target;
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-xs">
        <span className="text-sage-600">{label}</span>
        <span className={ok ? "text-sage-600" : "text-goethe-red"}>
          %{score} <span className="text-sage-300">/ {target}</span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-sage-100">
        <div
          className={`h-full rounded-full ${ok ? "bg-sage-400" : "bg-goethe-gold"}`}
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>
    </div>
  );
}
