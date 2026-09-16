import type {
  AftersalesBookingSource,
  AftersalesBookingType,
  AftersalesContact,
  AftersalesVehicle,
} from "@/types/aftersales";

export type BookingStep =
  | "vehicle"
  | "lookup"
  | "confirm-vehicle"
  | "manual"
  | "service"
  | "location"
  | "slot"
  | "details"
  | "review"
  | "submitting"
  | "failed"
  | "confirmation";

export type BookingAvailabilityStatus =
  | "idle"
  | "loading"
  | "available"
  | "none"
  | "unavailable";

export type BookingTimeWindow = "morning" | "afternoon" | "evening" | "any";

export type BookingStatus =
  | "started"
  | "requested"
  | "failed"
  | "abandoned";

export interface BookingPreference {
  date?: string;
  timeWindow?: BookingTimeWindow;
  selectedSlotId?: string;
}

export interface BookingSlot {
  id: string;
  startsAt: string;
  label: string;
}

export interface BookingAvailabilityResult {
  status: Exclude<BookingAvailabilityStatus, "idle" | "loading">;
  slots: BookingSlot[];
  message: string;
}

export interface BookingRequest {
  registration?: string;
  vehicle?: AftersalesVehicle;
  serviceType?: AftersalesBookingType;
  locationSlug?: string;
  preference: BookingPreference;
  selectedSlotId?: string;
  contact?: AftersalesContact;
  notes?: string;
  source: AftersalesBookingSource;
}

export interface BookingRecordView {
  reference: string;
  serviceType: AftersalesBookingType;
  locationSlug: string;
  locationName: string;
  registration?: string;
  vehicleLabel?: string;
  preferredDate?: string;
  preferredTime?: BookingTimeWindow;
  contactName: string;
  nextSteps: string[];
  instructions: string;
}
