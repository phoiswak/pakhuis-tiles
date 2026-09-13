export function parseTileSizeMm(sizeMm: string) {
  const match = sizeMm.replace(/\s/g, "").match(/(\d+(?:\.\d+)?)[x×](\d+(?:\.\d+)?)/i);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}

export function m2PerTile(sizeMm: string) {
  const size = parseTileSizeMm(sizeMm);
  if (!size) return 0;
  return (size.width / 1000) * (size.height / 1000);
}

export function tilesPerBox(sizeMm: string) {
  const size = parseTileSizeMm(sizeMm);
  if (!size) return 4;
  const min = Math.min(size.width, size.height);
  const max = Math.max(size.width, size.height);
  if (max >= 1180 && min <= 250) return 5;
  if (max >= 1180 && min >= 500) return 2;
  if (min >= 590 && max <= 610) return 4;
  return 4;
}

export function m2PerBox(sizeMm: string) {
  return Number((m2PerTile(sizeMm) * tilesPerBox(sizeMm)).toFixed(3));
}

export function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
