"use client";

import { useMemo, useState } from "react";
import { getHoerenQuestions } from "@german-coach/exams";
import { McqQuestion } from "@/components/exam/McqQuestion";
import { ExamModuleShell, ExamScoreBar } from "@/components/exam/ExamModuleShell";
import { ExamEvaluateButton, ExamInstructionBanner } from "@/components/exam/examUi";
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
  const answeredCount = session.filter((q) => answers[q.id] !== undefined).length;

  if (finished) {
    return (
      <ExamModuleShell title="Dinleme — Hören" subtitle="Bu oturum tamamlandı">
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
        <p className="text-center text-sm text-sage-500">
          Toplam banka: {all.length} soru · Çözülen: {Object.keys(progress.goethe.hoeren).length}
        </p>
      </ExamModuleShell>
    );
  }

  return (
    <ExamModuleShell
      title="1. Dinleme — Hören"
      subtitle={`Soru ${offset + 1}–${Math.min(offset + SESSION_SIZE, all.length)} / ${all.length} · hepsini işaretle, sonra değerlendir`}
    >
      <ExamInstructionBanner>
        Her soruda <strong>önce dinle</strong> (en fazla 2 kez), sonra doğru seçeneği işaretle. Tüm sorular
        bitince alttaki <strong>Değerlendir</strong> düğmesine bas.
      </ExamInstructionBanner>

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

      <ExamEvaluateButton
        disabled={!allAnswered}
        answered={answeredCount}
        total={session.length}
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
      />
    </ExamModuleShell>
  );
}
