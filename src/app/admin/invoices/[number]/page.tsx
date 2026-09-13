import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveInvoiceItems } from "@/data/staff-invoices";
import { getInvoice } from "@/lib/invoices";
import { formatZar } from "@/lib/utils";

type Props = { params: Promise<{ number: string }> };

export const dynamic = "force-dynamic";

export default async function AdminInvoiceDetailPage({ params }: Props) {
  const { number } = await params;
  const invoice = await getInvoice(number);
  if (!invoice) notFound();
  const lines = resolveInvoiceItems(invoice);

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
        </div>

        <div className="border border-stone-line bg-white p-5">
          <h2 className="font-display text-xl text-ink">Notes & terms</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-ink">{invoice.notes}</p>
          <p className="mt-4 whitespace-pre-wrap text-sm text-ink-muted">{invoice.terms}</p>
        </div>
      </div>

      <div className="overflow-x-auto border border-stone-line bg-white p-5">
        <h2 className="font-display text-xl text-ink">Line items</h2>
        <table className="mt-4 w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-stone-line text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="py-2 pr-3 font-medium">Tile image</th>
              <th className="py-2 pr-3 font-medium">Item</th>
              <th className="py-2 pr-3 font-medium">Item code</th>
              <th className="py-2 pr-3 font-medium">Tile size</th>
              <th className="py-2 pr-3 font-medium">m²</th>
              <th className="py-2 pr-3 font-medium">Boxes</th>
              <th className="py-2 pr-3 font-medium">Rate</th>
              <th className="py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((item) => (
              <tr key={`${item.itemCode}-${item.name}`} className="border-b border-stone-line/60 align-middle">
                <td className="py-3 pr-3">
                  {item.image ? (
                    <div className="relative h-16 w-24 overflow-hidden border border-stone-line bg-stone-soft">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3 pr-3">{item.name}</td>
                <td className="py-3 pr-3 font-mono text-xs">{item.itemCode}</td>
                <td className="py-3 pr-3">{item.sizeMm}</td>
                <td className="py-3 pr-3">{item.quantityM2.toFixed(3)}</td>
                <td className="py-3 pr-3">{item.boxesQuantity}</td>
                <td className="py-3 pr-3">{formatZar(item.rate)}</td>
                <td className="py-3 text-right">{formatZar(item.amount)}</td>
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
