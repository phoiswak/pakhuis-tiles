import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, canAccessAdmin } from "@/lib/auth";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/stock", label: "Stock" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/suppliers", label: "Suppliers" },
  { href: "/admin/promotions", label: "Promotions" },
  { href: "/admin/damage", label: "Damage" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/notifications", label: "Notifications" },
];

export const metadata = {
  title: "Admin",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !canAccessAdmin(session.user.role, session.user.email)) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex min-h-screen bg-stone-canvas">
      <aside className="flex w-56 shrink-0 flex-col bg-ink text-stone-soft">
        <div className="border-b border-white/10 px-4 py-5">
          <p className="font-display text-sm tracking-[0.16em] text-brass uppercase">Pakhuis</p>
          <p className="mt-0.5 text-xs text-stone-muted">Admin Portal</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-stone-muted transition hover:bg-white/5 hover:text-stone-soft"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 px-4 py-4 text-xs text-stone-muted">
          <p className="truncate text-stone-soft">{session.user.name}</p>
          <p className="mt-0.5 truncate">{session.user.role}</p>
          <Link href="/" className="mt-3 inline-block text-brass hover:underline">
            ← Storefront
          </Link>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 overflow-auto p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
