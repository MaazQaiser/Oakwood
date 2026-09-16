import {
  getBookingUrl,
  getLocationStockUrl,
  getUsedVansUrl,
  routes,
} from "@/config/routes";
import type { LocationServiceItem, LocationServiceKey } from "@/types/locations";

export const LOCATION_HOURS_NOTICE =
  "Opening hours will appear here when the location content source is connected.";

export const LOCATION_ADDRESS_NOTICE =
  "A full street address is not published here yet. Use the postcode and location name where shown.";

export const locationServiceCatalog: Record<LocationServiceKey, LocationServiceItem> = {
  "used-cars": {
    key: "used-cars",
    title: "Used cars",
    copy: "Browse used cars available at this Oakwood location.",
    href: routes.usedCars,
    cta: "View cars",
  },
  "used-vans": {
    key: "used-vans",
    title: "Used vans",
    copy: "See vans listed with Oakwood.",
    href: getUsedVansUrl(),
    cta: "View vans",
  },
  finance: {
    key: "finance",
    title: "Finance",
    copy: "Check eligibility and see monthly figures before you choose a car.",
    href: routes.finance,
    cta: "Car finance",
  },
  "part-exchange": {
    key: "part-exchange",
    title: "Part exchange",
    copy: "Get an estimated valuation and use it when you build your deal.",
    href: routes.partExchange,
    cta: "Part exchange",
  },
  servicing: {
    key: "servicing",
    title: "Servicing",
    copy: "Book a service at Bury or Chorley.",
    href: routes.service,
    cta: "Book a service",
  },
  mot: {
    key: "mot",
    title: "MOT",
    copy: "Request an MOT at this location.",
    href: routes.mot,
    cta: "Book an MOT",
  },
  warranty: {
    key: "warranty",
    title: "Warranty",
    copy: "Available cars include a 12-month warranty. Claim details are listed with the vehicle.",
    href: routes.warranty,
    cta: "Warranty",
  },
};

export function servicesForLocation(
  keys: LocationServiceKey[],
  locationSlug: string,
): LocationServiceItem[] {
  return keys.map((key) => {
    const item = locationServiceCatalog[key];
    if (key === "used-cars") {
      return {
        ...item,
        href: getLocationStockUrl(locationSlug),
      };
    }
    if (key === "servicing") {
      return {
        ...item,
        href: getBookingUrl({
          type: "service",
          source: "aftersales",
          location: locationSlug,
        }),
      };
    }
    if (key === "mot") {
      return {
        ...item,
        href: getBookingUrl({
          type: "mot",
          source: "mot",
          location: locationSlug,
        }),
      };
    }
    return item;
  });
}
