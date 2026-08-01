import { prisma } from "@/lib/prisma";
import { formatZar } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const now = new Date();

  const [salesAgg, ordersCount, activeCustomers, products, promoCount, supplierCount, damageAgg] =
    await Promise.all([
      prisma.order.aggregate({
        where: {
          OR: [{ status: "COMPLETED" }, { paymentStatus: "PAID" }],
        },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.product.findMany({
        where: { active: true },
        select: { stockAvailable: true, costPrice: true, lowStockAt: true },
      }),
      prisma.product.count({
        where: {
          OR: [
            { isSpecial: true },
            { promoPricePerM2: { not: null } },
            {
              promotions: {
                some: {
                  promotion: {
                    active: true,
                    startDate: { lte: now },
                    endDate: { gte: now },
                  },
                },
              },
            },
          ],
        },
      }),
      prisma.supplier.count({ where: { active: true } }),
      prisma.damageRecord.aggregate({ _sum: { quantity: true }, _count: true }),
    ]);

  const stockValue = products.reduce((sum, p) => sum + p.stockAvailable * p.costPrice, 0);
  const lowStock = products.filter((p) => p.stockAvailable <= p.lowStockAt).length;

  const cards = [
    { label: "Total sales", value: formatZar(salesAgg._sum.total ?? 0) },
    { label: "Orders", value: String(ordersCount) },
    { label: "Customers", value: String(activeCustomers) },
    { label: "Stock value", value: formatZar(stockValue) },
    { label: "Low stock", value: String(lowStock) },
    { label: "On promo", value: String(promoCount) },
    { label: "Suppliers", value: String(supplierCount) },
    {
      label: "Damaged stock",
      value: `${damageAgg._sum.quantity ?? 0} m² (${damageAgg._count} records)`,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Warehouse and sales overview</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-stone-line bg-white p-4">
            <p className="text-xs tracking-wide text-ink-muted uppercase">{card.label}</p>
            <p className="mt-2 font-display text-2xl text-ink">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
