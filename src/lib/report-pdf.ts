import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { SITE } from "@/data/catalog";
import type { ReportData } from "@/lib/reports";

const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;
const MARGIN = 32;
const INK = rgb(0.11, 0.098, 0.09);
const MUTED = rgb(0.42, 0.396, 0.376);
const LINE = rgb(0.831, 0.812, 0.769);
const MOSS = rgb(0.239, 0.353, 0.298);
const SOFT = rgb(0.953, 0.945, 0.925);

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

async function embedLogo(pdf: PDFDocument) {
  try {
    const bytes = await readFile(path.join(process.cwd(), "public", "images", "logo.jpg"));
    return await pdf.embedJpg(bytes);
  } catch {
    return null;
  }
}

export async function generateReportPdf(report: ReportData) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await embedLogo(pdf);
  const tableWidth = PAGE_WIDTH - MARGIN * 2;
  const totalUnits = report.columns.reduce((sum, column) => sum + column.width, 0);
  const columns = report.columns.map((column) => ({
    ...column,
    xWidth: (column.width / totalUnits) * tableWidth,
  }));
  const generated = new Date().toLocaleDateString("en-ZA");

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;
  let pageNumber = 1;

  const drawHeader = () => {
    const logoSize = 22;
    const titleX = logo ? MARGIN + logoSize + 8 : MARGIN;
    if (logo) {
      const fitted = logo.scaleToFit(logoSize, logoSize);
      page.drawImage(logo, {
        x: MARGIN,
        y: y - 6,
        width: fitted.width,
        height: fitted.height,
      });
    }
    page.drawText(SITE.name.toUpperCase(), { x: titleX, y, size: 11, font: bold, color: MOSS });
    const pageLabel = `Page ${pageNumber}`;
    page.drawText(pageLabel, {
      x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(pageLabel, 9),
      y,
      size: 9,
      font,
      color: MUTED,
    });
    y -= 16;
    page.drawText(report.title, { x: MARGIN, y, size: 16, font: bold, color: INK });
    page.drawText(`Generated ${generated}`, {
      x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(`Generated ${generated}`, 9),
      y,
      size: 9,
      font,
      color: MUTED,
    });
    y -= 18;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 1,
      color: LINE,
    });
    y -= 16;
  };

  const drawTableHeader = () => {
    page.drawRectangle({
      x: MARGIN,
      y: y - 12,
      width: tableWidth,
      height: 20,
      color: SOFT,
    });
    let x = MARGIN + 4;
    columns.forEach((column) => {
      page.drawText(column.label.toUpperCase(), {
        x,
        y: y - 6,
        size: 7,
        font: bold,
        color: MUTED,
      });
      x += column.xWidth;
    });
    y -= 22;
  };

  const addPage = () => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pageNumber += 1;
    y = PAGE_HEIGHT - MARGIN;
    drawHeader();
    drawTableHeader();
  };

  drawHeader();
  drawTableHeader();

  if (!report.rows.length) {
    page.drawText("No records for this report.", { x: MARGIN, y, size: 10, font, color: MUTED });
    return pdf.save();
  }

  for (const row of report.rows) {
    const wrapped = columns.map((column) =>
      wrapText(row[column.key] ?? "", font, 8, column.xWidth - 8),
    );
    const rowHeight = Math.max(16, ...wrapped.map((lines) => lines.length * 10 + 6));
    if (y - rowHeight < MARGIN + 20) addPage();

    let x = MARGIN + 4;
    columns.forEach((column, index) => {
      wrapped[index].forEach((line, lineIndex) => {
        const textWidth = font.widthOfTextAtSize(line, 8);
        const textX =
          column.align === "right" ? x + column.xWidth - 12 - textWidth : x;
        page.drawText(line, {
          x: textX,
          y: y - 8 - lineIndex * 10,
          size: 8,
          font,
          color: INK,
        });
      });
      x += column.xWidth;
    });
    y -= rowHeight;
    page.drawLine({
      start: { x: MARGIN, y: y + 2 },
      end: { x: PAGE_WIDTH - MARGIN, y: y + 2 },
      thickness: 0.4,
      color: LINE,
    });
  }

  return pdf.save();
}
