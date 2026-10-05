"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MONTH_OPTIONS, specialYearOptions } from "@/lib/specials";
import { uploadTilePhoto } from "@/lib/upload-tile-photo";

type Product = {
  id: string;
  name: string;
  image: string;
  costPrice: number;
  pricePerM2: number;
  contractorPrice: number | null;
  wholesalePrice: number | null;
  promoPricePerM2: number | null;
  stockAvailable: number;
  lowStockAt: number;
  isFeatured: boolean;
  isSpecial: boolean;
  specialYear: number | null;
  specialMonth: number | null;
  active: boolean;
};

export function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      name: String(form.get("name") || ""),
      costPrice: Number(form.get("costPrice")),
      pricePerM2: Number(form.get("pricePerM2")),
      contractorPrice: form.get("contractorPrice")
        ? Number(form.get("contractorPrice"))
        : null,
      wholesalePrice: form.get("wholesalePrice")
        ? Number(form.get("wholesalePrice"))
        : null,
      promoPricePerM2: form.get("promoPricePerM2")
        ? Number(form.get("promoPricePerM2"))
        : null,
      stockAvailable: Number(form.get("stockAvailable")),
      lowStockAt: Number(form.get("lowStockAt")),
      isFeatured: form.get("isFeatured") === "on",
      isSpecial: form.get("isSpecial") === "on",
      specialYear: form.get("isSpecial") === "on" && form.get("specialYear")
        ? Number(form.get("specialYear"))
        : null,
      specialMonth: form.get("isSpecial") === "on" && form.get("specialMonth")
        ? Number(form.get("specialMonth"))
        : null,
      active: form.get("active") === "on",
    };

    try {
      if (file) {
        payload.image = await uploadTilePhoto(file);
      }
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Update failed");
      }
      setStatus("success");
      setFile(null);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Update failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 border border-stone-line bg-white p-6">
      <div>
        <label className="field-label" htmlFor="name">
          Name
        </label>
        <input id="name" name="name" className="field" defaultValue={product.name} required />
      </div>
      <div>
        <label className="field-label" htmlFor="photo">
          Tile photo
        </label>
        <div className="mt-2 flex items-start gap-4">
          <img
            src={preview || product.image}
            alt={product.name}
            className="h-28 w-28 object-cover border border-stone-line bg-stone-soft"
          />
          <div className="flex-1">
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp"
              className="field"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null);
                setStatus("idle");
              }}
            />
            <p className="mt-1 text-xs text-ink-muted">Leave empty to keep the current photo.</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="costPrice">
            Cost price
          </label>
          <input
            id="costPrice"
            name="costPrice"
            type="number"
            step="0.01"
            className="field"
            defaultValue={product.costPrice}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="pricePerM2">
            Retail / m²
          </label>
          <input
            id="pricePerM2"
            name="pricePerM2"
            type="number"
            step="0.01"
            className="field"
            defaultValue={product.pricePerM2}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="contractorPrice">
            Contractor / m²
          </label>
          <input
            id="contractorPrice"
            name="contractorPrice"
            type="number"
            step="0.01"
            className="field"
            defaultValue={product.contractorPrice ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="wholesalePrice">
            Wholesale / m²
          </label>
          <input
            id="wholesalePrice"
            name="wholesalePrice"
            type="number"
            step="0.01"
            className="field"
            defaultValue={product.wholesalePrice ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="promoPricePerM2">
            Promo / m²
          </label>
          <input
            id="promoPricePerM2"
            name="promoPricePerM2"
            type="number"
            step="0.01"
            className="field"
            defaultValue={product.promoPricePerM2 ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="stockAvailable">
            Stock available (m²)
          </label>
          <input
            id="stockAvailable"
            name="stockAvailable"
            type="number"
            step="0.01"
            className="field"
            defaultValue={product.stockAvailable}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="lowStockAt">
            Low stock at
          </label>
          <input
            id="lowStockAt"
            name="lowStockAt"
            type="number"
            step="0.01"
            className="field"
            defaultValue={product.lowStockAt}
            required
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="isSpecial" defaultChecked={product.isSpecial} />
          Special
        </label>
        <label className="inline-flex items-center gap-2">
          <span className="text-ink-muted">Month</span>
          <select name="specialMonth" className="field w-auto" defaultValue={product.specialMonth ?? ""}>
            <option value="">—</option>
            {MONTH_OPTIONS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select name="specialYear" className="field w-auto" defaultValue={product.specialYear ?? specialYearOptions()[0]}>
            {specialYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="active" defaultChecked={product.active} />
          Active
        </label>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && <p className="text-sm text-moss">Saved.</p>}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}
