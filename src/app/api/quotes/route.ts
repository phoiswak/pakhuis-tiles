import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendQuoteEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

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
  installation: z.union([z.boolean(), z.string()]).optional(),
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

    const installation =
      parsed.data.installation === true ||
      parsed.data.installation === "true" ||
      parsed.data.installation === "on";

    let quoteId: string = randomUUID();

    try {
      const quote = await prisma.quoteRequest.create({
        data: {
          fullName: parsed.data.fullName,
          companyName: parsed.data.companyName,
          email: parsed.data.email,
          phone: parsed.data.phone,
          physicalAddress: parsed.data.physicalAddress,
          projectType: parsed.data.projectType,
          tileCategory: parsed.data.tileCategory,
          tileSize: parsed.data.tileSize,
          colourPreference: parsed.data.colourPreference,
          quantityM2: parsed.data.quantityM2,
          budgetRange: parsed.data.budgetRange,
          deliveryOption: parsed.data.deliveryOption,
          deliveryArea: parsed.data.deliveryArea,
          notes: parsed.data.notes,
          productSlug: parsed.data.productSlug,
          installation,
        },
      });
      quoteId = quote.id;

      try {
        await prisma.notification.create({
          data: {
            type: "QUOTE",
            title: "New quote request",
            message: `${quote.fullName} — ${quote.projectType}`,
          },
        });
      } catch (notifyError) {
        console.error("Quote notification failed:", notifyError);
      }
    } catch (dbError) {
      console.error("Quote DB save failed (email will still send):", dbError);
    }

    try {
      await sendQuoteEmail({
        ...parsed.data,
        installation,
        quoteId,
      });
    } catch (mailError) {
      console.error("Quote email failed:", mailError);
      return NextResponse.json(
        {
          error:
            "Could not email sales. Please call the showroom or try again.",
          id: quoteId,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: quoteId });
  } catch {
    return NextResponse.json({ error: "Could not submit quote request." }, { status: 500 });
  }
}
