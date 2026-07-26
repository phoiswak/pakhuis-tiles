import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/catalog";
import { effectivePrice } from "@/data/catalog";
import { formatZar } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const price = effectivePrice(product);
  const onPromo = product.promoPricePerM2 != null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden border border-stone-line bg-white transition duration-300 hover:-translate-y-0.5 hover:border-moss/40 hover:shadow-[0_18px_40px_-28px_rgba(28,25,23,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-soft">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isSpecial && (
            <span className="bg-brass px-2 py-1 text-[10px] font-medium tracking-wider text-ink uppercase">
              Monthly Special
            </span>
          )}
          <span className="bg-white/90 px-2 py-1 text-[10px] font-medium tracking-wider text-ink uppercase backdrop-blur">
            {product.stockStatus === "IN_STOCK"
              ? "In Stock"
              : product.stockStatus === "LOW_STOCK"
                ? "Low Stock"
                : "Out of Stock"}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs tracking-wide text-ink-muted">
          {product.sku} · {product.sizeMm}
        </p>
        <h3 className="font-display text-xl text-ink">{product.name}</h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          {onPromo && (
            <span className="text-sm text-ink-muted line-through">
              {formatZar(product.pricePerM2)}/m²
            </span>
          )}
          <span className="text-base font-medium text-moss">
            {formatZar(price)}
            <span className="text-sm font-normal text-ink-muted">/m²</span>
          </span>
        </div>
        <span className="text-sm text-ink-muted transition group-hover:text-moss">
          View tile →
        </span>
      </div>
    </Link>
  );
}
