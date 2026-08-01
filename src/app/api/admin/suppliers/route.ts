import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  contactPerson: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  physicalAddress: z.string().optional(),
  vatNumber: z.string().optional(),
});

export async function GET() {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(suppliers);
}

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid supplier data." }, { status: 400 });
  }

  try {
    const supplier = await prisma.supplier.create({
      data: {
        name: parsed.data.name,
        contactPerson: parsed.data.contactPerson,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        physicalAddress: parsed.data.physicalAddress,
        vatNumber: parsed.data.vatNumber,
      },
    });
    return NextResponse.json({ ok: true, supplier });
  } catch {
    return NextResponse.json({ error: "Could not create supplier." }, { status: 500 });
  }
}
