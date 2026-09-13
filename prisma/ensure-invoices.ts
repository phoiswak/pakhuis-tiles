/**
 * Upserts the existing staff invoice so created invoices share one table.
 */
import { PrismaClient } from "@prisma/client";
import { resolveInvoiceItems, staffInvoices } from "../src/data/staff-invoices";

const prisma = new PrismaClient();

async function main() {
  for (const invoice of staffInvoices) {
    const lines = resolveInvoiceItems(invoice);
    await prisma.salesInvoice.upsert({
      where: { invoiceNumber: invoice.number },
      update: {
        billTo: invoice.billTo,
        tech: invoice.tech,
        issuedAt: new Date(`${invoice.issuedAt}T00:00:00`),
        dueAt: new Date(`${invoice.dueAt}T00:00:00`),
        notes: invoice.notes,
        terms: invoice.terms,
        subtotal: invoice.subtotal,
        taxPercent: invoice.taxPercent,
        tax: invoice.tax,
        total: invoice.total,
      },
      create: {
        invoiceNumber: invoice.number,
        billTo: invoice.billTo,
        tech: invoice.tech,
        issuedAt: new Date(`${invoice.issuedAt}T00:00:00`),
        dueAt: new Date(`${invoice.dueAt}T00:00:00`),
        notes: invoice.notes,
        terms: invoice.terms,
        subtotal: invoice.subtotal,
        taxPercent: invoice.taxPercent,
        tax: invoice.tax,
        total: invoice.total,
        items: {
          create: lines.map((item, index) => ({
            productSlug: item.productSlug ?? null,
            description: item.name,
            itemCode: item.itemCode,
            sizeMm: item.sizeMm,
            image: item.image,
            quantity: item.quantity,
            quantityM2: item.quantityM2,
            boxesQuantity: item.boxesQuantity,
            rate: item.rate,
            amount: item.amount,
            sortOrder: index,
          })),
        },
      },
    });
  }

  console.log(`Seeded ${staffInvoices.length} sales invoices.`);
}

main()
  .catch((error) => {
    console.error("Invoice seed skipped.", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
