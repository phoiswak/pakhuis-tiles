import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  physicalAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile data" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, phone: parsed.data.phone },
  });

  await prisma.customer.updateMany({
    where: { userId: session.user.id },
    data: {
      contactPerson: parsed.data.name,
      phone: parsed.data.phone,
      companyName: parsed.data.companyName,
      physicalAddress: parsed.data.physicalAddress,
      deliveryAddress: parsed.data.deliveryAddress,
    },
  });

  return NextResponse.json({ ok: true });
}
