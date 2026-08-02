"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/tiles", label: "Shop Tiles" },
  { href: "/specials", label: "Specials" },
  { href: "/calculator", label: "Calculator" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const staffRoles = new Set([
  "ADMIN",
  "STORE_MANAGER",
  "SALES",
  "WAREHOUSE",
  "FINANCE",
]);

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const isStaff = session?.user?.role ? staffRoles.has(session.user.role) : false;
  const hideChrome = pathname.startsWith("/admin");

  if (hideChrome) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-line/80 bg-stone-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:gap-5 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.jpg"
            alt="Pakhuis Tiles logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-sm object-cover"
            priority
          />
          <span className="font-display text-lg tracking-[0.14em] text-ink uppercase">
            Pakhuis Tiles
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:gap-5 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 text-sm tracking-wide text-ink-muted transition hover:text-ink",
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "text-ink font-medium"
                  : "",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {session ? (
            <>
              {isStaff && (
                <Link
                  href="/admin"
                  className="btn-secondary hidden h-10 px-3 py-0 md:inline-flex"
                >
                  Admin
                </Link>
              )}
              <button
                type="button"
                className="btn-secondary hidden h-10 px-3 py-0 lg:inline-flex"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </button>
            </>
          ) : null}

          <Link
            href="/quote"
            className="btn-primary h-10 px-3 py-0 whitespace-nowrap sm:px-4"
          >
            Request Quote
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-stone-line bg-white text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-stone-line bg-stone-canvas lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-sm text-ink hover:bg-stone-soft"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isStaff && (
              <Link href="/admin" className="px-3 py-2.5 text-sm" onClick={() => setOpen(false)}>
                Admin
              </Link>
            )}
            {session && (
              <button
                type="button"
                className="px-3 py-2.5 text-left text-sm text-ink hover:bg-stone-soft"
                onClick={() => {
                  setOpen(false);
                  void signOut({ callbackUrl: "/" });
                }}
              >
                Sign out
              </button>
            )}
            <Link
              href="/quote"
              className="btn-primary mt-3 h-11 justify-center"
              onClick={() => setOpen(false)}
            >
              Request Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
