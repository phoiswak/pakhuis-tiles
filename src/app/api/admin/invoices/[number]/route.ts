import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireStaffSession } from "@/lib/auth";
import { getStaffInvoice, staffInvoicePdfPath } from "@/data/staff-invoices";

type Props = { params: Promise<{ number: string }> };

export async function GET(request: Request, { params }: Props) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { number } = await params;
  const invoice = getStaffInvoice(number);
  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), staffInvoicePdfPath(invoice));
  const file = await readFile(filePath);
  const download = new URL(request.url).searchParams.get("download") === "1";

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="Invoice ${invoice.number}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
