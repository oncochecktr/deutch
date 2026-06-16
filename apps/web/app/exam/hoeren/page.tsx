"use client";

import { useMemo, useState } from "react";
import { getHoerenQuestions } from "@german-coach/exams";
import { McqQuestion } from "@/components/exam/McqQuestion";
import { ExamModuleShell, ExamScoreBar } from "@/components/exam/ExamModuleShell";
import { useProgress } from "@/lib/ProgressContext";
import Link from "next/link";

const SESSION_SIZE = 10;

export default function HoerenExamPage() {
  const { progress, updateProgress } = useProgress();
  const all = getHoerenQuestions();
  const [offset, setOffset] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const session = useMemo(
    () => all.slice(offset, offset + SESSION_SIZE),
    [all, offset]
  );

  const score = useMemo(() => {
    let c = 0;
    for (const q of session) {
      if (answers[q.id] === q.correct_index) c++;
    }
    return c;
  }, [session, answers]);

  const allAnswered = session.every((q) => answers[q.id] !== undefined);

  if (finished) {
    const pct = Math.round((score / session.length) * 100);
    return (
      <ExamModuleShell title="Teil Hören" subtitle="Dinleme oturumu tamamlandı">
        <ExamScoreBar correct={score} total={session.length} label="Hören — Bu oturum" />
        <div className="flex flex-wrap justify-center gap-3">
          {offset + SESSION_SIZE < all.length && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setOffset((o) => o + SESSION_SIZE);
                setAnswers({});
                setFinished(false);
              }}
            >
              Sonraki 10 soru →
            </button>
          )}
          <Link href="/exam" className="btn-secondary">
            Modüllere dön
          </Link>
        </div>
        <p className="text-center text-xs text-sage-400">
          Toplam banka: {all.length} soru · Çözülen: {Object.keys(progress.goethe.hoeren).length}
        </p>
      </ExamModuleShell>
    );
  }

  return (
    <ExamModuleShell
      title="Teil 1: Hören"
      subtitle={`Dinleme — soru ${offset + 1}–${Math.min(offset + SESSION_SIZE, all.length)} / ${all.length}`}
    >
      <p className="rounded-xl bg-sage-50 p-3 text-xs text-sage-600">
        Goethe A1 Hören: Ses kaydını dinle (max. 2×), soruyu cevapla. Hedef: ≥ %75.
      </p>

      {session.map((q, i) => (
        <McqQuestion
          key={q.id}
          index={offset + i}
          total={all.length}
          questionDe={q.question_de}
          questionTr={q.question_tr}
          audioText={q.audio_text}
          options={q.options}
          selected={answers[q.id] ?? null}
          correctIndex={null}
          onSelect={(idx) => setAnswers((a) => ({ ...a, [q.id]: idx }))}
        />
      ))}

      <button
        type="button"
        className="btn-primary w-full py-3"
        disabled={!allAnswered}
        onClick={() => {
          const hoeren = { ...progress.goethe.hoeren };
          for (const q of session) {
            hoeren[q.id] = answers[q.id] === q.correct_index;
          }
          const pct = Math.round((score / session.length) * 100);
          updateProgress({
            goethe: {
              ...progress.goethe,
              hoeren,
              moduleBest: {
                ...progress.goethe.moduleBest,
                hoeren: Math.max(progress.goethe.moduleBest.hoeren, pct),
              },
            },
            dailyStats: {
              ...progress.dailyStats,
              hoerenSessions: progress.dailyStats.hoerenSessions + 1,
            },
          });
          setFinished(true);
        }}
      >
        Auswerten — Değerlendir
      </button>
    </ExamModuleShell>
  );
}
