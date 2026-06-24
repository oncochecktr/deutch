import type { SentenceExercise } from "@/lib/grundlagen";

export interface SatzFeedbackInput {
  tokens: string[];
  distractors?: string[];
  answer_de: string;
  hint?: string;
  hint_tr?: string;
  explanation_tr?: string;
}

export interface SatzMistakeAnalysis {
  reasons: string[];
  ruleTr: string | null;
}

const SEIN_FORMS = new Set([
  "bin",
  "bist",
  "ist",
  "sind",
  "seid",
  "sein",
  "war",
  "waren",
  "gewesen",
]);

const HABEN_FORMS = new Set(["habe", "hast", "hat", "haben", "habt", "hatte", "hatten"]);

const MODAL_FORMS = new Set([
  "kann",
  "kannst",
  "können",
  "könnt",
  "muss",
  "musst",
  "müssen",
  "müsst",
  "will",
  "willst",
  "wollen",
  "wollt",
  "darf",
  "darfst",
  "dürfen",
  "dürft",
  "soll",
  "sollst",
  "sollen",
  "sollt",
  "mag",
  "magst",
  "mögen",
  "mögt",
]);

const PREPOSITION_HINTS: Record<string, string> = {
  aus: "«aus» eksik — köken/bulunduğun yer (-den): aus der Türkei.",
  in: "«in» eksik — bulunulan yer (-de): in Deutschland.",
  mit: "«mit» eksik — birlikte (-le): mit dem Bus.",
  nach: "«nach» eksik — yön (-e): nach Berlin.",
  von: "«von» eksik — -den / kaynak: von Ankara.",
  zu: "«zu» eksik — -e / yön: zu Hause.",
  bei: "«bei» eksik — -de / yanında: bei mir.",
  für: "«für» eksik — için: für dich.",
};

const ARTICLE_FORMS = new Set([
  "der",
  "die",
  "das",
  "den",
  "dem",
  "des",
  "ein",
  "eine",
  "einen",
  "einem",
  "einer",
  "eines",
]);

function isVerbForm(word: string): boolean {
  const w = word.toLowerCase();
  return SEIN_FORMS.has(w) || HABEN_FORMS.has(w) || MODAL_FORMS.has(w);
}

function expectedTokens(exercise: SatzFeedbackInput): string[] {
  return exercise.answer_de
    .replace(/[.!?]+$/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function countTokens(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens) {
    const key = t.toLowerCase();
    m.set(key, (m.get(key) ?? 0) + 1);
  }
  return m;
}

function verbLabel(word: string): string {
  const w = word.toLowerCase();
  if (SEIN_FORMS.has(w)) return "sein";
  if (HABEN_FORMS.has(w)) return "haben";
  if (MODAL_FORMS.has(w)) return "modal fiil";
  return "fiil";
}

/** Kısa ipucu metnini öğretici Türkçe kurala çevirir */
export function expandHintTr(hint?: string): string | null {
  if (!hint?.trim()) return null;
  const h = hint.trim();

  const seinConj = h.match(/^sein:\s*(\w+)\s*→\s*(\w+)$/i);
  if (seinConj) {
    return `sein: ${seinConj[1]} → ${seinConj[2]}. Fiil özneye göre çekimlenir ve genelde 2. sırada durur.`;
  }

  const habenConj = h.match(/^haben:\s*(\w+)\s*→\s*(\w+)$/i);
  if (habenConj) {
    return `haben: ${habenConj[1]} → ${habenConj[2]}. Fiil özneye göre çekimlenir.`;
  }

  if (/sein\s*\+\s*aus/i.test(h)) {
    return "Aus = -den/-dan (köken). sein çekimi gerekli: ich → bin, wir → sind. Fiil 2. sırada.";
  }
  if (/sein\s*\+\s*in/i.test(h)) {
    return "In = -de/-da (bulunulan yer). sein çekimi gerekli: ich → bin, wir → sind.";
  }
  if (/^sein$/i.test(h)) {
    return "sein fiili zorunlu — özneye göre çekimlenir (ich → bin, du → bist, wir → sind).";
  }
  if (/^haben$/i.test(h)) {
    return "haben fiili zorunlu — özneye göre çekimlenir (ich → habe, du → hast).";
  }

  return h;
}

export function analyzeSatzMistake(
  selected: string[],
  exercise: SatzFeedbackInput | SentenceExercise
): SatzMistakeAnalysis {
  const reasons: string[] = [];
  const hintRaw = ("hint_tr" in exercise && exercise.hint_tr) || exercise.hint;
  const expected = expectedTokens(exercise);
  const selectedNorm = selected.filter((t) => t !== ".");
  const expectedNorm = expected.filter((t) => t !== ".");

  const selectedCounts = countTokens(selectedNorm);
  const expectedCounts = countTokens(expectedNorm);

  // Eksik kelimeler
  for (const token of expectedNorm) {
    const key = token.toLowerCase();
    const need = expectedCounts.get(key) ?? 0;
    const have = selectedCounts.get(key) ?? 0;
    if (have >= need) continue;

    if (isVerbForm(token)) {
      reasons.push(
        `«${token}» eksik — ${verbLabel(token)} fiili gerekli; Almancada fiil genelde 2. sırada (V2).`
      );
    } else if (PREPOSITION_HINTS[key]) {
      reasons.push(PREPOSITION_HINTS[key]);
    } else if (ARTICLE_FORMS.has(key)) {
      reasons.push(`«${token}» eksik — artikel veya edat tamamlanmalı.`);
    } else {
      reasons.push(`«${token}» kelimesi eksik.`);
    }
  }

  // Fazla kelime (distractor veya gereksiz)
  for (const token of selectedNorm) {
    const key = token.toLowerCase();
    const have = selectedCounts.get(key) ?? 0;
    const need = expectedCounts.get(key) ?? 0;
    if (have > need) {
      reasons.push(`«${token}» burada gereksiz veya yanlış yerde.`);
    }
  }

  // Sıra kontrolü — aynı çoklu küme, farklı dizilim
  const sameMultiset =
    selectedNorm.length === expectedNorm.length &&
    reasons.filter((r) => r.includes("eksik") || r.includes("gereksiz")).length === 0;

  if (sameMultiset) {
    const sel = selectedNorm.map((t) => t.toLowerCase()).join(" ");
    const exp = expectedNorm.map((t) => t.toLowerCase()).join(" ");
    if (sel !== exp) {
      const verbIdx = expectedNorm.findIndex((t) => isVerbForm(t));
      if (verbIdx === 1) {
        reasons.push("Kelime sırası yanlış — yükleme (fiil) 2. pozisyonda olmalı (V2 kuralı).");
      } else {
        reasons.push("Kelime sırası yanlış — doğru cümleyi referans alarak tekrar dene.");
      }
    }
  }

  if (exercise.explanation_tr) {
    reasons.unshift(exercise.explanation_tr);
  }

  const unique = [...new Set(reasons)].slice(0, 4);
  const ruleTr = expandHintTr(hintRaw);

  if (unique.length === 0 && !ruleTr) {
    unique.push("Cümle doğru cümleyle eşleşmiyor — kelime sırası ve fiil çekimini kontrol et.");
  }

  return {
    reasons: unique,
    ruleTr,
  };
}
