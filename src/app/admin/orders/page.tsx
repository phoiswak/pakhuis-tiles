import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { prisma } from "@/lib/prisma";
import { formatZar } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink-muted">{orders.length} orders</p>
      <div className="mt-6 overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Items</th>
              <th className="px-3 py-2 font-medium">Total</th>
              <th className="px-3 py-2 font-medium">Payment</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-stone-line/70">
                <td className="px-3 py-2 font-mono text-xs">{o.orderNumber}</td>
                <td className="px-3 py-2">
                  {o.customer?.contactPerson || o.guestName || "Guest"}
                  <div className="text-xs text-ink-muted">
                    {o.customer?.email || o.guestEmail || ""}
                  </div>
                </td>
                <td className="px-3 py-2">{o.items.length}</td>
                <td className="px-3 py-2">{formatZar(o.total)}</td>
                <td className="px-3 py-2">{o.paymentStatus}</td>
                <td className="px-3 py-2">
                  <OrderStatusSelect orderId={o.id} current={o.status} />
                </td>
                <td className="px-3 py-2 text-ink-muted">
                  {o.createdAt.toLocaleDateString("en-ZA")}
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-ink-muted">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
