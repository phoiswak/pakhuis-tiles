import type { StaticImageData } from "next/image";

function srcOf(image: string | StaticImageData): string {
  return typeof image === "string" ? image : image.src;
}

/** Warehouse photos live in public/images and are served as /images/tile-XX.jpg. */
export function resolveTileSrc(image: string | StaticImageData | null | undefined): string {
  if (!image) return "/images/tile-01.jpg";
  return srcOf(image);
}
