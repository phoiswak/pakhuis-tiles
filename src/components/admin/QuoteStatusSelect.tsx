"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QUOTE_STATUSES, quoteStatusLabel } from "@/lib/quotes-admin";

export function QuoteStatusSelect({
  quoteId,
  current,
}: {
  quoteId: string;
  current: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [busy, setBusy] = useState(false);

  async function onChange(next: string) {
    setBusy(true);
    setValue(next);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      setValue(current);
    } finally {
      setBusy(false);
    }
  }

  return (
    <select
      className="field py-1 text-xs"
      value={value}
      disabled={busy}
      onChange={(e) => onChange(e.target.value)}
    >
      {QUOTE_STATUSES.map((s) => (
        <option key={s} value={s}>
          {quoteStatusLabel(s)}
        </option>
      ))}
    </select>
  );
}
