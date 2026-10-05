import type { Category, Product, StockStatus } from "@/data/catalog";
import {
  blogPosts as catalogBlogPosts,
  categories as catalogCategories,
  galleryItems as catalogGalleryItems,
  products as catalogProducts,
} from "@/data/catalog";
import { isCampaignProduct } from "@/data/monthly-sale";
import { prisma } from "@/lib/prisma";
import { stockLabel } from "@/lib/pricing";
import { isSpecialLive } from "@/lib/specials";
import { resolveTileSrc } from "@/lib/tile-src";

export type { Category, Product, StockStatus };
export { resolveTileSrc };

type DbProduct = {
  slug: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  sizeMm: string;
  finish: string | null;
  material: string | null;
  pricePerM2: number;
  promoPricePerM2: number | null;
  stockAvailable: number;
  lowStockAt: number;
  isFeatured: boolean;
  isSpecial: boolean;
  specialYear: number | null;
  specialMonth: number | null;
  category: { slug: string };
  promotions: { promotion: { active: boolean; startDate: Date; endDate: Date; discountPercent: number } }[];
};

function bestPromotionPrice(row: DbProduct, now = new Date()) {
  const live = row.promotions
    .map((entry) => entry.promotion)
    .filter((promo) => promo.active && promo.startDate <= now && promo.endDate >= now);
  if (!live.length) return null;
  const discount = Math.max(...live.map((promo) => promo.discountPercent));
  return Math.round(row.pricePerM2 * (1 - discount / 100) * 100) / 100;
}

function mapDbProduct(row: DbProduct): Product {
  const liveSpecial = isSpecialLive(row);
  const promotionPrice = bestPromotionPrice(row);
  const promoPricePerM2 = liveSpecial
    ? (row.promoPricePerM2 ?? promotionPrice ?? undefined)
    : (promotionPrice ?? undefined);

  return {
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    description: row.description,
    image: resolveTileSrc(row.image),
    sizeMm: row.sizeMm,
    finish: row.finish ?? "",
    material: row.material ?? "",
    pricePerM2: row.pricePerM2,
    promoPricePerM2,
    stockStatus: stockLabel(row.stockAvailable, row.lowStockAt) as StockStatus,
    isFeatured: row.isFeatured,
    isSpecial: liveSpecial || promoPricePerM2 != null,
    categorySlug: row.category.slug,
  };
}

function resolveCatalogProduct(product: Product): Product {
  const live = isSpecialLive({
    isSpecial: product.isSpecial,
    specialYear: null,
    specialMonth: null,
  });
  return {
    ...product,
    image: resolveTileSrc(product.image),
    isSpecial: live,
    promoPricePerM2: live ? product.promoPricePerM2 : undefined,
  };
}

function isVisibleStorefrontProduct(product: Product) {
  if (!isCampaignProduct(product.sku)) return true;
  return product.isSpecial || product.promoPricePerM2 != null;
}

function resolveCategory(category: Category): Category {
  return { ...category, image: resolveTileSrc(category.image) };
}

function logCatalogFallback(fn: string, error: unknown) {
  console.error(`[catalog] ${fn} falling back to bundled catalogue`, error);
}

async function loadDbProducts() {
  try {
    return await prisma.product.findMany({
      where: { active: true },
      include: {
        category: { select: { slug: true } },
        promotions: { include: { promotion: true } },
      },
    });
  } catch (error) {
    logCatalogFallback("loadDbProducts", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  return catalogCategories.map(resolveCategory);
}

export async function getCategory(slug: string): Promise<Category | null> {
  const fallback = catalogCategories.find((category) => category.slug === slug);
  return fallback ? resolveCategory(fallback) : null;
}

export async function getProducts(): Promise<Product[]> {
  const rows = await loadDbProducts();
  const fromDb = new Map(rows.map((row) => [row.slug, mapDbProduct(row)]));
  const merged = catalogProducts.map((product) => fromDb.get(product.slug) ?? resolveCatalogProduct(product));
  const extras = [...fromDb.values()].filter(
    (product) => !catalogProducts.some((entry) => entry.slug === product.slug),
  );
  return [...merged, ...extras].filter(isVisibleStorefrontProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.categorySlug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.isFeatured);
}

export async function getSpecials(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.isSpecial || product.promoPricePerM2 != null);
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
  const visibleProducts = await getProducts();
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
