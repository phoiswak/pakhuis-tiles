import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { getCategories, getProducts } from "@/lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Tiles",
  description: "Browse floor, wall, outdoor, commercial and luxury tiles from Pakhuis Tiles.",
};

export default async function TilesPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Catalogue</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Shop Tiles</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Explore our full range of floor, wall, outdoor, commercial and luxury tiles. Request a
        quote and our sales team will get back to you with pricing.
      </p>

      <div className="mt-8 max-w-xl">
        <SearchBar />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/tiles" className="border border-moss bg-moss px-3 py-1.5 text-sm text-white">
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/tiles/${c.slug}`}
            className="border border-stone-line bg-white px-3 py-1.5 text-sm text-ink hover:border-moss"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-8 text-ink-muted">
          No tiles in the catalogue yet. Run <code>npm run db:setup</code> to seed the database.
        </p>
      )}
    </div>
  );
}
