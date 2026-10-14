import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { HomeHero } from "@/components/HomeHero";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SITE, testimonials } from "@/data/catalog";
import { HERO_SALE_SLIDES, isMonthlySaleActive } from "@/data/monthly-sale";
import { getCategories, getFeaturedProducts, resolveTileSrc } from "@/lib/catalog";
import { Calculator, MapPin, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredAll] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);
  const featured = featuredAll.slice(0, 8);

  return (
    <>
      <HomeHero saleActive={isMonthlySaleActive()} slides={HERO_SALE_SLIDES} />

      <section className="border-b border-stone-line bg-white/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-3 md:px-6">
          <Feature
            icon={<Truck size={18} />}
            title="Delivery across Gauteng"
            text="Pretoria, Joburg, Midrand and Centurion"
          />
          <Feature
            icon={<Calculator size={18} />}
            title="Free tile calculator"
            text="Know exactly how many tiles you need"
          />
          <Feature
            icon={<MapPin size={18} />}
            title="Trade & bulk pricing"
            text="Quotes for contractors and developers"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Our Range</p>
              <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">Shop by category</h2>
            </div>
            <Link href="/tiles" className="text-sm text-moss hover:underline">
              View all tiles →
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 60}>
              <Link
                href={`/tiles/${cat.slug}`}
                className="group relative block aspect-[5/3] overflow-hidden"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl text-stone-soft">{cat.name}</h3>
                  <p className="mt-1 text-sm text-stone-muted">{cat.collectionCount} collections</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white/50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="section-kicker">Hand-picked</p>
                <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">Featured tiles</h2>
              </div>
              <Link href="/specials" className="text-sm text-moss hover:underline">
                View specials →
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, i) => (
              <Reveal key={product.slug} delay={i * 40}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <Reveal>
          <div className="grid items-center gap-8 overflow-hidden border border-stone-line bg-ink lg:grid-cols-2">
            <div className="p-8 md:p-10">
              <p className="text-xs tracking-[0.22em] text-brass uppercase">Plan smart</p>
              <h2 className="mt-3 font-display text-3xl text-stone-soft md:text-4xl">
                Not sure how many tiles you need?
              </h2>
              <p className="mt-4 text-stone-muted">
                Enter your room size and our calculator works out the square meters, recommended
                quantity with wastage, and estimated cost.
              </p>
              <Link href="/calculator" className="btn-primary mt-8">
                Try the Tile Calculator
              </Link>
            </div>
            <div className="relative min-h-[280px]">
              <Image
                src={resolveTileSrc("/images/tile-12.jpg")}
                alt="Outdoor patio tiles"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-stone-soft/60 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <p className="section-kicker">Testimonials</p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              What our customers say
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 50}>
                <blockquote className="h-full border border-stone-line bg-white p-6">
                  <p className="text-ink-muted leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-5">
                    <p className="font-medium text-ink">{t.name}</p>
                    <p className="text-sm text-ink-muted">{t.place}</p>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <Reveal>
          <div className="border border-stone-line bg-white px-6 py-10 text-center md:px-12">
            <h2 className="font-display text-3xl text-ink md:text-4xl">Ready to start your project?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-muted">
              Visit our showroom at {SITE.address}, or request a quotation online — our sales
              consultants respond within one business day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/quote" className="btn-primary">
                Request a Quote
              </Link>
              <Link href="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-stone-line bg-stone-canvas text-moss">
        {icon}
      </div>
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-muted">{text}</p>
      </div>
    </div>
  );
}
