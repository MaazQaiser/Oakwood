export interface OakwoodImageSlot {
  label: string;
  intended: string;
  src?: string;
  alt?: string;
}

const GENERIC_STOCK_PREFIXES = [
  "/images/stock/",
  "/images/hero/",
  "/images/promo/",
  "/images/makes/",
] as const;

/** True for Unsplash/AI/generic assets — not authentic Oakwood photography. */
export function isGenericStockSrc(src?: string): boolean {
  if (!src) return true;
  return GENERIC_STOCK_PREFIXES.some((prefix) => src.startsWith(prefix));
}

/**
 * Inventory photography only when the bound source is authentic Oakwood.
 * Generic stock and schematic placeholders are treated as missing.
 */
export function oakwoodInventoryImage(src?: string): string | undefined {
  if (!src || isGenericStockSrc(src) || src.endsWith(".svg")) return undefined;
  return src;
}
