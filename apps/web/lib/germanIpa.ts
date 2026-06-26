/**
 * Basit Almanca → IPA yaklaşımı (dinamik cümleler için yedek).
 * Kalıcı kartlarda el ile yazılmış IPA tercih edilir.
 */
export function approxGermanIpa(text: string): string {
  let s = text.trim().replace(/\.$/, "").toLowerCase();
  const rules: [RegExp, string][] = [
    [/sch/g, "ʃ"],
    [/ch/g, "x"],
    [/tsch/g, "tʃ"],
    [/ei/g, "aɪ"],
    [/ie/g, "iː"],
    [/eu/g, "ɔɪ"],
    [/äu/g, "ɔɪ"],
    [/au/g, "aʊ"],
    [/ö/g, "ø"],
    [/ü/g, "y"],
    [/ä/g, "ɛ"],
    [/ß/g, "s"],
    [/ph/g, "f"],
    [/tion/g, "tsjoːn"],
    [/ung\b/g, "ʊŋ"],
    [/lich\b/g, "lɪç"],
    [/keit\b/g, "kaɪt"],
    [/en\b/g, "ən"],
    [/er\b/g, "ɐ"],
    [/st\b/g, "st"],
    [/nd\b/g, "nt"],
    [/ng\b/g, "ŋ"],
    [/w/g, "v"],
    [/v/g, "f"],
    [/z/g, "ts"],
    [/j/g, "j"],
    [/qu/g, "kv"],
  ];
  for (const [re, rep] of rules) {
    s = s.replace(re, rep);
  }
  return `[${s}]`;
}
