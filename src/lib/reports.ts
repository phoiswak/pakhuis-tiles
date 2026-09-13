import { prisma } from "@/lib/prisma";

export type ReportColumn = {
  key: string;
  label: string;
  align?: "left" | "right";
  width: number;
};

export type ReportData = {
  type: string;
  title: string;
  filename: string;
  columns: ReportColumn[];
  rows: Record<string, string>[];
};

function dateLabel(value: Date) {
  return value.toLocaleDateString("en-ZA");
}

function numberLabel(value: number, digits = 2) {
  return value.toLocaleString("en-ZA", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export async function getReport(type: string): Promise<ReportData | null> {
  switch (type) {
    case "sales": {
      const orders = await prisma.order.findMany({
        include: { customer: true },
        orderBy: { createdAt: "desc" },
      });
      return {
        type,
        title: "Sales report",
        filename: "sales-report",
        columns: [
          { key: "orderNumber", label: "Order", width: 70 },
          { key: "status", label: "Status", width: 80 },
          { key: "paymentStatus", label: "Payment", width: 70 },
          { key: "customer", label: "Customer", width: 120 },
          { key: "email", label: "Email", width: 150 },
          { key: "total", label: "Total", align: "right", width: 70 },
          { key: "deliveryType", label: "Delivery", width: 80 },
          { key: "createdAt", label: "Date", width: 70 },
        ],
        rows: orders.map((order) => ({
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          customer: order.customer?.contactPerson || order.guestName || "",
          email: order.customer?.email || order.guestEmail || "",
          total: numberLabel(order.total),
          deliveryType: order.deliveryType,
          createdAt: dateLabel(order.createdAt),
        })),
      };
    }
    case "inventory": {
      const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { name: "asc" },
      });
      return {
        type,
        title: "Inventory report",
        filename: "inventory-report",
        columns: [
          { key: "sku", label: "SKU", width: 80 },
          { key: "name", label: "Name", width: 160 },
          { key: "category", label: "Category", width: 110 },
          { key: "stockAvailable", label: "Available m²", align: "right", width: 70 },
          { key: "stockReserved", label: "Reserved m²", align: "right", width: 70 },
          { key: "stockDamaged", label: "Damaged m²", align: "right", width: 70 },
          { key: "costPrice", label: "Cost", align: "right", width: 60 },
          { key: "pricePerM2", label: "Retail", align: "right", width: 60 },
          { key: "stockValue", label: "Stock value", align: "right", width: 70 },
        ],
        rows: products.map((product) => ({
          sku: product.sku,
          name: product.name,
          category: product.category.name,
          stockAvailable: numberLabel(product.stockAvailable, 0),
          stockReserved: numberLabel(product.stockReserved, 0),
          stockDamaged: numberLabel(product.stockDamaged, 0),
          costPrice: numberLabel(product.costPrice),
          pricePerM2: numberLabel(product.pricePerM2),
          stockValue: numberLabel(Math.round(product.stockAvailable * product.costPrice * 100) / 100),
        })),
      };
    }
    case "damage": {
      const records = await prisma.damageRecord.findMany({
        include: { product: true, user: true },
        orderBy: { createdAt: "desc" },
      });
      return {
        type,
        title: "Damage report",
        filename: "damage-report",
        columns: [
          { key: "date", label: "Date", width: 80 },
          { key: "sku", label: "SKU", width: 80 },
          { key: "product", label: "Product", width: 180 },
          { key: "quantity", label: "Quantity m²", align: "right", width: 80 },
          { key: "reason", label: "Reason", width: 110 },
          { key: "note", label: "Note", width: 150 },
          { key: "recordedBy", label: "Recorded by", width: 110 },
        ],
        rows: records.map((record) => ({
          date: dateLabel(record.createdAt),
          sku: record.product.sku,
          product: record.product.name,
          quantity: numberLabel(record.quantity),
          reason: record.reason,
          note: record.note || "",
          recordedBy: record.user?.name || "",
        })),
      };
    }
    case "suppliers": {
      const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
      return {
        type,
        title: "Suppliers report",
        filename: "suppliers-report",
        columns: [
          { key: "name", label: "Name", width: 150 },
          { key: "contactPerson", label: "Contact person", width: 130 },
          { key: "email", label: "Email", width: 160 },
          { key: "phone", label: "Phone", width: 100 },
          { key: "vatNumber", label: "VAT number", width: 110 },
          { key: "active", label: "Active", width: 60 },
        ],
        rows: suppliers.map((supplier) => ({
          name: supplier.name,
          contactPerson: supplier.contactPerson || "",
          email: supplier.email || "",
          phone: supplier.phone || "",
          vatNumber: supplier.vatNumber || "",
          active: supplier.active ? "Yes" : "No",
        })),
      };
    }
    case "customers": {
      const customers = await prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
      return {
        type,
        title: "Customers report",
        filename: "customers-report",
        columns: [
          { key: "customerNumber", label: "Number", width: 80 },
          { key: "contactPerson", label: "Contact person", width: 140 },
          { key: "companyName", label: "Company", width: 130 },
          { key: "email", label: "Email", width: 170 },
          { key: "phone", label: "Phone", width: 100 },
          { key: "pricingTier", label: "Pricing tier", width: 90 },
        ],
        rows: customers.map((customer) => ({
          customerNumber: customer.customerNumber,
          contactPerson: customer.contactPerson,
          companyName: customer.companyName || "",
          email: customer.email,
          phone: customer.phone || "",
          pricingTier: customer.pricingTier,
        })),
      };
    }
    default:
      return null;
  }
}

export function toExcelCsv(report: ReportData) {
  const escape = (value: string) => {
    if (/[;"\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
    return value;
  };
  const headers = report.columns.map((column) => escape(column.label)).join(";");
  const lines = report.rows.map((row) =>
    report.columns.map((column) => escape(row[column.key] ?? "")).join(";"),
  );
  return `\uFEFFsep=;\r\n${headers}\r\n${lines.join("\r\n")}`;
}
