/**
 * Inserts catalogue photos/products if the database is empty.
 * Does not delete quotes, orders, or users.
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
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`Catalogue already has ${existing} products — leaving it unchanged.`);
    return;
  }

  for (const [index, cat] of catalogCategories.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
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
      update: {},
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

  if ((await prisma.galleryItem.count()) === 0) {
    for (const [index, item] of galleryItems.entries()) {
      await prisma.galleryItem.create({
        data: {
          title: item.title,
          description: item.description,
          image: item.image,
          location: item.location,
          sortOrder: index,
        },
      });
    }
  }

  if ((await prisma.blogPost.count()) === 0) {
    for (const post of blogPosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {},
        create: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          image: post.image,
        },
      });
    }
  }

  console.log("Catalogue photos and products are in the database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
