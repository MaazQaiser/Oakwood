import type { OakwoodImageSlot } from "@/lib/media/oakwood";

/**
 * Homepage photography slots. Set `src` when authentic Oakwood photography
 * is supplied. Do not point these at generic stock, Unsplash, or AI images.
 */
export const HOME_SHOWROOM_IMAGES: Record<string, OakwoodImageSlot> = {
  bury: {
    label: "Bury showroom",
    intended: "Oakwood Motor Company Bury showroom",
  },
  chorley: {
    label: "Chorley showroom",
    intended: "Oakwood Motor Company Chorley showroom",
  },
};

export const HOME_NEED_IMAGES: Record<string, OakwoodImageSlot> = {
  small: {
    label: "Small cars",
    intended: "Oakwood small cars in stock",
  },
  family: {
    label: "Family cars",
    intended: "Oakwood family cars in stock",
  },
  suv: {
    label: "SUVs",
    intended: "Oakwood SUVs in stock",
  },
  automatic: {
    label: "Automatic cars",
    intended: "Oakwood automatic cars in stock",
  },
  "hybrid-electric": {
    label: "Hybrid and electric",
    intended: "Oakwood hybrid and electric cars in stock",
  },
  "low-mileage": {
    label: "Low mileage",
    intended: "Oakwood low-mileage cars in stock",
  },
  vans: {
    label: "Vans",
    intended: "Oakwood vans in stock",
  },
};

export const HOME_FINANCE_IMAGES = {
  warranty: {
    label: "Prepared vehicle",
    intended: "Oakwood prepared used car with AA warranty",
  },
  customer: {
    label: "Customer handover",
    intended: "Oakwood customer at Bury or Chorley",
  },
} as const satisfies Record<string, OakwoodImageSlot>;

export const HOME_REVIEW_IMAGES = {
  "driving-away": {
    label: "Driving away",
    intended: "Oakwood customer driving away from Bury",
  },
  "showroom-handover": {
    label: "Showroom handover",
    intended: "Oakwood customer handover at Bury",
  },
} as const satisfies Record<string, OakwoodImageSlot>;

export function showroomPhotography(slug: string): OakwoodImageSlot {
  return (
    HOME_SHOWROOM_IMAGES[slug] ?? {
      label: "Showroom",
      intended: "Oakwood showroom photography",
    }
  );
}

export function needPhotography(id: string): OakwoodImageSlot {
  return (
    HOME_NEED_IMAGES[id] ?? {
      label: "Oakwood stock",
      intended: "Oakwood vehicle photography",
    }
  );
}
