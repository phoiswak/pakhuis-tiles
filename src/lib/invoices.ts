import { prisma } from "@/lib/prisma";
import {
  staffInvoices,
  type StaffInvoice,
  type StaffInvoiceItem,
} from "@/data/staff-invoices";
import { money } from "@/lib/invoice-coverage";

type SalesInvoiceRow = {
  invoiceNumber: string;
  billTo: string;
  tech: string;
  issuedAt: Date;
  dueAt: Date;
  notes: string;
  terms: string;
  subtotal: number;
  taxPercent: number;
  tax: number;
  total: number;
  items: Array<{
    productSlug: string | null;
    description: string;
    itemCode: string;
    sizeMm: string;
    image: string | null;
    quantity: number;
    quantityM2: number;
    boxesQuantity: number;
    rate: number;
    amount: number;
    sortOrder: number;
  }>;
};

function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function fromDb(invoice: SalesInvoiceRow): StaffInvoice {
  const items = [...invoice.items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => ({
      description: item.description,
      productSlug: item.productSlug ?? undefined,
      itemCode: item.itemCode,
      sizeMm: item.sizeMm,
      image: item.image,
      quantity: item.quantity,
      quantityM2: item.quantityM2,
      boxesQuantity: item.boxesQuantity,
      rate: item.rate,
      amount: item.amount,
    }));

  return {
    number: invoice.invoiceNumber,
    fileName: `invoice-${invoice.invoiceNumber}.pdf`,
    billTo: invoice.billTo,
    issuedAt: dateOnly(invoice.issuedAt),
    dueAt: dateOnly(invoice.dueAt),
    tech: invoice.tech,
    items,
    subtotal: invoice.subtotal,
    taxPercent: invoice.taxPercent,
    tax: invoice.tax,
    total: invoice.total,
    notes: invoice.notes,
    terms: invoice.terms,
  };
}

async function loadDbInvoices() {
  try {
    return await prisma.salesInvoice.findMany({
      include: { items: true },
      orderBy: { issuedAt: "desc" },
    });
  } catch (error) {
    console.error("[invoices] database read failed", error);
    return [];
  }
}

export async function listInvoices(): Promise<StaffInvoice[]> {
  const rows = await loadDbInvoices();
  const fromDatabase = rows.map(fromDb);
  const known = new Set(fromDatabase.map((invoice) => invoice.number));
  const extras = staffInvoices.filter((invoice) => !known.has(invoice.number));
  return [...fromDatabase, ...extras].sort((a, b) => {
    const byNumber = Number(b.number) - Number(a.number);
    if (Number.isFinite(byNumber) && byNumber !== 0) return byNumber;
    return b.issuedAt.localeCompare(a.issuedAt);
  });
}

export async function getInvoice(number: string): Promise<StaffInvoice | null> {
  try {
    const row = await prisma.salesInvoice.findUnique({
      where: { invoiceNumber: number },
      include: { items: true },
    });
    if (row) return fromDb(row);
  } catch (error) {
    console.error("[invoices] database lookup failed", error);
  }

  return staffInvoices.find((invoice) => invoice.number === number) ?? null;
}

export async function nextInvoiceNumber() {
  const invoices = await listInvoices();
  const numbers = invoices
    .map((invoice) => Number(invoice.number))
    .filter((value) => Number.isFinite(value));
  return String(Math.max(24364, ...numbers, 24363) + 1);
}

export type CreateInvoiceInput = {
  billTo: string;
  tech?: string;
  issuedAt: string;
  dueAt: string;
  notes?: string;
  terms?: string;
  taxPercent?: number;
  items: StaffInvoiceItem[];
};

export async function createInvoice(input: CreateInvoiceInput) {
  const items = input.items.map((item, index) => ({
    productSlug: item.productSlug ?? null,
    description: item.description,
    itemCode: item.itemCode ?? "",
    sizeMm: item.sizeMm ?? "",
    image: item.image ?? null,
    quantity: item.quantity || item.boxesQuantity || 1,
    quantityM2: item.quantityM2,
    boxesQuantity: item.boxesQuantity,
    rate: item.rate,
    amount: money(item.amount),
    sortOrder: index,
  }));
  const subtotal = money(items.reduce((sum, item) => sum + item.amount, 0));
  const taxPercent = input.taxPercent ?? 15;
  const tax = money(subtotal * (taxPercent / 100));
  const total = money(subtotal + tax);
  const invoiceNumber = await nextInvoiceNumber();

  const row = await prisma.salesInvoice.create({
    data: {
      invoiceNumber,
      billTo: input.billTo,
      tech: input.tech ?? "",
      issuedAt: new Date(`${input.issuedAt}T00:00:00`),
      dueAt: new Date(`${input.dueAt}T00:00:00`),
      notes: input.notes ?? "",
      terms: input.terms ?? "",
      subtotal,
      taxPercent,
      tax,
      total,
      items: { create: items },
    },
    include: { items: true },
  });

  return fromDb(row);
}
