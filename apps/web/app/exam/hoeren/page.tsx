"use client";

import { useMemo, useState } from "react";
import { getHoerenQuestions } from "@german-coach/exams";
import { McqQuestion } from "@/components/exam/McqQuestion";
import { ExamModuleShell, ExamScoreBar } from "@/components/exam/ExamModuleShell";
import {
  ExamEvaluateButton,
  ExamInstructionBanner,
  ExamProgressBar,
} from "@/components/exam/examUi";
import { SmartTip } from "@/components/ui/SmartTip";
import { resolveHoerenAudioSrc } from "@/lib/hoerenAudio";
import { useProgress } from "@/lib/ProgressContext";
import Link from "next/link";

const SESSION_SIZE = 10;

export default function HoerenExamPage() {
  const { progress, updateProgress } = useProgress();
  const all = getHoerenQuestions();
  const [offset, setOffset] = useState(0);
  const [sessionIdx, setSessionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const session = useMemo(
    () => all.slice(offset, offset + SESSION_SIZE),
    [all, offset]
  );

  const currentQ = session[sessionIdx];

  const score = useMemo(() => {
    let c = 0;
    for (const q of session) {
      if (answers[q.id] === q.correct_index) c++;
    }
    return c;
  }, [session, answers]);

  const allAnswered = session.every((q) => answers[q.id] !== undefined);
  const answeredCount = session.filter((q) => answers[q.id] !== undefined).length;

  const advanceInSession = () => {
    if (sessionIdx + 1 < session.length) {
      setSessionIdx((i) => i + 1);
    }
  };

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
                setSessionIdx(0);
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
      subtitle={`Soru ${offset + sessionIdx + 1} / ${all.length} · oturum ${sessionIdx + 1}/${session.length}`}
    >
      <ExamInstructionBanner>
        <strong>Dinle</strong> (Almanca kelime/cümle) → Türkçe anlamını seç. Klavyede{" "}
        <strong>Space</strong> = dinle, <strong>a–d</strong> = seç, <strong>Enter</strong> = sonraki soru.
        Oturum bitince <strong>Değerlendir</strong>.
      </ExamInstructionBanner>

      <SmartTip id="exam-hoeren-keyboard" className="mb-1">
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          Space
        </kbd>{" "}
        dinle ·{" "}
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          a
        </kbd>
        –
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          d
        </kbd>{" "}
        seç ·{" "}
        <kbd className="rounded border border-sage-200 bg-white px-1 py-0.5 font-mono text-[10px]">
          Enter
        </kbd>{" "}
        sonraki soru
      </SmartTip>

      <ExamProgressBar current={answeredCount} total={session.length} />

      {currentQ ? (
        <McqQuestion
          key={currentQ.id}
          index={offset + sessionIdx}
          total={all.length}
          questionDe={currentQ.question_de}
          questionTr={currentQ.question_tr}
          audioText={currentQ.audio_text}
          audioSrc={resolveHoerenAudioSrc(currentQ.audio_text)}
          options={currentQ.options}
          selected={answers[currentQ.id] ?? null}
          correctIndex={null}
          keyboardActive
          onSelect={(idx) => setAnswers((a) => ({ ...a, [currentQ.id]: idx }))}
          onAdvance={advanceInSession}
        />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="btn-secondary flex-1"
          disabled={sessionIdx === 0}
          onClick={() => setSessionIdx((i) => Math.max(0, i - 1))}
        >
          ← Önceki soru
        </button>
        <button
          type="button"
          className="btn-secondary flex-1"
          disabled={sessionIdx >= session.length - 1}
          onClick={advanceInSession}
        >
          Sonraki soru →
        </button>
      </div>

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
