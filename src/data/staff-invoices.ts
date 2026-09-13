import { products, SITE } from "@/data/catalog";

export const INVOICE_COMPANY = {
  legalName: "PAKHUISGAUTENG (Pty) Ltd",
  tradingAs: SITE.name,
  address: SITE.address,
  phone: SITE.phone,
  email: SITE.email,
};

export const DEFAULT_INVOICE_NOTES =
  "Please note that all products will only be released once payment has been received and confirmed.";

export const DEFAULT_INVOICE_TERMS =
  "Business Name: PAKHUISGAUTENG (Pty) Ltd\nBank Name: FNB Bank\nAccount type: Business Account\nAccount Number: 53002806361\nBranch code: 678910";

export type StaffInvoiceItem = {
  description: string;
  productSlug?: string;
  itemCode?: string;
  sizeMm?: string;
  image?: string | null;
  quantity: number;
  quantityM2: number;
  boxesQuantity: number;
  rate: number;
  amount: number;
};

export type StaffInvoice = {
  number: string;
  fileName: string;
  billTo: string;
  issuedAt: string;
  dueAt: string;
  tech: string;
  items: StaffInvoiceItem[];
  subtotal: number;
  taxPercent: number;
  tax: number;
  total: number;
  notes: string;
  terms: string;
};

export type ResolvedInvoiceItem = StaffInvoiceItem & {
  name: string;
  image: string | null;
  itemCode: string;
  sizeMm: string;
};

export const staffInvoices: StaffInvoice[] = [
  {
    number: "24364",
    fileName: "invoice-24364.pdf",
    billTo: "Rofhiwa Phosiwa",
    issuedAt: "2026-09-12",
    dueAt: "2026-09-14",
    tech: "Rofhiwa Phosiwa",
    items: [
      {
        description: "Ashenwood Plank Wood Look",
        productSlug: "ashenwood-plank-wood-look",
        quantity: 1,
        quantityM2: 1.152,
        boxesQuantity: 1,
        rate: 359,
        amount: 359,
      },
    ],
    subtotal: 359,
    taxPercent: 15,
    tax: 53.85,
    total: 412.85,
    notes: DEFAULT_INVOICE_NOTES,
    terms: DEFAULT_INVOICE_TERMS,
  },
];

export function getStaffInvoice(number: string) {
  return staffInvoices.find((invoice) => invoice.number === number) ?? null;
}

export function staffInvoicePdfPath(invoice: StaffInvoice) {
  return `src/data/invoices/${invoice.fileName}`;
}

export function resolveInvoiceItem(item: StaffInvoiceItem): ResolvedInvoiceItem {
  const product = item.productSlug
    ? products.find((entry) => entry.slug === item.productSlug)
    : undefined;

  return {
    ...item,
    name: product?.name ?? item.description,
    image: item.image || product?.image || null,
    itemCode: item.itemCode || product?.sku || "—",
    sizeMm: (item.sizeMm || product?.sizeMm || "—").replace(/x/gi, "×"),
  };
}

export function resolveInvoiceItems(invoice: StaffInvoice) {
  return invoice.items.map(resolveInvoiceItem);
}
