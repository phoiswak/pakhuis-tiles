"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Option = { id: string; label: string };

export function DamageRecordForm({ products }: { products: Option[] }) {
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
      quantity: Number(form.get("quantity")),
      reason: String(form.get("reason")),
      note: form.get("note") ? String(form.get("note")) : undefined,
    };

    try {
      const res = await fetch("/api/admin/damage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Record failed");
      }
      setStatus("success");
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Record failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border border-stone-line bg-white p-5">
      <h2 className="font-display text-xl text-ink">Record damage / waste</h2>
      <div className="grid gap-3 sm:grid-cols-2">
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
          <label className="field-label" htmlFor="quantity">
            Quantity (m²)
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            step="0.01"
            min="0.01"
            className="field"
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="reason">
            Reason
          </label>
          <select id="reason" name="reason" className="field" defaultValue="BROKEN">
            <option value="BROKEN">Broken</option>
            <option value="CRACKED">Cracked</option>
            <option value="WATER">Water</option>
            <option value="HANDLING">Handling</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="note">
            Note
          </label>
          <input id="note" name="note" className="field" />
        </div>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && <p className="text-sm text-moss">Damage recorded.</p>}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Record damage"}
      </button>
    </form>
  );
}
