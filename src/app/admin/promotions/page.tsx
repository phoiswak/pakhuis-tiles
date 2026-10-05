import { PromotionCreateForm } from "@/components/admin/PromotionCreateForm";
import { SpecialTileForm } from "@/components/admin/SpecialTileForm";
import { products as catalogProducts } from "@/data/catalog";
import { prisma } from "@/lib/prisma";
import { MONTH_OPTIONS } from "@/lib/specials";
import { formatZar } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const [promotions, products, categories, specials] = await Promise.all([
    prisma.promotion.findMany({
      include: { products: { include: { product: true } } },
      orderBy: { startDate: "desc" },
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.product.findMany({
      where: { isSpecial: true },
      orderBy: [{ specialYear: "desc" }, { specialMonth: "desc" }, { name: "asc" }],
    }),
  ]);

  const images = Array.from(new Set(catalogProducts.map((product) => product.image)));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Promotions</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Add a monthly special tile, or a dated promotion on existing tiles. Specials leave the
          shop when their month ends.
        </p>
      </div>

      <SpecialTileForm categories={categories} images={images} />
      <PromotionCreateForm products={products} />

      <div>
        <h2 className="font-display text-xl text-ink">Monthly special tiles</h2>
        <div className="mt-3 overflow-x-auto border border-stone-line bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
              <tr>
                <th className="px-3 py-2 font-medium">Tile</th>
                <th className="px-3 py-2 font-medium">Month</th>
                <th className="px-3 py-2 font-medium">Regular</th>
                <th className="px-3 py-2 font-medium">Special</th>
                <th className="px-3 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {specials.map((product) => {
                const month = MONTH_OPTIONS.find((entry) => entry.value === product.specialMonth);
                return (
                  <tr key={product.id} className="border-b border-stone-line/70">
                    <td className="px-3 py-2">{product.name}</td>
                    <td className="px-3 py-2 text-ink-muted">
                      {month ? `${month.label} ${product.specialYear ?? ""}` : "—"}
                    </td>
                    <td className="px-3 py-2">{formatZar(product.pricePerM2)}</td>
                    <td className="px-3 py-2">{product.promoPricePerM2 != null ? formatZar(product.promoPricePerM2) : "—"}</td>
                    <td className="px-3 py-2 text-right">
                      <Link href={`/admin/products/${product.id}`} className="text-moss hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {!specials.length && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-ink-muted">
                    No monthly special tiles yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

