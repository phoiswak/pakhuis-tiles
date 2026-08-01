import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  companyName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const count = await prisma.customer.count();
    const customerNumber = `CUST-${1000 + count + 1}`;

    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name,
        phone: parsed.data.phone,
        passwordHash,
        role: "CUSTOMER",
        customer: {
          create: {
            customerNumber,
            companyName: parsed.data.companyName,
            contactPerson: parsed.data.name,
            email,
            phone: parsed.data.phone,
            pricingTier: "RETAIL",
          },
        },
      },
    });

    return NextResponse.json({ ok: true, id: user.id });
  } catch {
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
