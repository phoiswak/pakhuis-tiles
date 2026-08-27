"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserCreateForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      email: String(form.get("email")),
      phone: form.get("phone") ? String(form.get("phone")) : undefined,
      password: form.get("password") ? String(form.get("password")) : undefined,
      role: String(form.get("role")),
    };

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Create failed");
      }
      setStatus("success");
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 border border-stone-line bg-white p-5">
      <h2 className="font-display text-xl text-ink">New staff user</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">
            Name
          </label>
          <input id="name" name="name" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="role">
            Role
          </label>
          <select id="role" name="role" className="field" defaultValue="SALES">
            <option value="ADMIN">Admin</option>
            <option value="STORE_MANAGER">Store manager</option>
            <option value="SALES">Sales</option>
            <option value="WAREHOUSE">Warehouse</option>
            <option value="FINANCE">Finance</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="password">
            Password (default password123)
          </label>
          <input id="password" name="password" type="password" className="field" minLength={6} />
        </div>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {status === "success" && <p className="text-sm text-moss">User created.</p>}
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Create user"}
      </button>
    </form>
  );
}
