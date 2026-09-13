import Link from "next/link";
import { notFound } from "next/navigation";
import { getStaffInvoice } from "@/data/staff-invoices";
import { formatZar } from "@/lib/utils";

type Props = { params: Promise<{ number: string }> };

export default async function AdminInvoiceDetailPage({ params }: Props) {
  const { number } = await params;
  const invoice = getStaffInvoice(number);
  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/invoices" className="text-sm text-moss hover:underline">
          ← All invoices
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">Invoice #{invoice.number}</h1>
            <p className="mt-1 text-sm text-ink-muted">{invoice.billTo}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`/api/admin/invoices/${invoice.number}`} className="btn-secondary" target="_blank" rel="noreferrer">
              View PDF
            </a>
            <a href={`/api/admin/invoices/${invoice.number}?download=1`} className="btn-primary">
              Download PDF
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-stone-line bg-white p-5">
          <h2 className="font-display text-xl text-ink">Invoice details</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            {[
              { label: "Bill to", value: invoice.billTo },
              { label: "Tech", value: invoice.tech },
              {
                label: "Date",
                value: new Date(`${invoice.issuedAt}T00:00:00`).toLocaleDateString("en-ZA"),
              },
              {
                label: "Due date",
                value: new Date(`${invoice.dueAt}T00:00:00`).toLocaleDateString("en-ZA"),
              },
              { label: "Balance due", value: formatZar(invoice.total) },
            ].map((field) => (
              <div
                key={field.label}
                className="grid grid-cols-[140px_1fr] gap-2 border-b border-stone-line/60 pb-2"
              >
                <dt className="text-ink-muted">{field.label}</dt>
                <dd className="text-ink">{field.value}</dd>
              </div>
            ))}
          </dl>

          <table className="mt-6 w-full text-left text-sm">
            <thead className="border-b border-stone-line text-xs tracking-wide text-ink-muted uppercase">
              <tr>
                <th className="py-2 font-medium">Item</th>
                <th className="py-2 font-medium">Qty</th>
                <th className="py-2 font-medium">Rate</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.description} className="border-b border-stone-line/60">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">{formatZar(item.rate)}</td>
                  <td className="py-2 text-right">{formatZar(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <dl className="mt-4 ml-auto max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd>{formatZar(invoice.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Tax ({invoice.taxPercent}%)</dt>
              <dd>{formatZar(invoice.tax)}</dd>
            </div>
            <div className="flex justify-between font-medium">
              <dt>Total</dt>
              <dd>{formatZar(invoice.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="border border-stone-line bg-white p-5">
          <h2 className="font-display text-xl text-ink">Notes & terms</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-ink">{invoice.notes}</p>
          <p className="mt-4 whitespace-pre-wrap text-sm text-ink-muted">{invoice.terms}</p>
        </div>
      </div>

      <div className="overflow-hidden border border-stone-line bg-white">
        <iframe
          title={`Invoice ${invoice.number}`}
          src={`/api/admin/invoices/${invoice.number}`}
          className="h-[80vh] w-full"
        />
      </div>
    </div>
  );
}
