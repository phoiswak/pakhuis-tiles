"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not send message");
      }
      setStatus("success");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-moss/30 bg-moss/5 p-6">
        <h3 className="font-display text-xl text-ink">Message sent</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Thanks — we&apos;ll get back to you as soon as we can.
        </p>
        <button type="button" className="btn-secondary mt-4" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="field-label">Name *</span>
        <input name="name" required className="field" />
      </label>
      <label className="block">
        <span className="field-label">Email *</span>
        <input name="email" type="email" required className="field" />
      </label>
      <label className="block">
        <span className="field-label">Phone</span>
        <input name="phone" type="tel" className="field" />
      </label>
      <label className="block">
        <span className="field-label">Subject</span>
        <input name="subject" className="field" />
      </label>
      <label className="block">
        <span className="field-label">Message *</span>
        <textarea name="message" required rows={5} className="field min-h-[140px]" />
      </label>
      {status === "error" && (
        <p className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
