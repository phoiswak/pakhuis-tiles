import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, canAccessAdmin } from "@/lib/auth";

export const metadata = {
  title: "Staff login",
};

export default async function StaffLandingPage() {
  const session = await getServerSession(authOptions);
  if (canAccessAdmin(session?.user?.role, session?.user?.email)) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:px-6 md:py-24">
      <p className="section-kicker">Pakhuis staff</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Staff portal</h1>
      <p className="mt-4 text-ink-muted">
        Sign in with your Pakhuis work email to open the admin dashboard, view quote
        requests, and follow up with customers.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/login?callbackUrl=/admin" className="btn-primary">
          Staff sign in
        </Link>
        <Link href="/" className="btn-secondary">
          Back to website
        </Link>
      </div>
      <p className="mt-8 text-sm text-ink-muted">
        Don&apos;t have access? Ask an existing admin to add your email under{" "}
        <strong>Admin → Users</strong>.
      </p>
    </div>
  );
}
