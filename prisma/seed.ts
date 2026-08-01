import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  blogPosts,
  categories as catalogCategories,
  galleryItems,
  products as catalogProducts,
} from "../src/data/catalog";

const prisma = new PrismaClient();

const staffPermissions = [
  "products:edit",
  "stock:manage",
  "customers:manage",
  "reports:view",
  "suppliers:manage",
  "orders:manage",
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.order.deleteMany();
  await prisma.promotionProduct.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.damageRecord.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.blogPost.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@pakhuistiles.co.za",
      name: "System Administrator",
      phone: "+27 12 000 0000",
      role: "ADMIN",
      passwordHash,
      permissions: JSON.stringify(staffPermissions),
    },
  });

  await prisma.user.create({
    data: {
      email: "manager@pakhuistiles.co.za",
      name: "Store Manager",
      role: "STORE_MANAGER",
      passwordHash,
      permissions: JSON.stringify(staffPermissions),
    },
  });

  await prisma.user.create({
    data: {
      email: "sales@pakhuistiles.co.za",
      name: "Sales Representative",
      role: "SALES",
      passwordHash,
      permissions: JSON.stringify(["customers:manage", "orders:manage", "reports:view"]),
    },
  });

  await prisma.user.create({
    data: {
      email: "warehouse@pakhuistiles.co.za",
      name: "Warehouse Staff",
      role: "WAREHOUSE",
      passwordHash,
      permissions: JSON.stringify(["stock:manage", "products:edit"]),
    },
  });

  await prisma.user.create({
    data: {
      email: "finance@pakhuistiles.co.za",
      name: "Finance User",
      role: "FINANCE",
      passwordHash,
      permissions: JSON.stringify(["reports:view", "orders:manage", "customers:manage"]),
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Demo Customer",
      phone: "+27 82 000 0000",
      role: "CUSTOMER",
      passwordHash,
    },
  });

  await prisma.customer.create({
    data: {
      customerNumber: "CUST-1001",
      companyName: "Demo Homes Pty Ltd",
      contactPerson: "Demo Customer",
      email: "customer@example.com",
      phone: "+27 82 000 0000",
      physicalAddress: "12 Sample Street, Pretoria East",
      deliveryAddress: "12 Sample Street, Pretoria East",
      pricingTier: "RETAIL",
      userId: customerUser.id,
    },
  });

  const supplier = await prisma.supplier.create({
    data: {
      name: "Italtile Imports",
      contactPerson: "Johan Steyn",
      email: "orders@example-supplier.co.za",
      phone: "+27 11 000 1111",
      physicalAddress: "Johannesburg",
      vatNumber: "4123456789",
    },
  });

  await prisma.supplier.create({
    data: {
      name: "Ceramic World SA",
      contactPerson: "Thandi Molefe",
      email: "sales@ceramicworld.example",
      phone: "+27 12 555 2222",
      vatNumber: "4987654321",
    },
  });

  for (const [index, cat] of catalogCategories.entries()) {
    await prisma.category.create({
      data: {
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
    const cost = Math.round(p.pricePerM2 * 0.62 * 100) / 100;
    const product = await prisma.product.create({
      data: {
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        description: p.description,
        image: p.image,
        sizeMm: p.sizeMm,
        finish: p.finish,
        material: p.material,
        costPrice: cost,
        pricePerM2: p.pricePerM2,
        contractorPrice: Math.round(p.pricePerM2 * 0.92 * 100) / 100,
        wholesalePrice: Math.round(p.pricePerM2 * 0.85 * 100) / 100,
        promoPricePerM2: p.promoPricePerM2,
        stockAvailable: p.stockStatus === "LOW_STOCK" ? 12 : 180,
        stockReserved: 0,
        stockDamaged: 0,
        isFeatured: p.isFeatured,
        isSpecial: p.isSpecial,
        categoryId: categoryMap[p.categorySlug],
      },
    });

    await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type: "RECEIVE",
        quantity: product.stockAvailable,
        costPrice: cost,
        sellingPrice: p.pricePerM2,
        supplierId: supplier.id,
        note: "Opening stock",
        invoiceRef: "PO-OPEN-001",
        createdBy: admin.id,
      },
    });
  }

  const specials = await prisma.product.findMany({ where: { isSpecial: true } });
  const promo = await prisma.promotion.create({
    data: {
      name: "Monthly Specials",
      description: "Limited-time pricing on selected tiles",
      discountPercent: 15,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      featured: true,
      active: true,
    },
  });

  for (const product of specials) {
    await prisma.promotionProduct.create({
      data: { promotionId: promo.id, productId: product.id },
    });
  }

  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.damageRecord.create({
      data: {
        productId: firstProduct.id,
        quantity: 2.5,
        reason: "BROKEN",
        note: "Damaged in receiving",
        userId: admin.id,
      },
    });
    await prisma.product.update({
      where: { id: firstProduct.id },
      data: {
        stockDamaged: { increment: 2.5 },
        stockAvailable: { decrement: 2.5 },
      },
    });
  }

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

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
      },
    });
  }

  await prisma.notification.create({
    data: {
      userId: admin.id,
      type: "SYSTEM",
      title: "Welcome to Pakhuis Admin",
      message: "Database seeded. Demo logins use password123.",
    },
  });

  console.log("Seed complete.");
  console.log("Admin: admin@pakhuistiles.co.za / password123");
  console.log("Customer: customer@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
