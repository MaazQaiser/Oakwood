import type { AftersalesContact, AftersalesVehicle } from "@/types/aftersales";

export type WarrantyClaimStep =
  | "intro"
  | "vehicle"
  | "lookup"
  | "confirm-vehicle"
  | "manual"
  | "issue"
  | "location"
  | "details"
  | "submitting"
  | "failed"
  | "success";

export type WarrantyClaimStatus = "started" | "submitted" | "failed" | "abandoned";

export interface WarrantyClaimRequest {
  registration?: string;
  vehicle?: AftersalesVehicle;
  issue?: string;
  locationSlug?: string;
  contact?: AftersalesContact;
}

export interface WarrantyClaimView {
  reference: string;
  registration?: string;
  vehicleLabel?: string;
  locationName?: string;
  nextSteps: string[];
}
