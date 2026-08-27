import { DamageRecordForm } from "@/components/admin/DamageRecordForm";
import { prisma } from "@/lib/prisma";

export default async function AdminDamagePage() {
  const [products, records] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true },
    }),
    prisma.damageRecord.findMany({
      include: { product: true, user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Damage / waste</h1>
        <p className="mt-1 text-sm text-ink-muted">Record damaged stock and review history</p>
      </div>

      <DamageRecordForm
        products={products.map((p) => ({ id: p.id, label: `${p.sku} — ${p.name}` }))}
      />

      <div className="overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Product</th>
              <th className="px-3 py-2 font-medium">Qty</th>
              <th className="px-3 py-2 font-medium">Reason</th>
              <th className="px-3 py-2 font-medium">By</th>
              <th className="px-3 py-2 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-stone-line/70">
                <td className="px-3 py-2 text-ink-muted">
                  {r.createdAt.toLocaleString("en-ZA")}
                </td>
                <td className="px-3 py-2">{r.product.name}</td>
                <td className="px-3 py-2">{r.quantity} m²</td>
                <td className="px-3 py-2">{r.reason}</td>
                <td className="px-3 py-2">{r.user?.name || "—"}</td>
                <td className="px-3 py-2 text-ink-muted">{r.note || "—"}</td>
              </tr>
            ))}
            {!records.length && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-ink-muted">
                  No damage records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
