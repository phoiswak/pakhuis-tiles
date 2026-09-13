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
  active: z.boolean().optional(),
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
    return NextResponse.json({ error: "Invalid supplier data." }, { status: 400 });
  }

  try {
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name: parsed.data.name,
        contactPerson: emptyToNull(parsed.data.contactPerson),
        email: emptyToNull(parsed.data.email),
        phone: emptyToNull(parsed.data.phone),
        physicalAddress: emptyToNull(parsed.data.physicalAddress),
        vatNumber: emptyToNull(parsed.data.vatNumber),
        active: parsed.data.active,
      },
    });
    return NextResponse.json({ ok: true, supplier });
  } catch {
    return NextResponse.json({ error: "Could not update supplier." }, { status: 500 });
  }
}
