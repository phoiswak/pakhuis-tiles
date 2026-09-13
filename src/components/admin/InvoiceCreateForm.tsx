"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_INVOICE_NOTES, DEFAULT_INVOICE_TERMS } from "@/data/staff-invoices";
import { m2PerBox, money } from "@/lib/invoice-coverage";
import { formatZar } from "@/lib/utils";

export type InvoiceProductOption = {
  slug: string;
  sku: string;
  name: string;
  image: string;
  sizeMm: string;
  pricePerM2: number;
  promoPricePerM2?: number | null;
};

export type InvoiceCustomerOption = {
  id: string;
  contactPerson: string;
  companyName: string | null;
};

type Line = {
  key: string;
  productSlug: string;
  description: string;
  itemCode: string;
  sizeMm: string;
  image: string;
  quantityM2: number;
  boxesQuantity: number;
  rate: number;
  amount: number;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function emptyLine(): Line {
  return {
    key: crypto.randomUUID(),
    productSlug: "",
    description: "",
    itemCode: "",
    sizeMm: "",
    image: "",
    quantityM2: 1,
    boxesQuantity: 1,
    rate: 0,
    amount: 0,
  };
}

function applyProduct(line: Line, product: InvoiceProductOption): Line {
  const coverage = m2PerBox(product.sizeMm) || 1;
  const rate = product.promoPricePerM2 ?? product.pricePerM2;
  const quantityM2 = coverage;
  return {
    ...line,
    productSlug: product.slug,
    description: product.name,
    itemCode: product.sku,
    sizeMm: product.sizeMm.replace(/x/gi, "×"),
    image: product.image,
    quantityM2,
    boxesQuantity: 1,
    rate,
    amount: money(rate * quantityM2),
  };
}

export function InvoiceCreateForm({
  nextNumber,
  products,
  customers,
  defaultTech,
}: {
  nextNumber: string;
  products: InvoiceProductOption[];
  customers: InvoiceCustomerOption[];
  defaultTech: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [billTo, setBillTo] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [tech, setTech] = useState(defaultTech);
  const [issuedAt, setIssuedAt] = useState(todayIso());
  const [dueAt, setDueAt] = useState(plusDaysIso(2));
  const [taxPercent, setTaxPercent] = useState(15);
  const [notes, setNotes] = useState(DEFAULT_INVOICE_NOTES);
  const [terms, setTerms] = useState(DEFAULT_INVOICE_TERMS);
  const [items, setItems] = useState<Line[]>([emptyLine()]);

  const totals = useMemo(() => {
    const subtotal = money(items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0));
    const tax = money(subtotal * (Number(taxPercent) / 100));
    return { subtotal, tax, total: money(subtotal + tax) };
  }, [items, taxPercent]);

  function updateLine(key: string, patch: Partial<Line>, recalc: "m2" | "boxes" | "rate" | "amount" | "none" = "none") {
    setItems((current) =>
      current.map((item) => {
        if (item.key !== key) return item;
        const next = { ...item, ...patch };
        const coverage = m2PerBox(next.sizeMm);
        if (recalc === "boxes" && coverage) {
          next.quantityM2 = money(next.boxesQuantity * coverage);
          next.amount = money(next.rate * next.quantityM2);
        } else if (recalc === "m2") {
          if (coverage) next.boxesQuantity = Number((next.quantityM2 / coverage).toFixed(3));
          next.amount = money(next.rate * next.quantityM2);
        } else if (recalc === "rate") {
          next.amount = money(next.rate * next.quantityM2);
        }
        return next;
      }),
    );
  }

  function onProductChange(key: string, slug: string) {
    const product = products.find((entry) => entry.slug === slug);
    if (!product) {
      updateLine(key, { productSlug: "", description: "", itemCode: "", sizeMm: "", image: "" });
      return;
    }
    setItems((current) => current.map((item) => (item.key === key ? applyProduct(item, product) : item)));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    const payload = {
      billTo,
      tech,
      issuedAt,
      dueAt,
      notes,
      terms,
      taxPercent: Number(taxPercent),
      items: items.map((item) => ({
        productSlug: item.productSlug || undefined,
        description: item.description,
        itemCode: item.itemCode,
        sizeMm: item.sizeMm,
        image: item.image || null,
        quantity: item.boxesQuantity,
        quantityM2: Number(item.quantityM2),
        boxesQuantity: Number(item.boxesQuantity),
        rate: Number(item.rate),
        amount: Number(item.amount),
      })),
    };

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Create failed");
      }
      router.push(`/admin/invoices/${data.invoice.number}`);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 border border-stone-line bg-white p-5 lg:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="customerId">
            Existing customer
          </label>
          <select
            id="customerId"
            className="field"
            value={customerId}
            onChange={(event) => {
              const value = event.target.value;
              setCustomerId(value);
              const customer = customers.find((entry) => entry.id === value);
              if (customer) {
                setBillTo(customer.companyName || customer.contactPerson);
              }
            }}
          >
            <option value="">Enter a name below</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.contactPerson}
                {customer.companyName ? ` · ${customer.companyName}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="billTo">
            Bill to
          </label>
          <input
            id="billTo"
            className="field"
            required
            value={billTo}
            onChange={(event) => setBillTo(event.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="tech">
            Tech
          </label>
          <input id="tech" className="field" value={tech} onChange={(event) => setTech(event.target.value)} />
        </div>
        <div>
          <p className="field-label">Invoice number</p>
          <p className="field bg-stone-soft/50 font-mono text-sm">#{nextNumber}</p>
        </div>
        <div>
          <label className="field-label" htmlFor="issuedAt">
            Date
          </label>
          <input
            id="issuedAt"
            type="date"
            className="field"
            required
            value={issuedAt}
            onChange={(event) => setIssuedAt(event.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="dueAt">
            Due date
          </label>
          <input
            id="dueAt"
            type="date"
            className="field"
            required
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="taxPercent">
            Tax %
          </label>
          <input
            id="taxPercent"
            type="number"
            min="0"
            max="100"
            step="0.01"
            className="field"
            value={taxPercent}
            onChange={(event) => setTaxPercent(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-stone-line bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl text-ink">Line items</h2>
          <button type="button" className="btn-secondary" onClick={() => setItems((current) => [...current, emptyLine()])}>
            Add item
          </button>
        </div>
        <table className="mt-4 w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-stone-line text-xs tracking-wide text-ink-muted uppercase">
            <tr>
              <th className="py-2 pr-2 font-medium">Product</th>
              <th className="py-2 pr-2 font-medium">Code</th>
              <th className="py-2 pr-2 font-medium">Size</th>
              <th className="py-2 pr-2 font-medium">m²</th>
              <th className="py-2 pr-2 font-medium">Boxes</th>
              <th className="py-2 pr-2 font-medium">Rate</th>
              <th className="py-2 pr-2 font-medium">Amount</th>
              <th className="py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.key} className="border-b border-stone-line/60 align-top">
                <td className="py-2 pr-2">
                  <select
                    className="field"
                    value={item.productSlug}
                    onChange={(event) => onProductChange(item.key, event.target.value)}
                    required
                  >
                    <option value="">Select a tile</option>
                    {products.map((product) => (
                      <option key={product.slug} value={product.slug}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="field font-mono text-xs"
                    value={item.itemCode}
                    onChange={(event) => updateLine(item.key, { itemCode: event.target.value })}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input className="field" value={item.sizeMm} readOnly />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="field"
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={item.quantityM2}
                    onChange={(event) => updateLine(item.key, { quantityM2: Number(event.target.value) }, "m2")}
                    required
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="field"
                    type="number"
                    min="0.001"
                    step="0.001"
                    value={item.boxesQuantity}
                    onChange={(event) => updateLine(item.key, { boxesQuantity: Number(event.target.value) }, "boxes")}
                    required
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="field"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(event) => updateLine(item.key, { rate: Number(event.target.value) }, "rate")}
                    required
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="field"
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={(event) => updateLine(item.key, { amount: Number(event.target.value) }, "amount")}
                    required
                  />
                </td>
                <td className="py-2">
                  <button
                    type="button"
                    className="text-sm text-red-700 hover:underline disabled:text-ink-muted"
                    disabled={items.length === 1}
                    onClick={() => setItems((current) => current.filter((entry) => entry.key !== item.key))}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="mt-4 ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd>{formatZar(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Tax ({taxPercent}%)</dt>
            <dd>{formatZar(totals.tax)}</dd>
          </div>
          <div className="flex justify-between font-medium">
            <dt>Total</dt>
            <dd>{formatZar(totals.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-4 border border-stone-line bg-white p-5 lg:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            className="field min-h-28"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="terms">
            Bank details / terms
          </label>
          <textarea
            id="terms"
            className="field min-h-28"
            value={terms}
            onChange={(event) => setTerms(event.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Create invoice"}
      </button>
    </form>
  );
}
