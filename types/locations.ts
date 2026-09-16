import type { Location } from "@/types/vehicle";

export type LocationServiceKey =
  | "used-cars"
  | "used-vans"
  | "finance"
  | "part-exchange"
  | "servicing"
  | "mot"
  | "warranty";

export type OpeningHoursDepartment = "sales" | "aftersales";

export interface OpeningHoursRow {
  department: OpeningHoursDepartment;
  days: string;
  hours: string;
}

export interface OpeningHoursException {
  label: string;
  note: string;
}

export interface LocationServiceItem {
  key: LocationServiceKey;
  title: string;
  copy: string;
  href: string;
  cta: string;
}

export interface ShowroomProfile extends Location {
  h1: string;
  eyebrow: string;
  descriptor: string;
  metaTitle: string;
  metaDescription: string;
  services: LocationServiceKey[];
  openingHours: OpeningHoursRow[];
  exceptions: OpeningHoursException[];
  hoursStatus: "published" | "cms-pending";
}

export interface LocationStockSummary {
  slug: string;
  availableCount: number;
}
