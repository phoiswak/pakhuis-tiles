import Link from "next/link";
import { getServerSession } from "next-auth";
import { InvoiceCreateForm } from "@/components/admin/InvoiceCreateForm";
import { products } from "@/data/catalog";
import { authOptions } from "@/lib/auth";
import { nextInvoiceNumber } from "@/lib/invoices";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminNewInvoicePage() {
  const [nextNumber, session, customers, salesPeople] = await Promise.all([
    nextInvoiceNumber(),
    getServerSession(authOptions),
    prisma.customer
      .findMany({
        orderBy: { contactPerson: "asc" },
        select: { id: true, contactPerson: true, companyName: true },
      })
      .catch(() => []),
    prisma.user
      .findMany({
        where: { active: true, role: { in: ["ADMIN", "STORE_MANAGER", "SALES"] } },
        orderBy: { name: "asc" },
        select: { name: true },
      })
      .then((users) => users.map((user) => user.name).filter(Boolean))
      .catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/invoices" className="text-sm text-moss hover:underline">
          ← All invoices
        </Link>
        <h1 className="mt-3 font-display text-3xl text-ink">New invoice</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Create a customer invoice with tile image, item code, size, m² and boxes.
        </p>
      </div>

      <InvoiceCreateForm
        nextNumber={nextNumber}
        defaultSalesPerson={session?.user?.name ?? ""}
        salesPeople={salesPeople}
        customers={customers}
        products={products.map((product) => ({
          slug: product.slug,
          sku: product.sku,
          name: product.name,
          image: product.image,
          sizeMm: product.sizeMm,
          pricePerM2: product.pricePerM2,
          promoPricePerM2: product.promoPricePerM2,
        }))}
      />
    </div>
  );
}
