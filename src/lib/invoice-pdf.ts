import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";
import { INVOICE_COMPANY, resolveInvoiceItems, type StaffInvoice } from "@/data/staff-invoices";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const INK = rgb(0.11, 0.098, 0.09);
const MUTED = rgb(0.42, 0.396, 0.376);
const LINE = rgb(0.831, 0.812, 0.769);
const MOSS = rgb(0.239, 0.353, 0.298);
const SOFT = rgb(0.953, 0.945, 0.925);

function moneyLabel(value: number) {
  return `R ${value.toFixed(2)}`;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
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

async function embedImage(pdf: PDFDocument, imagePath: string | null) {
  if (!imagePath) return null;
  const relative = imagePath.replace(/^\//, "").replace(/\//g, path.sep);
  const candidates = [
    path.join(process.cwd(), "public", relative),
    path.join(process.cwd(), relative),
  ];

  for (const filePath of candidates) {
    try {
      const bytes = await readFile(filePath);
      const header = bytes.subarray(0, 4);
      const isPng = header[0] === 0x89 && header[1] === 0x50;
      return isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    } catch {
      // Try the next location or skip if the warehouse photo is not on disk.
    }
  }

  return null;
}

function drawLabelValue(
  page: PDFPage,
  font: PDFFont,
  bold: PDFFont,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
) {
  page.drawText(label.toUpperCase(), { x, y, size: 8, font: bold, color: MUTED });
  const lines = wrapText(value, font, 11, width);
  lines.forEach((line, index) => {
    page.drawText(line, { x, y: y - 16 - index * 13, size: 11, font, color: INK });
  });
  return y - 16 - lines.length * 13;
}

export async function generateInvoicePdf(invoice: StaffInvoice) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const lines = resolveInvoiceItems(invoice);
  const images = await Promise.all(lines.map((item) => embedImage(pdf, item.image)));
  const logo = await embedImage(pdf, "/images/logo.jpg");

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const addPage = () => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  };

  const ensureSpace = (needed: number) => {
    if (y - needed < MARGIN + 40) addPage();
  };

  const logoSize = 46;
  const textX = logo ? MARGIN + logoSize + 12 : MARGIN;
  if (logo) {
    const fitted = logo.scaleToFit(logoSize, logoSize);
    page.drawImage(logo, {
      x: MARGIN + (logoSize - fitted.width) / 2,
      y: y - fitted.height + 14,
      width: fitted.width,
      height: fitted.height,
    });
  }

  page.drawText(INVOICE_COMPANY.tradingAs.toUpperCase(), {
    x: textX,
    y,
    size: 18,
    font: bold,
    color: MOSS,
  });
  page.drawText("INVOICE", {
    x: PAGE_WIDTH - MARGIN - bold.widthOfTextAtSize("INVOICE", 22),
    y,
    size: 22,
    font: bold,
    color: INK,
  });
  y -= 18;

  page.drawText(INVOICE_COMPANY.legalName, { x: textX, y, size: 9, font, color: MUTED });
  page.drawText(`#${invoice.number}`, {
    x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(`#${invoice.number}`, 12),
    y,
    size: 12,
    font: bold,
    color: INK,
  });
  y -= 14;

  [INVOICE_COMPANY.address, INVOICE_COMPANY.phone, INVOICE_COMPANY.email].forEach((line) => {
    page.drawText(line, { x: textX, y, size: 9, font, color: MUTED });
    y -= 12;
  });

  y -= 10;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: LINE,
  });
  y -= 28;

  const issued = new Date(`${invoice.issuedAt}T00:00:00`).toLocaleDateString("en-ZA");
  const due = new Date(`${invoice.dueAt}T00:00:00`).toLocaleDateString("en-ZA");
  drawLabelValue(page, font, bold, "Bill to", invoice.billTo, MARGIN, y, 220);
  drawLabelValue(page, font, bold, "Sales person", invoice.tech || "—", 270, y, 140);
  drawLabelValue(page, font, bold, "Date", issued, 420, y, 70);
  drawLabelValue(page, font, bold, "Due date", due, 500, y, 55);
  y -= 52;

  page.drawText(`Balance due  ${moneyLabel(invoice.total)}`, {
    x: PAGE_WIDTH - MARGIN - bold.widthOfTextAtSize(`Balance due  ${moneyLabel(invoice.total)}`, 12),
    y,
    size: 12,
    font: bold,
    color: MOSS,
  });
  y -= 24;

  const columns = [
    { key: "image", label: "IMAGE", x: MARGIN, width: 46 },
    { key: "item", label: "ITEM", x: MARGIN + 50, width: 118 },
    { key: "code", label: "CODE", x: MARGIN + 172, width: 62 },
    { key: "size", label: "SIZE", x: MARGIN + 238, width: 68 },
    { key: "m2", label: "M2", x: MARGIN + 310, width: 42 },
    { key: "boxes", label: "BOXES", x: MARGIN + 356, width: 40 },
    { key: "rate", label: "RATE", x: MARGIN + 400, width: 58 },
    { key: "amount", label: "AMOUNT", x: MARGIN + 462, width: 53 },
  ] as const;

  const drawTableHeader = () => {
    page.drawRectangle({
      x: MARGIN,
      y: y - 16,
      width: PAGE_WIDTH - MARGIN * 2,
      height: 22,
      color: SOFT,
    });
    columns.forEach((column) => {
      page.drawText(column.label, {
        x: column.x,
        y: y - 10,
        size: 7,
        font: bold,
        color: MUTED,
      });
    });
    y -= 28;
  };

  drawTableHeader();

  const drawEmbeddedImage = (image: PDFImage | null, boxX: number, boxY: number) => {
    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: 42,
      height: 28,
      borderColor: LINE,
      borderWidth: 0.6,
      color: rgb(1, 1, 1),
    });
    if (!image) return;
    const fitted = image.scaleToFit(40, 26);
    page.drawImage(image, {
      x: boxX + (42 - fitted.width) / 2,
      y: boxY + (28 - fitted.height) / 2,
      width: fitted.width,
      height: fitted.height,
    });
  };

  for (const [index, item] of lines.entries()) {
    const nameLines = wrapText(item.name, font, 8, 116);
    const rowHeight = Math.max(36, 16 + nameLines.length * 10);
    ensureSpace(rowHeight + 8);
    if (y === PAGE_HEIGHT - MARGIN) drawTableHeader();

    drawEmbeddedImage(images[index], columns[0].x, y - 28);
    nameLines.forEach((line, lineIndex) => {
      page.drawText(line, {
        x: columns[1].x,
        y: y - 8 - lineIndex * 10,
        size: 8,
        font,
        color: INK,
      });
    });
    page.drawText(item.itemCode, { x: columns[2].x, y: y - 8, size: 7, font, color: INK });
    page.drawText(item.sizeMm, { x: columns[3].x, y: y - 8, size: 8, font, color: INK });
    page.drawText(item.quantityM2.toFixed(3), { x: columns[4].x, y: y - 8, size: 8, font, color: INK });
    page.drawText(String(item.boxesQuantity), { x: columns[5].x, y: y - 8, size: 8, font, color: INK });
    page.drawText(moneyLabel(item.rate), { x: columns[6].x, y: y - 8, size: 8, font, color: INK });
    page.drawText(moneyLabel(item.amount), {
      x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(moneyLabel(item.amount), 8),
      y: y - 8,
      size: 8,
      font: bold,
      color: INK,
    });
    y -= rowHeight;
  }

  y -= 8;
  ensureSpace(80);
  page.drawLine({
    start: { x: 360, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: LINE,
  });
  y -= 18;

  const totals = [
    { label: "Subtotal", value: moneyLabel(invoice.subtotal), strong: false },
    { label: `Tax (${invoice.taxPercent}%)`, value: moneyLabel(invoice.tax), strong: false },
    { label: "Total", value: moneyLabel(invoice.total), strong: true },
  ];
  totals.forEach((row) => {
    page.drawText(row.label, {
      x: 360,
      y,
      size: row.strong ? 11 : 9,
      font: row.strong ? bold : font,
      color: row.strong ? INK : MUTED,
    });
    page.drawText(row.value, {
      x: PAGE_WIDTH - MARGIN - (row.strong ? bold : font).widthOfTextAtSize(row.value, row.strong ? 11 : 9),
      y,
      size: row.strong ? 11 : 9,
      font: row.strong ? bold : font,
      color: INK,
    });
    y -= row.strong ? 18 : 14;
  });

  y -= 16;
  ensureSpace(120);
  page.drawText("NOTES", { x: MARGIN, y, size: 8, font: bold, color: MUTED });
  y -= 14;
  wrapText(invoice.notes, font, 9, PAGE_WIDTH - MARGIN * 2).forEach((line) => {
    page.drawText(line, { x: MARGIN, y, size: 9, font, color: INK });
    y -= 12;
  });

  y -= 10;
  page.drawText("BANK DETAILS", { x: MARGIN, y, size: 8, font: bold, color: MUTED });
  y -= 14;
  invoice.terms.split("\n").forEach((line) => {
    page.drawText(line, { x: MARGIN, y, size: 9, font, color: INK });
    y -= 12;
  });

  return pdf.save();
}
