import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).optional(),
  costPrice: z.number().optional(),
  pricePerM2: z.number().optional(),
  contractorPrice: z.number().nullable().optional(),
  wholesalePrice: z.number().nullable().optional(),
  promoPricePerM2: z.number().nullable().optional(),
  stockAvailable: z.number().optional(),
  lowStockAt: z.number().optional(),
  isFeatured: z.boolean().optional(),
  isSpecial: z.boolean().optional(),
  active: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ ok: true, product });
  } catch {
    return NextResponse.json({ error: "Could not update product." }, { status: 500 });
  }
}
