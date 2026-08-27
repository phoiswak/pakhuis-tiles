import Image from "next/image";
import { getGalleryItems } from "@/lib/catalog";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tile Gallery",
  description: "Browse the full range of tiles in stock at Pakhuis Tiles, Pretoria East.",
};

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Our range</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Tile Gallery</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        600×1200mm matt porcelain from our Pretoria East warehouse. Visit the showroom to see
        samples, or request a quote.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <figure key={item.image} className="overflow-hidden border border-stone-line bg-white">
            <div className="relative aspect-[3/4]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <figcaption className="p-4">
              <h2 className="font-display text-xl text-ink">{item.title}</h2>
              {item.description && (
                <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
