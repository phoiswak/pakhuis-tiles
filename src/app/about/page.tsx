import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BadgePercent, Handshake, Layers, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsAppLink";
import { SITE } from "@/data/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "More than tiles. Pakhuis Tiles in Pretoria East helps homeowners, contractors, designers and developers build beautiful spaces with quality tiles, competitive prices and personal service.",
};

const benefits = [
  {
    icon: <Layers size={18} />,
    title: "For Every Project",
    text: "From single-room renovations and home improvements to large residential and commercial developments, Pakhuis Tiles provides solutions for projects of different sizes.",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Quality Products",
    text: "We carefully select beautiful and durable products suitable for modern South African homes, businesses and developments.",
  },
  {
    icon: <BadgePercent size={18} />,
    title: "Competitive Pricing",
    text: "Beautiful spaces should not require unreasonable budgets. Our goal is to provide customers with quality products at competitive prices.",
  },
  {
    icon: <Handshake size={18} />,
    title: "Honest, Personal Service",
    text: "Our team is available to help customers choose products that complement their style, project requirements and budget.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[72vh] overflow-hidden">
        <Image
          src="/images/bathroom-wall.jpg"
          alt="Professionally tiled bathroom interior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/88 via-ink/60 to-ink/25" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
          <p className="hero-animate text-xs tracking-[0.28em] text-brass uppercase">
            Quality Tiles. Brighter Spaces.
          </p>
          <h1 className="hero-animate-delay mt-4 max-w-3xl font-display text-4xl leading-[1.05] text-stone-soft sm:text-5xl md:text-6xl">
            More Than Tiles.
            <br />
            We&apos;re Building Beautiful Spaces.
          </h1>
          <p className="hero-animate-delay-2 mt-4 max-w-xl text-lg text-stone-muted">
            At Pakhuis Tiles, we believe every beautiful space starts with the right foundation.
          </p>
          <div className="hero-animate-delay-2 mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Visit Our Showroom
            </Link>
            <Link href="/tiles" className="btn-ghost-light">
              View Our Products
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="section-kicker">Our story</p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              From a Simple Idea to So Much More
            </h2>
            <div className="mt-6 space-y-4 text-ink-muted leading-relaxed">
              <p>
                Pakhuis Tiles was created with a clear purpose — to make beautiful, high-quality
                tiles accessible to customers looking to transform their spaces.
              </p>
              <p>
                Based in Pretoria East, we serve homeowners, contractors, designers and property
                developers who value quality, style, competitive pricing and dependable service.
              </p>
              <p>
                Our goal is to become more than simply a place where customers purchase tiles. We
                want Pakhuis Tiles to be a destination where customers can discover ideas, explore
                beautiful finishes and receive assistance in selecting products that complement
                their projects.
              </p>
              <p>
                Whether it&apos;s a bathroom renovation, kitchen transformation, new home or large
                property development, we aim to help our customers bring their vision to life — one
                space at a time.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="relative min-h-[360px] overflow-hidden border border-stone-line md:min-h-[460px]">
              <Image
                src="/images/hero-showroom.jpg"
                alt="Pakhuis Tiles warehouse and showroom in Pretoria East"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white/50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <p className="section-kicker">Why choose us</p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              Why Choose Pakhuis Tiles?
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit, i) => (
              <Reveal key={benefit.title} delay={i * 60}>
                <Benefit icon={benefit.icon} title={benefit.title} text={benefit.text} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <Reveal>
          <div className="grid items-stretch gap-0 overflow-hidden border border-stone-line bg-ink lg:grid-cols-2">
            <div className="p-8 md:p-10">
              <p className="text-xs tracking-[0.22em] text-brass uppercase">Our commitment</p>
              <h2 className="mt-3 font-display text-3xl text-stone-soft md:text-4xl">
                Your Vision. Our Tiles. One Beautiful Space.
              </h2>
              <p className="mt-4 text-stone-muted leading-relaxed">
                At Pakhuis Tiles, we don&apos;t simply sell tiles — we help transform spaces, one
                tile at a time.
              </p>
              <p className="mt-4 text-stone-muted leading-relaxed">
                Our commitment is to combine quality products, beautiful designs, competitive
                pricing and dependable customer service to help customers create spaces they will
                enjoy for years to come.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Visit Our Showroom
                </Link>
                <Link href="/quote" className="btn-ghost-light">
                  Get a Quote
                </Link>
                <Link href="/tiles" className="btn-ghost-light">
                  View Our Products
                </Link>
              </div>
            </div>
            <div className="relative min-h-[280px]">
              <Image
                src="/images/outdoor-patio.jpg"
                alt="Completed outdoor patio tiled with Pakhuis Tiles products"
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
            <div className="border border-stone-line bg-white px-6 py-10 text-center md:px-12">
              <p className="section-kicker">Spaces start here</p>
              <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
                From the first tile to the finished space
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-ink-muted">
                Pakhuis Tiles aims to be part of the customer&apos;s journey — quality tiles,
                competitive prices and personal service.
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-muted">
                {SITE.address} · {SITE.hours}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/quote" className="btn-primary">
                  Get a Quote
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Contact Us
                </Link>
                <WhatsAppLink className="btn-secondary">
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </WhatsAppLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="h-full border border-stone-line bg-white p-6">
      <div className="flex h-9 w-9 items-center justify-center border border-stone-line bg-stone-canvas text-moss">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
    </div>
  );
}
