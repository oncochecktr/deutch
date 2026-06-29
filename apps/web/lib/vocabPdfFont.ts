import type { jsPDF } from "jspdf";

const FONT_REG = "NotoSans-Regular.ttf";
const FONT_BOLD = "NotoSans-Bold.ttf";
const FAMILY = "NotoSans";

let fontData: { reg: string; bold: string } | null = null;
let fontLoad: Promise<{ reg: string; bold: string }> | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function loadFontData(): Promise<{ reg: string; bold: string }> {
  if (fontData) return fontData;
  if (fontLoad) return fontLoad;

  fontLoad = (async () => {
    const [reg, bold] = await Promise.all([
      fetch("/fonts/NotoSans-Regular.ttf").then((r) => {
        if (!r.ok) throw new Error("NotoSans-Regular.ttf yüklenemedi");
        return r.arrayBuffer();
      }),
      fetch("/fonts/NotoSans-Bold.ttf").then((r) => {
        if (!r.ok) throw new Error("NotoSans-Bold.ttf yüklenemedi");
        return r.arrayBuffer();
      }),
    ]);
    fontData = {
      reg: arrayBufferToBase64(reg),
      bold: arrayBufferToBase64(bold),
    };
    return fontData;
  })();

  return fontLoad;
}

/** Türkçe (ı, ğ, ş, ç…) ve Almanca (ä, ö, ü, ß) için UTF-8 font */
export async function ensureVocabPdfFonts(doc: jsPDF): Promise<void> {
  const data = await loadFontData();
  doc.addFileToVFS(FONT_REG, data.reg);
  doc.addFileToVFS(FONT_BOLD, data.bold);
  doc.addFont(FONT_REG, FAMILY, "normal");
  doc.addFont(FONT_BOLD, FAMILY, "bold");
  doc.setFont(FAMILY, "normal");
}

export function pdfFontFamily(): string {
  return FAMILY;
}

export function resetVocabPdfFontCache(): void {
  fontData = null;
  fontLoad = null;
}
