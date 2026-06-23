"use client";

import { getLessonById } from "@/lib/speakCurriculum";
import type { CompletedLessonRecord, TeacherNote } from "@/lib/speakStorage";

interface SpeakCompletedLessonsAccordionProps {
  completedLessons: CompletedLessonRecord[];
  notes: TeacherNote[];
}

function formatCompletedDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function SpeakCompletedLessonsAccordion({
  completedLessons,
  notes,
}: SpeakCompletedLessonsAccordionProps) {
  const sorted = [...completedLessons].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  return (
    <div className="rounded-xl border border-sage-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-goethe-blue">
        Geçilen dersler
      </p>
      <p className="mt-1 text-xs text-sage-500">
        Tamamladıkça burada birikir — başlığa tıkla, içeriği aç.
      </p>

      {sorted.length === 0 ? (
        <p className="mt-3 rounded-lg bg-sage-50 px-3 py-2.5 text-sm italic text-sage-500">
          Henüz bitmiş ders yok. Profesör dersi tamamlayınca burada görünür.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          {sorted.map((record, index) => {
            const lesson = getLessonById(record.lessonId);
            const lessonNotes = notes.filter((n) => n.lessonId === record.lessonId);

            return (
              <details
                key={record.lessonId}
                className="group rounded-lg border border-emerald-200/80 bg-emerald-50/50 open:bg-white open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-start gap-2 px-3 py-2.5 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-snug text-emerald-950">
                      {record.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-emerald-700/80">
                      {formatCompletedDate(record.completedAt)} · {record.level}
                    </span>
                  </span>
                  <span
                    className="mt-1 shrink-0 text-sage-400 transition group-open:rotate-180"
                    aria-hidden
                  >
                    ▾
                  </span>
                </summary>

                <div className="space-y-3 border-t border-emerald-100 px-3 pb-3 pt-2 text-sm text-sage-700">
                  {lesson ? (
                    <>
                      <div>
                        <p className="text-xs font-semibold uppercase text-sage-400">Hedef</p>
                        <p className="mt-1 leading-relaxed">{lesson.goal}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase text-sage-400">
                          Kalıplar
                        </p>
                        <ul className="mt-1 flex flex-wrap gap-1.5">
                          {lesson.phrases.map((phrase) => (
                            <li
                              key={phrase}
                              className="rounded-md bg-goethe-blue/10 px-2 py-0.5 text-xs font-medium text-goethe-blue"
                            >
                              {phrase}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase text-sage-400">
                          Adımlar ({lesson.steps.length})
                        </p>
                        <ol className="mt-1.5 space-y-1.5">
                          {lesson.steps.map((step, i) => (
                            <li key={step.title} className="flex gap-2 text-xs leading-snug">
                              <span className="font-semibold text-goethe-blue">{i + 1}.</span>
                              <span>
                                <span className="font-medium text-sage-800">{step.title}</span>
                                <span className="text-sage-500"> — {step.instruction}</span>
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs italic text-sage-500">Ders detayı bulunamadı.</p>
                  )}

                  {lessonNotes.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-sage-400">
                        Tahta notların
                      </p>
                      <ul className="mt-1.5 space-y-1.5">
                        {lessonNotes.map((n) => (
                          <li
                            key={n.id}
                            className="border-l-2 border-goethe-blue pl-2 text-xs leading-snug text-goethe-blue"
                          >
                            {n.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
