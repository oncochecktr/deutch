export type DialogueLevel = "A1" | "A2" | "B1";

export type DialogueLineKind = "dialogue" | "narration";

export interface DialogueLine {
  id: string;
  speaker?: string;
  kind: DialogueLineKind;
  text_de: string;
  text_tr: string;
  /** Önceden üretilmiş Almanca MP3 (hikaye dinle) */
  audio_de?: string;
  /** Önceden üretilmiş Türkçe MP3 — kadın ses */
  audio_tr?: string;
}

export interface DialogueComprehension {
  id: string;
  prompt_tr: string;
  options_tr: string[];
  correct_index: number;
  explanation_tr?: string;
}

export interface DialogueStory {
  id: string;
  level: DialogueLevel;
  title_de: string;
  title_tr: string;
  theme: string;
  lines: DialogueLine[];
  comprehension: DialogueComprehension[];
  source: "seed" | "ai";
  createdAt?: string;
  readCount?: number;
}

export type DialogueStyle = "funny" | "daily" | "exam";

export interface DialogueGenerateRequest {
  level: DialogueLevel;
  theme?: string;
  style?: DialogueStyle;
  maxLines?: number;
}
