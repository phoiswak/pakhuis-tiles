"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Could not register");
      return;
    }
    await signIn("credentials", {
      email: String(payload.email),
      password: String(payload.password),
      redirect: false,
    });
    setLoading(false);
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Account</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Create account</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 border border-stone-line bg-white p-6">
        <label className="block">
          <span className="field-label">Full name *</span>
          <input name="name" required className="field" />
        </label>
        <label className="block">
          <span className="field-label">Company</span>
          <input name="companyName" className="field" />
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
          <span className="field-label">Password * (min 6)</span>
          <input name="password" type="password" required minLength={6} className="field" />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-ink-muted">
        Already registered?{" "}
        <Link href="/login" className="text-moss hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
