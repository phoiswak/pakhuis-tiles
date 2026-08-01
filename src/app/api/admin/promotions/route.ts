import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  discountPercent: z.number().min(0).max(100),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  featured: z.boolean().optional(),
  productIds: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid promotion data." }, { status: 400 });
  }

  try {
    const promotion = await prisma.promotion.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        discountPercent: parsed.data.discountPercent,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
        featured: parsed.data.featured ?? false,
        products: parsed.data.productIds?.length
          ? {
              create: parsed.data.productIds.map((productId) => ({ productId })),
            }
          : undefined,
      },
    });
    return NextResponse.json({ ok: true, promotion });
  } catch {
    return NextResponse.json({ error: "Could not create promotion." }, { status: 500 });
  }
}
