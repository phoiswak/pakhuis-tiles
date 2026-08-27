import { PromotionCreateForm } from "@/components/admin/PromotionCreateForm";
import { prisma } from "@/lib/prisma";

export default async function AdminPromotionsPage() {
  const [promotions, products] = await Promise.all([
    prisma.promotion.findMany({
      include: { products: { include: { product: true } } },
      orderBy: { startDate: "desc" },
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Promotions</h1>
        <p className="mt-1 text-sm text-ink-muted">{promotions.length} promotions</p>
      </div>

      <PromotionCreateForm products={products} />

      <div className="overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Discount</th>
              <th className="px-3 py-2 font-medium">Dates</th>
              <th className="px-3 py-2 font-medium">Products</th>
              <th className="px-3 py-2 font-medium">Active</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((p) => (
              <tr key={p.id} className="border-b border-stone-line/70">
                <td className="px-3 py-2">
                  {p.name}
                  {p.featured && (
                    <span className="ml-2 text-[10px] tracking-wide text-brass uppercase">
                      featured
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">{p.discountPercent}%</td>
                <td className="px-3 py-2 text-ink-muted">
                  {p.startDate.toLocaleDateString("en-ZA")} –{" "}
                  {p.endDate.toLocaleDateString("en-ZA")}
                </td>
                <td className="px-3 py-2">{p.products.length}</td>
                <td className="px-3 py-2">{p.active ? "Yes" : "No"}</td>
              </tr>
            ))}
            {!promotions.length && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-ink-muted">
                  No promotions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
