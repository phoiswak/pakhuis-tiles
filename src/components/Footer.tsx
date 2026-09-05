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
