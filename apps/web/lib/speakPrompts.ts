import { KEYBOARD_HINT_FOR_PROFESSOR } from "./speakKeyboard";
import { formatHintLevelForPrompt } from "./speakHintLevel";
import { formatLessonContext, type SpeakLesson } from "./speakCurriculum";
import { takeSentences } from "./speakTts";
import type {
  BoardPhase,
  SpeakInputLanguage,
  SpeakLevel,
  StudentProfileContext,
  TeachingExample,
} from "./speakTypes";

const JSON_INSTRUCTION = `
Cevabını YALNIZCA geçerli JSON formatında ver, başka metin ekleme:
{
  "reply": "Türkçe kısa yönlendirme (max 2 cümle)",
  "speakTextGerman": "Profesörün sesli okuyacağı Almanca — selamlama + ana kalıp/soru. Örn: Guten Tag Timur. Wie geht es dir?",
  "speakText": "ZORUNLU — Türkçe seslendirme: max 2 kısa konuşma cümlesi (TTS okur). Markdown/liste/uzun paragraf YASAK.",
  "boardPhase": "teach | practice | question",
  "teachingIntro": "Bugün X öğreneceğiz — Türkçe tanıtım",
  "teachingTopicGerman": "Wie geht es dir?",
  "teachingTopicTurkish": "Nasılsın?",
  "teachingExamples": [{"german": "Mir geht es gut.", "turkish": "İyiyim."}],
  "conceptIntroduced": false,
  "germanQuestion": "Tek soru — SADECE konu tanıtıldıktan sonra; yoksa null",
  "turkishTranslation": "Soru için Türkçe (toggle) — seviye 1 veya null",
  "partialHint": "Seviye 2 ipucu veya null",
  "praise": "Doğru cevapta Sehr gut! veya null",
  "correction": "Model — öğrenci denedikten sonra veya null",
  "correctionExplanation": "Hata nedeni veya null",
  "lessonNotes": ["Tahta kalıbı"],
  "assignment": "Türkçe görev veya null — SADECE okuma/not alma (expectsWrittenAnswer: false)",
  "weaknesses": ["Eksik: ..."],
  "professorAdvice": "1 cümle",
  "expectsWrittenAnswer": false,
  "stepComplete": false,
  "lessonComplete": false,
  "assessedLevel": null
}

DERS AKIŞI (ZORUNLU — A1 varsayımı: öğrenci hiçbir şey bilmiyor):

1) ÖĞRET (boardPhase: teach):
   - Yeni adım/konu → ÖNCE öğret. germanQuestion = null.
   - teachingIntro + teachingTopicGerman + teachingTopicTurkish + teachingExamples (2–4 adet).
   - Örneklerde Almanca + Türkçe birlikte (öğrenme anı).
   - conceptIntroduced: false. reply: "Not al" / "Dinle".

2) ALIŞTIRMA (boardPhase: practice):
   - Örnekler gösterildikten SONRA: reply "Şimdi deneyelim."
   - Öğrenci "hazırım", "anladım", "devam", "ok", "tamam" derse → HEMEN bu faza geç (tekrar öğretme).
   - germanQuestion = tek soru (öğrettiğin konudan).
   - turkishTranslation: seviye 1'de doldur ama öğrenci göz simgesi ile açar — reply'de Türkçe yazma.
   - conceptIntroduced: true.

3) SORU-CEVAP (boardPhase: question):
   - Öğrenci cevap verir → praise veya correction.
   - Doğru cevap → praise + stepComplete: true (+ lessonComplete: true son adımda).
   - Doğru cevapta AYNI turda yeni teach/teachingIntro/teachingExamples AÇMA — sonraki adım bir sonraki turda.
   - Yanlış → correction, stepComplete: false, tekrar sor.

YASAK:
- Konu tanıtılmadan germanQuestion sorma (stepConceptReady=false iken).
- Öğrencinin bilmediği ifadeyle karşılaştığında ÖĞRETİCİ moda geç (teach).
- Çift soru, mesleki monolog, hazır cevap verme.

DESTEK SEVİYESİ:
- Seviye 1: turkishTranslation doldur (toggle), partialHint null.
- Seviye 2: partialHint kısa, turkishTranslation null.
- Seviye 3: ikisi de null.

[YAZILI CEVAP]: klavye toleransı; doğru → praise + stepComplete mümkün.
OFFLINE GÖREV (defterine yaz, ezberle): assignment verebilirsin ama expectsWrittenAnswer=false — öğrenci "hazırım" deyince practice'e geç.
`.trim();

const CLASSROOM_CORE = `Sen gerçek bir Alman Almanca profesörüsün. A1 sınıfı — öğrenci SIFIRDAN başlıyor.

TEMEL İLKE: Önce öğret, sonra sor. Asla öğretmediğin şeyi sorarak sorma.

DOĞRU AKIŞ:
Öğret → Örnek göster (2–4) → "Şimdi deneyelim" → Tek soru → Öğrenci cevap → Düzelt/öv → Yeni konu

ÖRNEK (Wie geht es dir?):
1) "Bugün Wie geht es dir? öğreneceğiz." + örnekler: Mir geht es gut. / Sehr gut. / …
2) "Şimdi deneyelim." + tahtada soru
3) Öğrenci: Mir geht es gut.
4) Sehr gut! → sonraki konu

Öğrenci "bilmiyorum" / anlamadı / saçma cevap → tekrar öğret (teach), sabırla.

KLAVYE: ss=ß, oe=ö, ue=ü, ae=ä — hata sayma.

SESLENDİRME (ZORUNLU — A1 telaffuz):
- speakTextGerman: Her turda doldur. Öğrenci duymadan okuyamaz.
- Öğretim: selamlama + ana kalıp (teachingTopicGerman).
- Soru: soruyu Almanca sesli oku (germanQuestion ile aynı veya selamlama + soru).
- Düzeltme: correction varsa speakTextGerman = model cümle veya kısa Almanca geri bildirim.
- speakText: ZORUNLU — Türkçe, max 2 kısa cümle, konuşma dili (Edge TTS okur). reply'den kısa olmalı.
- Tahtadaki her Almanca ifade telaffuz için önemli — speakTextGerman asla boş bırakma.`;

function formatStepPhase(profile: StudentProfileContext): string {
  if (!profile.stepConceptReady) {
    return `ADIM DURUMU: Bu adım HENÜZ TANITILMADI.
→ boardPhase MUST be "teach".
→ teachingIntro + teachingExamples (en az 2) ZORUNLU.
→ germanQuestion = null, conceptIntroduced = false.
→ Öğrenci hiçbir şey bilmiyor varsay.`;
  }
  return `ADIM DURUMU: Örnekler tahtada — öğrenci hazır olabilir (stepConceptReady=true).
→ "hazırım/anladım/devam" → boardPhase: practice, germanQuestion sor, conceptIntroduced: true.
→ Öğrenci cevap verince boardPhase: question (praise/correction).
→ Öğrenci bilmediği ifadeyle karşılaşırsa tekrar boardPhase: teach.`;
}

function formatStudentProfile(profile: StudentProfileContext | null | undefined): string {
  if (!profile) return "";
  const parts: string[] = [];
  parts.push(formatStepPhase(profile));
  if (profile.weaknesses.length) {
    parts.push(`Bilinen eksikler: ${profile.weaknesses.join("; ")}`);
  }
  if (profile.currentAssignment) {
    parts.push(`Bekleyen yazılı ödev: ${profile.currentAssignment}`);
  }
  if (profile.recentNotes.length) {
    parts.push(`Son tahta notları: ${profile.recentNotes.slice(-5).join(" | ")}`);
  }
  parts.push(
    `Müfredat ilerlemesi: %${profile.levelProgressPercent} tamam, %${profile.levelRemainingPercent} kaldı.`
  );
  parts.push(`Sıradaki hedef: ${profile.nextMilestone}`);
  parts.push(formatHintLevelForPrompt(profile.hintLevel, profile.consecutiveCorrect));
  parts.push(KEYBOARD_HINT_FOR_PROFESSOR);
  return `\n\nÖĞRENCİ PROFİLİ:\n${parts.join("\n")}`;
}

export function getSpeakSystemPrompt(
  level: SpeakLevel,
  inputLanguage: SpeakInputLanguage = "de",
  lessonContext?: string | null,
  studentProfile?: StudentProfileContext | null
): string {
  const langBlock =
    inputLanguage === "tr"
      ? `\n\nÖğrenci Türkçe konuşuyor. reply Türkçe, kısa.`
      : "";
  const lessonBlock = lessonContext ? `\n\nAKTİF DERS:\n${lessonContext}` : "";
  const profileBlock = formatStudentProfile(studentProfile);
  const levelGuide =
    level === "A1"
      ? "A1: Öğrenci hiçbir şey bilmiyor. Her yeni kalıp → önce öğret+örnek, sonra sor."
      : level === "A2"
        ? "A2: Kısa tanıtım + 2 örnek, sonra soru."
        : "B1: Daha az destek, yine öğret→soru sırası.";
  return `${CLASSROOM_CORE}\n\nSeviye: ${levelGuide}${langBlock}${lessonBlock}${profileBlock}\n\n${JSON_INSTRUCTION}`;
}

export function buildLessonContext(lesson: SpeakLesson, stepIndex: number): string {
  return formatLessonContext(lesson, stepIndex);
}

export function extractJsonFromText(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

function extractGermanQuestionFromPlainText(text: string): string | null {
  const markdown = text.match(/\*([^*\n]+?\?)\*/);
  if (markdown) return markdown[1].trim();

  const quoted = text.match(/"([^"\n]+?\?)"/);
  if (quoted) return quoted[1].trim();

  const afterColon = text.match(/:\s*(\*?)([A-ZÄÖÜ][^?\n]*\?)\*?\s*$/);
  if (afterColon) return afterColon[2].trim();

  const questions = [...text.matchAll(/([A-ZÄÖÜ][a-zäöüßA-ZÄÖÜ\s,.-]{2,80}\?)/g)];
  for (let i = questions.length - 1; i >= 0; i--) {
    const q = questions[i][1].trim();
    if (/[äöüßÄÖÜ]|^(Was|Wie|Wo|Wer|Haben|Bist|Kommst|Macht|Ist|Sprechen)/i.test(q)) {
      return q;
    }
  }
  return null;
}

function parsePlainTextChatFallback(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith("{")) return null;

  const germanQuestion = extractGermanQuestionFromPlainText(trimmed);
  const praiseMatch = trimmed.match(/\b(Sehr gut!?|Gut gemacht!?|Prima!?|Ausgezeichnet!?)\b/i);
  const praise = praiseMatch ? praiseMatch[0] : null;
  const boardPhase: BoardPhase | null = germanQuestion ? "practice" : praise ? "question" : null;

  return {
    reply: trimmed,
    correction: null,
    correctionExplanation: null,
    stepComplete: false,
    lessonComplete: false,
    assessedLevel: null,
    lessonNotes: [] as string[],
    assignment: null,
    weaknesses: [] as string[],
    expectsWrittenAnswer: false,
    professorAdvice: null,
    speakText: null,
    speakTextGerman: germanQuestion,
    germanQuestion,
    turkishTranslation: null,
    partialHint: null,
    praise,
    teachingIntro: null,
    teachingTopicGerman: null,
    teachingTopicTurkish: null,
    teachingExamples: [] as TeachingExample[],
    boardPhase,
    conceptIntroduced: Boolean(germanQuestion),
  };
}

function parseStringArray(val: unknown, max = 5): string[] {
  if (!Array.isArray(val)) return [];
  return val
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((x) => x.trim())
    .slice(0, max);
}

function parseTeachingExamples(val: unknown): TeachingExample[] {
  if (!Array.isArray(val)) return [];
  return val
    .filter(
      (x): x is { german: string; turkish: string } =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as { german?: string }).german === "string" &&
        typeof (x as { turkish?: string }).turkish === "string"
    )
    .map((x) => ({ german: x.german.trim(), turkish: x.turkish.trim() }))
    .slice(0, 4);
}

function parseBoardPhase(val: unknown): BoardPhase | null {
  if (val === "teach" || val === "practice" || val === "question") return val;
  return null;
}

export function parseChatResponse(raw: string): {
  reply: string;
  correction: string | null;
  correctionExplanation: string | null;
  stepComplete: boolean;
  lessonComplete: boolean;
  assessedLevel: SpeakLevel | null;
  lessonNotes: string[];
  assignment: string | null;
  weaknesses: string[];
  expectsWrittenAnswer: boolean;
  professorAdvice: string | null;
  speakText: string | null;
  speakTextGerman: string | null;
  germanQuestion: string | null;
  turkishTranslation: string | null;
  partialHint: string | null;
  praise: string | null;
  teachingIntro: string | null;
  teachingTopicGerman: string | null;
  teachingTopicTurkish: string | null;
  teachingExamples: TeachingExample[];
  boardPhase: BoardPhase | null;
  conceptIntroduced: boolean;
} {
  const jsonStr = extractJsonFromText(raw);
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonStr) as Record<string, unknown>;
  } catch (jsonErr) {
    const fallback = parsePlainTextChatFallback(raw);
    if (fallback) return fallback;
    throw jsonErr;
  }

  const reply = typeof parsed.reply === "string" ? parsed.reply.trim() : "";
  const germanQuestion =
    typeof parsed.germanQuestion === "string" && parsed.germanQuestion.trim()
      ? parsed.germanQuestion.trim()
      : null;
  const teachingIntro =
    typeof parsed.teachingIntro === "string" && parsed.teachingIntro.trim()
      ? parsed.teachingIntro.trim()
      : null;
  if (!reply && !germanQuestion && !teachingIntro) {
    throw new Error("reply, germanQuestion veya teachingIntro gerekli");
  }

  const correction =
    typeof parsed.correction === "string" && parsed.correction.trim()
      ? parsed.correction.trim()
      : null;
  const correctionExplanation =
    typeof parsed.correctionExplanation === "string" && parsed.correctionExplanation.trim()
      ? parsed.correctionExplanation.trim()
      : null;

  const stepComplete = parsed.stepComplete === true;
  const lessonComplete = parsed.lessonComplete === true;
  const assessedLevel =
    parsed.assessedLevel === "A1" ||
    parsed.assessedLevel === "A2" ||
    parsed.assessedLevel === "B1"
      ? parsed.assessedLevel
      : null;

  const lessonNotes = parseStringArray(parsed.lessonNotes, 6);
  const weaknesses = parseStringArray(parsed.weaknesses, 5);
  const assignment =
    typeof parsed.assignment === "string" && parsed.assignment.trim()
      ? parsed.assignment.trim()
      : null;
  const expectsWrittenAnswer =
    parsed.expectsWrittenAnswer === true && Boolean(germanQuestion);
  const professorAdvice =
    typeof parsed.professorAdvice === "string" && parsed.professorAdvice.trim()
      ? parsed.professorAdvice.trim()
      : null;
  const speakText =
    typeof parsed.speakText === "string" && parsed.speakText.trim()
      ? parsed.speakText.trim()
      : takeSentences(reply || "Dinle ve not al.", 2);
  const speakTextGerman =
    typeof parsed.speakTextGerman === "string" && parsed.speakTextGerman.trim()
      ? parsed.speakTextGerman.trim()
      : null;
  const turkishTranslation =
    typeof parsed.turkishTranslation === "string" && parsed.turkishTranslation.trim()
      ? parsed.turkishTranslation.trim()
      : null;
  const partialHint =
    typeof parsed.partialHint === "string" && parsed.partialHint.trim()
      ? parsed.partialHint.trim()
      : null;
  const praise =
    typeof parsed.praise === "string" && parsed.praise.trim() ? parsed.praise.trim() : null;
  const teachingTopicGerman =
    typeof parsed.teachingTopicGerman === "string" && parsed.teachingTopicGerman.trim()
      ? parsed.teachingTopicGerman.trim()
      : null;
  const teachingTopicTurkish =
    typeof parsed.teachingTopicTurkish === "string" && parsed.teachingTopicTurkish.trim()
      ? parsed.teachingTopicTurkish.trim()
      : null;
  const teachingExamples = parseTeachingExamples(parsed.teachingExamples);
  const boardPhase = parseBoardPhase(parsed.boardPhase);
  const conceptIntroduced = parsed.conceptIntroduced === true;

  return {
    reply: reply || "Dinle ve not al.",
    correction,
    correctionExplanation,
    stepComplete,
    lessonComplete,
    assessedLevel,
    lessonNotes,
    assignment,
    weaknesses,
    expectsWrittenAnswer,
    professorAdvice,
    speakText,
    speakTextGerman,
    germanQuestion,
    turkishTranslation,
    partialHint,
    praise,
    teachingIntro,
    teachingTopicGerman,
    teachingTopicTurkish,
    teachingExamples,
    boardPhase,
    conceptIntroduced,
  };
}
