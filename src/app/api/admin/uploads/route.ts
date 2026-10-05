import { NextResponse } from "next/server";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 6 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await requireStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size < 1) {
    return NextResponse.json({ error: "Please choose a photo of the tile." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That photo is too large. Use a photo under 6MB." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Please use a JPG or PNG photo." }, { status: 400 });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const image = await prisma.uploadedImage.create({
      data: {
        filename: file.name.slice(0, 180) || "tile.jpg",
        mimeType: file.type,
        bytes,
      },
    });
    return NextResponse.json({ ok: true, url: `/api/media/${image.id}` });
  } catch (error) {
    console.error("[uploads] failed", error);
    return NextResponse.json({ error: "Could not save the tile photo." }, { status: 500 });
  }
}
