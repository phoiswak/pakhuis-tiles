import { prisma } from "@/lib/prisma";

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Quote requests</h1>
      <p className="mt-1 text-sm text-ink-muted">{quotes.length} requests</p>
      <div className="mt-6 overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Project</th>
              <th className="px-3 py-2 font-medium">Qty</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Contact</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="border-b border-stone-line/70 align-top">
                <td className="px-3 py-2 text-ink-muted whitespace-nowrap">
                  {q.createdAt.toLocaleDateString("en-ZA")}
                </td>
                <td className="px-3 py-2">
                  {q.fullName}
                  {q.companyName && (
                    <div className="text-xs text-ink-muted">{q.companyName}</div>
                  )}
                </td>
                <td className="px-3 py-2">
                  {q.projectType}
                  {q.tileCategory && (
                    <div className="text-xs text-ink-muted">{q.tileCategory}</div>
                  )}
                </td>
                <td className="px-3 py-2">{q.quantityM2 || "—"}</td>
                <td className="px-3 py-2">{q.status}</td>
                <td className="px-3 py-2 text-ink-muted">
                  <div>{q.email}</div>
                  <div>{q.phone}</div>
                </td>
              </tr>
            ))}
            {!quotes.length && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-ink-muted">
                  No quote requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
