"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CustomerDeleteButton({
  id,
  name,
  redirectTo,
}: {
  id: string;
  name: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function onDelete() {
    if (!window.confirm(`Delete customer ${name}? Their orders will stay, but this customer will be removed.`)) {
      return;
    }

    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        className="text-sm text-red-700 hover:underline disabled:text-ink-muted"
        onClick={onDelete}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </span>
  );
}
