export interface DailyTaskMeta {
  title: string;
  subtitle: string;
  shortLabel: string;
}

export const DAILY_TASK_META: Record<string, DailyTaskMeta> = {
  srs: {
    title: "SRS Tekrar",
    subtitle: "Ezberlediğin kelimeleri kartla tekrar et — unutmamak için",
    shortLabel: "SRS tekrar",
  },
  new: {
    title: "Yeni kelime (Kartlar)",
    subtitle: "Bugün öğreneceğin A1 kelimeleri — çevir, Biliyorum de",
    shortLabel: "Yeni kelime",
  },
  hoeren: {
    title: "Hören (Dinleme)",
    subtitle: "A1 dinleme — sesi dinle, çoktan seçmeli soruları cevapla (Goethe · TELC formatı)",
    shortLabel: "Hören oturumu",
  },
  lesen: {
    title: "Lesen (Okuma)",
    subtitle: "A1 okuma — kısa metni oku, alttaki soruları işaretle",
    shortLabel: "Lesen metni",
  },
  schreiben: {
    title: "Schreiben (Yazma)",
    subtitle: "A1 yazma — form doldur veya kısa mesaj / e-posta yaz",
    shortLabel: "Schreiben görevi",
  },
  sprechen: {
    title: "Sprechen (Konuşma)",
    subtitle: "A1 konuşma — soruları yüksek sesle cevapla, checklist işaretle",
    shortLabel: "Sprechen kartları",
  },
  listen: {
    title: "Dinleme (MP3)",
    subtitle: "Kulaklıkla yürürken kelime ve cümle dinle — telaffuz alışkanlığı",
    shortLabel: "Dinleme (MP3)",
  },
  speakClass: {
    title: "Sınıf — Profesör",
    subtitle: "Tahtada 1 adım bitir (öğret → dene → cevap) — 60 gün A1+A2 yolu",
    shortLabel: "Sınıf adımı",
  },
  speakExercise: {
    title: "Sınıf — Egzersiz",
    subtitle: "Profesörle kelime, yazma ve konuşma egzersizi — A1/A2/B1",
    shortLabel: "Egzersiz alanı",
  },
  dialogues: {
    title: "Hikayeler & Diyaloglar",
    subtitle: "Satır satır oku — gizli Türkçe çeviri, ses, anlama soruları",
    shortLabel: "Hikaye oku",
  },
  exam: {
    title: "Deneme sınavı (Prüfung)",
    subtitle: "Tam A1 simülasyonu — Hören, Lesen, Schreiben, Sprechen (Goethe · TELC · ÖSD)",
    shortLabel: "Deneme sınavı",
  },
  rest: {
    title: "Günlük hedef tamam",
    subtitle: "Bugünkü plan bitti — mola ver veya Mesleki Almanca çalış",
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
