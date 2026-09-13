import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffSession } from "@/lib/auth";
import { DEFAULT_INVOICE_NOTES, DEFAULT_INVOICE_TERMS } from "@/data/staff-invoices";
import { createInvoice } from "@/lib/invoices";

const schema = z.object({
  billTo: z.string().trim().min(2),
  tech: z.string().trim().optional(),
  issuedAt: z.string().min(1),
  dueAt: z.string().min(1),
  notes: z.string().optional(),
  terms: z.string().optional(),
  taxPercent: z.number().min(0).max(100).optional(),
  items: z
    .array(
      z.object({
        productSlug: z.string().optional(),
        description: z.string().trim().min(1),
        itemCode: z.string().optional(),
        sizeMm: z.string().optional(),
        image: z.string().nullable().optional(),
        quantity: z.number().positive().optional(),
        quantityM2: z.number().positive(),
        boxesQuantity: z.number().positive(),
        rate: z.number().min(0),
        amount: z.number().min(0),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invoice data." }, { status: 400 });
  }

  try {
    const invoice = await createInvoice({
      billTo: parsed.data.billTo,
      tech: parsed.data.tech || session.user?.name || "",
      issuedAt: parsed.data.issuedAt,
      dueAt: parsed.data.dueAt,
      notes: parsed.data.notes || DEFAULT_INVOICE_NOTES,
      terms: parsed.data.terms || DEFAULT_INVOICE_TERMS,
      taxPercent: parsed.data.taxPercent,
      items: parsed.data.items.map((item) => ({
        description: item.description,
        productSlug: item.productSlug,
        itemCode: item.itemCode,
        sizeMm: item.sizeMm,
        image: item.image,
        quantity: item.quantity ?? item.boxesQuantity,
        quantityM2: item.quantityM2,
        boxesQuantity: item.boxesQuantity,
        rate: item.rate,
        amount: item.amount,
      })),
    });

    return NextResponse.json({ ok: true, invoice });
  } catch (error) {
    console.error("[invoices] create failed", error);
    return NextResponse.json({ error: "Could not create invoice." }, { status: 500 });
  }
}
