/** Goethe A1 Schreiben — Mektup (Brief) örnekleri — PDF kaynaklı */

export const MEKTUP_EXAM_INFO = {
  title: "Teil 2: Brief / E-Mail",
  duration: "Schreiben bölümü ~20 dk — form + mektup",
  rules: [
    {
      title: "3 soruya cevap ver",
      text: "Üstte kısa metin ve madde işaretli sorular var. Hepsine mektupta cevap yaz.",
    },
    {
      title: "Neden yazıyorsun?",
      text: "ich schreibe …, weil … veya önce neden + Deshalb schreibe ich …. Tek başına «Deshalb schreibe ich» yetmez.",
    },
    {
      title: "Resmi / samimi selamlama",
      text: "Arkadaşa: Liebe … / lieber … · Kuruma: Sehr geehrte Damen und Herren, · Tek kişi: Sehr geehrter Herr …",
    },
    {
      title: "Kapanış paketi",
      text: "Ich bitte um eine Antwort. + Vielen Dank im Voraus. + Mit freundlichen Grüßen / Viele Grüße + adın",
    },
  ],
};

export interface MektupSection {
  id: string;
  labelDe: string;
  labelTr: string;
  hintTr: string;
  placeholder: string;
  phrases: { de: string; tr: string }[];
}

export interface MektupBullet {
  de: string;
  tr: string;
  /** Tam mektupta aranacak ipuçları (küçük harf) */
  hints: string[];
}

export interface MektupExample {
  id: string;
  titleTr: string;
  promptDe: string;
  promptTr: string;
  bullets: MektupBullet[];
  sections: MektupSection[];
  sampleLetter: string;
  minWords: number;
}

const CLOSING_PHRASES: MektupSection["phrases"] = [
  { de: "Ich bitte um eine Antwort.", tr: "Lütfen cevap yazın." },
  { de: "Vielen Dank im Voraus.", tr: "Şimdiden teşekkürler." },
];

export const MEKTUP_EXAMPLES: MektupExample[] = [
  {
    id: "mektup_001",
    titleTr: "Doğum günü daveti (arkadaşlar)",
    promptDe:
      "Sie möchten Ihren Geburtstag feiern und Ihre Freunde Susanne und Paul einladen. Schreiben Sie an Susanne und Paul:",
    promptTr: "Doğum gününü kutlamak istiyorsunuz. Arkadaşlarınız Susanne ve Paul’u davet edin.",
    bullets: [
      { de: "Warum schreiben Sie?", tr: "Neden yazıyorsunuz?", hints: ["deshalb", "geburtstag", "einlad"] },
      { de: "Tag und Uhrzeit?", tr: "Gün ve saat?", hints: ["sonntag", "uhr", "19"] },
      { de: "Kommen: Wie?", tr: "Kaç kişi geliyor?", hints: ["person", "fünf", "5"] },
    ],
    sections: [
      {
        id: "anrede",
        labelDe: "Anrede",
        labelTr: "Hitap / selamlama",
        hintTr: "Samimi: Liebe … und lieber … (kız + erkek arkadaş)",
        placeholder: "Liebe Susanne und lieber Paul,",
        phrases: [
          { de: "Liebe Susanne und lieber Paul,", tr: "Sevgili Susanne ve sevgili Paul," },
        ],
      },
      {
        id: "grund",
        labelDe: "Grund",
        labelTr: "Neden yazıyorsunuz?",
        hintTr: "Ne istediğin + Deshalb schreibe ich euch.",
        placeholder: "ich möchte meinen Geburtstag feiern und euch einladen. Deshalb schreibe ich euch.",
        phrases: [
          {
            de: "ich möchte meinen Geburtstag feiern und euch einladen.",
            tr: "Doğum günümü kutlamak ve sizi davet etmek istiyorum.",
          },
          { de: "Deshalb schreibe ich euch.", tr: "Bu yüzden size yazıyorum." },
        ],
      },
      {
        id: "inhalt",
        labelDe: "Inhalt",
        labelTr: "Detaylar (tarih, saat, kişi sayısı)",
        hintTr: "am … um … Uhr · im Cafe … · mit … Personen",
        placeholder: "Die Party ist am Sonntag um 19 Uhr im Cafe Rosinante. Wir kommen mit fünf Personen.",
        phrases: [
          { de: "Die Party ist am Sonntag um 19 Uhr im Cafe Rosinante.", tr: "Parti Pazar 19:00’da Cafe Rosinante’de." },
          { de: "Wir kommen mit fünf Personen.", tr: "Beş kişi geliyoruz." },
        ],
      },
      {
        id: "schluss",
        labelDe: "Bitte & Danke",
        labelTr: "Kapanış cümleleri",
        hintTr: "Her resmi mektupta bu iki cümle olmalı.",
        placeholder: "Ich bitte um eine Antwort.\nVielen Dank im Voraus.",
        phrases: CLOSING_PHRASES,
      },
      {
        id: "gruss",
        labelDe: "Gruß & Name",
        labelTr: "İmza satırı",
        hintTr: "Arkadaşa: Viele Grüße + adın",
        placeholder: "Viele Grüße\nTimur",
        phrases: [
          { de: "Viele Grüße", tr: "Sevgiler" },
          { de: "Timur", tr: "(kendi adını yaz)" },
        ],
      },
    ],
    sampleLetter: `Liebe Susanne und lieber Paul,
ich möchte meinen Geburtstag feiern und euch einladen. Deshalb schreibe ich euch.
Die Party ist am Sonntag um 19 Uhr im Cafe Rosinante.
Wir kommen mit fünf Personen.
Ich bitte um eine Antwort.
Vielen Dank im Voraus.
Viele Grüße
Timur`,
    minWords: 30,
  },
  {
    id: "mektup_002",
    titleTr: "Almanca kursu bilgisi (resmi)",
    promptDe: "Sie möchten im Juli einen Deutschkurs machen. Schreiben Sie:",
    promptTr: "Temmuz’da Almanca kursu almak istiyorsunuz. Kuruma yazın.",
    bullets: [
      { de: "Warum?", tr: "Neden?", hints: ["deshalb", "deutschkurs", "juli"] },
      { de: "Fragen: Uhrzeit?", tr: "Saat bilgisi sor", hints: ["uhrzeit", "information"] },
      { de: "Wann: Prüfung?", tr: "Sınav ne zaman?", hints: ["prüfung", "wann"] },
    ],
    sections: [
      {
        id: "anrede",
        labelDe: "Anrede",
        labelTr: "Resmi selamlama",
        hintTr: "Kurum / okul: Sehr geehrte Damen und Herren,",
        placeholder: "Sehr geehrte Damen und Herren,",
        phrases: [{ de: "Sehr geehrte Damen und Herren,", tr: "Sayın Bayanlar, Sayın Baylar," }],
      },
      {
        id: "grund",
        labelDe: "Grund",
        labelTr: "Neden yazıyorsunuz?",
        hintTr: "ich möchte … Deshalb schreibe ich Ihnen.",
        placeholder: "ich möchte im Juli einen Deutschkurs machen. Deshalb schreibe ich Ihnen.",
        phrases: [
          { de: "ich möchte im Juli einen Deutschkurs machen.", tr: "Temmuz’da Almanca kursu almak istiyorum." },
          { de: "Deshalb schreibe ich Ihnen.", tr: "Bu yüzden size yazıyorum." },
        ],
      },
      {
        id: "inhalt",
        labelDe: "Fragen",
        labelTr: "Sorularınız",
        hintTr: "Können Sie mir bitte Informationen über … geben?",
        placeholder: "Können Sie mir bitte Informationen über die Uhrzeit geben?\nWann ist die Prüfung?",
        phrases: [
          {
            de: "Können Sie mir bitte Informationen über die Uhrzeit geben?",
            tr: "Saat bilgisi verir misiniz?",
          },
          { de: "Wann ist die Prüfung?", tr: "Sınav ne zaman?" },
        ],
      },
      {
        id: "schluss",
        labelDe: "Bitte & Danke",
        labelTr: "Kapanış",
        hintTr: "Standart iki cümle",
        placeholder: "Ich bitte um eine Antwort.\nVielen Dank im Voraus.",
        phrases: CLOSING_PHRASES,
      },
      {
        id: "gruss",
        labelDe: "Gruß & Name",
        labelTr: "Resmi imza",
        hintTr: "Mit freundlichen Grüßen + ad soyad",
        placeholder: "Mit freundlichen Grüßen\nTimur Yilmaz",
        phrases: [
          { de: "Mit freundlichen Grüßen", tr: "Saygılarımla" },
          { de: "Timur Yilmaz", tr: "(ad soyad)" },
        ],
      },
    ],
    sampleLetter: `Sehr geehrte Damen und Herren,
ich möchte im Juli einen Deutschkurs machen. Deshalb schreibe ich Ihnen.
Können Sie mir bitte Informationen über die Uhrzeit geben?
Wann ist die Prüfung?
Ich bitte um eine Antwort.
Vielen Dank im Voraus.
Mit freundlichen Grüßen
Timur Yilmaz`,
    minWords: 30,
  },
  {
    id: "mektup_003",
    titleTr: "Otel — Köln (park + kahvaltı)",
    promptDe:
      "Sie wollen mit dem Auto nach Köln fahren und in einem Hotel bleiben. Schreiben Sie ans Hotel:",
    promptTr: "Arabayla Köln’e gidip otelde kalacaksınız. Otele yazın.",
    bullets: [
      { de: "Warum?", tr: "Neden?", hints: ["deshalb", "köln", "hotel", "auto"] },
      { de: "Parkplatz und Frühstück?", tr: "Otopark ve kahvaltı sor", hints: ["parkplatz", "frühstück"] },
      { de: "Wie viele Personen?", tr: "Kaç kişi?", hints: ["person", "fünf"] },
    ],
    sections: [
      {
        id: "anrede",
        labelDe: "Anrede",
        labelTr: "Resmi selamlama",
        hintTr: "Otel / firma: Sehr geehrte Damen und Herren,",
        placeholder: "Sehr geehrte Damen und Herren,",
        phrases: [{ de: "Sehr geehrte Damen und Herren,", tr: "Sayın yetkililer," }],
      },
      {
        id: "grund",
        labelDe: "Grund",
        labelTr: "Neden yazıyorsunuz?",
        hintTr: "Auto + Köln + Hotel + Deshalb…",
        placeholder:
          "ich will mit dem Auto nach Köln fahren und in einem Hotel bleiben. Deshalb schreibe ich Ihnen.",
        phrases: [
          {
            de: "ich will mit dem Auto nach Köln fahren und in einem Hotel bleiben.",
            tr: "Arabayla Köln’e gidip otelde kalacağım.",
          },
          { de: "Deshalb schreibe ich Ihnen.", tr: "Bu yüzden yazıyorum." },
        ],
      },
      {
        id: "inhalt",
        labelDe: "Fragen & Personen",
        labelTr: "Sorular + kişi sayısı",
        hintTr: "Informationen über Parkplatz und Frühstück",
        placeholder:
          "Können Sie mir bitte Informationen über einen Parkplatz und das Frühstück geben? Wir kommen mit fünf Personen.",
        phrases: [
          {
            de: "Können Sie mir bitte Informationen über einen Parkplatz und das Frühstück geben?",
            tr: "Otopark ve kahvaltı hakkında bilgi verir misiniz?",
          },
          { de: "Wir kommen mit fünf Personen.", tr: "Beş kişiyiz." },
        ],
      },
      {
        id: "schluss",
        labelDe: "Bitte & Danke",
        labelTr: "Kapanış",
        hintTr: "Standart kapanış",
        placeholder: "Ich bitte um eine Antwort.\nVielen Dank im Voraus.",
        phrases: CLOSING_PHRASES,
      },
      {
        id: "gruss",
        labelDe: "Gruß & Name",
        labelTr: "İmza",
        hintTr: "Mit freundlichen Grüßen",
        placeholder: "Mit freundlichen Grüßen\nTimur Yilmaz",
        phrases: [{ de: "Mit freundlichen Grüßen", tr: "Saygılarımla" }],
      },
    ],
    sampleLetter: `Sehr geehrte Damen und Herren,
ich will mit dem Auto nach Köln fahren und in einem Hotel bleiben. Deshalb schreibe ich Ihnen.
Können Sie mir bitte Informationen über einen Parkplatz und das Frühstück geben?
Wir kommen mit fünf Personen.
Ich bitte um eine Antwort.
Vielen Dank im Voraus.
Mit freundlichen Grüßen
Timur Yilmaz`,
    minWords: 30,
  },
  {
    id: "mektup_004",
    titleTr: "Taşınma — arkadaşa (Marianne)",
    promptDe:
      "Sie haben eine neue Wohnung und ziehen bald um. Schreiben Sie an Ihre Freundin Marianne:",
    promptTr: "Yeni daireniz var, yakında taşınıyorsunuz. Arkadaşınız Marianne’ye yazın.",
    bullets: [
      { de: "Warum?", tr: "Neden?", hints: ["deshalb", "wohnung", "ziehe"] },
      { de: "Wohin?", tr: "Nereye taşınıyorsun?", hints: ["berlin", "nach"] },
      { de: "Fragen: Möbel?", tr: "Mobilya sorusu", hints: ["möbel", "kauf"] },
    ],
    sections: [
      {
        id: "anrede",
        labelDe: "Anrede",
        labelTr: "Samimi hitap",
        hintTr: "Tek kadın arkadaş: Liebe Marianne,",
        placeholder: "Liebe Marianne,",
        phrases: [{ de: "Liebe Marianne,", tr: "Sevgili Marianne," }],
      },
      {
        id: "grund",
        labelDe: "Grund",
        labelTr: "Neden yazıyorsunuz?",
        hintTr: "neue Wohnung + umziehen + Deshalb schreibe ich dir",
        placeholder: "ich habe eine neue Wohnung und ziehe bald um. Deshalb schreibe ich dir.",
        phrases: [
          {
            de: "ich habe eine neue Wohnung und ziehe bald um.",
            tr: "Yeni bir dairem var, yakında taşınıyorum.",
          },
          { de: "Deshalb schreibe ich dir.", tr: "Bu yüzden sana yazıyorum." },
        ],
      },
      {
        id: "inhalt",
        labelDe: "Inhalt",
        labelTr: "Nereye + mobilya sorusu",
        hintTr: "Ich ziehe nach … um. Wo kann ich … kaufen?",
        placeholder:
          "Ich ziehe nach Berlin um. Ich brauche neue Möbel. Wo kann ich Möbel kaufen?",
        phrases: [
          { de: "Ich ziehe nach Berlin um.", tr: "Berlin’e taşınıyorum." },
          { de: "Ich brauche neue Möbel.", tr: "Yeni mobilyaya ihtiyacım var." },
          { de: "Wo kann ich Möbel kaufen?", tr: "Mobilyayı nereden alabilirim?" },
        ],
      },
      {
        id: "schluss",
        labelDe: "Bitte & Danke",
        labelTr: "Kapanış",
        hintTr: "PDF’te tek paragrafta da olabilir",
        placeholder: "Ich bitte um eine Antwort.\nVielen Dank im Voraus.",
        phrases: CLOSING_PHRASES,
      },
      {
        id: "gruss",
        labelDe: "Gruß & Name",
        labelTr: "İmza",
        hintTr: "Viele Grüße",
        placeholder: "Viele Grüße\nTimur",
        phrases: [{ de: "Viele Grüße", tr: "Sevgiler" }],
      },
    ],
    sampleLetter: `Liebe Marianne,
ich habe eine neue Wohnung und ziehe bald um. Deshalb schreibe ich dir.
Ich ziehe nach Berlin um. Ich brauche neue Möbel. Wo kann ich Möbel kaufen?
Ich bitte um eine Antwort.
Vielen Dank im Voraus.
Viele Grüße
Timur`,
    minWords: 30,
  },
  {
    id: "mektup_005",
    titleTr: "İlan — dolap satıcısı (Mark Tepper)",
    promptDe:
      "Sie suchen einen Schrank. Sie lesen eine Anzeige im Internet. Schreiben Sie an den Verkäufer Mark Tepper:",
    promptTr: "Dolap arıyorsunuz, internet ilanı okudunuz. Satıcı Mark Tepper’e yazın.",
    bullets: [
      { de: "Warum?", tr: "Neden?", hints: ["deshalb", "schrank", "anzeige"] },
      { de: "Preis?", tr: "Fiyat sor", hints: ["preis", "kostet"] },
      { de: "Wann abholen?", tr: "Ne zaman alırsın?", hints: ["abhol", "wann"] },
    ],
    sections: [
      {
        id: "anrede",
        labelDe: "Anrede",
        labelTr: "Erkek kişiye resmi hitap",
        hintTr: "Sehr geehrter Herr Tepper, (der Herr → geehrter)",
        placeholder: "Sehr geehrter Herr Tepper,",
        phrases: [{ de: "Sehr geehrter Herr Tepper,", tr: "Sayın Bay Tepper," }],
      },
      {
        id: "grund",
        labelDe: "Grund",
        labelTr: "Neden yazıyorsunuz?",
        hintTr: "Schrank + Anzeige + Deshalb…",
        placeholder:
          "ich suche einen Schrank. Ich lese eine Anzeige im Internet. Deshalb schreibe ich Ihnen.",
        phrases: [
          { de: "ich suche einen Schrank.", tr: "Bir dolap arıyorum." },
          { de: "Ich lese eine Anzeige im Internet.", tr: "İnternette bir ilan okuyorum." },
          { de: "Deshalb schreibe ich Ihnen.", tr: "Bu yüzden size yazıyorum." },
        ],
      },
      {
        id: "inhalt",
        labelDe: "Fragen",
        labelTr: "Fiyat + teslim alma",
        hintTr: "Preis · Wann abholen?",
        placeholder:
          "Können Sie mir bitte Informationen über den Preis geben? Wann kann ich den Schrank abholen?",
        phrases: [
          {
            de: "Können Sie mir bitte Informationen über den Preis geben?",
            tr: "Fiyat bilgisi verir misiniz?",
          },
          { de: "Wie viel kostet der Schrank?", tr: "Dolap ne kadar?" },
          { de: "Wann kann ich den Schrank abholen?", tr: "Dolabı ne zaman alabilirim?" },
        ],
      },
      {
        id: "schluss",
        labelDe: "Bitte & Danke",
        labelTr: "Kapanış",
        hintTr: "Standart",
        placeholder: "Ich bitte um eine Antwort.\nVielen Dank im Voraus.",
        phrases: CLOSING_PHRASES,
      },
      {
        id: "gruss",
        labelDe: "Gruß & Name",
        labelTr: "İmza",
        hintTr: "Resmi kapanış",
        placeholder: "Mit freundlichen Grüßen\nTimur Yilmaz",
        phrases: [{ de: "Mit freundlichen Grüßen", tr: "Saygılarımla" }],
      },
    ],
    sampleLetter: `Sehr geehrter Herr Tepper,
ich suche einen Schrank. Ich lese eine Anzeige im Internet. Deshalb schreibe ich Ihnen.
Können Sie mir bitte Informationen über den Preis geben?
Wann kann ich den Schrank abholen?
Ich bitte um eine Antwort.
Vielen Dank im Voraus.
Mit freundlichen Grüßen
Timur Yilmaz`,
    minWords: 30,
  },
];

export function buildFullLetter(
  example: MektupExample,
  parts: Record<string, string>
): string {
  return example.sections
    .map((s) => (parts[s.id] ?? "").trim())
    .filter(Boolean)
    .join("\n");
}

export function countWords(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export function checkBullet(text: string, bullet: MektupBullet): boolean {
  const lower = text.toLowerCase();
  return bullet.hints.some((h) => lower.includes(h));
}

export function checkStructure(text: string): { ok: boolean; missing: string[] } {
  const lower = text.toLowerCase();
  const hasWeilOpening = lower.includes("weil") && /schreibe (ich|ihnen|dir|euch)/.test(lower);
  const deshalbIdx = lower.indexOf("deshalb");
  const hasDeshalbWithReason =
    deshalbIdx > 0 &&
    lower.includes("schreibe ich") &&
    lower.slice(0, deshalbIdx).includes(".");
  const hasWhy = hasWeilOpening || hasDeshalbWithReason;
  const missing: string[] = [];
  if (!hasWhy) {
    missing.push("Neden (ich schreibe …, weil … veya … . Deshalb schreibe ich …)");
  }
  if (!lower.includes("bitte um eine antwort")) {
    missing.push("Ich bitte um eine Antwort.");
  }
  if (!lower.includes("vielen dank im voraus")) {
    missing.push("Vielen Dank im Voraus.");
  }
  return { ok: missing.length === 0, missing };
}
