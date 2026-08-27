import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the required fields and try again." },
        { status: 400 },
      );
    }

    let id: string = randomUUID();
    try {
      const message = await prisma.contactMessage.create({ data: parsed.data });
      id = message.id;
    } catch (dbError) {
      console.error("Contact DB save failed (email will still send):", dbError);
    }

    try {
      await sendContactEmail(parsed.data);
    } catch (mailError) {
      console.error("Contact email failed:", mailError);
      return NextResponse.json(
        {
          error: "Could not email sales. Please try again or call us.",
          id,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ error: "Could not send message." }, { status: 500 });
  }
}
