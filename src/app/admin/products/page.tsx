import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatZar } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Products</h1>
      <p className="mt-1 text-sm text-ink-muted">{products.length} products</p>
      <div className="mt-6 overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">SKU</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Category</th>
              <th className="px-3 py-2 font-medium">Stock</th>
              <th className="px-3 py-2 font-medium">Retail</th>
              <th className="px-3 py-2 font-medium">Cost</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-stone-line/70">
                <td className="px-3 py-2 font-mono text-xs">{p.sku}</td>
                <td className="px-3 py-2">
                  {p.name}
                  {p.isSpecial && (
                    <span className="ml-2 text-[10px] tracking-wide text-brass uppercase">
                      promo
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-ink-muted">{p.category.name}</td>
                <td className="px-3 py-2">
                  <span className={p.stockAvailable <= p.lowStockAt ? "text-red-700" : ""}>
                    {p.stockAvailable} m²
                  </span>
                </td>
                <td className="px-3 py-2">{formatZar(p.pricePerM2)}</td>
                <td className="px-3 py-2">{formatZar(p.costPrice)}</td>
                <td className="px-3 py-2 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-moss hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
