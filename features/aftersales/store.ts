import { randomBytes } from "crypto";
import { getShowroom } from "@/config/locations";
import {
  bookingNextSteps,
  bookingInstructions,
  claimNextSteps,
} from "@/lib/aftersales/content";
import { formatBookingReference, formatVehicleLabel } from "@/lib/aftersales/format";
import type {
  AftersalesBookingSource,
  AftersalesBookingType,
  AftersalesContact,
  AftersalesVehicle,
} from "@/types/aftersales";
import type {
  BookingPreference,
  BookingRecordView,
  BookingStatus,
  BookingStep,
} from "@/types/booking";
import type {
  WarrantyClaimStatus,
  WarrantyClaimStep,
  WarrantyClaimView,
} from "@/types/warranty";

export const BOOKING_SESSION_COOKIE = "oakwood_booking_session";
export const CLAIM_SESSION_COOKIE = "oakwood_claim_session";
export const AFTERSALES_SESSION_TTL_MS = 4 * 60 * 60 * 1000;

export interface BookingSessionRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  step: BookingStep;
  status: BookingStatus;
  source: AftersalesBookingSource;
  registration?: string;
  vehicle?: AftersalesVehicle;
  serviceType?: AftersalesBookingType;
  locationSlug?: string;
  preference: BookingPreference;
  contact?: AftersalesContact;
  notes?: string;
  reference?: string;
  failureReason?: "submit" | "unavailable";
}

export interface WarrantyClaimRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  step: WarrantyClaimStep;
  status: WarrantyClaimStatus;
  registration?: string;
  vehicle?: AftersalesVehicle;
  issue?: string;
  locationSlug?: string;
  contact?: AftersalesContact;
  reference?: string;
}

export interface EnquiryRecord {
  id: string;
  createdAt: number;
  reference: string;
  name: string;
  telephone: string;
  email: string;
  message: string;
  locationSlug?: string;
  registration?: string;
}

const bookings = new Map<string, BookingSessionRecord>();
const claims = new Map<string, WarrantyClaimRecord>();
const enquiries = new Map<string, EnquiryRecord>();

export function createAftersalesOpaqueId(): string {
  return randomBytes(16).toString("hex");
}

function isFresh(expiresAt: number, now: number): boolean {
  return expiresAt > now;
}

export function createBookingRecord(
  id: string,
  source: AftersalesBookingSource,
  now = Date.now(),
): BookingSessionRecord {
  const record: BookingSessionRecord = {
    id,
    createdAt: now,
    updatedAt: now,
    expiresAt: now + AFTERSALES_SESSION_TTL_MS,
    step: "vehicle",
    status: "started",
    source,
    preference: {},
  };
  bookings.set(id, record);
  return record;
}

export function getBookingRecord(
  id: string,
  now = Date.now(),
): BookingSessionRecord | null {
  const record = bookings.get(id);
  if (!record) {
    return null;
  }
  if (!isFresh(record.expiresAt, now)) {
    return { ...record };
  }
  return record;
}

export function isBookingExpired(
  record: BookingSessionRecord,
  now = Date.now(),
): boolean {
  return record.expiresAt <= now;
}

export function patchBookingRecord(
  id: string,
  patch: Partial<Omit<BookingSessionRecord, "id" | "createdAt">>,
  now = Date.now(),
): BookingSessionRecord | null {
  const record = bookings.get(id);
  if (!record) {
    return null;
  }
  const next: BookingSessionRecord = {
    ...record,
    ...patch,
    preference: patch.preference
      ? { ...record.preference, ...patch.preference }
      : record.preference,
    updatedAt: now,
    expiresAt: now + AFTERSALES_SESSION_TTL_MS,
  };
  bookings.set(id, next);
  return next;
}

export function createClaimRecord(
  id: string,
  now = Date.now(),
): WarrantyClaimRecord {
  const record: WarrantyClaimRecord = {
    id,
    createdAt: now,
    updatedAt: now,
    expiresAt: now + AFTERSALES_SESSION_TTL_MS,
    step: "intro",
    status: "started",
  };
  claims.set(id, record);
  return record;
}

export function getClaimRecord(
  id: string,
  now = Date.now(),
): WarrantyClaimRecord | null {
  const record = claims.get(id);
  if (!record) {
    return null;
  }
  if (!isFresh(record.expiresAt, now)) {
    return { ...record };
  }
  return record;
}

export function isClaimExpired(
  record: WarrantyClaimRecord,
  now = Date.now(),
): boolean {
  return record.expiresAt <= now;
}

export function patchClaimRecord(
  id: string,
  patch: Partial<Omit<WarrantyClaimRecord, "id" | "createdAt">>,
  now = Date.now(),
): WarrantyClaimRecord | null {
  const record = claims.get(id);
  if (!record) {
    return null;
  }
  const next: WarrantyClaimRecord = {
    ...record,
    ...patch,
    updatedAt: now,
    expiresAt: now + AFTERSALES_SESSION_TTL_MS,
  };
  claims.set(id, next);
  return next;
}

export function createEnquiryRecord(input: {
  name: string;
  telephone: string;
  email: string;
  message: string;
  locationSlug?: string;
  registration?: string;
  now?: number;
}): EnquiryRecord {
  const now = input.now ?? Date.now();
  const id = createAftersalesOpaqueId();
  const record: EnquiryRecord = {
    id,
    createdAt: now,
    reference: formatBookingReference(id, "ENQ"),
    name: input.name,
    telephone: input.telephone,
    email: input.email,
    message: input.message,
    locationSlug: input.locationSlug,
    registration: input.registration,
  };
  enquiries.set(id, record);
  return record;
}

export function toBookingView(record: BookingSessionRecord): BookingRecordView | null {
  if (!record.reference || !record.serviceType || !record.locationSlug || !record.contact) {
    return null;
  }
  const location = getShowroom(record.locationSlug);
  return {
    reference: record.reference,
    serviceType: record.serviceType,
    locationSlug: record.locationSlug,
    locationName: location?.name ?? record.locationSlug,
    registration: record.registration,
    vehicleLabel: formatVehicleLabel(record.vehicle),
    preferredDate: record.preference.date,
    preferredTime: record.preference.timeWindow,
    contactName: record.contact.name,
    nextSteps: bookingNextSteps,
    instructions: bookingInstructions,
  };
}

export function toClaimView(record: WarrantyClaimRecord): WarrantyClaimView | null {
  if (!record.reference) {
    return null;
  }
  const location = record.locationSlug
    ? getShowroom(record.locationSlug)
    : undefined;
  return {
    reference: record.reference,
    registration: record.registration,
    vehicleLabel: formatVehicleLabel(record.vehicle),
    locationName: location?.name,
    nextSteps: claimNextSteps,
  };
}
