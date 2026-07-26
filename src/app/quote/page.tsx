import { QuoteForm } from "@/components/QuoteForm";
import { getCategory, getProduct } from "@/data/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Quotation",
  description: "Request a free, no-obligation tile quotation from Pakhuis Tiles Pretoria East.",
};

type Props = {
  searchParams: Promise<{
    quantity?: string;
    category?: string;
    product?: string;
  }>;
};

export default async function QuotePage({ searchParams }: Props) {
  const params = await searchParams;
  const product = params.product ? getProduct(params.product) : undefined;
  const category = params.category ? getCategory(params.category) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Free & no obligation</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Request a Quotation</h1>
      <p className="mt-4 text-ink-muted">
        Tell us about your project and our sales team will prepare a detailed quotation — usually
        within one business day.
      </p>
      {product && (
        <p className="mt-4 border border-moss/25 bg-moss/5 px-4 py-3 text-sm text-ink">
          Quoting for <strong>{product.name}</strong> ({product.sku})
        </p>
      )}
      <div className="mt-10 border border-stone-line bg-white p-6 md:p-8">
        <QuoteForm
          defaultCategory={category?.name}
          defaultQuantity={params.quantity}
          productSlug={product?.slug}
        />
      </div>
    </div>
  );
}
