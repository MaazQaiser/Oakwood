export type VdpLayoutVariant = 1 | 2;

export const VDP_VARIANT_STORAGE_KEY = "oakwood_vdp_variant";
export const VDP_VARIANT_QUERY = "vdp";

export function isVdpVariantSwitchEnabled(): boolean {
  return true;
}

export function parseVdpVariantParam(value: string | string[] | undefined): VdpLayoutVariant | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "1") {
    return 1;
  }
  if (raw === "2") {
    return 2;
  }
  return null;
}

/** Server-side initial variant from the URL. */
export function resolveVdpVariantFromSearchParams(
  searchParams?: Record<string, string | string[] | undefined>,
): VdpLayoutVariant {
  if (!isVdpVariantSwitchEnabled()) {
    return 1;
  }
  const fromQuery = parseVdpVariantParam(searchParams?.[VDP_VARIANT_QUERY]);
  return fromQuery ?? 1;
}
