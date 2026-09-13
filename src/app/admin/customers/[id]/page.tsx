import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomerCreateForm } from "@/components/admin/CustomerCreateForm";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function AdminCustomerEditPage({ params }: Props) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/customers" className="text-sm text-moss hover:underline">
          ← Customers
        </Link>
        <h1 className="mt-2 font-display text-3xl text-ink">{customer.contactPerson}</h1>
        <p className="mt-1 text-sm text-ink-muted">{customer.customerNumber}</p>
      </div>
      <CustomerCreateForm customer={customer} />
    </div>
  );
}
