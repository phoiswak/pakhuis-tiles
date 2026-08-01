export type PricingTier = "RETAIL" | "CONTRACTOR" | "WHOLESALE";

export function priceForTier(
  product: {
    pricePerM2: number;
    contractorPrice?: number | null;
    wholesalePrice?: number | null;
    promoPricePerM2?: number | null;
  },
  tier: PricingTier = "RETAIL",
) {
  if (tier === "CONTRACTOR" && product.contractorPrice != null) {
    return product.contractorPrice;
  }
  if (tier === "WHOLESALE" && product.wholesalePrice != null) {
    return product.wholesalePrice;
  }
  if (product.promoPricePerM2 != null) {
    return product.promoPricePerM2;
  }
  return product.pricePerM2;
}

export function stockLabel(available: number, lowAt: number) {
  if (available <= 0) return "OUT_OF_STOCK";
  if (available <= lowAt) return "LOW_STOCK";
  return "IN_STOCK";
}
