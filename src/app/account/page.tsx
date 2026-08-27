import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, isStaffRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatZar } from "@/lib/utils";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/account");

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
  });

  const orders = await prisma.order.findMany({
    where: customer
      ? { customerId: customer.id }
      : { guestEmail: session.user.email },
    include: { invoice: true, items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Customer portal</p>
          <h1 className="mt-2 font-display text-4xl text-ink">My account</h1>
          <p className="mt-2 text-ink-muted">
            {session.user.name} · {session.user.email}
            {customer ? ` · ${customer.customerNumber} · ${customer.pricingTier}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isStaffRole(session.user.role) && (
            <Link href="/admin" className="btn-secondary">
              Open admin
            </Link>
          )}
          <SignOutButton className="btn-secondary" />
          <Link href="/tiles" className="btn-primary">
            Shop tiles
          </Link>
        </div>
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="border border-stone-line bg-white p-5">
          <p className="text-xs tracking-wide text-ink-muted uppercase">Orders</p>
          <p className="mt-2 font-display text-3xl text-ink">{orders.length}</p>
        </div>
        <div className="border border-stone-line bg-white p-5">
          <p className="text-xs tracking-wide text-ink-muted uppercase">Pricing tier</p>
          <p className="mt-2 font-display text-3xl text-ink">{customer?.pricingTier || "RETAIL"}</p>
        </div>
        <div className="border border-stone-line bg-white p-5">
          <p className="text-xs tracking-wide text-ink-muted uppercase">Profile</p>
          <Link href="/account/profile" className="mt-2 inline-block text-moss hover:underline">
            Update details →
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-ink">Order history</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-ink-muted">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto border border-stone-line bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-stone-line bg-stone-soft/60">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-line/70">
                    <td className="px-4 py-3">
                      <Link href={`/account/orders/${order.id}`} className="text-moss hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {order.createdAt.toLocaleDateString("en-ZA")}
                    </td>
                    <td className="px-4 py-3">{order.status.replaceAll("_", " ")}</td>
                    <td className="px-4 py-3">{formatZar(order.total)}</td>
                    <td className="px-4 py-3">
                      {order.invoice ? (
                        <a
                          href={`/api/invoices/${order.invoice.id}`}
                          className="text-moss hover:underline"
                        >
                          {order.invoice.invoiceNumber}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
