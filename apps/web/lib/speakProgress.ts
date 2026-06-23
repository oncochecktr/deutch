import { getLessonById, getLessonsForLevel, SPEAK_LESSONS } from "./speakCurriculum";
import type { SpeakLevel } from "./speakTypes";
import type { SpeakProfessorState } from "./speakStorage";

export interface LevelProgress {
  level: SpeakLevel;
  completedPercent: number;
  remainingPercent: number;
  completedSteps: number;
  totalSteps: number;
  completedLessons: number;
  totalLessons: number;
  currentLessonTitle: string;
  nextMilestone: string;
}

export function computeLevelProgress(professor: SpeakProfessorState): LevelProgress {
  const level = professor.assessedLevel;
  const lessons = getLessonsForLevel(level);
  const totalSteps = lessons.reduce((sum, l) => sum + l.steps.length, 0);
  const totalLessons = lessons.length;

  let completedSteps = 0;
  let completedLessons = 0;

  for (const lesson of lessons) {
    const isDone = professor.completedLessons.some((c) => c.lessonId === lesson.id);
    if (isDone) {
      completedSteps += lesson.steps.length;
      completedLessons += 1;
    } else if (lesson.id === professor.currentLessonId) {
      // currentStepIndex = tamamlanan adım sayısı (0 = henüz adım bitmedi)
      completedSteps += professor.currentStepIndex;
      break;
    } else {
      break;
    }
  }

  const completedPercent =
    totalSteps > 0 ? Math.min(100, Math.round((completedSteps / totalSteps) * 100)) : 0;
  const remainingPercent = 100 - completedPercent;

  const currentLesson = getLessonById(professor.currentLessonId);
  const nextIncomplete = lessons.find(
    (l) => !professor.completedLessons.some((c) => c.lessonId === l.id)
  );

  let nextMilestone = "A1 müfredatını tamamla";
  if (completedPercent >= 100) {
    nextMilestone = level === "A1" ? "A2 seviyesine geçiş" : level === "A2" ? "B1 seviyesine geçiş" : "Goethe sınav simülasyonu";
  } else if (nextIncomplete) {
    nextMilestone = `Sırada: ${nextIncomplete.title}`;
  }

  return {
    level,
    completedPercent,
    remainingPercent,
    completedSteps,
    totalSteps,
    completedLessons,
    totalLessons,
    currentLessonTitle: currentLesson?.title ?? "—",
    nextMilestone,
  };
}

/** Tüm müfredat (A1 dersleri) — baştan sona yol haritası */
export function computeOverallCurriculumProgress(professor: SpeakProfessorState): LevelProgress {
  const totalSteps = SPEAK_LESSONS.reduce((s, l) => s + l.steps.length, 0);
  let completedSteps = 0;
  let completedLessons = 0;

  for (const lesson of SPEAK_LESSONS) {
    const isDone = professor.completedLessons.some((c) => c.lessonId === lesson.id);
    if (isDone) {
      completedSteps += lesson.steps.length;
      completedLessons += 1;
    } else if (lesson.id === professor.currentLessonId) {
      completedSteps += professor.currentStepIndex;
      break;
    } else {
      break;
    }
  }

  const completedPercent =
    totalSteps > 0 ? Math.min(100, Math.round((completedSteps / totalSteps) * 100)) : 0;

  return {
    level: professor.assessedLevel,
    completedPercent,
    remainingPercent: 100 - completedPercent,
    completedSteps,
    totalSteps,
    completedLessons,
    totalLessons: SPEAK_LESSONS.length,
    currentLessonTitle: getLessonById(professor.currentLessonId)?.title ?? "—",
    nextMilestone:
      completedPercent >= 100
        ? "A1+A2 konuşma müfredatı bitti — Goethe Sprechen modülüne geç"
        : computeLevelProgress(professor).nextMilestone,
  };
}

export function formatProgressLabel(progress: LevelProgress): string {
  if (progress.completedPercent === 0 && progress.completedLessons === 0) {
    const lesson = progress.currentLessonTitle;
    return `Henüz %0 — ${lesson} başlıyor (${progress.totalSteps} adım müfredat)`;
  }
  return `${progress.level}: %${progress.completedPercent} tamam · %${progress.remainingPercent} kaldı`;
}

export function getLocalProfessorAdvice(
  progress: LevelProgress,
  weaknesses: string[]
): string {
  if (progress.completedPercent === 0) {
    return "Günde 15–20 dk Sınıf yeterli. Önce tahta notlarını defterine yaz, sonra sesli tekrar et.";
  }
  if (progress.completedPercent < 25) {
    return "A1 temelinde kal — her gün 3 yeni kalıp + 5 kelime kartı. Acele etme.";
  }
  if (progress.completedPercent < 50) {
    return "Yazılı ödevleri atlama; yazmak konuşmayı hızlandırır. Schwächen listene her ders bak.";
  }
  if (progress.completedPercent < 75) {
    return "Yarı yoldasın! Dinle (Hören) modülüne haftada 2 kez gir — kulak alışkanlığı şart.";
  }
  if (progress.completedPercent < 100) {
    return "Son düzlük: her ders sonunda kendi cümlelerini Almanca yaz, profesöre kontrol ettir.";
  }
  if (weaknesses.length > 0) {
    return `Eksiklerin var (${weaknesses.length} madde) — bir sonraki oturumda bunları tekrar iste.`;
  }
  return "A1 konuşma müfredatını bitirdin! Goethe Sprechen kartlarına geç — gerçek sınav formatı.";
}
