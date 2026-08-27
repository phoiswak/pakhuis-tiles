import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  productId: z.string().min(1),
  type: z.enum(["RECEIVE", "ADJUST"]),
  quantity: z.number(),
  costPrice: z.number().optional(),
  supplierId: z.string().optional(),
  note: z.string().optional(),
  invoiceRef: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid stock data." }, { status: 400 });
  }

  const { productId, type, quantity, costPrice, supplierId, note, invoiceRef } = parsed.data;

  if (type === "RECEIVE" && quantity <= 0) {
    return NextResponse.json({ error: "Receive quantity must be positive." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id: productId },
        data: {
          stockAvailable: { increment: quantity },
          ...(costPrice !== undefined ? { costPrice } : {}),
        },
      });

      const movement = await tx.stockMovement.create({
        data: {
          productId,
          type,
          quantity,
          costPrice,
          supplierId: supplierId || null,
          note,
          invoiceRef,
          createdBy: session.user.id,
        },
      });

      return { product, movement };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ error: "Could not update stock." }, { status: 500 });
  }
}
