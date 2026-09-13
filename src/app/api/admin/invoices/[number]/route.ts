import { NextResponse } from "next/server";
import { requireStaffSession } from "@/lib/auth";
import { generateInvoicePdf } from "@/lib/invoice-pdf";
import { getInvoice } from "@/lib/invoices";

type Props = { params: Promise<{ number: string }> };

export async function GET(request: Request, { params }: Props) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { number } = await params;
  const invoice = await getInvoice(number);
  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const file = await generateInvoicePdf(invoice);
  const download = new URL(request.url).searchParams.get("download") === "1";

  return new NextResponse(Buffer.from(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="Invoice ${invoice.number}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
