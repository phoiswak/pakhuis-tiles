import { prisma } from "@/lib/prisma";

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Notifications</h1>
      <p className="mt-1 text-sm text-ink-muted">{notifications.length} recent</p>
      <div className="mt-6 overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Title</th>
              <th className="px-3 py-2 font-medium">Message</th>
              <th className="px-3 py-2 font-medium">Read</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} className="border-b border-stone-line/70">
                <td className="px-3 py-2 text-ink-muted whitespace-nowrap">
                  {n.createdAt.toLocaleString("en-ZA")}
                </td>
                <td className="px-3 py-2">{n.type}</td>
                <td className="px-3 py-2">{n.title}</td>
                <td className="px-3 py-2 text-ink-muted">{n.message}</td>
                <td className="px-3 py-2">{n.read ? "Yes" : "No"}</td>
              </tr>
            ))}
            {!notifications.length && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-ink-muted">
                  No notifications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
