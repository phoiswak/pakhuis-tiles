"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuoteNotesForm({
  quoteId,
  initialNotes,
}: {
  quoteId: string;
  initialNotes?: string | null;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes || "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: notes }),
      });
      if (!res.ok) throw new Error("Failed");
      setSaved(true);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-3 border border-stone-line bg-white p-5">
      <h2 className="font-display text-xl text-ink">Internal notes</h2>
      <textarea
        className="field min-h-[120px]"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Call notes, pricing discussed, follow-up date…"
      />
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-secondary" disabled={busy}>
          {busy ? "Saving…" : "Save notes"}
        </button>
        {saved && <span className="text-sm text-moss">Saved</span>}
      </div>
    </form>
  );
}
