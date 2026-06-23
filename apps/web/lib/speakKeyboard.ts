/** Türk klavyede ß/ö/ü/ä olmadan yazılan Almanca — karşılaştırma için normalize */
const REPLACEMENTS: [RegExp, string][] = [
  [/ß/g, "ss"],
  [/ä/g, "ae"],
  [/ö/g, "oe"],
  [/ü/g, "ue"],
  [/Ä/g, "Ae"],
  [/Ö/g, "Oe"],
  [/Ü/g, "Ue"],
];

export function normalizeGermanForKeyboard(text: string): string {
  let out = text.toLowerCase().trim();
  for (const [from, to] of REPLACEMENTS) {
    out = out.replace(from, to);
  }
  return out.replace(/\s+/g, " ");
}

/** İki Almanca metin klavye toleransıyla eşdeğer mi */
export function germanKeyboardEquivalent(a: string, b: string): boolean {
  return normalizeGermanForKeyboard(a) === normalizeGermanForKeyboard(b);
}

export const KEYBOARD_HINT_FOR_PROFESSOR =
  "Öğrenci Türk Q klavye kullanıyor (ß, ö, ü, ä yok). ss=ß, oe=ö, ue=ü, ae=ä yazımını HATA SAYMA; anlam ve kelime sırasına bak.";
