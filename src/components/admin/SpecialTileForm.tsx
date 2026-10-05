"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MONTH_OPTIONS, specialYearOptions } from "@/lib/specials";
import { uploadTilePhoto } from "@/lib/upload-tile-photo";

export function SpecialTileForm({
  categories,
  images,
}: {
  categories: { id: string; name: string }[];
  images: string[];
}) {
  const router = useRouter();
  const years = specialYearOptions();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [image, setImage] = useState("");
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
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    try {
      const uploaded = file ? await uploadTilePhoto(file) : "";
      const imageValue =
        uploaded || String(form.get("imageUrl") || "").trim() || String(form.get("image") || "");
      if (!imageValue) {
        throw new Error("Please add a photo of the tile.");
      }
      const payload = {
        name: String(form.get("name")),
        description: form.get("description") ? String(form.get("description")) : undefined,
        image: imageValue,
        sizeMm: String(form.get("sizeMm")),
        finish: form.get("finish") ? String(form.get("finish")) : undefined,
        material: form.get("material") ? String(form.get("material")) : undefined,
        categoryId: String(form.get("categoryId")),
        pricePerM2: Number(form.get("pricePerM2")),
        promoPricePerM2: form.get("promoPricePerM2") ? Number(form.get("promoPricePerM2")) : null,
        stockAvailable: form.get("stockAvailable") ? Number(form.get("stockAvailable")) : 50,
        isSpecial: true,
        specialYear: Number(form.get("specialYear")),
        specialMonth: Number(form.get("specialMonth")),
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Create failed");
      }
      setStatus("success");
      formEl.reset();
      setImage("");
      setFile(null);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border border-stone-line bg-white p-5">
      <h2 className="font-display text-xl text-ink">New special tile</h2>
      <p className="text-sm text-ink-muted">
        The special price and ribbon show only during the month you pick. After that month the
        special disappears from the shop.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">
            Tile name
          </label>
          <input id="name" name="name" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="categoryId">
            Category
          </label>
          <select id="categoryId" name="categoryId" className="field" required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="sizeMm">
            Size
          </label>
          <input id="sizeMm" name="sizeMm" className="field" placeholder="600x1200mm" required />
        </div>
        <div>
          <label className="field-label" htmlFor="finish">
            Finish
          </label>
          <input id="finish" name="finish" className="field" placeholder="Matt" />
        </div>
        <div>
          <label className="field-label" htmlFor="material">
            Material
          </label>
          <input id="material" name="material" className="field" placeholder="Porcelain" />
        </div>
        <div>
          <label className="field-label" htmlFor="stockAvailable">
            Stock (m²)
          </label>
          <input id="stockAvailable" name="stockAvailable" type="number" step="0.01" min="0" className="field" defaultValue="50" />
        </div>
        <div>
          <label className="field-label" htmlFor="pricePerM2">
            Regular price / m²
          </label>
          <input id="pricePerM2" name="pricePerM2" type="number" step="0.01" min="0.01" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="promoPricePerM2">
            Special price / m²
          </label>
          <input id="promoPricePerM2" name="promoPricePerM2" type="number" step="0.01" min="0.01" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="specialMonth">
            Special month
          </label>
          <select id="specialMonth" name="specialMonth" className="field" required defaultValue={new Date().getMonth() + 1}>
            {MONTH_OPTIONS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="specialYear">
            Special year
          </label>
          <select id="specialYear" name="specialYear" className="field" required defaultValue={years[0]}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="photo">
            Tile photo
          </label>
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
          <p className="mt-1 text-xs text-ink-muted">
            Upload a photo of this tile (WhatsApp pictures work). This is the picture customers see
            in the shop.
          </p>
          {preview && (
            <img src={preview} alt="Tile preview" className="mt-3 h-36 w-36 object-cover border border-stone-line bg-stone-soft" />
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="image">
            Or use an existing shop photo
          </label>
          <select
            id="image"
            name="image"
            className="field"
            value={image}
            onChange={(event) => setImage(event.target.value)}
          >
            <option value="">Choose a photo…</option>
            {images.map((src) => (
              <option key={src} value={src}>
                {src.replace("/images/", "")}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="imageUrl">
            Or image URL / path
          </label>
          <input id="imageUrl" name="imageUrl" className="field" placeholder="/images/special-ashenwood-plank.jpg" />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="description">
            Description
          </label>
          <input id="description" name="description" className="field" />
        </div>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && <p className="text-sm text-moss">Special tile created. It will hide when the month ends.</p>}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Add special tile"}
      </button>
    </form>
  );
}
