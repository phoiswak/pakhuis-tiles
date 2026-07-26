"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-line/80 bg-stone-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
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

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm tracking-wide text-ink-muted transition hover:text-ink",
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "text-ink font-medium"
                  : "",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/quote" className="btn-primary hidden sm:inline-flex">
            Request Quote
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-stone-line text-ink lg:hidden"
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
                className="rounded-sm px-3 py-2.5 text-sm text-ink hover:bg-stone-soft"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className="btn-primary mt-2 justify-center"
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
