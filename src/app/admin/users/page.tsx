import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserCreateForm } from "@/components/admin/UserCreateForm";
import { authOptions, isAdminRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const staffRoles = ["ADMIN", "STORE_MANAGER", "SALES", "WAREHOUSE", "FINANCE"];

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!isAdminRole(session?.user?.role)) {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    where: { role: { in: staffRoles } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Staff users</h1>
        <p className="mt-1 text-sm text-ink-muted">{users.length} staff accounts</p>
      </div>

      <UserCreateForm />

      <div className="overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Phone</th>
              <th className="px-3 py-2 font-medium">Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-stone-line/70">
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2 text-ink-muted">{u.email}</td>
                <td className="px-3 py-2">{u.role}</td>
                <td className="px-3 py-2">{u.phone || "—"}</td>
                <td className="px-3 py-2">{u.active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
