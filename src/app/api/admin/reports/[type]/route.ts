import { NextResponse } from "next/server";
import { requireStaffSession } from "@/lib/auth";
import { generateReportPdf } from "@/lib/report-pdf";
import { getReport, toExcelCsv } from "@/lib/reports";

type Params = { params: Promise<{ type: string }> };

export async function GET(request: Request, { params }: Params) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await params;
  const report = await getReport(type);
  if (!report) {
    return NextResponse.json({ error: "Unknown report type." }, { status: 404 });
  }

  const format = new URL(request.url).searchParams.get("format") === "pdf" ? "pdf" : "csv";

  if (format === "pdf") {
    const file = await generateReportPdf(report);
    return new NextResponse(Buffer.from(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${report.filename}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  }

  return new NextResponse(toExcelCsv(report), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${report.filename}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
