import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().min(1),
  sizeMm: z.string().min(2),
  finish: z.string().optional(),
  material: z.string().optional(),
  categoryId: z.string().min(1),
  pricePerM2: z.number().positive(),
  promoPricePerM2: z.number().positive().optional().nullable(),
  stockAvailable: z.number().min(0).optional(),
  sku: z.string().optional(),
  isSpecial: z.boolean().optional(),
  specialYear: z.number().int().min(2024).max(2100).optional().nullable(),
  specialMonth: z.number().int().min(1).max(12).optional().nullable(),
});

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `tile-${Date.now()}`;
}

async function uniqueSlug(base: string) {
  let slug = base;
  let n = 2;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

async function nextSpecialSku() {
  const rows = await prisma.product.findMany({
    where: { sku: { startsWith: "PT-SP-" } },
    select: { sku: true },
  });
  const nums = rows
    .map((row) => Number(row.sku.replace(/PT-SP-/i, "")))
    .filter((value) => Number.isFinite(value));
  return `PT-SP-${String(Math.max(0, ...nums) + 1).padStart(3, "0")}`;
}

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
  }

  const isSpecial = parsed.data.isSpecial ?? true;
  if (isSpecial && (!parsed.data.specialYear || !parsed.data.specialMonth || parsed.data.promoPricePerM2 == null)) {
    return NextResponse.json(
      { error: "Specials need a month, year and special price." },
      { status: 400 },
    );
  }

  try {
    const sku = parsed.data.sku?.trim() || (await nextSpecialSku());
    const existsSku = await prisma.product.findUnique({ where: { sku } });
    if (existsSku) {
      return NextResponse.json({ error: "That SKU is already in use." }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        slug: await uniqueSlug(slugify(parsed.data.name)),
        sku,
        name: parsed.data.name,
        description: parsed.data.description || parsed.data.name,
        image: parsed.data.image,
        sizeMm: parsed.data.sizeMm,
        finish: parsed.data.finish || null,
        material: parsed.data.material || null,
        costPrice: Math.round(parsed.data.pricePerM2 * 0.62 * 100) / 100,
        pricePerM2: parsed.data.pricePerM2,
        promoPricePerM2: parsed.data.promoPricePerM2 ?? null,
        stockAvailable: parsed.data.stockAvailable ?? 50,
        isSpecial,
        specialYear: isSpecial ? parsed.data.specialYear : null,
        specialMonth: isSpecial ? parsed.data.specialMonth : null,
        categoryId: parsed.data.categoryId,
      },
    });
    return NextResponse.json({ ok: true, product });
  } catch (error) {
    console.error("[products] create failed", error);
    return NextResponse.json({ error: "Could not create tile." }, { status: 500 });
  }
}
