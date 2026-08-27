import type { Category, Product, StockStatus } from "@/data/catalog";
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

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { active: true } } } } },
  });

  return rows.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    image: c.image ?? "",
    collectionCount: c._count.products,
  }));
}

export async function getCategory(slug: string): Promise<Category | null> {
  const c = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: { where: { active: true } } } } },
  });
  if (!c) return null;

  return {
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    image: c.image ?? "",
    collectionCount: c._count.products,
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    include: productInclude,
    orderBy: { name: "asc" },
  });
  return rows.map(mapProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const p = await prisma.product.findFirst({
    where: { slug, active: true },
    include: productInclude,
  });
  return p ? mapProduct(p) : null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, category: { slug } },
    include: productInclude,
    orderBy: { name: "asc" },
  });
  return rows.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, isFeatured: true },
    include: productInclude,
    orderBy: { name: "asc" },
  });
  return rows.map(mapProduct);
}

export async function getSpecials(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      active: true,
      OR: [{ isSpecial: true }, { promoPricePerM2: { not: null } }],
    },
    include: productInclude,
    orderBy: { name: "asc" },
  });
  return rows.map(mapProduct);
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
  return prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getBlogPosts() {
  return prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function getBlogPost(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}
