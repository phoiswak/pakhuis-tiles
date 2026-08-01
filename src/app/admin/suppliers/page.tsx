import { SupplierCreateForm } from "@/components/admin/SupplierCreateForm";
import { prisma } from "@/lib/prisma";

export default async function AdminSuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Suppliers</h1>
        <p className="mt-1 text-sm text-ink-muted">{suppliers.length} suppliers</p>
      </div>

      <SupplierCreateForm />

      <div className="overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Contact</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Phone</th>
              <th className="px-3 py-2 font-medium">VAT</th>
              <th className="px-3 py-2 font-medium">Active</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-stone-line/70">
                <td className="px-3 py-2">{s.name}</td>
                <td className="px-3 py-2">{s.contactPerson || "—"}</td>
                <td className="px-3 py-2 text-ink-muted">{s.email || "—"}</td>
                <td className="px-3 py-2">{s.phone || "—"}</td>
                <td className="px-3 py-2">{s.vatNumber || "—"}</td>
                <td className="px-3 py-2">{s.active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
