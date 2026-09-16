import { listVehicles } from "@/lib/vehicles/query";
import type { Vehicle } from "@/types/vehicle";

export function getSimilarVehicles(
  vehicle: Vehicle,
  limit = 4,
): Vehicle[] {
  const catalog = listVehicles(vehicle.category).filter(
    (item) =>
      item.stockId !== vehicle.stockId && item.availability === "available",
  );

  const scored = catalog
    .map((item) => {
      let score = 0;
      if (item.makeSlug === vehicle.makeSlug) score += 8;
      if (item.modelSlug === vehicle.modelSlug) score += 6;
      if (item.bodyStyle === vehicle.bodyStyle) score += 4;
      if (item.fuelType === vehicle.fuelType) score += 2;
      if (item.transmission === vehicle.transmission) score += 1;
      const priceGap = Math.abs(item.cashPrice - vehicle.cashPrice);
      score += Math.max(0, 4 - Math.floor(priceGap / 4000));
      const monthlyGap = Math.abs(item.monthlyPayment - vehicle.monthlyPayment);
      score += Math.max(0, 3 - Math.floor(monthlyGap / 50));
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.item);
}

export function getGalleryItems(
  images: Array<{ src: string; alt: string; width: number; height: number }>,
  video?: { title: string; poster: string; src?: string },
): Array<{
  kind: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
  title?: string;
  width: number;
  height: number;
}> {
  const [first, ...rest] = images;
  const items: Array<{
    kind: "image" | "video";
    src: string;
    alt: string;
    poster?: string;
    title?: string;
    width: number;
    height: number;
  }> = [];

  if (first) {
    items.push({
      kind: "image",
      src: first.src,
      alt: first.alt,
      width: first.width,
      height: first.height,
    });
  }

  if (video) {
    items.push({
      kind: "video",
      src: video.src ?? video.poster,
      poster: video.poster,
      title: video.title,
      alt: video.title,
      width: first?.width ?? 1600,
      height: first?.height ?? 1000,
    });
  }

  rest.forEach((image) => {
    items.push({
      kind: "image",
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
    });
  });

  return items;
}
