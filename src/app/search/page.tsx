import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { getCategories, searchProducts } from "@/lib/catalog";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  return {
    title: query ? `Search: ${query}` : "Search tiles",
    description: "Search the Pakhuis Tiles catalogue by name, size, colour, or material.",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const [categories, results] = await Promise.all([
    getCategories(),
    query ? searchProducts(query) : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Catalogue</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Search tiles</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Find tiles by name, SKU, size, finish, material, or category.
      </p>

      <div className="mt-8 max-w-xl">
        <SearchBar initialQuery={query} autoFocus />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/tiles" className="border border-stone-line bg-white px-3 py-1.5 text-sm text-ink hover:border-moss">
          Browse all
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

      {query ? (
        <>
          <p className="mt-8 text-sm text-ink-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-medium text-ink">&ldquo;{query}&rdquo;</span>
          </p>
          {results.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8 border border-stone-line bg-white p-8">
              <h2 className="font-display text-2xl text-ink">No tiles found</h2>
              <p className="mt-2 text-ink-muted">
                Try a shorter search, a colour, or a size like <em>600x600</em>. You can also{" "}
                <Link href="/quote" className="text-moss hover:underline">
                  request a quote
                </Link>{" "}
                and we&apos;ll help you find the right tile.
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="mt-8 text-ink-muted">Type a search above to see matching tiles.</p>
      )}
    </div>
  );
}
