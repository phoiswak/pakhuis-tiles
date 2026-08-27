"use client";

import { useState } from "react";
import { SITE } from "@/data/catalog";

const projectTypes = [
  "Residential Project",
  "Commercial Project",
  "Government Project",
  "Renovation",
  "New Construction",
];

const budgets = [
  "Under R10,000",
  "R10,000 – R50,000",
  "R50,000 – R150,000",
  "R150,000 – R500,000",
  "Over R500,000",
];

type Props = {
  defaultCategory?: string;
  defaultQuantity?: string;
  productSlug?: string;
  categories?: { slug: string; name: string }[];
};

export function QuoteForm({
  defaultCategory,
  defaultQuantity,
  productSlug,
  categories = [],
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          productSlug,
          installation: form.get("installation") === "true",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not submit quote");
      }
      setStatus("success");
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-moss/30 bg-moss/5 p-8">
        <h3 className="font-display text-2xl text-ink">Quote request received</h3>
        <p className="mt-3 text-ink-muted">
          Thanks — our sales consultants usually respond within one business day. We&apos;ll email
          you at the address you provided.
        </p>
        <button type="button" className="btn-secondary mt-6" onClick={() => setStatus("idle")}>
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">1. Your details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name *" name="fullName" required />
          <Field label="Company name" name="companyName" />
          <Field label="Email address *" name="email" type="email" required />
          <Field label="Phone number *" name="phone" type="tel" required />
          <div className="md:col-span-2">
            <Field label="Physical address" name="physicalAddress" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">2. Project information</h2>
        <label className="block">
          <span className="field-label">Project type *</span>
          <select name="projectType" required className="field" defaultValue="">
            <option value="" disabled>
              Select project type
            </option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">3. Tile requirements</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="field-label">Tile category</span>
            <select
              name="tileCategory"
              className="field"
              defaultValue={defaultCategory || ""}
            >
              <option value="">— Select —</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </label>
          <Field label="Tile size" name="tileSize" placeholder="e.g. 600x600mm" />
          <Field label="Colour preference" name="colourPreference" />
          <Field
            label="Quantity required (m²)"
            name="quantityM2"
            defaultValue={defaultQuantity}
          />
          <label className="block md:col-span-2">
            <span className="field-label">Budget range</span>
            <select name="budgetRange" className="field" defaultValue="">
              <option value="">— Select —</option>
              {budgets.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">4. Delivery</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="field-label">Delivery or collection?</span>
            <select name="deliveryOption" className="field" defaultValue="">
              <option value="">— Select —</option>
              <option value="Deliver to me">Deliver to me</option>
              <option value="I'll collect">I&apos;ll collect</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">Delivery area</span>
            <select name="deliveryArea" className="field" defaultValue="">
              <option value="">— Select —</option>
              {SITE.deliveryAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">5. Installation</h2>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="installation" value="true" className="mt-1" />
          <span>I also need tile installation services (we&apos;ll include this in the quote)</span>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">6. Additional notes</h2>
        <label className="block">
          <span className="field-label">Anything else we should know?</span>
          <textarea name="notes" rows={4} className="field min-h-[120px]" />
        </label>
      </section>

      {status === "error" && (
        <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : "Submit Quote Request"}
      </button>
      <p className="text-xs text-ink-muted">
        By submitting you agree to be contacted about your quotation. Your information is handled
        in line with POPIA.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="field"
      />
    </label>
  );
}
