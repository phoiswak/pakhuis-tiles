import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatZar } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function AccountOrderPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const { id } = await params;

  const customer = await prisma.customer.findUnique({ where: { userId: session.user.id } });
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, invoice: true, customer: true },
  });
  if (!order) notFound();

  const allowed =
    (customer && order.customerId === customer.id) ||
    order.guestEmail === session.user.email ||
    ["ADMIN", "STORE_MANAGER", "SALES", "FINANCE"].includes(session.user.role);
  if (!allowed) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <Link href="/account" className="text-sm text-moss hover:underline">
        ← Back to account
      </Link>
      <h1 className="mt-4 font-display text-4xl text-ink">{order.orderNumber}</h1>
      <p className="mt-2 text-ink-muted">
        {order.status.replaceAll("_", " ")} · {order.deliveryType} · {order.paymentStatus}
      </p>

      <div className="mt-8 border border-stone-line bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/50">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-right">m²</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-stone-line/60">
                <td className="px-4 py-3">
                  {item.product.name}
                  <div className="text-xs text-ink-muted">{item.product.sku}</div>
                </td>
                <td className="px-4 py-3 text-right">{item.quantityM2}</td>
                <td className="px-4 py-3 text-right">{formatZar(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between px-4 py-4 font-medium">
          <span>Total</span>
          <span>{formatZar(order.total)}</span>
        </div>
      </div>

      {order.invoice && (
        <a href={`/api/invoices/${order.invoice.id}`} className="btn-primary mt-6 inline-flex">
          Download invoice
        </a>
      )}
    </div>
  );
}
