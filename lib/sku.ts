function randomSegment(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function generateSku(name: string, prefix = "PRD"): string {
  const namePart = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4);
  return [prefix, namePart, randomSegment(5)].filter(Boolean).join("-");
}

export function generateVariantSku(baseSku: string | null | undefined, variantLabel: string): string {
  const base = (baseSku ?? "VAR").replace(/\s+/g, "");
  const suffix = variantLabel
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base}-${suffix}`;
}
