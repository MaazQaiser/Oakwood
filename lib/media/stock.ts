/** Local Unsplash stock used for authentic UK automotive imagery. */

export const stockImages = {
  hatchback01: "/images/stock/hatchback-01.jpg",
  hatchback02: "/images/stock/hatchback-02.jpg",
  hatchback03: "/images/stock/hatchback-03.jpg",
  saloon01: "/images/stock/saloon-01.jpg",
  saloon02: "/images/stock/saloon-02.jpg",
  suv01: "/images/stock/suv-01.jpg",
  suv02: "/images/stock/suv-02.jpg",
  estate01: "/images/stock/estate-01.jpg",
  van01: "/images/stock/van-01.jpg",
  van02: "/images/stock/van-02.jpg",
  mpv01: "/images/stock/mpv-01.jpg",
  coupe01: "/images/stock/coupe-01.jpg",
  carSide: "/images/stock/car-side.jpg",
  carRear: "/images/stock/car-rear.jpg",
  carInterior: "/images/stock/car-interior.jpg",
  carDashboard: "/images/stock/car-dashboard.jpg",
  dealershipBury: "/images/stock/dealership-01.jpg",
  dealershipChorley: "/images/stock/dealership-02.jpg",
  lifestyleDrive: "/images/stock/lifestyle-drive.jpg",
  lifestyleUk: "/images/stock/lifestyle-uk.jpg",
  ev: "/images/stock/ev.jpg",
  family: "/images/stock/family.jpg",
  keys: "/images/stock/lifestyle-uk.jpg",
} as const;

const bodyPools: Record<string, string[]> = {
  Hatchback: [
    stockImages.hatchback01,
    stockImages.hatchback02,
    stockImages.hatchback03,
  ],
  Saloon: [stockImages.saloon01, stockImages.saloon02],
  SUV: [stockImages.suv01, stockImages.suv02],
  Estate: [stockImages.estate01, stockImages.suv01],
  Van: [stockImages.van01, stockImages.van02],
  MPV: [stockImages.mpv01, stockImages.family],
  Coupe: [stockImages.coupe01, stockImages.saloon01],
  Convertible: [stockImages.coupe01, stockImages.hatchback02],
};

export function pickStockImage(seed: string, pool: string[]): string {
  const digits = seed.replace(/\D/g, "");
  const index = Number(digits || "0") % pool.length;
  return pool[index] ?? pool[0];
}

export function vehicleCardImage(input: {
  stockId: string;
  bodyStyle: string;
  category?: string;
}): string {
  if (input.category === "van" || input.bodyStyle === "Van") {
    return pickStockImage(input.stockId, bodyPools.Van);
  }

  return pickStockImage(
    input.stockId,
    bodyPools[input.bodyStyle] ?? bodyPools.Hatchback,
  );
}

export function vehicleGalleryImages(hero: string): string[] {
  return [
    hero,
    stockImages.carSide,
    stockImages.carRear,
    stockImages.carInterior,
    stockImages.carDashboard,
    stockImages.carRear,
  ];
}

export function locationStockImage(slug: string): string {
  return slug === "chorley"
    ? stockImages.dealershipChorley
    : stockImages.dealershipBury;
}

export function needCategoryImage(id: string): string {
  const images: Record<string, string> = {
    small: stockImages.hatchback01,
    family: stockImages.family,
    suv: stockImages.suv01,
    automatic: stockImages.saloon01,
    "hybrid-electric": stockImages.ev,
    "low-mileage": stockImages.hatchback02,
    vans: stockImages.van01,
  };

  return images[id] ?? stockImages.lifestyleDrive;
}

export function contentFallbackHero(input: {
  type?: string;
  slug?: string;
  category?: string;
}): { src: string; alt: string } {
  const slug = input.slug ?? "";
  const type = input.type ?? "";

  if (slug.includes("suv") || input.category?.toLowerCase().includes("suv")) {
    return { src: stockImages.suv01, alt: "Used SUV parked in daylight" };
  }
  if (slug.includes("hatch") || type === "model-guide") {
    return {
      src: stockImages.hatchback01,
      alt: "Used hatchback on a UK road",
    };
  }
  if (type === "comparison") {
    return {
      src: stockImages.hatchback03,
      alt: "Everyday used car on a daylight road",
    };
  }

  if (type === "article" || input.category?.toLowerCase().includes("finance")) {
    return {
      src: stockImages.keys,
      alt: "Handing over car keys in daylight",
    };
  }

  return {
    src: stockImages.lifestyleDrive,
    alt: "Driving on a bright UK road",
  };
}
