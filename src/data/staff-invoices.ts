export type StaffInvoiceItem = {
  description: string;
  quantity: number;
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
        quantity: 1,
        rate: 359,
        amount: 359,
      },
    ],
    subtotal: 359,
    taxPercent: 15,
    tax: 53.85,
    total: 412.85,
    notes:
      "Please note that all products will only be released once payment has been received and confirmed.",
    terms:
      "Business Name: PAKHUISGAUTENG (Pty) Ltd\nBank Name: FNB Bank\nAccount type: Business Account\nAccount Number: 53002806361\nBranch code: 678910",
  },
];

export function getStaffInvoice(number: string) {
  return staffInvoices.find((invoice) => invoice.number === number) ?? null;
}

export function staffInvoicePdfPath(invoice: StaffInvoice) {
  return `src/data/invoices/${invoice.fileName}`;
}
