"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type SupplierFormValues = {
  id: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  vatNumber: string | null;
  physicalAddress: string | null;
  active: boolean;
};

export function SupplierCreateForm({ supplier }: { supplier?: SupplierFormValues }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const isEdit = Boolean(supplier);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = {
      ...Object.fromEntries(form.entries()),
      active: isEdit ? form.get("active") === "on" : true,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/suppliers/${supplier!.id}` : "/api/admin/suppliers", {
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
      <h2 className="font-display text-xl text-ink">{isEdit ? "Edit supplier" : "New supplier"}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" className="field" required defaultValue={supplier?.name ?? ""} />
        </div>
        <div>
          <label className="field-label" htmlFor="contactPerson">
            Contact person
          </label>
          <input
            id="contactPerson"
            name="contactPerson"
            className="field"
            defaultValue={supplier?.contactPerson ?? ""}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" className="field" defaultValue={supplier?.email ?? ""} />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" className="field" defaultValue={supplier?.phone ?? ""} />
        </div>
        <div>
          <label className="field-label" htmlFor="vatNumber">
            VAT number
          </label>
          <input id="vatNumber" name="vatNumber" className="field" defaultValue={supplier?.vatNumber ?? ""} />
        </div>
        <div>
          <label className="field-label" htmlFor="physicalAddress">
            Address
          </label>
          <input
            id="physicalAddress"
            name="physicalAddress"
            className="field"
            defaultValue={supplier?.physicalAddress ?? ""}
          />
        </div>
      </div>
      {isEdit ? (
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={supplier?.active ?? true} />
          Active
        </label>
      ) : null}
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && (
        <p className="text-sm text-moss">{isEdit ? "Supplier updated." : "Supplier created."}</p>
      )}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : isEdit ? "Save supplier" : "Create supplier"}
      </button>
    </form>
  );
}
