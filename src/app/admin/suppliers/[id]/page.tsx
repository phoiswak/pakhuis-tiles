import Link from "next/link";
import { notFound } from "next/navigation";
import { SupplierCreateForm } from "@/components/admin/SupplierCreateForm";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function AdminSupplierEditPage({ params }: Props) {
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/suppliers" className="text-sm text-moss hover:underline">
          ← Suppliers
        </Link>
        <h1 className="mt-2 font-display text-3xl text-ink">{supplier.name}</h1>
        <p className="mt-1 text-sm text-ink-muted">{supplier.active ? "Active" : "Inactive"}</p>
      </div>
      <SupplierCreateForm supplier={supplier} />
    </div>
  );
}
