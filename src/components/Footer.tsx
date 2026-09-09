"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { SITE } from "@/data/catalog";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-auto border-t border-stone-line bg-ink text-stone-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="Pakhuis Tiles logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-sm object-cover"
            />
            <span className="font-display text-base tracking-[0.12em] uppercase">
              Pakhuis Tiles
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-stone-muted">
            {SITE.brandTagline} Floor, wall, outdoor, commercial and luxury tiles for residential
            and construction projects in Pretoria East.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pakhuis Tiles on Facebook"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-stone-muted transition hover:border-brass hover:text-stone-soft"
            >
              <FacebookIcon />
            </a>
            <a
              href={SITE.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pakhuis Tiles on TikTok"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-stone-muted transition hover:border-brass hover:text-stone-soft"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.16em] text-brass uppercase">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-muted">
            <li>
              <Link href="/about" className="hover:text-stone-soft">
                About
              </Link>
            </li>
            <li>
              <Link href="/tiles" className="hover:text-stone-soft">
                Shop Tiles
              </Link>
            </li>
            <li>
              <Link href="/specials" className="hover:text-stone-soft">
                Specials
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-stone-soft">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-stone-soft">
                News
              </Link>
            </li>
            <li>
              <Link href="/calculator" className="hover:text-stone-soft">
                Calculator
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-stone-soft">
                Contacts
              </Link>
            </li>
            <li>
              <Link href="/quote" className="hover:text-stone-soft">
                Request a Quote
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.16em] text-brass uppercase">
            Delivery Areas
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-muted">
            {SITE.deliveryAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm tracking-[0.16em] text-brass uppercase">Visit Us</h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-muted">
            <li>{SITE.address}</li>
            <li>
              <a href={SITE.phoneHref} className="hover:text-stone-soft">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-stone-soft">
                {SITE.email}
              </a>
            </li>
            <li>
              <WhatsAppLink className="inline-flex items-center gap-2 hover:text-stone-soft">
                <WhatsAppIcon />
                Chat on WhatsApp
              </WhatsAppLink>
            </li>
            <li>{SITE.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-stone-muted md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} Pakhuis Tiles. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>POPIA compliant · Secure quotations</p>
            <Link href="/staff" className="hover:text-stone-soft">
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 11.94 2S1.88 6.5 1.88 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.42V9.84c0-2.39 1.42-3.7 3.59-3.7 1.04 0 2.13.19 2.13.19v2.35h-1.2c-1.18 0-1.55.74-1.55 1.49v1.78h2.64l-.42 2.91h-2.22v7.03c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.76.14 2.89 2.89 0 0 1 2.88-3.02c.28 0 .54.04.8.1v-3.5a6.34 6.34 0 0 0-6.34 6.28 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.18 8.18 0 0 0 4.75 1.51V6.78a4.84 4.84 0 0 1-1.79-.09Z" />
    </svg>
  );
}
