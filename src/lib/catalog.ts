import type { Category, Product, StockStatus } from "@/data/catalog";
import {
  blogPosts as catalogBlogPosts,
  categories as catalogCategories,
  galleryItems as catalogGalleryItems,
  products as catalogProducts,
} from "@/data/catalog";
import { prisma } from "@/lib/prisma";
import { stockLabel } from "@/lib/pricing";

export type { Category, Product, StockStatus };

type ProductRow = {
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
  category: { slug: string };
};

function mapProduct(p: ProductRow): Product {
  return {
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    description: p.description,
    image: p.image,
    sizeMm: p.sizeMm,
    finish: p.finish ?? "",
    material: p.material ?? "",
    pricePerM2: p.pricePerM2,
    promoPricePerM2: p.promoPricePerM2 ?? undefined,
    stockStatus: stockLabel(p.stockAvailable, p.lowStockAt) as StockStatus,
    isFeatured: p.isFeatured,
    isSpecial: p.isSpecial,
    categorySlug: p.category.slug,
  };
}

const productInclude = { category: { select: { slug: true } } } as const;

function logCatalogFallback(fn: string, error: unknown) {
  console.error(`[catalog] ${fn} falling back to bundled catalogue`, error);
}

export async function getCategories(): Promise<Category[]> {
  try {
    const rows = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { active: true } } } } },
    });

    if (rows.length === 0) return catalogCategories;

    return rows.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description ?? "",
      image: c.image ?? "",
      collectionCount: c._count.products,
    }));
  } catch (error) {
    logCatalogFallback("getCategories", error);
    return catalogCategories;
  }
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const c = await prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { products: { where: { active: true } } } } },
    });
    if (c) {
      return {
        slug: c.slug,
        name: c.name,
        description: c.description ?? "",
        image: c.image ?? "",
        collectionCount: c._count.products,
      };
    }
  } catch (error) {
    logCatalogFallback("getCategory", error);
  }

  return catalogCategories.find((category) => category.slug === slug) ?? null;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { active: true },
      include: productInclude,
      orderBy: { name: "asc" },
    });
    if (rows.length > 0) return rows.map(mapProduct);
  } catch (error) {
    logCatalogFallback("getProducts", error);
  }
  return catalogProducts;
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const p = await prisma.product.findFirst({
      where: { slug, active: true },
      include: productInclude,
    });
    if (p) return mapProduct(p);
  } catch (error) {
    logCatalogFallback("getProduct", error);
  }
  return catalogProducts.find((product) => product.slug === slug) ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { active: true, category: { slug } },
      include: productInclude,
      orderBy: { name: "asc" },
    });
    if (rows.length > 0) return rows.map(mapProduct);
  } catch (error) {
    logCatalogFallback("getProductsByCategory", error);
  }
  return catalogProducts.filter((product) => product.categorySlug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { active: true, isFeatured: true },
      include: productInclude,
      orderBy: { name: "asc" },
    });
    if (rows.length > 0) return rows.map(mapProduct);
  } catch (error) {
    logCatalogFallback("getFeaturedProducts", error);
  }
  return catalogProducts.filter((product) => product.isFeatured);
}

export async function getSpecials(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        active: true,
        OR: [{ isSpecial: true }, { promoPricePerM2: { not: null } }],
      },
      include: productInclude,
      orderBy: { name: "asc" },
    });
    if (rows.length > 0) return rows.map(mapProduct);
  } catch (error) {
    logCatalogFallback("getSpecials", error);
  }
  return catalogProducts.filter(
    (product) => product.isSpecial || product.promoPricePerM2 != null,
  );
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

export async function getGalleryItems() {
  return catalogGalleryItems.map((item, sortOrder) => ({
    id: item.image,
    title: item.title,
    description: item.description,
    image: item.image,
    location: item.location ?? null,
    sortOrder,
    createdAt: new Date(0),
  }));
}

export async function getBlogPosts() {
  try {
    const rows = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
    if (rows.length > 0) return rows;
  } catch (error) {
    logCatalogFallback("getBlogPosts", error);
  }

  return catalogBlogPosts.map((post) => ({
    id: post.slug,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    publishedAt: new Date(0),
  }));
}

export async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (post) return post;
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
    image: fallback.image,
    publishedAt: new Date(0),
  };
}
