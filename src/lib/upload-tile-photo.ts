const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;

export async function compressTilePhoto(file: File): Promise<File> {
  if (!ALLOWED.has(file.type) && !file.type.startsWith("image/")) {
    throw new Error("Please use a JPG or PNG photo of the tile.");
  }

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("Could not read that photo. Try a JPG or PNG from WhatsApp.");
  });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not process that photo.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error("Could not process that photo."))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  const name = file.name.replace(/\.[^.]+$/, "") || "tile";
  return new File([blob], `${name}.jpg`, { type: "image/jpeg" });
}

export async function uploadTilePhoto(file: File): Promise<string> {
  const photo = await compressTilePhoto(file);
  const form = new FormData();
  form.append("file", photo);

  const res = await fetch("/api/admin/uploads", {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || typeof data.url !== "string") {
    throw new Error(data.error || "Could not upload the tile photo.");
  }
  return data.url;
}
