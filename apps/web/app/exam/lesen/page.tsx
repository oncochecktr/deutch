"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getLesenPassages } from "@german-coach/exams";
import { McqQuestion } from "@/components/exam/McqQuestion";
import { ExamModuleShell, ExamScoreBar } from "@/components/exam/ExamModuleShell";
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

  if (!passage) return null;

  if (finished) {
    return (
      <ExamModuleShell title="Teil Lesen" subtitle="Okuma metni tamamlandı">
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
        <p className="text-center text-xs text-sage-400">
          Metin {passageIdx + 1}/{passages.length} · Toplam {totalQuestions} soru bankada
        </p>
      </ExamModuleShell>
    );
  }

  return (
    <ExamModuleShell
      title="Teil 2: Lesen"
      subtitle={`${passage.title_de} — Metin ${passageIdx + 1}/${passages.length}`}
    >
      <div className="card-soft p-4">
        <p className="mb-2 text-xs uppercase text-sage-400">{passage.type}</p>
        <p className="whitespace-pre-line rounded-xl bg-white p-4 text-sm leading-relaxed text-sage-700">
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

      <button
        type="button"
        className="btn-primary w-full py-3"
        disabled={!allAnswered}
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
      >
        Auswerten — Değerlendir
      </button>
    </ExamModuleShell>
  );
}
