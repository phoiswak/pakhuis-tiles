import { NextResponse } from "next/server";
import { z } from "zod";
import { saveQuote } from "@/lib/quotes";

const schema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  physicalAddress: z.string().optional(),
  projectType: z.string().min(2),
  tileCategory: z.string().optional(),
  tileSize: z.string().optional(),
  colourPreference: z.string().optional(),
  quantityM2: z.string().optional(),
  budgetRange: z.string().optional(),
  deliveryOption: z.string().optional(),
  deliveryArea: z.string().optional(),
  notes: z.string().optional(),
  productSlug: z.string().optional(),
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
    const quote = await saveQuote(parsed.data);
    return NextResponse.json({ ok: true, id: quote.id });
  } catch {
    return NextResponse.json({ error: "Could not save quote request." }, { status: 500 });
  }
}
