import Image from "next/image";
import { getGalleryItems } from "@/lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Gallery",
  description: "Completed residential and commercial tile projects by Pakhuis Tiles customers.",
};

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">Inspiration</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">Project Gallery</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Real homes and commercial spaces finished with tiles from our Pretoria East warehouse.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <figure key={item.title} className="overflow-hidden border border-stone-line bg-white">
            <div className="relative aspect-[4/3]">
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
              <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
              {item.location && (
                <p className="mt-2 text-xs tracking-wide text-moss uppercase">{item.location}</p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
