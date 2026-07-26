import { ProductCard } from "@/components/ProductCard";
import { getSpecials } from "@/data/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Specials & Promotions",
  description: "Monthly specials and promotional tile pricing from Pakhuis Tiles.",
};

export default function SpecialsPage() {
  const specials = getSpecials();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Promotions</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Specials & Promotions</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Limited-time pricing on selected tiles. Stock is while supplies last — request a quote to
        lock in today&apos;s rate.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {specials.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
