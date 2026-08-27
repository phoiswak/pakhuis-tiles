"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PromotionCreateForm({ products }: { products: { id: string; name: string }[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const productIds = form.getAll("productIds").map(String);
    const payload = {
      name: String(form.get("name")),
      description: form.get("description") ? String(form.get("description")) : undefined,
      discountPercent: Number(form.get("discountPercent")),
      startDate: String(form.get("startDate")),
      endDate: String(form.get("endDate")),
      featured: form.get("featured") === "on",
      productIds,
    };

    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Create failed");
      }
      setStatus("success");
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border border-stone-line bg-white p-5">
      <h2 className="font-display text-xl text-ink">New promotion</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="discountPercent">
            Discount %
          </label>
          <input
            id="discountPercent"
            name="discountPercent"
            type="number"
            step="0.1"
            min="0"
            max="100"
            className="field"
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="startDate">
            Start date
          </label>
          <input id="startDate" name="startDate" type="date" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="endDate">
            End date
          </label>
          <input id="endDate" name="endDate" type="date" className="field" required />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="description">
          Description
        </label>
        <input id="description" name="description" className="field" />
      </div>
      <div>
        <span className="field-label">Products</span>
        <div className="max-h-40 space-y-1 overflow-auto border border-stone-line p-2 text-sm">
          {products.map((p) => (
            <label key={p.id} className="flex items-center gap-2">
              <input type="checkbox" name="productIds" value={p.id} />
              {p.name}
            </label>
          ))}
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" />
        Featured
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && <p className="text-sm text-moss">Promotion created.</p>}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Create promotion"}
      </button>
    </form>
  );
}
