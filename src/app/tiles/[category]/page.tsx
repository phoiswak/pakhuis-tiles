import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";
import type { Metadata } from "next";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) return { title: "Category" };
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const [cat, items, categories] = await Promise.all([
    getCategory(category),
    getProductsByCategory(category),
    getCategories(),
  ]);
  if (!cat) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Catalogue</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">{cat.name}</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">{cat.description}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/tiles"
          className="border border-stone-line bg-white px-3 py-1.5 text-sm text-ink hover:border-moss"
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/tiles/${c.slug}`}
            className={
              c.slug === category
                ? "border border-moss bg-moss px-3 py-1.5 text-sm text-white"
                : "border border-stone-line bg-white px-3 py-1.5 text-sm text-ink hover:border-moss"
            }
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
