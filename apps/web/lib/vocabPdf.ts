import {
  getA1Vocabulary,
  getA2Vocabulary,
  getTimurVocabulary,
  type VocabularyWord,
} from "@german-coach/vocabulary";
import { jsPDF } from "jspdf";
import { ensureVocabPdfFonts, pdfFontFamily } from "@/lib/vocabPdfFont";

export type VocabPdfPack = "a1" | "a2" | "all" | "mesleki";

export interface VocabPdfOptions {
  pack: VocabPdfPack;
  category: string | null;
  includeExamples: boolean;
}

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const GAP = 6;
const COL_W = (PAGE_W - MARGIN * 2 - GAP) / 2;
const LEFT_X = MARGIN;
const RIGHT_X = MARGIN + COL_W + GAP;
const FOOTER_Y = PAGE_H - 10;
const FONT = () => pdfFontFamily();

export function packLabel(pack: VocabPdfPack): string {
  switch (pack) {
    case "a1":
      return "A1";
    case "a2":
      return "A2";
    case "all":
      return "A1 + A2";
    case "mesleki":
      return "Mesleki";
  }
}

export function getWordsForPdf(options: VocabPdfOptions): VocabularyWord[] {
  let words: VocabularyWord[] = [];
  if (options.pack === "a1") words = [...getA1Vocabulary().words];
  else if (options.pack === "a2") words = [...getA2Vocabulary().words];
  else if (options.pack === "mesleki") words = [...getTimurVocabulary().words];
  else words = [...getA1Vocabulary().words, ...getA2Vocabulary().words];

  if (options.category) {
    words = words.filter((w) => w.category === options.category);
  }

  return words;
}

export function displayGerman(w: VocabularyWord): string {
  return w.article ? `${w.article} ${w.word}` : w.word;
}

export function pdfFileName(options: VocabPdfOptions): string {
  const base = `german-coach-${options.pack}`;
  if (options.category) {
    const slug = options.category
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/gi, "");
    return `${base}-${slug}.pdf`;
  }
  return `${base}-kelimeler.pdf`;
}

function ensureSpace(doc: jsPDF, y: number, need: number): number {
  if (y + need > PAGE_H - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

export async function buildVocabPdf(
  words: VocabularyWord[],
  options: VocabPdfOptions
): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  await ensureVocabPdfFonts(doc);

  const title = options.category
    ? `${packLabel(options.pack)} · ${options.category}`
    : `${packLabel(options.pack)} kelimeler`;

  let y = MARGIN;
  let lastCategory: string | null = null;

  const drawHeader = () => {
    doc.setFont(FONT(), "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 95);
    doc.text(title, MARGIN, y);
    y += 7;
    doc.setFont(FONT(), "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Sol: Almanca oku · Sağ: Türkçe anlam", LEFT_X, y);
    doc.text(`${words.length} kelime`, RIGHT_X + COL_W, y, { align: "right" });
    y += 5;
    doc.setDrawColor(210);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 6;
    doc.setTextColor(0);
  };

  drawHeader();

  for (const w of words) {
    if (!options.category && w.category !== lastCategory) {
      lastCategory = w.category;
      const catBlock = 10;
      y = ensureSpace(doc, y, catBlock);
      doc.setFont(FONT(), "bold");
      doc.setFontSize(10);
      doc.setTextColor(90, 120, 90);
      doc.text(w.category, MARGIN, y);
      y += 5;
      doc.setTextColor(0);
    }

    const deHead = displayGerman(w);
    const trHead = w.translation_tr;
    const deEx = w.example_de;
    const trEx = w.example_tr;

    doc.setFont(FONT(), "bold");
    doc.setFontSize(13);
    const deHeadLines = doc.splitTextToSize(deHead, COL_W);
    doc.setFont(FONT(), "normal");
    doc.setFontSize(12);
    const trHeadLines = doc.splitTextToSize(trHead, COL_W);

    let deExLines: string[] = [];
    let trExLines: string[] = [];
    if (options.includeExamples) {
      doc.setFontSize(9.5);
      deExLines = doc.splitTextToSize(deEx, COL_W);
      trExLines = doc.splitTextToSize(trEx, COL_W);
    }

    const headRows = Math.max(deHeadLines.length, trHeadLines.length);
    const exRows = options.includeExamples
      ? Math.max(deExLines.length, trExLines.length)
      : 0;
    const blockH = headRows * 5.5 + (options.includeExamples ? 2 + exRows * 4.2 : 0) + 5;
    y = ensureSpace(doc, y, blockH);

    doc.setFont(FONT(), "bold");
    doc.setFontSize(13);
    doc.text(deHeadLines, LEFT_X, y);
    doc.setFont(FONT(), "normal");
    doc.setFontSize(12);
    doc.text(trHeadLines, RIGHT_X, y);
    y += headRows * 5.5;

    if (options.includeExamples) {
      y += 1.5;
      doc.setFontSize(9.5);
      doc.setTextColor(70);
      doc.text(deExLines, LEFT_X, y);
      doc.text(trExLines, RIGHT_X, y);
      y += exRows * 4.2;
      doc.setTextColor(0);
    }

    doc.setDrawColor(225);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(MARGIN, y + 1.5, PAGE_W - MARGIN, y + 1.5);
    doc.setLineDashPattern([], 0);
    y += 5;
  }

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont(FONT(), "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(`German Coach · ${title}`, MARGIN, FOOTER_Y);
    doc.text(`${p} / ${totalPages}`, PAGE_W - MARGIN, FOOTER_Y, { align: "right" });
    doc.setTextColor(0);
  }

  return doc;
}

export async function downloadVocabPdf(
  words: VocabularyWord[],
  options: VocabPdfOptions
): Promise<void> {
  const doc = await buildVocabPdf(words, options);
  doc.save(pdfFileName(options));
}

/** Yedek: HTML önizlemeden (font yüklenemezse) */
export async function downloadVocabPdfFromHtml(
  element: HTMLElement,
  options: VocabPdfOptions
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  await new Promise<void>((resolve, reject) => {
    doc.html(element, {
      callback: (d) => {
        try {
          d.save(pdfFileName(options));
          resolve();
        } catch (e) {
          reject(e);
        }
      },
      margin: [10, 10, 12, 10],
      autoPaging: "text",
      width: 190,
      windowWidth: 920,
      html2canvas: { scale: 0.92, useCORS: true },
    });
  });
}
