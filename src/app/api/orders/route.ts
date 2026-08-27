import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { createOrderFromCart } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantityM2: z.number().positive(),
    }),
  ),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  deliveryType: z.enum(["DELIVERY", "COLLECTION"]),
  deliveryAddress: z.string().optional(),
  deliveryArea: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order details." }, { status: 400 });
    }

    let customerId: string | undefined;
    let pricingTier: "RETAIL" | "CONTRACTOR" | "WHOLESALE" = "RETAIL";

    if (session?.user?.id) {
      const customer = await prisma.customer.findUnique({
        where: { userId: session.user.id },
      });
      if (customer) {
        customerId = customer.id;
        pricingTier = customer.pricingTier as typeof pricingTier;
      }
    }

    if (!customerId && (!parsed.data.guestName || !parsed.data.guestEmail || !parsed.data.guestPhone)) {
      return NextResponse.json(
        { error: "Please sign in or provide guest contact details." },
        { status: 400 },
      );
    }

    const order = await createOrderFromCart({
      ...parsed.data,
      customerId,
      pricingTier,
    });

    return NextResponse.json({
      ok: true,
      orderNumber: order.orderNumber,
      invoiceNumber: order.invoice?.invoiceNumber,
      id: order.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not place order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
  });

  const orders = await prisma.order.findMany({
    where: customer
      ? { customerId: customer.id }
      : { guestEmail: session.user.email },
    include: { items: { include: { product: true } }, invoice: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
