"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CustomerCreateForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/admin/customers", {
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
      <h2 className="font-display text-xl text-ink">New customer</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contactPerson">
            Contact person
          </label>
          <input id="contactPerson" name="contactPerson" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="companyName">
            Company
          </label>
          <input id="companyName" name="companyName" className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="pricingTier">
            Pricing tier
          </label>
          <select id="pricingTier" name="pricingTier" className="field" defaultValue="RETAIL">
            <option value="RETAIL">Retail</option>
            <option value="CONTRACTOR">Contractor</option>
            <option value="WHOLESALE">Wholesale</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="physicalAddress">
            Address
          </label>
          <input id="physicalAddress" name="physicalAddress" className="field" />
        </div>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && <p className="text-sm text-moss">Customer created.</p>}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Create customer"}
      </button>
    </form>
  );
}
