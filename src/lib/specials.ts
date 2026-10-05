import { isMonthlySaleActive } from "@/data/monthly-sale";

export const MONTH_OPTIONS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const;

export function sastYearMonth(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-ZA", {
      timeZone: "Africa/Johannesburg",
      year: "numeric",
      month: "numeric",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  return { year: Number(parts.year), month: Number(parts.month) };
}

export function isMonthCurrent(year?: number | null, month?: number | null, now = new Date()) {
  if (!year || !month) return false;
  const current = sastYearMonth(now);
  return current.year === year && current.month === month;
}

export function isSpecialLive(
  product: {
    isSpecial?: boolean | null;
    specialYear?: number | null;
    specialMonth?: number | null;
  },
  now = new Date(),
) {
  if (!product.isSpecial) return false;
  if (product.specialYear && product.specialMonth) {
    return isMonthCurrent(product.specialYear, product.specialMonth, now);
  }
  return isMonthlySaleActive(now);
}

export function specialYearOptions(now = new Date()) {
  const { year } = sastYearMonth(now);
  return [year, year + 1];
}
