export type HintLevel = 1 | 2 | 3;

export interface HintSupportState {
  level: HintLevel;
  consecutiveCorrect: number;
}

export const HINT_LEVEL_STREAK = 5;

export function emptyHintSupport(): HintSupportState {
  return { level: 1, consecutiveCorrect: 0 };
}

export function normalizeHintSupport(raw: Partial<HintSupportState> | undefined): HintSupportState {
  const base = emptyHintSupport();
  if (!raw) return base;
  const level = raw.level === 2 || raw.level === 3 ? raw.level : 1;
  const consecutiveCorrect =
    typeof raw.consecutiveCorrect === "number" && raw.consecutiveCorrect >= 0
      ? Math.min(raw.consecutiveCorrect, HINT_LEVEL_STREAK)
      : 0;
  return { level, consecutiveCorrect };
}

export function hintLevelLabel(level: HintLevel): string {
  if (level === 1) return "Seviye 1 — Türkçe çeviri (isteğe bağlı)";
  if (level === 2) return "Seviye 2 — küçük ipucu";
  return "Seviye 3 — sadece Almanca";
}

export function updateHintSupport(
  current: HintSupportState,
  outcome: "correct" | "wrong" | "neutral"
): HintSupportState {
  if (outcome === "neutral") return current;

  if (outcome === "correct") {
    const consecutiveCorrect = current.consecutiveCorrect + 1;
    if (consecutiveCorrect >= HINT_LEVEL_STREAK && current.level < 3) {
      return { level: (current.level + 1) as HintLevel, consecutiveCorrect: 0 };
    }
    return { ...current, consecutiveCorrect };
  }

  return {
    level: current.level > 1 ? ((current.level - 1) as HintLevel) : 1,
    consecutiveCorrect: 0,
  };
}

export function inferAnswerOutcome(
  chatData: {
    stepComplete?: boolean;
    correction?: string | null;
  },
  wasWritten: boolean
): "correct" | "wrong" | "neutral" {
  if (chatData.stepComplete) return "correct";
  if (wasWritten && chatData.correction) return "wrong";
  if (wasWritten && !chatData.correction) return "correct";
  return "neutral";
}

export function formatHintLevelForPrompt(level: HintLevel, consecutiveCorrect: number): string {
  const remaining = Math.max(0, HINT_LEVEL_STREAK - consecutiveCorrect);
  if (level === 1) {
    return `DESTEK SEVİYESİ 1: Her soruda germanQuestion + turkishTranslation ver. partialHint null. Öğrenci A1 başı — tek Almanca soru, Türkçe çeviri ayrı alanda (reply'de değil). ${remaining} doğru cevap daha → seviye 2.`;
  }
  if (level === 2) {
    return `DESTEK SEVİYESİ 2: germanQuestion ver. turkishTranslation null. partialHint küçük ipucu (tam çeviri YOK). ${remaining} doğru cevap daha → seviye 3.`;
  }
  return "DESTEK SEVİYESİ 3: Sadece germanQuestion. turkishTranslation ve partialHint null — gerçek sınıf modu. Yanlış yaparsa sistem seviye düşürür.";
}
