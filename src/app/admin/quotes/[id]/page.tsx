import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteNotesForm } from "@/components/admin/QuoteNotesForm";
import { QuoteReplyForm } from "@/components/admin/QuoteReplyForm";
import { QuoteStatusSelect } from "@/components/admin/QuoteStatusSelect";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminQuoteDetailPage({ params }: Props) {
  const { id } = await params;
  const quote = await prisma.quoteRequest.findUnique({ where: { id } });
  if (!quote) notFound();

  const fields: { label: string; value: string }[] = [
    { label: "Name", value: quote.fullName },
    { label: "Company", value: quote.companyName || "—" },
    { label: "Email", value: quote.email },
    { label: "Phone", value: quote.phone },
    { label: "Address", value: quote.physicalAddress || "—" },
    { label: "Project type", value: quote.projectType },
    { label: "Tile category", value: quote.tileCategory || "—" },
    { label: "Tile size", value: quote.tileSize || "—" },
    { label: "Colour", value: quote.colourPreference || "—" },
    { label: "Quantity (m²)", value: quote.quantityM2 || "—" },
    { label: "Budget", value: quote.budgetRange || "—" },
    { label: "Product", value: quote.productSlug || "—" },
    { label: "Installation", value: quote.installation ? "Yes" : "No" },
    { label: "Delivery", value: quote.deliveryOption || "—" },
    { label: "Area", value: quote.deliveryArea || "—" },
    {
      label: "Submitted",
      value: quote.createdAt.toLocaleString("en-ZA"),
    },
    {
      label: "Last contacted",
      value: quote.lastContactedAt
        ? quote.lastContactedAt.toLocaleString("en-ZA")
        : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/quotes" className="text-sm text-moss hover:underline">
          ← All quotes
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-ink">{quote.fullName}</h1>
            <p className="mt-1 text-sm text-ink-muted">{quote.projectType}</p>
          </div>
          <div className="w-48">
            <p className="mb-1 text-xs tracking-wide text-ink-muted uppercase">Status</p>
            <QuoteStatusSelect quoteId={quote.id} current={quote.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-stone-line bg-white p-5">
          <h2 className="font-display text-xl text-ink">Request details</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            {fields.map((f) => (
              <div key={f.label} className="grid grid-cols-[140px_1fr] gap-2 border-b border-stone-line/60 pb-2">
                <dt className="text-ink-muted">{f.label}</dt>
                <dd className="text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <p className="text-xs tracking-wide text-ink-muted uppercase">Customer notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink">
              {quote.notes || "—"}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${quote.email}`} className="btn-secondary">
              Open mail app
            </a>
            <a href={`tel:${quote.phone}`} className="btn-secondary">
              Call {quote.phone}
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <QuoteReplyForm
            quoteId={quote.id}
            customerName={quote.fullName}
            customerEmail={quote.email}
            projectType={quote.projectType}
          />
          <QuoteNotesForm quoteId={quote.id} initialNotes={quote.adminNotes} />
        </div>
      </div>
    </div>
  );
}
