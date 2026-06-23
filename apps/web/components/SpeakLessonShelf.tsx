"use client";

import type { TeacherNote, CompletedLessonRecord } from "@/lib/speakStorage";
import { SPEAK_LESSONS } from "@/lib/speakCurriculum";
import type { SpeakLesson } from "@/lib/speakCurriculum";
import { SpeakCompletedLessonsAccordion } from "@/components/SpeakCompletedLessonsAccordion";

interface SpeakLessonShelfProps {
  currentLesson: SpeakLesson;
  currentStepIndex: number;
  completedLessons: CompletedLessonRecord[];
  assessedLevel: string;
  notes: TeacherNote[];
  collapsed?: boolean;
}

function ShelfSection({
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
    <details
      className="rounded-lg border border-sage-200 bg-white group"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sage-500 marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        {badge && (
          <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-bold text-sage-600">
            {badge}
          </span>
        )}
      </summary>
      <div className="border-t border-sage-100 px-3 pb-3 pt-2">{children}</div>
    </details>
  );
}

export function SpeakLessonShelf({
  currentLesson,
  currentStepIndex,
  completedLessons,
  assessedLevel,
  notes,
  collapsed = true,
}: SpeakLessonShelfProps) {
  const completedIds = completedLessons.map((c) => c.lessonId);
  const upcoming = SPEAK_LESSONS.filter(
    (l) => l.id !== currentLesson.id && !completedIds.includes(l.id)
  );
  const lessonNotes = notes.filter((n) => n.lessonId === currentLesson.id);

  const activeLesson = (
    <div>
      <p className="text-sm font-bold leading-snug text-goethe-blue">{currentLesson.title}</p>
      <p className="mt-1 text-xs text-sage-600">
        Adım {currentStepIndex + 1}/{currentLesson.steps.length} ·{" "}
        {currentLesson.steps[currentStepIndex]?.title ?? "—"}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sage-100">
        <div
          className="h-full rounded-full bg-goethe-blue"
          style={{
            width: `${Math.round(((currentStepIndex + 1) / currentLesson.steps.length) * 100)}%`,
          }}
        />
      </div>
    </div>
  );

  if (collapsed) {
    return (
      <aside className="space-y-2 text-sm">
        <ShelfSection title="Aktif ders" defaultOpen={false}>
          {activeLesson}
          <p className="mt-2 text-xs text-sage-500">Seviye {assessedLevel}</p>
        </ShelfSection>
        {lessonNotes.length > 0 && (
          <ShelfSection title="Defter" badge={String(lessonNotes.length)} defaultOpen={false}>
            <ul className="space-y-1">
              {lessonNotes.slice(-4).map((n) => (
                <li key={n.id} className="text-xs leading-snug text-goethe-blue">
                  {n.text}
                </li>
              ))}
            </ul>
          </ShelfSection>
        )}
        {completedLessons.length > 0 && (
          <ShelfSection title="Geçilen dersler" badge={String(completedLessons.length)} defaultOpen={false}>
            <SpeakCompletedLessonsAccordion
              completedLessons={completedLessons}
              notes={notes}
            />
          </ShelfSection>
        )}
        {upcoming.length > 0 && (
          <ShelfSection title="Sıradaki" defaultOpen={false}>
            <ul className="space-y-1">
              {upcoming.slice(0, 3).map((l) => (
                <li key={l.id} className="text-xs text-sage-600">
                  {l.title}
                </li>
              ))}
            </ul>
          </ShelfSection>
        )}
      </aside>
    );
  }

  return (
    <aside className="space-y-2 text-sm">
      <div className="rounded-lg border-2 border-goethe-blue/20 bg-white p-3">{activeLesson}</div>
      {lessonNotes.length > 0 && (
        <ShelfSection title="Defter notları" defaultOpen={false}>
          <ul className="space-y-1">
            {lessonNotes.slice(-5).map((n) => (
              <li key={n.id} className="text-xs text-goethe-blue">
                {n.text}
              </li>
            ))}
          </ul>
        </ShelfSection>
      )}
      <SpeakCompletedLessonsAccordion completedLessons={completedLessons} notes={notes} />
    </aside>
  );
}
