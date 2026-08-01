import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order confirmed" };

type Props = { searchParams: Promise<{ order?: string; invoice?: string }> };

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="section-kicker">Thank you</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Order received</h1>
      <p className="mt-4 text-ink-muted">
        Order <strong>{params.order || "—"}</strong>
        {params.invoice ? (
          <>
            {" "}
            · Invoice <strong>{params.invoice}</strong>
          </>
        ) : null}
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        Our team will confirm stock and arrange delivery or collection.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/account" className="btn-primary">
          View account
        </Link>
        <Link href="/tiles" className="btn-secondary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
