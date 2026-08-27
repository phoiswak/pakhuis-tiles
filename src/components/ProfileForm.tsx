"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProfileForm(props: {
  name: string;
  phone: string;
  companyName: string;
  physicalAddress: string;
  deliveryAddress: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    setStatus(res.ok ? "saved" : "error");
    if (res.ok) router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="field-label">Name</span>
        <input name="name" defaultValue={props.name} required className="field" />
      </label>
      <label className="block">
        <span className="field-label">Phone</span>
        <input name="phone" defaultValue={props.phone} className="field" />
      </label>
      <label className="block">
        <span className="field-label">Company</span>
        <input name="companyName" defaultValue={props.companyName} className="field" />
      </label>
      <label className="block">
        <span className="field-label">Physical address</span>
        <input name="physicalAddress" defaultValue={props.physicalAddress} className="field" />
      </label>
      <label className="block">
        <span className="field-label">Delivery address</span>
        <input name="deliveryAddress" defaultValue={props.deliveryAddress} className="field" />
      </label>
      <button type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Save profile"}
      </button>
      {status === "saved" && <p className="text-sm text-moss">Saved.</p>}
      {status === "error" && <p className="text-sm text-red-700">Could not save.</p>}
    </form>
  );
}
