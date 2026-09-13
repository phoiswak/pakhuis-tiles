import Link from "next/link";
import { staffInvoices } from "@/data/staff-invoices";
import { formatZar } from "@/lib/utils";

export default function AdminInvoicesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Invoices</h1>
      <p className="mt-1 text-sm text-ink-muted">{staffInvoices.length} invoices</p>
      <div className="mt-6 overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Invoice</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Due</th>
              <th className="px-3 py-2 font-medium">Total</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {staffInvoices.map((invoice) => (
              <tr key={invoice.number} className="border-b border-stone-line/70">
                <td className="px-3 py-2 font-mono text-xs">#{invoice.number}</td>
                <td className="px-3 py-2">{invoice.billTo}</td>
                <td className="px-3 py-2 text-ink-muted">
                  {new Date(`${invoice.issuedAt}T00:00:00`).toLocaleDateString("en-ZA")}
                </td>
                <td className="px-3 py-2 text-ink-muted">
                  {new Date(`${invoice.dueAt}T00:00:00`).toLocaleDateString("en-ZA")}
                </td>
                <td className="px-3 py-2">{formatZar(invoice.total)}</td>
                <td className="px-3 py-2">
                  <Link href={`/admin/invoices/${invoice.number}`} className="text-moss hover:underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
