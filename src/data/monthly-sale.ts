/**
 * Monthly homepage sale campaign.
 * When you load a new month’s specials: replace the hero-sale images in
 * public/images and change MONTHLY_SALE_MONTH (year + month 1–12).
 * The slider and specials drop off automatically at that month-end (SAST).
 */
export const MONTHLY_SALE_MONTH = { year: 2026, month: 9 } as const;

export type HeroSaleSlide = {
  src: string;
  alt: string;
};

export const HERO_SALE_SLIDES: HeroSaleSlide[] = [
  {
    src: "/images/hero-sale-1.jpg",
    alt: "September specials — Celtic Maple, Ashenwood, Armani Crystal and Celtic Mocca planks now R159 per square metre",
  },
  {
    src: "/images/hero-sale-2.jpg",
    alt: "Limited time tile specials — Veronda Charcoal, Carnival Black, EarthVein Taupe, Oyster Leaf Brown and Pacific Green",
  },
  {
    src: "/images/hero-sale-3.jpg",
    alt: "Opening specials — Newlands Grey, Ramco Grey, Light Grey Speckle, Atlantic Sand and Rainfall Pink",
  },
  {
    src: "/images/hero-sale-4.jpg",
    alt: "Opening special plank posters — Celtic Maple, Celtic Mocca, Ashenwood and Armani Crystal valid to 30 September",
  },
];

export function endOfMonthSast(year: number, month: number): Date {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const mm = String(month).padStart(2, "0");
  const dd = String(lastDay).padStart(2, "0");
  return new Date(`${year}-${mm}-${dd}T23:59:59+02:00`);
}

export const MONTHLY_SALE_EXPIRES_AT = endOfMonthSast(
  MONTHLY_SALE_MONTH.year,
  MONTHLY_SALE_MONTH.month,
);

export function isMonthlySaleActive(now: Date = new Date()): boolean {
  return now.getTime() <= MONTHLY_SALE_EXPIRES_AT.getTime();
}

export function isCampaignProduct(sku: string): boolean {
  return sku.startsWith("PT-SP-");
}
