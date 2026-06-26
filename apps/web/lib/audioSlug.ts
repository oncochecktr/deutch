/** Almanca metin → MP3 dosya adı (scripts/generate-audio ile uyumlu) */
export function germanAudioSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * MP3 yolu söylenen metinle uyumlu mu?
 * Eski hata: slug(word.split(" ")[0]) → "Guten Morgen" ve "Guten Appetit" aynı guten.mp3
 */
export function audioPathMatchesText(audioSrc: string, text: string): boolean {
  const file =
    audioSrc
      .split("/")
      .pop()
      ?.replace(/\.mp3$/i, "") ?? "";
  const slug = germanAudioSlug(text.trim());
  if (!file || !slug) return false;
  if (file === slug) return true;

  const withoutArticle = text.trim().replace(/^(der|die|das|ein|eine)\s+/i, "");
  if (withoutArticle !== text.trim() && germanAudioSlug(withoutArticle) === file) {
    return true;
  }

  // Kısaltılmış paylaşımlı dosya (guten.mp3 ≠ guten-morgen) → reddet
  const fileSegs = file.split("-").filter(Boolean);
  const slugSegs = slug.split("-").filter(Boolean);
  if (slugSegs.length > fileSegs.length) return false;
  return slug.startsWith(`${file}-`) || file.startsWith(`${slug}-`);
}

export function expectedWordAudioPath(text: string): string {
  return `/audio/a1/${germanAudioSlug(text)}.mp3`;
}
