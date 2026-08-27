import { CustomerCreateForm } from "@/components/admin/CustomerCreateForm";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Customers</h1>
        <p className="mt-1 text-sm text-ink-muted">{customers.length} customers</p>
      </div>

      <CustomerCreateForm />

      <div className="overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Number</th>
              <th className="px-3 py-2 font-medium">Contact</th>
              <th className="px-3 py-2 font-medium">Company</th>
              <th className="px-3 py-2 font-medium">Tier</th>
              <th className="px-3 py-2 font-medium">Orders</th>
              <th className="px-3 py-2 font-medium">Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-stone-line/70">
                <td className="px-3 py-2 font-mono text-xs">{c.customerNumber}</td>
                <td className="px-3 py-2">{c.contactPerson}</td>
                <td className="px-3 py-2">{c.companyName || "—"}</td>
                <td className="px-3 py-2">{c.pricingTier}</td>
                <td className="px-3 py-2">{c._count.orders}</td>
                <td className="px-3 py-2 text-ink-muted">{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
