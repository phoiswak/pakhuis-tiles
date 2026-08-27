import { prisma } from "@/lib/prisma";
import { priceForTier, type PricingTier } from "@/lib/pricing";

export type CartLineInput = {
  productId: string;
  quantityM2: number;
};

export async function createOrderFromCart(input: {
  items: CartLineInput[];
  customerId?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  deliveryType: "DELIVERY" | "COLLECTION";
  deliveryAddress?: string;
  deliveryArea?: string;
  pricingTier?: PricingTier;
  paymentMethod?: string;
  notes?: string;
}) {
  if (!input.items.length) throw new Error("Cart is empty");

  const tier = input.pricingTier || "RETAIL";
  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) }, active: true },
  });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

  const lines = input.items.map((item) => {
    const product = productMap[item.productId];
    if (!product) throw new Error("Product not found");
    if (item.quantityM2 <= 0) throw new Error("Invalid quantity");
    if (product.stockAvailable < item.quantityM2) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    const unitPrice = priceForTier(product, tier);
    return {
      productId: product.id,
      quantityM2: item.quantityM2,
      unitPrice,
      lineTotal: Math.round(unitPrice * item.quantityM2 * 100) / 100,
    };
  });

  const subtotal = Math.round(lines.reduce((sum, l) => sum + l.lineTotal, 0) * 100) / 100;
  const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

  const order = await prisma.$transaction(async (tx) => {
    for (const line of lines) {
      await tx.product.update({
        where: { id: line.productId },
        data: {
          stockAvailable: { decrement: line.quantityM2 },
          stockReserved: { increment: line.quantityM2 },
        },
      });
      await tx.stockMovement.create({
        data: {
          productId: line.productId,
          type: "SALE",
          quantity: -line.quantityM2,
          sellingPrice: line.unitPrice,
          note: `Order ${orderNumber}`,
        },
      });
    }

    const created = await tx.order.create({
      data: {
        orderNumber,
        customerId: input.customerId,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        status: "PENDING",
        deliveryType: input.deliveryType,
        deliveryAddress: input.deliveryAddress,
        deliveryArea: input.deliveryArea,
        pricingTier: tier,
        subtotal,
        discount: 0,
        total: subtotal,
        paymentMethod: input.paymentMethod || "PAY_ON_DELIVERY",
        paymentStatus: "UNPAID",
        notes: input.notes,
        items: { create: lines },
        invoice: {
          create: {
            invoiceNumber,
            amount: subtotal,
          },
        },
      },
      include: { items: true, invoice: true },
    });

    return created;
  });

  await prisma.notification.create({
    data: {
      type: "ORDER",
      title: "New order received",
      message: `${orderNumber} — ${formatZar(subtotal)}`,
    },
  });

  return order;
}

function formatZar(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

export async function updateOrderStatus(orderId: string, status: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: true },
  });

  if (status === "COMPLETED") {
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockReserved: { decrement: item.quantityM2 } },
      });
    }
    await prisma.invoice.updateMany({
      where: { orderId },
      data: { paidAt: new Date() },
    });
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "PAID" },
    });
  }

  return order;
}
