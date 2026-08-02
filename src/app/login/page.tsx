"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/account";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    // Staff who open /staff or /admin land in the portal; others go to account
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Account</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Sign in</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Staff members: use{" "}
        <Link href="/staff" className="text-moss hover:underline">
          Staff login
        </Link>
        . Need an account?{" "}
        <Link href="/contact" className="text-moss hover:underline">
          Contact us
        </Link>
        .
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 border border-stone-line bg-white p-6">
        <label className="block">
          <span className="field-label">Email</span>
          <input name="email" type="email" required className="field" />
        </label>
        <label className="block">
          <span className="field-label">Password</span>
          <input name="password" type="password" required className="field" />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
