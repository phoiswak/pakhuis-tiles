import { NextResponse } from "next/server";
import { z } from "zod";
import { saveContactMessage } from "@/lib/contact";

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
    const message = await saveContactMessage(parsed.data);
    return NextResponse.json({ ok: true, id: message.id });
  } catch {
    return NextResponse.json({ error: "Could not send message." }, { status: 500 });
  }
}
