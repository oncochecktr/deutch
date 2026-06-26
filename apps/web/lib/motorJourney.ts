import type { UserProgress } from "@/lib/progress";
import { loadDasIstPossessiveProgress } from "@/lib/dasIstPossessiveStorage";
import { loadDasIstProgress } from "@/lib/dasIstStorage";
import { loadSentenceEngineProgress } from "@/lib/sentenceEngineStorage";
import { loadWoIstLegoProgress } from "@/lib/woIstLegoStorage";

export interface MotorJourneyStep {
  step: number;
  titleTr: string;
  formula: string;
  hackTr: string;
  href: string;
  weekHint: string;
  /** localStorage veya progress ile tamamlanma kontrolü */
  checkDone?: (progress: UserProgress) => boolean;
}

export const A1_MOTOR_JOURNEY: MotorJourneyStep[] = [
  {
    step: 1,
    titleTr: "Artikel + isim",
    formula: "der / die / das + İsim",
    hackTr: "İsmin artikeli sabit — motor değişmez, sadece isim değişir.",
    href: "/grundlagen/artikel",
    weekHint: "1. hafta",
    checkDone: (p) => p.grundlagen.articlesCompleted.length >= 3,
  },
  {
    step: 2,
    titleTr: "Wo ist …?",
    formula: "Wo + ist + der/die/das + İsim + ?",
    hackTr: "Wo ve ist asla değişmez — Lego'nun sadece ortası değişir.",
    href: "/grundlagen/wo-ist",
    weekHint: "1.–2. hafta",
    checkDone: () => loadWoIstLegoProgress().completed.length >= 1,
  },
  {
    step: 3,
    titleTr: "Artikel + sıfat + isim",
    formula: "der große Park · die nächste Apotheke",
    hackTr: "Sıfat isimden önce; artikel cinsiyeti sıfatı çeker (-e).",
    href: "/grundlagen/sentence-engine/adjektiv",
    weekHint: "2.–3. hafta",
    checkDone: () => loadSentenceEngineProgress().pattern02Completed.length >= 1,
  },
  {
    step: 4,
    titleTr: "Das ist ein … → Er/Es/Sie",
    formula: "Das ist ein Hotel. Es ist sehr schön.",
    hackTr: "İlk satır tanıtır (ein), ikinci satır zamirle yorum yapar (das→Es).",
    href: "/grundlagen/sentence-engine/das-ist",
    weekHint: "3.–4. hafta",
    checkDone: () => loadDasIstProgress().completed.includes("mixed"),
  },
  {
    step: 5,
    titleTr: "Das ist mein/unser … → Er/Es/Sie",
    formula: "Das ist mein Zimmer. Es ist sehr groß.",
    hackTr: "ein yerine mein/dein/unser — köprü aynı: der→Er, die→Sie, das→Es.",
    href: "/grundlagen/sentence-engine/das-ist-mein",
    weekHint: "4.–6. hafta",
    checkDone: () => loadDasIstPossessiveProgress().completed.includes("mixed"),
  },
  {
    step: 6,
    titleTr: "Fiil + tam cümle",
    formula: "Ich arbeite. · Wo ist …? · Modal + mastar",
    hackTr: "Özne + fiil (2. pozisyon) — sonra sınav modüllerine geç.",
    href: "/grundlagen/conjugation",
    weekHint: "6.–10. hafta",
    checkDone: (p) => p.grundlagen.conjugationCompleted.length >= 5,
  },
];

export const A1_READINESS_MILESTONE = {
  title: "Ne zaman «A1'e hazırım» dersin?",
  summary:
    "Kursa gitmeden de aynı mantığı burada kaparsın. Hoca yine anlatacak — ama sen «aa bu motor» diyecek kadar hazır olursun.",
  signals: [
    "Motor adımları 1–5 tamam (özellikle Das ist + mein/unser)",
    "En az 400 kelime çalışılmış",
    "Word-order + en az 1 deneme sınavı",
    "Günde 30–45 dk, 8–14 hafta düzenli çalışma",
  ],
  typicalWeeks: "8–14 hafta",
  examHref: "/exam",
  wordsHref: "/words",
};

export function motorJourneyState(progress: UserProgress) {
  const steps = A1_MOTOR_JOURNEY.map((s) => ({
    ...s,
    done: s.checkDone?.(progress) ?? false,
  }));
  const doneCount = steps.filter((s) => s.done).length;
  const active = steps.find((s) => !s.done) ?? steps[steps.length - 1];
  const pct = Math.round((doneCount / steps.length) * 100);
  const readyFeel =
    doneCount >= 5 && progress.grundlagen.conjugationCompleted.length >= 3
      ? "yakın"
      : doneCount >= 3
        ? "yolda"
        : "başlangıç";

  return { steps, doneCount, total: steps.length, pct, active, readyFeel };
}
