import { showrooms } from "@/config/locations";
import { routes, trustRoutes } from "@/config/routes";
import {
  HOME_PROOF_POINTS,
  HOME_WARRANTY_AA_UPGRADE,
  HOME_WARRANTY_INCLUDED,
} from "@/lib/home/copy";
import { CMS_TRUST_NOTICE, preparationCopy } from "@/lib/trust/content";

export interface WhyOakwoodImageSlot {
  id: "preparation" | "workshop" | "showrooms" | "technicians";
  label: string;
  intended: string;
  src?: string;
  alt?: string;
}

export interface WhyOakwoodTechnician {
  name?: string;
  qualifications?: string;
  yearsOfService?: string;
  photoSrc?: string;
}

export const WHY_OAKWOOD_HEADING = "Why Oakwood";

export const WHY_OAKWOOD_INTRO =
  "Oakwood selects used cars, inspects them, prepares them in-house, and supports them with warranty and aftersales from two showrooms and our own workshop.";

export const WHY_OAKWOOD_CMS_NOTICE = CMS_TRUST_NOTICE;

/** Published on the homepage proof strip. Not a cars-handed-over figure. */
export const WHY_OAKWOOD_CARS = HOME_PROOF_POINTS[0];

export const WHY_OAKWOOD_AA_INSPECTED = "Every car AA inspected";

export const WHY_OAKWOOD_AA_POINTS = "Over 130-point AA inspection";

export const WHY_OAKWOOD_AA_NOTE =
  "The inspection certificate is listed on each vehicle page, not as a homepage summary.";

export const WHY_OAKWOOD_WARRANTY = HOME_WARRANTY_INCLUDED;

export const WHY_OAKWOOD_WARRANTY_COPY = HOME_WARRANTY_AA_UPGRADE;

export const WHY_OAKWOOD_PREPARATION_HEADING = "In-house vehicle preparation";

export const WHY_OAKWOOD_PREPARATION = preparationCopy.description;

export const WHY_OAKWOOD_WORKSHOP = "Own workshop";

export const WHY_OAKWOOD_SHOWROOMS = showrooms.map((showroom) => ({
  name: showroom.name,
  slug: showroom.slug,
}));

export const WHY_OAKWOOD_ESTABLISHED_YEAR: string | undefined = undefined;

export const WHY_OAKWOOD_CARS_HANDED_OVER: string | undefined = undefined;

export const WHY_OAKWOOD_TECHNICIANS: WhyOakwoodTechnician[] = [];

export const WHY_OAKWOOD_IMAGES: WhyOakwoodImageSlot[] = [
  {
    id: "preparation",
    label: "Preparation centre",
    intended: "Oakwood in-house vehicle preparation",
    src: "/images/stock/family.jpg",
    alt: "A prepared used car ready for handover",
  },
  {
    id: "workshop",
    label: "Workshop",
    intended: "Oakwood's own workshop",
    src: "/images/stock/dealership-01.jpg",
    alt: "Vehicles being prepared at Oakwood",
  },
  {
    id: "showrooms",
    label: "Showrooms",
    intended: "Oakwood Bury and Chorley",
    src: "/images/hero/showroom-customer.png",
    alt: "A customer with a car in the showroom",
  },
  {
    id: "technicians",
    label: "Technicians",
    intended: "Oakwood technicians and workshop staff",
    src: "/images/hero/open-sky.png",
    alt: "A smiling customer beside a car under an open sky",
  },
];

export const WHY_OAKWOOD_LINKS = {
  aaStandards: trustRoutes.aaStandards,
  warranty: routes.warranty,
  garage: trustRoutes.ourGarage,
  locations: routes.locations,
} as const;
