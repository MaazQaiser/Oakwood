export const HOME_HERO_VARIANTS = ["current", "filters"] as const;

export type HomeHeroVariant = (typeof HOME_HERO_VARIANTS)[number];

export const HOME_HERO_VARIANT_PARAM = "hero";
export const HOME_HERO_VARIANT_STORAGE = "oakwood-hero-variant";

export function isHomeHeroVariant(value: string | null): value is HomeHeroVariant {
  return value === "current" || value === "filters";
}
