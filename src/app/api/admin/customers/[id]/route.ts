import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  contactPerson: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  physicalAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  pricingTier: z.enum(["RETAIL", "CONTRACTOR", "WHOLESALE"]).default("RETAIL"),
});

type Params = { params: Promise<{ id: string }> };

function emptyToNull(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid customer data." }, { status: 400 });
  }

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        contactPerson: parsed.data.contactPerson,
        email: parsed.data.email.toLowerCase().trim(),
        phone: emptyToNull(parsed.data.phone),
        companyName: emptyToNull(parsed.data.companyName),
        physicalAddress: emptyToNull(parsed.data.physicalAddress),
        deliveryAddress: emptyToNull(parsed.data.deliveryAddress),
        pricingTier: parsed.data.pricingTier,
      },
    });
    return NextResponse.json({ ok: true, customer });
  } catch {
    return NextResponse.json({ error: "Could not update customer." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.$transaction([
      prisma.order.updateMany({ where: { customerId: id }, data: { customerId: null } }),
      prisma.quoteRequest.updateMany({ where: { customerId: id }, data: { customerId: null } }),
      prisma.customer.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete customer." }, { status: 500 });
  }
}
