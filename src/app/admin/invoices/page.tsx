import Image from "next/image";
import Link from "next/link";
import { resolveInvoiceItems } from "@/data/staff-invoices";
import { listInvoices } from "@/lib/invoices";
import { formatZar } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const invoices = await listInvoices();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Invoices</h1>
          <p className="mt-1 text-sm text-ink-muted">{invoices.length} invoices</p>
        </div>
        <Link href="/admin/invoices/new" className="btn-primary">
          New invoice
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto border border-stone-line bg-white">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead className="border-b border-stone-line bg-stone-soft/60 text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Invoice</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Tile image</th>
              <th className="px-3 py-2 font-medium">Item code</th>
              <th className="px-3 py-2 font-medium">Tile size</th>
              <th className="px-3 py-2 font-medium">m²</th>
              <th className="px-3 py-2 font-medium">Boxes</th>
              <th className="px-3 py-2 font-medium">Total</th>
              <th className="px-3 py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const lines = resolveInvoiceItems(invoice);
              return lines.map((item, index) => (
                <tr key={`${invoice.number}-${item.itemCode}-${index}`} className="border-b border-stone-line/70">
                  {index === 0 ? (
                    <>
                      <td className="px-3 py-2 font-mono text-xs" rowSpan={lines.length}>
                        #{invoice.number}
                      </td>
                      <td className="px-3 py-2" rowSpan={lines.length}>
                        {invoice.billTo}
                      </td>
                    </>
                  ) : null}
                  <td className="px-3 py-2">
                    {item.image ? (
                      <div className="relative h-14 w-20 overflow-hidden border border-stone-line bg-stone-soft">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{item.itemCode}</td>
                  <td className="px-3 py-2">{item.sizeMm}</td>
                  <td className="px-3 py-2">{item.quantityM2.toFixed(3)}</td>
                  <td className="px-3 py-2">{item.boxesQuantity}</td>
                  {index === 0 ? (
                    <>
                      <td className="px-3 py-2" rowSpan={lines.length}>
                        {formatZar(invoice.total)}
                      </td>
                      <td className="px-3 py-2" rowSpan={lines.length}>
                        <Link href={`/admin/invoices/${invoice.number}`} className="text-moss hover:underline">
                          Open
                        </Link>
                      </td>
                    </>
                  ) : null}
                </tr>
              ));
            })}
            {!invoices.length && (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-ink-muted">
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
