import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  productId: z.string().min(1),
  quantity: z.number().positive(),
  reason: z.enum(["BROKEN", "CRACKED", "WATER", "HANDLING", "OTHER"]),
  note: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid damage data." }, { status: 400 });
  }

  const { productId, quantity, reason, note } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error("Product not found");
      if (product.stockAvailable < quantity) {
        throw new Error("Insufficient available stock");
      }

      const updated = await tx.product.update({
        where: { id: productId },
        data: {
          stockAvailable: { decrement: quantity },
          stockDamaged: { increment: quantity },
        },
      });

      const record = await tx.damageRecord.create({
        data: {
          productId,
          quantity,
          reason,
          note,
          userId: session.user.id,
        },
      });

      await tx.stockMovement.create({
        data: {
          productId,
          type: "DAMAGE",
          quantity: -quantity,
          note: `${reason}${note ? ` — ${note}` : ""}`,
          createdBy: session.user.id,
        },
      });

      return { product: updated, record };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not record damage.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
