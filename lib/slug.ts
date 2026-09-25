export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface SlugDelegate {
  findFirst(args: { where: Record<string, unknown> }): Promise<{ id: number } | null>;
}

export async function ensureUniqueSlug(
  delegate: SlugDelegate,
  baseSlug: string,
  excludeId?: number
): Promise<string> {
  const base = slugify(baseSlug) || "item";
  let candidate = base;
  let suffix = 1;

  while (true) {
    const existing = await delegate.findFirst({
      where: excludeId ? { slug: candidate, id: { not: excludeId } } : { slug: candidate },
    });
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}
