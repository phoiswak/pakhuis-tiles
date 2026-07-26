import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/data/catalog";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <Link href="/blog" className="text-sm text-moss hover:underline">
        ← Back to blog
      </Link>
      <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-lg text-ink-muted">{post.excerpt}</p>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden border border-stone-line">
        <Image
          src={post.image || "/images/hero-showroom.jpg"}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>
      <div className="prose-pakhuis mt-8 space-y-4 text-ink-muted leading-relaxed whitespace-pre-line">
        {post.content}
      </div>
    </article>
  );
}
