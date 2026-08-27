import { prisma } from "@/lib/prisma";
import { formatZar } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const now = new Date();

  const [
    salesAgg,
    ordersCount,
    activeCustomers,
    products,
    promoCount,
    supplierCount,
    damageAgg,
    newQuotes,
    openQuotes,
    recentQuotes,
  ] = await Promise.all([
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
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.quoteRequest.count({
      where: { status: { in: ["NEW", "CONTACTED", "QUOTED"] } },
    }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stockValue = products.reduce((sum, p) => sum + p.stockAvailable * p.costPrice, 0);
  const lowStock = products.filter((p) => p.stockAvailable <= p.lowStockAt).length;

  const cards = [
    { label: "New quotes", value: String(newQuotes), href: "/admin/quotes" },
    { label: "Open quotes", value: String(openQuotes), href: "/admin/quotes" },
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
      <p className="mt-1 text-sm text-ink-muted">Sales quotes and warehouse overview</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-stone-line bg-white p-4">
            <p className="text-xs tracking-wide text-ink-muted uppercase">{card.label}</p>
            <p className="mt-2 font-display text-2xl text-ink">{card.value}</p>
            {"href" in card && card.href ? (
              <a href={card.href} className="mt-2 inline-block text-xs text-moss hover:underline">
                View quotes →
              </a>
            ) : null}
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-ink">Latest quote requests</h2>
          <a href="/admin/quotes" className="text-sm text-moss hover:underline">
            View all
          </a>
        </div>
        <div className="mt-4 overflow-x-auto border border-stone-line bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Project</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentQuotes.map((q) => (
                <tr key={q.id} className="border-b border-stone-line/70">
                  <td className="px-3 py-2 text-ink-muted">
                    {q.createdAt.toLocaleDateString("en-ZA")}
                  </td>
                  <td className="px-3 py-2">
                    <a href={`/admin/quotes/${q.id}`} className="text-ink hover:text-moss">
                      {q.fullName}
                    </a>
                  </td>
                  <td className="px-3 py-2">{q.projectType}</td>
                  <td className="px-3 py-2">{q.status}</td>
                </tr>
              ))}
              {!recentQuotes.length && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-ink-muted">
                    No quotes yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
