import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaffSession } from "@/lib/auth";
import { sendQuoteReplyEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { QUOTE_STATUSES } from "@/lib/quotes-admin";

const patchSchema = z.object({
  status: z.enum(QUOTE_STATUSES).optional(),
  adminNotes: z.string().optional(),
});

const replySchema = z.object({
  subject: z.string().min(2),
  message: z.string().min(2),
  markContacted: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const quote = await prisma.quoteRequest.findUnique({ where: { id } });
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ quote });
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  try {
    const quote = await prisma.quoteRequest.update({
      where: { id },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.adminNotes !== undefined
          ? { adminNotes: parsed.data.adminNotes }
          : {}),
      },
    });
    return NextResponse.json({ ok: true, quote });
  } catch {
    return NextResponse.json({ error: "Could not update quote." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const quote = await prisma.quoteRequest.findUnique({ where: { id } });
  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = replySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });
  }

  try {
    await sendQuoteReplyEmail({
      to: quote.email,
      customerName: quote.fullName,
      subject: parsed.data.subject,
      message: parsed.data.message,
      quoteId: quote.id,
    });

    const nextStatus =
      parsed.data.markContacted !== false &&
      (quote.status === "NEW" || quote.status === "CONTACTED")
        ? "CONTACTED"
        : quote.status;

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: {
        status: nextStatus,
        lastContactedAt: new Date(),
        adminNotes: [
          quote.adminNotes?.trim(),
          `[${new Date().toISOString()}] Email sent by ${session.user?.email || "staff"}: ${parsed.data.subject}`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    });

    return NextResponse.json({ ok: true, quote: updated });
  } catch (error) {
    console.error("Quote reply failed:", error);
    return NextResponse.json(
      { error: "Could not send email. Check SMTP settings." },
      { status: 502 },
    );
  }
}
