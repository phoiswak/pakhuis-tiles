import type { Category, Product, StockStatus } from "@/data/catalog";
import {
  blogPosts as catalogBlogPosts,
  categories as catalogCategories,
  galleryItems as catalogGalleryItems,
  products as catalogProducts,
} from "@/data/catalog";
import { isCampaignProduct, isMonthlySaleActive } from "@/data/monthly-sale";
import { prisma } from "@/lib/prisma";
import { resolveTileSrc } from "@/lib/tile-src";

export type { Category, Product, StockStatus };
export { resolveTileSrc };

function resolveProduct(product: Product): Product {
  const saleLive = isMonthlySaleActive();
  return {
    ...product,
    image: resolveTileSrc(product.image),
    isSpecial: product.isSpecial && saleLive,
    promoPricePerM2: saleLive ? product.promoPricePerM2 : undefined,
  };
}

function isVisibleProduct(product: Product): boolean {
  if (!isCampaignProduct(product.sku)) return true;
  return isMonthlySaleActive();
}

function resolveCategory(category: Category): Category {
  return { ...category, image: resolveTileSrc(category.image) };
}

function logCatalogFallback(fn: string, error: unknown) {
  console.error(`[catalog] ${fn} falling back to bundled catalogue`, error);
}

export async function getCategories(): Promise<Category[]> {
  return catalogCategories.map(resolveCategory);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const fallback = catalogCategories.find((category) => category.slug === slug);
  return fallback ? resolveCategory(fallback) : null;
}

export async function getProducts(): Promise<Product[]> {
  return catalogProducts.filter(isVisibleProduct).map(resolveProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const fallback = catalogProducts.find((product) => product.slug === slug);
  if (!fallback || !isVisibleProduct(fallback)) return null;
  return resolveProduct(fallback);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  return catalogProducts
    .filter((product) => product.categorySlug === slug && isVisibleProduct(product))
    .map(resolveProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return catalogProducts
    .filter((product) => product.isFeatured && isVisibleProduct(product))
    .map(resolveProduct);
}

export async function getSpecials(): Promise<Product[]> {
  if (!isMonthlySaleActive()) return [];
  return catalogProducts
    .filter((product) => product.isSpecial || product.promoPricePerM2 != null)
    .map(resolveProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const products = await getProducts();
  const categories = await getCategories();
  const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.sku,
      product.description,
      product.sizeMm,
      product.finish,
      product.material,
      product.categorySlug,
      categoryNames[product.categorySlug] ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}

function galleryLabel(product: Product) {
  const size = product.sizeMm.replace(/x/gi, "×");
  return `${size} ${product.finish.toLowerCase()} ${product.material.toLowerCase()} · ${product.sku}`;
}

export async function getGalleryItems() {
  const visibleProducts = catalogProducts.filter(isVisibleProduct).map(resolveProduct);
  const seenImages = new Set<string>();
  const items: {
    id: string;
    title: string;
    description: string;
    image: string;
    href: string | null;
    location: string | null;
    sortOrder: number;
    createdAt: Date;
  }[] = [];

  const pushProduct = (product: Product) => {
    const image = resolveTileSrc(product.image);
    if (seenImages.has(image)) return;
    seenImages.add(image);
    items.push({
      id: product.slug,
      title: product.name,
      description: galleryLabel(product),
      image,
      href: `/products/${product.slug}`,
      location: null,
      sortOrder: items.length,
      createdAt: new Date(0),
    });
  };

  visibleProducts.filter((product) => product.isSpecial).forEach(pushProduct);

  for (const item of catalogGalleryItems) {
    const image = resolveTileSrc(item.image);
    if (seenImages.has(image)) continue;
    seenImages.add(image);
    const match = visibleProducts.find((product) => resolveTileSrc(product.image) === image);
    items.push({
      id: item.image,
      title: item.title,
      description: item.description,
      image,
      href: match ? `/products/${match.slug}` : null,
      location: "location" in item ? (item as { location?: string }).location ?? null : null,
      sortOrder: items.length,
      createdAt: new Date(0),
    });
  }

  visibleProducts.filter((product) => !product.isSpecial).forEach(pushProduct);

  return items;
}

export async function getBlogPosts() {
  try {
    const rows = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
    if (rows.length > 0) {
      return rows.map((post) => ({ ...post, image: resolveTileSrc(post.image) }));
    }
  } catch (error) {
    logCatalogFallback("getBlogPosts", error);
  }

  return catalogBlogPosts.map((post) => ({
    id: post.slug,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: resolveTileSrc(post.image),
    publishedAt: new Date(0),
  }));
}

export async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (post) return { ...post, image: resolveTileSrc(post.image) };
  } catch (error) {
    logCatalogFallback("getBlogPost", error);
  }

  const fallback = catalogBlogPosts.find((item) => item.slug === slug);
  if (!fallback) return null;

  return {
    id: fallback.slug,
    slug: fallback.slug,
    title: fallback.title,
    excerpt: fallback.excerpt,
    content: fallback.content,
    image: resolveTileSrc(fallback.image),
    publishedAt: new Date(0),
  };
}
