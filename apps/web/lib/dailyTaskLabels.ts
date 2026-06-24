export interface DailyTaskMeta {
  title: string;
  subtitle: string;
  shortLabel: string;
}

export const DAILY_TASK_META: Record<string, DailyTaskMeta> = {
  srs: {
    title: "SRS Tekrar",
    subtitle: "Kartla tekrar et",
    shortLabel: "SRS tekrar",
  },
  new: {
    title: "Yeni kelime (Kartlar)",
    subtitle: "Yeni A1 kelimeler",
    shortLabel: "Yeni kelime",
  },
  hoeren: {
    title: "Hören (Dinleme)",
    subtitle: "Dinle ve cevapla",
    shortLabel: "Hören oturumu",
  },
  lesen: {
    title: "Lesen (Okuma)",
    subtitle: "Metin oku, soruları işaretle",
    shortLabel: "Lesen metni",
  },
  schreiben: {
    title: "Schreiben (Yazma)",
    subtitle: "Form veya kısa mesaj",
    shortLabel: "Schreiben görevi",
  },
  sprechen: {
    title: "Sprechen (Konuşma)",
    subtitle: "Soruları sesle cevapla",
    shortLabel: "Sprechen kartları",
  },
  listen: {
    title: "Dinleme (MP3)",
    subtitle: "Kelime ve cümle dinle",
    shortLabel: "Dinleme (MP3)",
  },
  speakClass: {
    title: "Sınıf — Profesör",
    subtitle: "1 tahta adımı bitir",
    shortLabel: "Sınıf adımı",
  },
  speakExercise: {
    title: "Sınıf — Egzersiz",
    subtitle: "Kelime ve yazma egzersizi",
    shortLabel: "Egzersiz alanı",
  },
  dialogues: {
    title: "Hikayeler & Diyaloglar",
    subtitle: "Satır satır oku",
    shortLabel: "Hikaye oku",
  },
  exam: {
    title: "Deneme sınavı (Prüfung)",
    subtitle: "Tam A1 simülasyonu",
    shortLabel: "Deneme sınavı",
  },
  rest: {
    title: "Günlük hedef tamam",
    subtitle: "Bugün bitti — mola ver",
    shortLabel: "Tamamlandı",
  },
};

export function getTaskMeta(id: string): DailyTaskMeta {
  return (
    DAILY_TASK_META[id] ?? {
      title: id,
      subtitle: "",
      shortLabel: id,
    }
  );
}

function taskFields(id: string) {
  const m = getTaskMeta(id);
  return { label: m.shortLabel, title: m.title, subtitle: m.subtitle };
}

export { taskFields };
