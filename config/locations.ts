import type { Location } from "@/types/vehicle";
import type { ShowroomProfile } from "@/types/locations";

export const showrooms: Location[] = [
  {
    slug: "bury",
    name: "Bury",
    region: "Greater Manchester",
    regionSlug: "greater-manchester",
    postcode: "BL8 1SW",
    telephone: "0161 762 1000",
    isShowroom: true,
  },
  {
    slug: "chorley",
    name: "Chorley",
    region: "Lancashire",
    regionSlug: "lancashire",
    telephone: "01257 826 530",
    isShowroom: true,
  },
];

export const stockLocations: Location[] = [
  ...showrooms,
  {
    slug: "bolton",
    name: "Bolton",
    region: "Greater Manchester",
    regionSlug: "greater-manchester",
    isShowroom: false,
  },
];

function profileFor(slug: string, extras: Omit<ShowroomProfile, keyof Location>): ShowroomProfile {
  const location = showrooms.find((item) => item.slug === slug);
  if (!location) {
    throw new Error(`Showroom ${slug} is missing from location config.`);
  }
  return { ...location, ...extras };
}

const SHOWROOM_SERVICES: ShowroomProfile["services"] = [
  "used-cars",
  "used-vans",
  "finance",
  "part-exchange",
  "servicing",
  "mot",
  "warranty",
];

const STANDARD_OPENING_HOURS: ShowroomProfile["openingHours"] = [
  { department: "sales", days: "Monday to Saturday", hours: "09:00 – 18:00" },
  { department: "sales", days: "Sunday", hours: "10:00 – 17:00" },
  {
    department: "aftersales",
    days: "Monday to Saturday",
    hours: "09:00 – 18:00",
  },
  { department: "aftersales", days: "Sunday", hours: "10:00 – 17:00" },
];

export const showroomProfiles: ShowroomProfile[] = [
  profileFor("bury", {
    h1: "Oakwood Bury",
    eyebrow: "Bury showroom",
    descriptor:
      "Used cars in Bury, Greater Manchester. Visit us at BL8 1SW or browse the cars available here.",
    metaTitle: "Oakwood Bury | Used cars BL8 1SW",
    metaDescription:
      "Visit Oakwood Motor Company in Bury, BL8 1SW. Browse used cars, check finance eligibility, and book servicing at our Greater Manchester showroom.",
    services: SHOWROOM_SERVICES,
    openingHours: STANDARD_OPENING_HOURS,
    exceptions: [
      {
        label: "Bank holidays",
        note: "Hours may vary — call the showroom to confirm.",
      },
    ],
    hoursStatus: "published",
  }),
  profileFor("chorley", {
    h1: "Oakwood Chorley",
    eyebrow: "Chorley showroom",
    descriptor:
      "Used car sales in Chorley and Adlington. Visit Oakwood in Lancashire or browse the cars available at this location.",
    metaTitle: "Oakwood Chorley | Car sales Chorley and Adlington",
    metaDescription:
      "Visit Oakwood Motor Company in Chorley for used car sales in Chorley and Adlington. Browse stock, check finance, and book aftersales in Lancashire.",
    services: SHOWROOM_SERVICES,
    openingHours: STANDARD_OPENING_HOURS,
    exceptions: [
      {
        label: "Bank holidays",
        note: "Hours may vary — call the showroom to confirm.",
      },
    ],
    hoursStatus: "published",
  }),
];

export function getShowroom(slug: string): Location | undefined {
  return showrooms.find((location) => location.slug === slug);
}

export function getShowroomProfile(slug: string): ShowroomProfile | undefined {
  return showroomProfiles.find((location) => location.slug === slug);
}

export function getStockLocation(slug: string): Location | undefined {
  return stockLocations.find((location) => location.slug === slug);
}

export function formatShowroomAddress(location: Location): string {
  return [location.postcode, location.region].filter(Boolean).join(", ");
}
