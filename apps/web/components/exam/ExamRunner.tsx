"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getExamById,
  resolveHoerenItem,
  getLesenPassageById,
  getLesenRfById,
  getLesenMatchById,
  getSprechenById,
} from "@german-coach/exams";
import type { GoetheExam, HoerenExamItem, HoerenQuestion, HoerenTrueFalse, LesenMatching, LesenPassage, LesenTrueFalse, SprechenCard } from "@german-coach/exams";
import { IconCheck } from "@/components/icons";
import { AudioButton } from "@/components/AudioButton";
import { ExamLockGuard } from "@/components/exam/ExamLockGuard";
import { ExamScoreBar } from "@/components/exam/ExamModuleShell";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { MatchingQuestion } from "@/components/exam/MatchingQuestion";
import { McqQuestion } from "@/components/exam/McqQuestion";
import { SchreibenExamFlow } from "@/components/exam/SchreibenExamFlow";
import { SprechenScoredCard } from "@/components/exam/SprechenScoredCard";
import { TrueFalseQuestion } from "@/components/exam/TrueFalseQuestion";
import {
  computeGoetheModulePoints,
  isHoerenMcq,
  isHoerenTrueFalse,
  scoreHoerenModule,
  scoreLesenModule,
  sprechenModulePoints,
  type ExamAnswerState,
} from "@/lib/goetheScoring";
import type { GoetheExamResult, GoetheModulePoints } from "@/lib/goetheProgress";
import { useExamSession } from "@/lib/useExamSession";
import { useProgress } from "@/lib/ProgressContext";
import { todayISO } from "@/lib/srs";

type Step = "intro" | "hoeren" | "lesen" | "schreiben" | "sprechen" | "result";

interface ExamRunnerProps {
  examId: string;
  mode: "practice" | "real";
}

export function ExamRunner({ examId, mode }: ExamRunnerProps) {
  const exam = getExamById(examId);
  const { progress, updateProgress } = useProgress();
  const minutes = exam?.time_minutes ?? 65;

  const {
    session,
    startExam,
    clearSession,
    patchSession,
    expireExam,
    recordAudioPlay,
  } = useExamSession(examId, mode, minutes);

  const [localAnswers, setLocalAnswers] = useState<ExamAnswerState>(() => ({
    mcq: {},
    trueFalse: {},
    matching: {},
    schreibenForm: {},
    schreibenLetter: "",
    sprechenAnswers: {},
    sprechenChecklists: {},
    sprechenScores: {},
  }));

  const [schreibenPoints, setSchreibenPoints] = useState(0);
  const [finalPoints, setFinalPoints] = useState<GoetheModulePoints | null>(null);
  const [hoerenIdx, setHoerenIdx] = useState(0);
  const [lesenRfIdx, setLesenRfIdx] = useState(0);
  const [lesenMatchDone, setLesenMatchDone] = useState(false);
  const [lesenMcqIdx, setLesenMcqIdx] = useState(0);
  const [spIdx, setSpIdx] = useState(0);

  const answers = mode === "real" ? session.answers : localAnswers;
  const step = (mode === "real" ? session.step : "intro") as Step;
  const locked = mode === "real" && session.startedAt > 0 && step !== "intro" && step !== "result";

  const blueprint = exam?.real;
  const hoerenIds = useMemo(
    () => (mode === "real" && blueprint ? blueprint.hoeren : exam?.hoeren ?? []),
    [mode, blueprint, exam]
  );
  const hoerenItems = useMemo(
    () => hoerenIds.map(resolveHoerenItem).filter((x): x is HoerenExamItem => !!x),
    [hoerenIds]
  );
  const lesenRf = useMemo(
    () =>
      (mode === "real" && blueprint
        ? blueprint.lesen_rf.map(getLesenRfById).filter(Boolean)
        : []) as LesenTrueFalse[],
    [mode, blueprint]
  );
  const lesenMatch = useMemo(
    () =>
      (mode === "real" && blueprint
        ? blueprint.lesen_match.map(getLesenMatchById).filter(Boolean)
        : []) as LesenMatching[],
    [mode, blueprint]
  );
  const lesenPassages = useMemo(
    () =>
      (mode === "real" && blueprint
        ? blueprint.lesen.map(getLesenPassageById).filter(Boolean)
        : exam?.lesen.map(getLesenPassageById).filter(Boolean) ?? []) as LesenPassage[],
    [mode, blueprint, exam]
  );
  const sprechenCards = useMemo(
    () => exam?.sprechen.map(getSprechenById).filter(Boolean) as SprechenCard[],
    [exam]
  );

  const setAnswers = useCallback(
    (patch: Partial<ExamAnswerState>) => {
      if (mode === "real") {
        patchSession({ answers: { ...session.answers, ...patch } });
      } else {
        setLocalAnswers((a) => ({ ...a, ...patch }));
      }
    },
    [mode, patchSession, session.answers]
  );

  const goStep = (s: Step) => {
    if (mode === "real") patchSession({ step: s });
    else if (s === "hoeren") setPracticeStep("hoeren");
  };

  const [practiceStep, setPracticeStep] = useState<Step>("intro");
  const activeStep = mode === "real" ? step : practiceStep;

  const finishExam = useCallback(
    (spScores: Record<string, number>) => {
      if (!exam) return;
      const mcqH = hoerenItems.filter(isHoerenMcq) as HoerenQuestion[];
      const rfH = hoerenItems.filter(isHoerenTrueFalse) as HoerenTrueFalse[];
      const hScore = scoreHoerenModule(mcqH, rfH, answers);
      const lScore = scoreLesenModule(lesenRf, lesenMatch, lesenPassages, answers);
      const spPoints = sprechenModulePoints(Object.values(spScores));
      const schPoints = mode === "real" ? schreibenPoints : 0;
      const points = computeGoetheModulePoints({
        hoeren: hScore,
        lesen: lScore,
        schreiben: schPoints,
        sprechen: spPoints,
      });
      setFinalPoints(points);

      const result: GoetheExamResult = {
        examId: exam.id,
        mode,
        hoeren: { correct: hScore.correct, total: hScore.total, date: todayISO() },
        lesen: { correct: lScore.correct, total: lScore.total, date: todayISO() },
        schreiben: {
          completed: true,
          date: todayISO(),
          points: schPoints,
        },
        sprechen: {
          completed: Object.keys(spScores).length,
          total: sprechenCards.length,
          avgScore: Object.values(spScores).length
            ? Math.round(
                Object.values(spScores).reduce((a, b) => a + b, 0) /
                  Object.values(spScores).length
              )
            : 0,
          points: spPoints,
          date: todayISO(),
        },
        points,
        passed: points.passed,
        timeUsedSeconds:
          mode === "real" && session.startedAt
            ? Math.round((Date.now() - session.startedAt) / 1000)
            : undefined,
        date: todayISO(),
      };

      updateProgress((p) => ({
        ...p,
        examSimulations: p.examSimulations + 1,
        goethe: {
          ...p.goethe,
          sprechenScores: { ...p.goethe.sprechenScores, ...spScores },
          ...(mode === "real"
            ? {
                realExamResults: {
                  ...p.goethe.realExamResults,
                  [exam.id]: result,
                },
              }
            : {
                examResults: {
                  ...p.goethe.examResults,
                  [exam.id]: result,
                },
              }),
        },
      }));

      if (mode === "real") {
        patchSession({ step: "result" });
        clearSession();
      } else {
        setPracticeStep("result");
      }
    },
    [
      answers,
      clearSession,
      exam,
      hoerenItems,
      lesenMatch,
      lesenPassages,
      lesenRf,
      mode,
      patchSession,
      schreibenPoints,
      session.startedAt,
      sprechenCards.length,
      updateProgress,
    ]
  );

  useEffect(() => {
    if (mode === "real" && session.expired && activeStep !== "result") {
      finishExam(answers.sprechenScores);
    }
  }, [mode, session.expired, activeStep, finishExam, answers.sprechenScores]);

  if (!exam) {
    return (
      <div className="card-soft mx-auto max-w-lg p-8 text-center">
        <p>Sınav bulunamadı.</p>
        <Link href="/exam" className="btn-primary mt-4 inline-block">
          Geri
        </Link>
      </div>
    );
  }

  const introContent = (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="card-soft overflow-hidden">
        <div className="bg-goethe-blue px-6 py-8 text-center text-white">
          <p className="text-xs uppercase tracking-widest text-white/60">
            {mode === "real" ? "Gerçek Sınav Modu" : "Modellprüfung"}
          </p>
          <h1 className="mt-2 text-xl font-bold">{exam.title}</h1>
          <p className="mt-2 text-sm text-white/70">
            {minutes} Minuten · 4 Teile · {mode === "real" ? "60/100 puan" : "Praxis"}
          </p>
        </div>
        <ul className="space-y-2 p-6 text-sm text-sage-600">
          <li>Teil 1 Hören — {hoerenItems.length} Aufgaben</li>
          <li>
            Teil 2 Lesen —{" "}
            {mode === "real"
              ? `${lesenRf.length} R/F + ${lesenMatch.length} Zuordnung + ${lesenPassages.length} Texte`
              : `${lesenPassages.length} Texte`}
          </li>
          <li>Teil 3 Schreiben — Form + Mektup</li>
          <li>Teil 4 Sprechen — {sprechenCards.length} Karten</li>
        </ul>
        {mode === "real" && (
          <p className="border-t border-sage-100 px-6 py-3 text-xs text-red-700">
            Sınav başlayınca geri dönemezsin. Süre bitince otomatik teslim edilir. Geçme: 60/100.
          </p>
        )}
        <div className="border-t border-sage-100 p-4">
          <button
            type="button"
            className="btn-primary w-full py-3"
            onClick={() => {
              if (mode === "real") {
                startExam();
              } else {
                setPracticeStep("hoeren");
              }
            }}
          >
            {mode === "real" ? "Gerçek sınavı başlat" : "Prüfung beginnen"}
          </button>
          {!locked && (
            <Link href="/exam" className="mt-2 block text-center text-sm text-sage-400">
              ← İptal
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  const timerEl =
    mode === "real" && session.endsAt > 0 && activeStep !== "intro" && activeStep !== "result" ? (
      <ExamTimer endsAt={session.endsAt} onExpire={expireExam} />
    ) : null;

  if (activeStep === "intro") {
    return mode === "real" ? introContent : introContent;
  }

  if (activeStep === "hoeren") {
    const item = hoerenItems[hoerenIdx];
    if (!item) {
      const next = () => (mode === "real" ? patchSession({ step: "lesen" }) : setPracticeStep("lesen"));
      return wrap(locked, timerEl, (
        <ModuleFrame title="Teil 1: Hören" n={hoerenItems.length} total={hoerenItems.length} mode={mode}>
          <p className="text-center text-sage-500">Hören abgeschlossen.</p>
          <button type="button" className="btn-primary w-full py-3" onClick={next}>
            Weiter → Lesen
          </button>
        </ModuleFrame>
      ));
    }

    if (isHoerenTrueFalse(item)) {
      return wrap(locked, timerEl, (
        <ModuleFrame title="Teil 1: Hören" n={hoerenIdx + 1} total={hoerenItems.length} mode={mode}>
          <TrueFalseQuestion
            index={hoerenIdx}
            total={hoerenItems.length}
            statementDe={item.statement_de}
            statementTr={item.statement_tr}
            audioText={item.audio_text}
            selected={answers.trueFalse[item.id] ?? null}
            onSelect={(v) => setAnswers({ trueFalse: { ...answers.trueFalse, [item.id]: v } })}
          />
          <AudioButton
            text={item.audio_text}
            label="Anhören"
            maxPlays={mode === "real" ? 2 : undefined}
            playsUsed={session.audioPlays[item.id] ?? 0}
            onPlay={() => (mode === "real" ? recordAudioPlay(item.id, 2) : true)}
          />
          <AdvanceButton
            disabled={answers.trueFalse[item.id] === undefined}
            onClick={() => {
              if (hoerenIdx + 1 < hoerenItems.length) setHoerenIdx((i) => i + 1);
              else mode === "real" ? patchSession({ step: "lesen" }) : setPracticeStep("lesen");
            }}
          />
        </ModuleFrame>
      ));
    }

    const q = item as HoerenQuestion;
    return wrap(locked, timerEl, (
      <ModuleFrame title="Teil 1: Hören" n={hoerenIdx + 1} total={hoerenItems.length} mode={mode}>
        <McqQuestion
          index={hoerenIdx}
          total={hoerenItems.length}
          questionDe={q.question_de}
          questionTr={q.question_tr}
          audioText={q.audio_text}
          options={q.options}
          selected={answers.mcq[q.id] ?? null}
          correctIndex={null}
          onSelect={(idx) => setAnswers({ mcq: { ...answers.mcq, [q.id]: idx } })}
        />
        {q.audio_text ? (
          <AudioButton
            text={q.audio_text}
            label="Anhören"
            maxPlays={mode === "real" ? 2 : undefined}
            playsUsed={session.audioPlays[q.id] ?? 0}
            onPlay={() => (mode === "real" ? recordAudioPlay(q.id, 2) : true)}
          />
        ) : null}
        <AdvanceButton
          disabled={answers.mcq[q.id] === undefined}
          onClick={() => {
            if (hoerenIdx + 1 < hoerenItems.length) setHoerenIdx((i) => i + 1);
            else mode === "real" ? patchSession({ step: "lesen" }) : setPracticeStep("lesen");
          }}
        />
      </ModuleFrame>
    ));
  }

  if (activeStep === "lesen") {
    if (mode === "real" && lesenRfIdx < lesenRf.length) {
      const q = lesenRf[lesenRfIdx];
      return wrap(locked, timerEl, (
        <ModuleFrame title="Teil 2: Lesen (R/F)" n={lesenRfIdx + 1} total={lesenRf.length} mode={mode}>
          <TrueFalseQuestion
            index={lesenRfIdx}
            total={lesenRf.length}
            contextDe={q.context_de}
            statementDe={q.statement_de}
            statementTr={q.statement_tr}
            selected={answers.trueFalse[q.id] ?? null}
            onSelect={(v) => setAnswers({ trueFalse: { ...answers.trueFalse, [q.id]: v } })}
          />
          <AdvanceButton
            disabled={answers.trueFalse[q.id] === undefined}
            onClick={() => setLesenRfIdx((i) => i + 1)}
          />
        </ModuleFrame>
      ));
    }

    if (mode === "real" && !lesenMatchDone && lesenMatch[0]) {
      const m = lesenMatch[0];
      const sel = answers.matching[m.id] ?? [];
      return wrap(locked, timerEl, (
        <ModuleFrame title="Teil 2: Lesen (Zuordnung)" n={1} total={1} mode={mode}>
          <MatchingQuestion
            item={m}
            selected={sel}
            onChange={(indices) => setAnswers({ matching: { ...answers.matching, [m.id]: indices } })}
          />
          <AdvanceButton
            disabled={sel.length < m.prompts.length || sel.some((v) => Number.isNaN(v))}
            onClick={() => setLesenMatchDone(true)}
          />
        </ModuleFrame>
      ));
    }

    if (lesenMcqIdx >= lesenPassages.length) {
      return wrap(locked, timerEl, (
        <ModuleFrame title="Teil 2: Lesen" n={lesenPassages.length} total={lesenPassages.length} mode={mode}>
          <p className="text-center text-sage-500">Lesen abgeschlossen.</p>
          <button
            type="button"
            className="btn-primary w-full py-3"
            onClick={() => (mode === "real" ? patchSession({ step: "schreiben" }) : setPracticeStep("schreiben"))}
          >
            Weiter → Schreiben
          </button>
        </ModuleFrame>
      ));
    }

    const p = lesenPassages[lesenMcqIdx];
    const allDone = p.questions.every((q) => answers.mcq[q.id] !== undefined);
    return wrap(locked, timerEl, (
      <ModuleFrame title="Teil 2: Lesen" n={lesenMcqIdx + 1} total={lesenPassages.length} mode={mode}>
        <div className="card-soft p-4">
          <p className="mb-2 text-xs uppercase text-sage-400">{p.title_de}</p>
          <p className="whitespace-pre-line text-sm leading-relaxed">{p.text_de}</p>
        </div>
        {p.questions.map((q, i) => (
          <McqQuestion
            key={q.id}
            index={i}
            total={p.questions.length}
            questionDe={q.question_de}
            questionTr={q.question_tr}
            options={q.options}
            selected={answers.mcq[q.id] ?? null}
            correctIndex={null}
            onSelect={(idx) => setAnswers({ mcq: { ...answers.mcq, [q.id]: idx } })}
          />
        ))}
        <AdvanceButton
          disabled={!allDone}
          onClick={() => {
            if (lesenMcqIdx + 1 < lesenPassages.length) setLesenMcqIdx((i) => i + 1);
            else mode === "real" ? patchSession({ step: "schreiben" }) : setPracticeStep("schreiben");
          }}
        />
      </ModuleFrame>
    ));
  }

  if (activeStep === "schreiben") {
    if (mode === "real") {
      return wrap(locked, timerEl, (
        <ModuleFrame title="Teil 3: Schreiben" n={1} total={1} mode={mode}>
          <SchreibenExamFlow
            examMode
            onComplete={({ total }) => {
              setSchreibenPoints(Math.min(25, total));
              patchSession({ step: "sprechen" });
            }}
          />
        </ModuleFrame>
      ));
    }
    return wrap(locked, timerEl, (
      <ModuleFrame title="Teil 3: Schreiben" n={1} total={1} mode={mode}>
        <SchreibenExamFlow
          examMode={false}
          onComplete={() => setPracticeStep("sprechen")}
        />
      </ModuleFrame>
    ));
  }

  if (activeStep === "sprechen") {
    if (spIdx >= sprechenCards.length) {
      finishExam(answers.sprechenScores);
      return null;
    }
    const card = sprechenCards[spIdx];
    return wrap(locked, timerEl, (
      <ModuleFrame title="Teil 4: Sprechen" n={spIdx + 1} total={sprechenCards.length} mode={mode}>
        <SprechenScoredCard
          card={card}
          examMode={mode === "real"}
          onComplete={(score) => {
            const nextScores = { ...answers.sprechenScores, [card.id]: score };
            setAnswers({ sprechenScores: nextScores });
            if (spIdx + 1 >= sprechenCards.length) {
              finishExam(nextScores);
            } else {
              setSpIdx((i) => i + 1);
            }
          }}
        />
      </ModuleFrame>
    ));
  }

  const points = finalPoints;
  const mcqH = hoerenItems.filter(isHoerenMcq) as HoerenQuestion[];
  const rfH = hoerenItems.filter(isHoerenTrueFalse) as HoerenTrueFalse[];
  const hScore = scoreHoerenModule(mcqH, rfH, answers);
  const lScore = scoreLesenModule(lesenRf, lesenMatch, lesenPassages, answers);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="card-soft p-8 text-center">
        <span className="goethe-badge mb-4">Prüfung beendet</span>
        <h1 className="text-xl font-bold text-goethe-blue">{exam.title}</h1>
        {points ? (
          <>
            <p className="mt-4 text-4xl font-bold text-goethe-gold">{points.total}/100</p>
            <p className={`mt-2 text-sm font-semibold ${points.passed ? "text-sage-600" : "text-red-600"}`}>
              {points.passed ? "Bestanden — Geçtin!" : "Nicht bestanden — 60 gerekli"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-sage-500">
              <p>Hören: {points.hoeren}/25</p>
              <p>Lesen: {points.lesen}/25</p>
              <p>Schreiben: {points.schreiben}/25</p>
              <p>Sprechen: {points.sprechen}/25</p>
            </div>
          </>
        ) : (
          <ExamScoreBar correct={hScore.correct + lScore.correct} total={hScore.total + lScore.total} label="Hören + Lesen" />
        )}
        <div className="mt-6">
          <Link href="/exam" className="btn-primary">
            Modüllere dön
          </Link>
        </div>
      </div>
    </div>
  );
}

function wrap(locked: boolean, timer: React.ReactNode, content: React.ReactNode) {
  return (
    <ExamLockGuard active={locked}>
      <div className="mx-auto max-w-2xl space-y-4">
        {timer}
        {content}
      </div>
    </ExamLockGuard>
  );
}

function AdvanceButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button type="button" className="btn-primary w-full py-3" disabled={disabled} onClick={onClick}>
      Weiter →
    </button>
  );
}

function ModuleFrame({
  title,
  n,
  total,
  mode,
  children,
}: {
  title: string;
  n: number;
  total: number;
  mode: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-sage-100 pb-3">
        <span className="goethe-badge">{title}</span>
        <p className="mt-1 text-xs text-sage-400">
          {n}/{total} · {mode === "real" ? "Gerçek Sınav" : "Modellprüfung"}
        </p>
      </div>
      {children}
    </>
  );
}
