import type { AftersalesBookingSource, AftersalesBookingType } from "@/config/routes";

export type AftersalesServiceKey =
  | "service"
  | "mot"
  | "warranty"
  | "warranty-claims"
  | "booking";

export type AftersalesContentStatus = "published" | "cms-pending";

export interface AftersalesFaqItem {
  question: string;
  answer: string;
}

export interface AftersalesVehicle {
  year: number;
  make: string;
  model: string;
  variant?: string;
  fuelType: string;
  transmission: string;
  source: "lookup" | "manual" | "session";
}

export interface AftersalesVehicleContext {
  registration?: string;
  vehicle?: AftersalesVehicle;
  source?: AftersalesBookingSource | "session";
}

export interface AftersalesContact {
  name: string;
  telephone: string;
  email: string;
}

export interface AftersalesPageCopy {
  eyebrow: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

export type { AftersalesBookingSource, AftersalesBookingType };
