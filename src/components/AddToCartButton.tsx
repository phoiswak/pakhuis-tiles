"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";

type Props = {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  image: string;
  unitPrice: number;
};

export function AddToCartButton({ productId, slug, name, sku, image, unitPrice }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function onAdd() {
    addItem({ productId, slug, name, sku, image, unitPrice }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="block">
        <span className="field-label">Quantity (m²)</span>
        <input
          type="number"
          min={0.5}
          step={0.5}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value) || 1)}
          className="field w-28"
        />
      </label>
      <button type="button" className="btn-primary" onClick={onAdd}>
        {added ? "Added to cart" : "Add to Cart"}
      </button>
    </div>
  );
}
