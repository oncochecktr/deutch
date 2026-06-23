import type {
  DialogueGenerateRequest,
  DialogueLevel,
  DialogueStory,
} from "./dialogueTypes";

const STORY_JSON_SCHEMA = `{
  "id": "ai_...",
  "level": "A1|A2|B1",
  "title_de": "...",
  "title_tr": "...",
  "theme": "...",
  "lines": [
    { "id": "l01", "speaker": "Name", "kind": "dialogue|narration", "text_de": "...", "text_tr": "..." }
  ],
  "comprehension": [
    { "id": "c01", "prompt_tr": "...", "options_tr": ["...", "...", "...", "..."], "correct_index": 0, "explanation_tr": "..." }
  ]
}`;

export function getDialogueSystemPrompt(level: DialogueLevel): string {
  return `Sen Prof. German Coach'sun — Almanca öğrenme hikayesi/diyalog yazıyorsun.
Seviye: ${level}. Öğrenci Türkçe konuşuyor; her satırda ZORUNLU text_tr (Türkçe çeviri).
Yanıt YALNIZCA geçerli JSON object: ${STORY_JSON_SCHEMA}
source alanı YAZMA — client ekler.
Kurallar:
- A1: Präsens, kısa cümleler, 12-16 satır, basit kelimeler
- A2: Perfekt kullan, diyalog ağırlıklı, 10-14 satır
- B1: weil/denn/deshalb, Nebensätze, 10-14 satır
- 2-3 anlama sorusu (prompt_tr ve options_tr Türkçe)
- Karakter isimleri tutarlı; kind=narration anlatıcı satırları için
- Komik veya günlük hayat tarzı olabilir`;
}

export function buildDialogueUserMessage(req: DialogueGenerateRequest): string {
  const parts = [
    `Seviye: ${req.level}`,
    req.theme ? `Tema: ${req.theme}` : "Tema: günlük hayat",
    req.style === "funny" ? "Stil: komik, hafif mizah (Junior/Papa tarzı olabilir)" : null,
    req.style === "exam" ? "Stil: sınav gerçekçi (Goethe)" : null,
    req.style === "daily" ? "Stil: günlük konuşma" : null,
    `Satır sayısı: en fazla ${req.maxLines ?? 16}`,
    `id benzersiz olsun: ai_${Date.now()}`,
    "JSON üret.",
  ];
  return parts.filter(Boolean).join("\n");
}

export function parseDialogueStory(text: string): Omit<DialogueStory, "source"> {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new SyntaxError("Invalid JSON");
  }

  const level = parsed.level;
  if (level !== "A1" && level !== "A2" && level !== "B1") {
    throw new SyntaxError("Invalid level");
  }

  const linesRaw = parsed.lines;
  if (!Array.isArray(linesRaw) || linesRaw.length < 4) {
    throw new SyntaxError("Need at least 4 lines");
  }

  const lines = linesRaw.map((raw, i) => {
    const l = raw as Record<string, unknown>;
    const text_de = typeof l.text_de === "string" ? l.text_de.trim() : "";
    const text_tr = typeof l.text_tr === "string" ? l.text_tr.trim() : "";
    if (!text_de || !text_tr) throw new SyntaxError(`Line ${i} missing text_de or text_tr`);
    return {
      id: typeof l.id === "string" ? l.id : `l${String(i + 1).padStart(2, "0")}`,
      speaker: typeof l.speaker === "string" ? l.speaker : undefined,
      kind: l.kind === "narration" ? ("narration" as const) : ("dialogue" as const),
      text_de,
      text_tr,
    };
  });

  const compRaw = parsed.comprehension;
  const comprehension = Array.isArray(compRaw)
    ? compRaw.slice(0, 3).map((raw, i) => {
        const c = raw as Record<string, unknown>;
        const options_tr = Array.isArray(c.options_tr)
          ? c.options_tr.filter((o): o is string => typeof o === "string").slice(0, 4)
          : [];
        if (options_tr.length < 2) throw new SyntaxError("Need options_tr");
        const correct_index =
          typeof c.correct_index === "number" && c.correct_index >= 0
            ? Math.min(c.correct_index, options_tr.length - 1)
            : 0;
        return {
          id: typeof c.id === "string" ? c.id : `c${String(i + 1).padStart(2, "0")}`,
          prompt_tr: typeof c.prompt_tr === "string" ? c.prompt_tr : "Soru?",
          options_tr,
          correct_index,
          explanation_tr:
            typeof c.explanation_tr === "string" ? c.explanation_tr : undefined,
        };
      })
    : [];

  return {
    id: typeof parsed.id === "string" ? parsed.id : `ai_${Date.now()}`,
    level,
    title_de: typeof parsed.title_de === "string" ? parsed.title_de : "Neue Geschichte",
    title_tr: typeof parsed.title_tr === "string" ? parsed.title_tr : "Yeni hikaye",
    theme: typeof parsed.theme === "string" ? parsed.theme : "Alltag",
    lines,
    comprehension,
  };
}

export function isValidDialogueGenerateBody(body: unknown): body is DialogueGenerateRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return b.level === "A1" || b.level === "A2" || b.level === "B1";
}
