"use client";

import { getA1Vocabulary, getTimurVocabulary } from "@german-coach/vocabulary";
import {
  calcAccuracy,
  calcKnownPercent,
  calcReadiness,
  getNextStudyTip,
  getStudyMinutesSinceBreak,
} from "@/lib/progress";
import { useProgress } from "@/lib/ProgressContext";
import { getSRSStats, SRS_INTERVALS } from "@/lib/srs";

export function ProgressPanel() {
  const { progress } = useProgress();
  const vocab = getA1Vocabulary();
  const timur = getTimurVocabulary();
  const allIds = [...vocab.words.map((w) => w.id), ...timur.words.map((w) => w.id)];
  const totalWords = allIds.length;
  const accuracy = calcAccuracy(progress);
  const readiness = calcReadiness(progress, totalWords);
  const knownPct = calcKnownPercent(progress, totalWords);
  const studyMin = getStudyMinutesSinceBreak(progress);
  const srs = getSRSStats(allIds, progress.srsRecords);

  return (
    <aside className="card-soft p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-sage-400">
        Günlük İlerleme
      </h2>
      <div className="space-y-4">
        <StatRow label="Tekrar bekleyen" value={`${srs.due} kelime`} highlight={srs.due > 0} />
        <StatRow label="Yeni kelime" value={`${srs.newWords} / ${totalWords}`} />
        <StatRow label="Ezberlenmiş (30g)" value={`${srs.mastered} / ${totalWords}`} highlight={readiness >= 85} />
        <StatRow label="SRS hazırlık" value={`%${readiness}`} />
        <StatRow label="Bilinen kelime" value={`%${knownPct}`} />
        <StatRow label="Bugün doğruluk" value={`%${accuracy}`} />
        <StatRow label="SRS tekrar bugün" value={`${progress.dailyStats.srsReviews}`} />
        <StatRow label="Blok süresi" value={`${studyMin} / ${progress.studyBlockMinutes} dk`} />

        <div>
          <div className="mb-1 flex justify-between text-xs text-sage-400">
            <span>A1 hedef (%85)</span>
            <span>{readiness}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sage-100">
            <div
              className="h-full rounded-full bg-sage-400 transition-all duration-500"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-sage-50 p-3 text-xs text-sage-500">
          <p className="mb-1 font-semibold uppercase text-sage-400">SRS aralıkları</p>
          <p>{SRS_INTERVALS.join(" → ")} gün</p>
        </div>

        <div className="rounded-xl bg-sage-50 p-3 text-sm text-sage-600">
          <p className="mb-1 text-xs font-semibold uppercase text-sage-400">Bugün ne yap?</p>
          <p>{getNextStudyTip(progress, totalWords, srs.due)}</p>
        </div>
      </div>
    </aside>
  );
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-sage-400">{label}</span>
      <span className={highlight ? "font-semibold text-sage-600" : "font-medium"}>{value}</span>
    </div>
  );
}
