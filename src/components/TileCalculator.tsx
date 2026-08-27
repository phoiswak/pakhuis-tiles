"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/data/catalog";
import { effectivePrice } from "@/data/catalog";
import { formatZar } from "@/lib/utils";

export function TileCalculator({ products }: { products: Product[] }) {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [wastage, setWastage] = useState(10);
  const [productSlug, setProductSlug] = useState("");

  const result = useMemo(() => {
    const l = Number(length);
    const w = Number(width);
    if (!l || !w || l <= 0 || w <= 0) return null;
    const area = l * w;
    const withWaste = area * (1 + wastage / 100);
    const product = products.find((p) => p.slug === productSlug);
    const price = product ? effectivePrice(product) : null;
    return {
      area,
      withWaste,
      product,
      estimate: price != null ? withWaste * price : null,
    };
  }, [length, width, wastage, productSlug]);

  const quoteHref = result
    ? `/quote?quantity=${result.withWaste.toFixed(1)}${
        result.product ? `&category=${encodeURIComponent(result.product.categorySlug)}` : ""
      }${result.product ? `&product=${result.product.slug}` : ""}`
    : "/quote";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5 border border-stone-line bg-white p-6 md:p-8">
        <label className="block">
          <span className="field-label">Room length (meters)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="field"
            placeholder="e.g. 4.5"
          />
        </label>
        <label className="block">
          <span className="field-label">Room width (meters)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="field"
            placeholder="e.g. 3.2"
          />
        </label>
        <label className="block">
          <span className="field-label">Wastage allowance</span>
          <select
            className="field"
            value={wastage}
            onChange={(e) => setWastage(Number(e.target.value))}
          >
            <option value={10}>10% — standard layouts</option>
            <option value={15}>15% — diagonal / herringbone</option>
            <option value={5}>5% — simple square rooms</option>
          </select>
        </label>
        <label className="block">
          <span className="field-label">Choose a tile (optional, for cost estimate)</span>
          <select
            className="field"
            value={productSlug}
            onChange={(e) => setProductSlug(e.target.value)}
          >
            <option value="">— Select a tile —</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-ink-muted">
          Tip: we recommend ordering 10% extra for cuts, patterns and future repairs. Complex
          layouts may need up to 15%.
        </p>
      </div>

      <div className="relative overflow-hidden border border-stone-line bg-ink p-6 text-stone-soft md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,163,90,0.18),transparent_55%)]" />
        <div className="relative">
          <p className="text-xs tracking-[0.2em] text-brass uppercase">Estimate</p>
          {result ? (
            <div className="mt-6 space-y-4">
              <Stat label="Room area" value={`${result.area.toFixed(2)} m²`} />
              <Stat
                label={`Recommended order (+${wastage}%)`}
                value={`${result.withWaste.toFixed(2)} m²`}
              />
              {result.product && (
                <Stat label="Selected tile" value={result.product.name} />
              )}
              {result.estimate != null && (
                <Stat label="Estimated material cost" value={formatZar(result.estimate)} accent />
              )}
            </div>
          ) : (
            <p className="mt-6 text-stone-muted">
              Enter your room dimensions to see square metres, recommended quantity and estimated
              cost.
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={quoteHref} className="btn-primary">
              Request a Quote with these quantities
            </Link>
            <Link href="/tiles" className="btn-ghost-light">
              Browse Tiles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border-b border-white/10 pb-3">
      <p className="text-xs tracking-wide text-stone-muted uppercase">{label}</p>
      <p className={`mt-1 font-display text-2xl ${accent ? "text-brass" : "text-stone-soft"}`}>
        {value}
      </p>
    </div>
  );
}
