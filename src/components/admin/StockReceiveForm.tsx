"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = { id: string; label: string };

export function StockReceiveForm({
  products,
  suppliers,
}: {
  products: Option[];
  suppliers: Option[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      productId: String(form.get("productId")),
      type: String(form.get("type")),
      quantity: Number(form.get("quantity")),
      costPrice: form.get("costPrice") ? Number(form.get("costPrice")) : undefined,
      supplierId: form.get("supplierId") ? String(form.get("supplierId")) : undefined,
      note: form.get("note") ? String(form.get("note")) : undefined,
      invoiceRef: form.get("invoiceRef") ? String(form.get("invoiceRef")) : undefined,
    };

    try {
      const res = await fetch("/api/admin/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Stock update failed");
      }
      setStatus("success");
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Stock update failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-stone-line bg-white p-5">
      <h2 className="font-display text-xl text-ink">Receive / adjust stock</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="productId">
            Product
          </label>
          <select id="productId" name="productId" className="field" required>
            <option value="">Select…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="type">
            Type
          </label>
          <select id="type" name="type" className="field" defaultValue="RECEIVE">
            <option value="RECEIVE">Receive</option>
            <option value="ADJUST">Adjust</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="quantity">
            Quantity (m²)
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            step="0.01"
            className="field"
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="costPrice">
            Cost price
          </label>
          <input id="costPrice" name="costPrice" type="number" step="0.01" className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="supplierId">
            Supplier
          </label>
          <select id="supplierId" name="supplierId" className="field">
            <option value="">None</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="invoiceRef">
            Invoice ref
          </label>
          <input id="invoiceRef" name="invoiceRef" className="field" />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor="note">
          Note
        </label>
        <input id="note" name="note" className="field" />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && <p className="text-sm text-moss">Stock updated.</p>}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Post movement"}
      </button>
    </form>
  );
}
