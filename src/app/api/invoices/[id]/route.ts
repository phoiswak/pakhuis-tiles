import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          items: { include: { product: true } },
          customer: true,
        },
      },
    },
  });
  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const customer = await prisma.customer.findUnique({ where: { userId: session.user.id } });
  const allowed =
    (customer && invoice.order.customerId === customer.id) ||
    invoice.order.guestEmail === session.user.email ||
    ["ADMIN", "STORE_MANAGER", "SALES", "FINANCE"].includes(session.user.role);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const lines = [
    "PAKHUIS TILES — TAX INVOICE",
    `Invoice: ${invoice.invoiceNumber}`,
    `Order: ${invoice.order.orderNumber}`,
    `Date: ${invoice.issuedAt.toISOString()}`,
    `Customer: ${invoice.order.customer?.contactPerson || invoice.order.guestName || ""}`,
    `Email: ${invoice.order.customer?.email || invoice.order.guestEmail || ""}`,
    "",
    "SKU,Product,Qty m2,Unit,Line Total",
    ...invoice.order.items.map(
      (i) =>
        `${i.product.sku},${i.product.name},${i.quantityM2},${i.unitPrice},${i.lineTotal}`,
    ),
    "",
    `TOTAL,${invoice.amount}`,
    `Payment status,${invoice.order.paymentStatus}`,
  ].join("\n");

  return new NextResponse(lines, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.csv"`,
    },
  });
}
