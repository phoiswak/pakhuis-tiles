import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/data/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Pakhuis Tiles is a Pretoria East tile warehouse supplying residential and construction projects across Gauteng.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="section-kicker">Our story</p>
          <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">About Pakhuis Tiles</h1>
          <div className="mt-6 space-y-4 text-ink-muted leading-relaxed">
            <p>
              Pakhuis Tiles is a Pretoria East tile warehouse built for homeowners, contractors and
              developers who need honest advice, reliable stock and competitive pricing.
            </p>
            <p>
              From everyday ceramic floors to luxury marble-look porcelain and outdoor patio ranges,
              we help you specify the right product — then calculate quantities and deliver across
              Gauteng.
            </p>
            <p>
              Visit our showroom at {SITE.address} to see samples in person, or request a quotation
              online and our sales consultants will respond within one business day.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quote" className="btn-primary">
              Request a Quote
            </Link>
            <Link href="/contact" className="btn-secondary">
              Visit / Contact
            </Link>
          </div>
        </div>
        <div className="relative min-h-[360px] overflow-hidden border border-stone-line">
          <Image
            src="/images/hero-showroom.jpg"
            alt="Pakhuis Tiles showroom"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
