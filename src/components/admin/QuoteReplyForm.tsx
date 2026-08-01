"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function QuoteReplyForm({
  quoteId,
  customerName,
  customerEmail,
  projectType,
}: {
  quoteId: string;
  customerName: string;
  customerEmail: string;
  projectType: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const defaultSubject = `Re: Your Pakhuis Tiles quote — ${projectType}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: String(form.get("subject") || ""),
          message: String(form.get("message") || ""),
          markContacted: true,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send reply");
      setStatus("success");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-stone-line bg-white p-5">
      <div>
        <h2 className="font-display text-xl text-ink">Email customer</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Sends to <strong>{customerEmail}</strong> and CC sales inbox.
        </p>
      </div>
      <label className="block">
        <span className="field-label">Subject</span>
        <input name="subject" required className="field" defaultValue={defaultSubject} />
      </label>
      <label className="block">
        <span className="field-label">Message</span>
        <textarea
          name="message"
          required
          rows={8}
          className="field min-h-[160px]"
          defaultValue={`Hi ${customerName},\n\nThank you for your quote request with Pakhuis Tiles.\n\n`}
        />
      </label>
      {status === "error" && (
        <p className="border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}
      {status === "success" && (
        <p className="border border-moss/30 bg-moss/5 px-3 py-2 text-sm text-ink">
          Email sent. Quote marked as contacted.
        </p>
      )}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send email to customer"}
      </button>
    </form>
  );
}
