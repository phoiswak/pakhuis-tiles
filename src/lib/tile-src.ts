import type { StaticImageData } from "next/image";

import tile01 from "@/assets/tiles/tile-01.jpg";
import tile02 from "@/assets/tiles/tile-02.jpg";
import tile03 from "@/assets/tiles/tile-03.jpg";
import tile04 from "@/assets/tiles/tile-04.jpg";
import tile05 from "@/assets/tiles/tile-05.jpg";
import tile06 from "@/assets/tiles/tile-06.jpg";
import tile07 from "@/assets/tiles/tile-07.jpg";
import tile08 from "@/assets/tiles/tile-08.jpg";
import tile09 from "@/assets/tiles/tile-09.jpg";
import tile10 from "@/assets/tiles/tile-10.jpg";
import tile11 from "@/assets/tiles/tile-11.jpg";
import tile12 from "@/assets/tiles/tile-12.jpg";
import tile13 from "@/assets/tiles/tile-13.jpg";
import tile14 from "@/assets/tiles/tile-14.jpg";
import tile15 from "@/assets/tiles/tile-15.jpg";
import tile16 from "@/assets/tiles/tile-16.jpg";
import tile17 from "@/assets/tiles/tile-17.jpg";
import tile18 from "@/assets/tiles/tile-18.jpg";
import tile19 from "@/assets/tiles/tile-19.jpg";
import tile20 from "@/assets/tiles/tile-20.jpg";
import tile21 from "@/assets/tiles/tile-21.jpg";
import tile22 from "@/assets/tiles/tile-22.jpg";
import tile23 from "@/assets/tiles/tile-23.jpg";
import tile24 from "@/assets/tiles/tile-24.jpg";
import tile25 from "@/assets/tiles/tile-25.jpg";
import tile26 from "@/assets/tiles/tile-26.jpg";
import tile27 from "@/assets/tiles/tile-27.jpg";
import tile28 from "@/assets/tiles/tile-28.jpg";
import tile29 from "@/assets/tiles/tile-29.jpg";
import tile30 from "@/assets/tiles/tile-30.jpg";
import tile31 from "@/assets/tiles/tile-31.jpg";
import tile32 from "@/assets/tiles/tile-32.jpg";
import tile33 from "@/assets/tiles/tile-33.jpg";
import tile34 from "@/assets/tiles/tile-34.jpg";
import tile35 from "@/assets/tiles/tile-35.jpg";
import tile36 from "@/assets/tiles/tile-36.jpg";
import tile37 from "@/assets/tiles/tile-37.jpg";
import tile38 from "@/assets/tiles/tile-38.jpg";
import tile39 from "@/assets/tiles/tile-39.jpg";
import tile40 from "@/assets/tiles/tile-40.jpg";
import tile41 from "@/assets/tiles/tile-41.jpg";

const TILE_SRC: Record<string, string> = {
  "/images/tile-01.jpg": tile01.src,
  "/images/tile-02.jpg": tile02.src,
  "/images/tile-03.jpg": tile03.src,
  "/images/tile-04.jpg": tile04.src,
  "/images/tile-05.jpg": tile05.src,
  "/images/tile-06.jpg": tile06.src,
  "/images/tile-07.jpg": tile07.src,
  "/images/tile-08.jpg": tile08.src,
  "/images/tile-09.jpg": tile09.src,
  "/images/tile-10.jpg": tile10.src,
  "/images/tile-11.jpg": tile11.src,
  "/images/tile-12.jpg": tile12.src,
  "/images/tile-13.jpg": tile13.src,
  "/images/tile-14.jpg": tile14.src,
  "/images/tile-15.jpg": tile15.src,
  "/images/tile-16.jpg": tile16.src,
  "/images/tile-17.jpg": tile17.src,
  "/images/tile-18.jpg": tile18.src,
  "/images/tile-19.jpg": tile19.src,
  "/images/tile-20.jpg": tile20.src,
  "/images/tile-21.jpg": tile21.src,
  "/images/tile-22.jpg": tile22.src,
  "/images/tile-23.jpg": tile23.src,
  "/images/tile-24.jpg": tile24.src,
  "/images/tile-25.jpg": tile25.src,
  "/images/tile-26.jpg": tile26.src,
  "/images/tile-27.jpg": tile27.src,
  "/images/tile-28.jpg": tile28.src,
  "/images/tile-29.jpg": tile29.src,
  "/images/tile-30.jpg": tile30.src,
  "/images/tile-31.jpg": tile31.src,
  "/images/tile-32.jpg": tile32.src,
  "/images/tile-33.jpg": tile33.src,
  "/images/tile-34.jpg": tile34.src,
  "/images/tile-35.jpg": tile35.src,
  "/images/tile-36.jpg": tile36.src,
  "/images/tile-37.jpg": tile37.src,
  "/images/tile-38.jpg": tile38.src,
  "/images/tile-39.jpg": tile39.src,
  "/images/tile-40.jpg": tile40.src,
  "/images/tile-41.jpg": tile41.src
};


function srcOf(image: string | StaticImageData): string {
  return typeof image === "string" ? image : image.src;
}

export function resolveTileSrc(image: string | StaticImageData | null | undefined): string {
  if (!image) return tile01.src;
  const path = srcOf(image);
  return TILE_SRC[path] ?? path;
}
