"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomerDeleteButton } from "@/components/admin/CustomerDeleteButton";

export type CustomerFormValues = {
  id: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  physicalAddress: string | null;
  pricingTier: string;
};

export function CustomerCreateForm({ customer }: { customer?: CustomerFormValues }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const isEdit = Boolean(customer);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch(isEdit ? `/api/admin/customers/${customer!.id}` : "/api/admin/customers", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || (isEdit ? "Update failed" : "Create failed"));
      }
      setStatus("success");
      if (!isEdit) formEl.reset();
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : isEdit ? "Update failed" : "Create failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border border-stone-line bg-white p-5">
      <h2 className="font-display text-xl text-ink">{isEdit ? "Edit customer" : "New customer"}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="contactPerson">
            Contact person
          </label>
          <input
            id="contactPerson"
            name="contactPerson"
            className="field"
            required
            defaultValue={customer?.contactPerson ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="field"
            required
            defaultValue={customer?.email ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" className="field" defaultValue={customer?.phone ?? ""} />
        </div>
        <div>
          <label className="field-label" htmlFor="companyName">
            Company
          </label>
          <input id="companyName" name="companyName" className="field" defaultValue={customer?.companyName ?? ""} />
        </div>
        <div>
          <label className="field-label" htmlFor="pricingTier">
            Pricing tier
          </label>
          <select
            id="pricingTier"
            name="pricingTier"
            className="field"
            defaultValue={customer?.pricingTier ?? "RETAIL"}
          >
            <option value="RETAIL">Retail</option>
            <option value="CONTRACTOR">Contractor</option>
            <option value="WHOLESALE">Wholesale</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="physicalAddress">
            Address
          </label>
          <input
            id="physicalAddress"
            name="physicalAddress"
            className="field"
            defaultValue={customer?.physicalAddress ?? ""}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && (
        <p className="text-sm text-moss">{isEdit ? "Customer updated." : "Customer created."}</p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" ? "Saving…" : isEdit ? "Save customer" : "Create customer"}
        </button>
        {customer ? <CustomerDeleteButton id={customer.id} name={customer.contactPerson} redirectTo="/admin/customers" /> : null}
      </div>
    </form>
  );
}
