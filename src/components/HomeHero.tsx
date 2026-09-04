"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SITE } from "@/data/catalog";
import type { HeroSaleSlide } from "@/data/monthly-sale";

const SHOWROOM = {
  src: "/images/hero-showroom.jpg",
  alt: "Pakhuis Tiles showroom with premium tile displays",
};

export function HomeHero({
  saleActive,
  slides,
}: {
  saleActive: boolean;
  slides: HeroSaleSlide[];
}) {
  const saleSlides = saleActive && slides.length > 0 ? slides : null;

  if (!saleSlides) {
    return (
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image src={SHOWROOM.src} alt={SHOWROOM.alt} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25" />
        <HeroCopy />
      </section>
    );
  }

  return <SaleSlider slides={saleSlides} />;
}

function HeroCopy() {
  return (
    <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
      <p className="hero-animate text-xs tracking-[0.28em] text-brass uppercase">
        Tile Warehouse · Pretoria East
      </p>
      <h1 className="hero-animate-delay mt-4 max-w-3xl font-display text-4xl leading-[1.05] text-stone-soft sm:text-5xl md:text-6xl">
        Pakhuis Tiles
      </h1>
      <p className="hero-animate-delay-2 mt-4 max-w-xl text-lg text-stone-muted">
        {SITE.tagline}. Browse our full range, calculate exactly what you need, and get a
        professional quotation.
      </p>
      <div className="hero-animate-delay-2 mt-8 flex flex-wrap gap-3">
        <Link href="/quote" className="btn-primary">
          Request a Quote
        </Link>
        <Link href="/tiles" className="btn-ghost-light">
          Shop Tiles
        </Link>
        <Link href="/contact" className="btn-ghost-light">
          Contact Us
        </Link>
      </div>
    </div>
  );
}

function SaleSlider({ slides }: { slides: HeroSaleSlide[] }) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      setIndex((current) => (current + next + count) % count);
    },
    [count],
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion || count < 2) return;
    const timer = window.setInterval(() => go(1), 6500);
    return () => window.clearInterval(timer);
  }, [count, go, reduceMotion]);

  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-ink md:min-h-[88vh]">
      <div
        className={`flex h-[70vh] md:h-[88vh] ${reduceMotion ? "" : "transition-transform duration-700 ease-out"}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.src} className="relative h-full w-full shrink-0">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              unoptimized
              className="object-contain object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/80 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-10 md:px-6 md:pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Link href="/specials" className="btn-primary pointer-events-auto">
            Shop this month’s specials
          </Link>
          {count > 1 && (
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous sale image"
                onClick={() => go(-1)}
                className="flex h-10 w-10 items-center justify-center border border-white/30 bg-ink/50 text-stone-soft backdrop-blur hover:bg-ink/80"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next sale image"
                onClick={() => go(1)}
                className="flex h-10 w-10 items-center justify-center border border-white/30 bg-ink/50 text-stone-soft backdrop-blur hover:bg-ink/80"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
        {count > 1 && (
          <div className="mt-4 flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show sale image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={`h-1.5 w-8 ${i === index ? "bg-brass" : "bg-white/35"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
