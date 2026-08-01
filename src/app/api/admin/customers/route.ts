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

export async function GET() {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid customer data." }, { status: 400 });
  }

  try {
    const count = await prisma.customer.count();
    const customerNumber = `CUST-${1000 + count + 1}`;
    const customer = await prisma.customer.create({
      data: {
        customerNumber,
        contactPerson: parsed.data.contactPerson,
        email: parsed.data.email.toLowerCase().trim(),
        phone: parsed.data.phone,
        companyName: parsed.data.companyName,
        physicalAddress: parsed.data.physicalAddress,
        deliveryAddress: parsed.data.deliveryAddress,
        pricingTier: parsed.data.pricingTier,
      },
    });
    return NextResponse.json({ ok: true, customer });
  } catch {
    return NextResponse.json({ error: "Could not create customer." }, { status: 500 });
  }
}
