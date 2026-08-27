import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCategory, getProduct, getProductsByCategory } from "@/lib/catalog";
import { effectivePrice } from "@/data/catalog";
import { formatZar } from "@/lib/utils";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, relatedAll] = await Promise.all([
    getCategory(product.categorySlug),
    getProductsByCategory(product.categorySlug),
  ]);
  const price = effectivePrice(product);
  const onPromo = product.promoPricePerM2 != null;
  const relatedCatalog = relatedAll.filter((p) => p.slug !== product.slug).slice(0, 3);

  const stockLabel =
    product.stockStatus === "IN_STOCK"
      ? "In Stock"
      : product.stockStatus === "LOW_STOCK"
        ? "Low Stock"
        : "Out of Stock";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="text-sm text-ink-muted">
        <Link href="/tiles" className="hover:text-moss">
          Shop Tiles
        </Link>
        {" / "}
        {category && (
          <Link href={`/tiles/${category.slug}`} className="hover:text-moss">
            {category.name}
          </Link>
        )}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden border border-stone-line bg-stone-soft">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {product.isSpecial && (
              <span className="bg-brass px-2 py-1 text-[10px] font-medium tracking-wider text-ink uppercase">
                Monthly Special
              </span>
            )}
            <span className="border border-stone-line bg-white px-2 py-1 text-[10px] font-medium tracking-wider text-ink uppercase">
              {stockLabel}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">{product.name}</h1>
          <p className="mt-2 text-sm tracking-wide text-ink-muted">
            {product.sku} · {product.sizeMm}
          </p>
          <div className="mt-6 flex items-baseline gap-3">
            {onPromo && (
              <span className="text-lg text-ink-muted line-through">
                {formatZar(product.pricePerM2)}/m²
              </span>
            )}
            <span className="font-display text-3xl text-moss">
              {formatZar(price)}
              <span className="text-base font-normal text-ink-muted">/m²</span>
            </span>
          </div>
          <p className="mt-6 leading-relaxed text-ink-muted">{product.description}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-stone-line py-6 text-sm">
            <div>
              <dt className="text-ink-muted">Material</dt>
              <dd className="mt-1 font-medium text-ink">{product.material}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Finish</dt>
              <dd className="mt-1 font-medium text-ink">{product.finish}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Size</dt>
              <dd className="mt-1 font-medium text-ink">{product.sizeMm}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Category</dt>
              <dd className="mt-1 font-medium text-ink">{category?.name ?? product.categorySlug}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/quote?product=${product.slug}&category=${product.categorySlug}`}
              className="btn-primary"
            >
              Request Quote
            </Link>
            <Link href="/calculator" className="btn-secondary">
              Tile Calculator
            </Link>
          </div>
        </div>
      </div>

      {relatedCatalog.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-ink">Related tiles</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCatalog.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
