import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description: "Guides on measuring tiles, porcelain vs ceramic, and outdoor tiling in Gauteng.",
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <p className="section-kicker">News</p>
      <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">News</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Practical advice from our showroom team to help you plan, measure and choose the right
        tiles.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden border border-stone-line bg-white transition hover:border-moss/40"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={post.image || "/images/hero-showroom.jpg"}
                alt={post.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl text-ink group-hover:text-moss">{post.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{post.excerpt}</p>
              <span className="mt-4 inline-block text-sm text-moss">Read more →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
