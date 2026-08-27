/**
 * Upserts catalogue products and photos without wiping quotes, orders, or users.
 */
import { PrismaClient } from "@prisma/client";
import {
  blogPosts,
  categories as catalogCategories,
  galleryItems,
  products as catalogProducts,
} from "../src/data/catalog";

const prisma = new PrismaClient();

async function main() {
  for (const [index, cat] of catalogCategories.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        sortOrder: index,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        image: cat.image,
        sortOrder: index,
      },
    });
  }

  const dbCategories = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(dbCategories.map((c) => [c.slug, c.id]));

  for (const p of catalogProducts) {
    const categoryId = categoryMap[p.categorySlug];
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { image: p.image, name: p.name, description: p.description },
      create: {
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        description: p.description,
        image: p.image,
        sizeMm: p.sizeMm,
        finish: p.finish,
        material: p.material,
        costPrice: Math.round(p.pricePerM2 * 0.62 * 100) / 100,
        pricePerM2: p.pricePerM2,
        contractorPrice: Math.round(p.pricePerM2 * 0.92 * 100) / 100,
        wholesalePrice: Math.round(p.pricePerM2 * 0.85 * 100) / 100,
        promoPricePerM2: p.promoPricePerM2,
        stockAvailable: p.stockStatus === "LOW_STOCK" ? 12 : 180,
        isFeatured: p.isFeatured,
        isSpecial: p.isSpecial,
        categoryId,
      },
    });
  }

  const existingGallery = await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });
  if (existingGallery.length === 0) {
    for (const [index, item] of galleryItems.entries()) {
      await prisma.galleryItem.create({
        data: {
          title: item.title,
          description: item.description,
          image: item.image,
          location: "location" in item ? (item as { location?: string }).location : null,
          sortOrder: index,
        },
      });
    }
  } else {
    for (const [index, item] of galleryItems.entries()) {
      const row = existingGallery[index];
      if (!row) continue;
      await prisma.galleryItem.update({
        where: { id: row.id },
        data: { image: item.image, title: item.title, description: item.description },
      });
    }
  }

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { image: post.image, title: post.title, excerpt: post.excerpt, content: post.content },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
      },
    });
  }

  console.log("Catalogue photos are synced from your images folder.");
}

main()
  .catch((e) => {
    console.error("Catalogue seed skipped; storefront will use bundled photos.", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
