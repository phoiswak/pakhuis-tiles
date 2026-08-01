import { NextResponse } from "next/server";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ type: string }> };

function toCsv(rows: Record<string, string | number | null | undefined>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\n");
}

export async function GET(_request: Request, { params }: Params) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await params;
  let rows: Record<string, string | number | null | undefined>[] = [];
  let filename = `${type}.csv`;

  switch (type) {
    case "sales": {
      const orders = await prisma.order.findMany({
        include: { customer: true },
        orderBy: { createdAt: "desc" },
      });
      rows = orders.map((o) => ({
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        customer: o.customer?.contactPerson || o.guestName || "",
        email: o.customer?.email || o.guestEmail || "",
        total: o.total,
        deliveryType: o.deliveryType,
        createdAt: o.createdAt.toISOString(),
      }));
      filename = "sales-report.csv";
      break;
    }
    case "inventory": {
      const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { name: "asc" },
      });
      rows = products.map((p) => ({
        sku: p.sku,
        name: p.name,
        category: p.category.name,
        stockAvailable: p.stockAvailable,
        stockReserved: p.stockReserved,
        stockDamaged: p.stockDamaged,
        costPrice: p.costPrice,
        pricePerM2: p.pricePerM2,
        stockValue: Math.round(p.stockAvailable * p.costPrice * 100) / 100,
      }));
      filename = "inventory-report.csv";
      break;
    }
    case "damage": {
      const records = await prisma.damageRecord.findMany({
        include: { product: true, user: true },
        orderBy: { createdAt: "desc" },
      });
      rows = records.map((r) => ({
        date: r.createdAt.toISOString(),
        product: r.product.name,
        sku: r.product.sku,
        quantity: r.quantity,
        reason: r.reason,
        note: r.note || "",
        recordedBy: r.user?.name || "",
      }));
      filename = "damage-report.csv";
      break;
    }
    case "suppliers": {
      const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
      rows = suppliers.map((s) => ({
        name: s.name,
        contactPerson: s.contactPerson || "",
        email: s.email || "",
        phone: s.phone || "",
        vatNumber: s.vatNumber || "",
        active: s.active ? "yes" : "no",
      }));
      filename = "suppliers-report.csv";
      break;
    }
    case "customers": {
      const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
      rows = customers.map((c) => ({
        customerNumber: c.customerNumber,
        contactPerson: c.contactPerson,
        companyName: c.companyName || "",
        email: c.email,
        phone: c.phone || "",
        pricingTier: c.pricingTier,
      }));
      filename = "customers-report.csv";
      break;
    }
    default:
      return NextResponse.json({ error: "Unknown report type." }, { status: 404 });
  }

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
