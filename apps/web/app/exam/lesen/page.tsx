"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getLesenPassages } from "@german-coach/exams";
import { McqQuestion } from "@/components/exam/McqQuestion";
import { ExamModuleShell, ExamScoreBar } from "@/components/exam/ExamModuleShell";
import { ExamEvaluateButton, ExamInstructionBanner } from "@/components/exam/examUi";
import { useProgress } from "@/lib/ProgressContext";

export default function LesenExamPage() {
  const { progress, updateProgress } = useProgress();
  const passages = getLesenPassages();
  const [passageIdx, setPassageIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const passage = passages[passageIdx];
  const totalQuestions = passages.reduce((n, p) => n + p.questions.length, 0);

  const score = useMemo(() => {
    if (!passage) return 0;
    let c = 0;
    for (const q of passage.questions) {
      if (answers[q.id] === q.correct_index) c++;
    }
    return c;
  }, [passage, answers]);

  const allAnswered = passage?.questions.every((q) => answers[q.id] !== undefined);
  const answeredCount = passage?.questions.filter((q) => answers[q.id] !== undefined).length ?? 0;

  if (!passage) return null;

  if (finished) {
    return (
      <ExamModuleShell title="Okuma — Lesen" subtitle="Bu metin tamamlandı">
        <ExamScoreBar
          correct={score}
          total={passage.questions.length}
          label={`Lesen — ${passage.title_de}`}
        />
        <div className="flex flex-wrap justify-center gap-3">
          {passageIdx + 1 < passages.length && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setPassageIdx((i) => i + 1);
                setAnswers({});
                setFinished(false);
              }}
            >
              Sonraki metin →
            </button>
          )}
          <Link href="/exam" className="btn-secondary">
            Modüllere dön
          </Link>
        </div>
        <p className="text-center text-sm text-sage-500">
          Metin {passageIdx + 1}/{passages.length} · Toplam {totalQuestions} soru bankada
        </p>
      </ExamModuleShell>
    );
  }

  return (
    <ExamModuleShell
      title="2. Okuma — Lesen"
      subtitle={`${passage.title_de} — Metin ${passageIdx + 1}/${passages.length}`}
    >
      <ExamInstructionBanner>
        Önce metni oku, sonra her soruyu işaretle. Hepsi tamamlanınca <strong>Değerlendir</strong> ile
        sonucu gör.
      </ExamInstructionBanner>

      <div className="card-soft p-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-sage-500">{passage.type}</p>
        <p className="whitespace-pre-line rounded-xl border border-sage-100 bg-white p-4 text-base leading-relaxed text-sage-800">
          {passage.text_de}
        </p>
      </div>

      {passage.questions.map((q, i) => (
        <McqQuestion
          key={q.id}
          index={i}
          total={passage.questions.length}
          questionDe={q.question_de}
          questionTr={q.question_tr}
          options={q.options}
          selected={answers[q.id] ?? null}
          correctIndex={null}
          onSelect={(idx) => setAnswers((a) => ({ ...a, [q.id]: idx }))}
        />
      ))}

      <ExamEvaluateButton
        disabled={!allAnswered}
        answered={answeredCount}
        total={passage.questions.length}
        onClick={() => {
          const lesen = { ...progress.goethe.lesen };
          for (const q of passage.questions) {
            lesen[q.id] = answers[q.id] === q.correct_index;
          }
          const pct = Math.round((score / passage.questions.length) * 100);
          updateProgress({
            goethe: {
              ...progress.goethe,
              lesen,
              moduleBest: {
                ...progress.goethe.moduleBest,
                lesen: Math.max(progress.goethe.moduleBest.lesen, pct),
              },
            },
            dailyStats: {
              ...progress.dailyStats,
              lesenPassages: progress.dailyStats.lesenPassages + 1,
            },
          });
          setFinished(true);
        }}
      />
    </ExamModuleShell>
  );
}
