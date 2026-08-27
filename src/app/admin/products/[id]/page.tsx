import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductEditForm } from "@/components/admin/ProductEditForm";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function AdminProductEditPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-moss hover:underline">
        ← Products
      </Link>
      <h1 className="mt-2 font-display text-3xl text-ink">{product.name}</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {product.sku} · {product.category.name}
      </p>
      <div className="mt-6">
        <ProductEditForm product={product} />
      </div>
    </div>
  );
}
