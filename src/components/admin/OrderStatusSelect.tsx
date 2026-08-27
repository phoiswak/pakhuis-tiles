"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_COLLECTION",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
] as const;

export function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [busy, setBusy] = useState(false);

  async function onChange(next: string) {
    setBusy(true);
    setValue(next);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
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
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}
