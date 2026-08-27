import { StockReceiveForm } from "@/components/admin/StockReceiveForm";
import { prisma } from "@/lib/prisma";

export default async function AdminStockPage() {
  const [products, suppliers, movements] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true },
    }),
    prisma.supplier.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.stockMovement.findMany({
      include: { product: true, supplier: true },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Stock</h1>
        <p className="mt-1 text-sm text-ink-muted">Receive stock and review movements</p>
      </div>

      <StockReceiveForm
        products={products.map((p) => ({ id: p.id, label: `${p.sku} — ${p.name}` }))}
        suppliers={suppliers.map((s) => ({ id: s.id, label: s.name }))}
      />

      <div>
        <h2 className="font-display text-xl text-ink">Recent movements</h2>
        <div className="mt-3 overflow-x-auto border border-stone-line bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Qty</th>
                <th className="px-3 py-2 font-medium">Supplier</th>
                <th className="px-3 py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id} className="border-b border-stone-line/70">
                  <td className="px-3 py-2 text-ink-muted">
                    {m.createdAt.toLocaleString("en-ZA")}
                  </td>
                  <td className="px-3 py-2">{m.product.name}</td>
                  <td className="px-3 py-2">{m.type}</td>
                  <td className="px-3 py-2">{m.quantity}</td>
                  <td className="px-3 py-2">{m.supplier?.name || "—"}</td>
                  <td className="px-3 py-2 text-ink-muted">{m.note || m.invoiceRef || "—"}</td>
                </tr>
              ))}
              {!movements.length && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-ink-muted">
                    No movements yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
