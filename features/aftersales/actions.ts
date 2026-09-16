"use server";

import { getShowroom } from "@/config/locations";
import { getBookingAvailability } from "@/lib/aftersales/availability";
import { formatBookingReference } from "@/lib/aftersales/format";
import { lookupAftersalesVehicle } from "@/lib/aftersales/lookup";
import {
  contactError,
  issueError,
  locationError,
  normaliseRegistration,
  preferredDateError,
  registrationError,
  sanitiseContact,
  serviceTypeError,
  timeWindowError,
  toManualVehicle,
  vehicleDetailsError,
} from "@/lib/aftersales/validation";
import {
  getBookingSession,
  getClaimSession,
  getOrCreateBookingSession,
  getOrCreateClaimSession,
  writeBookingCookie,
} from "@/features/aftersales/session";
import {
  createAftersalesOpaqueId,
  createBookingRecord,
  createEnquiryRecord,
  isBookingExpired,
  isClaimExpired,
  patchBookingRecord,
  patchClaimRecord,
  toBookingView,
  toClaimView,
  type BookingSessionRecord,
  type WarrantyClaimRecord,
} from "@/features/aftersales/store";
import type {
  AftersalesBookingSource,
  AftersalesBookingType,
  AftersalesVehicle,
} from "@/types/aftersales";
import type {
  BookingAvailabilityResult,
  BookingRecordView,
  BookingStep,
  BookingTimeWindow,
} from "@/types/booking";
import type { WarrantyClaimStep, WarrantyClaimView } from "@/types/warranty";

export interface BookingUiState {
  step: BookingStep;
  expired: boolean;
  source: AftersalesBookingSource;
  registration?: string;
  vehicle?: AftersalesVehicle;
  serviceType?: AftersalesBookingType;
  locationSlug?: string;
  preferredDate?: string;
  timeWindow?: BookingTimeWindow;
  selectedSlotId?: string;
  contactName?: string;
  contactTelephone?: string;
  contactEmail?: string;
  availability: BookingAvailabilityResult;
  confirmation?: BookingRecordView;
  error?: string;
}

export interface ClaimUiState {
  step: WarrantyClaimStep;
  expired: boolean;
  registration?: string;
  vehicle?: AftersalesVehicle;
  issue?: string;
  locationSlug?: string;
  contactName?: string;
  contactTelephone?: string;
  contactEmail?: string;
  confirmation?: WarrantyClaimView;
  error?: string;
}

function toBookingUi(record: BookingSessionRecord): BookingUiState {
  return {
    step: record.step,
    expired: isBookingExpired(record),
    source: record.source,
    registration: record.registration,
    vehicle: record.vehicle,
    serviceType: record.serviceType,
    locationSlug: record.locationSlug,
    preferredDate: record.preference.date,
    timeWindow: record.preference.timeWindow,
    selectedSlotId: record.preference.selectedSlotId,
    contactName: record.contact?.name,
    contactTelephone: record.contact?.telephone,
    contactEmail: record.contact?.email,
    availability: getBookingAvailability(),
    confirmation: toBookingView(record) ?? undefined,
    error:
      record.status === "failed"
        ? record.failureReason === "unavailable"
          ? "service"
          : "submit"
        : undefined,
  };
}

function toClaimUi(record: WarrantyClaimRecord): ClaimUiState {
  return {
    step: record.step,
    expired: isClaimExpired(record),
    registration: record.registration,
    vehicle: record.vehicle,
    issue: record.issue,
    locationSlug: record.locationSlug,
    contactName: record.contact?.name,
    contactTelephone: record.contact?.telephone,
    contactEmail: record.contact?.email,
    confirmation: toClaimView(record) ?? undefined,
    error: record.status === "failed" ? "submit" : undefined,
  };
}

export async function getBookingUiState(): Promise<BookingUiState | { empty: true }> {
  const record = await getBookingSession();
  if (!record) {
    return { empty: true };
  }
  return toBookingUi(record);
}

export async function startBookingSession(input: {
  source: AftersalesBookingSource;
  serviceType?: AftersalesBookingType;
  locationSlug?: string;
  registration?: string;
  vehicle?: AftersalesVehicle;
}): Promise<BookingUiState> {
  const record = await getOrCreateBookingSession(input.source);
  const patched = patchBookingRecord(record.id, {
    source: input.source,
    serviceType: input.serviceType ?? record.serviceType,
    locationSlug: input.locationSlug ?? record.locationSlug,
    registration: input.registration ?? record.registration,
    vehicle: input.vehicle ?? record.vehicle,
    step:
      record.status === "requested"
        ? "vehicle"
        : input.vehicle
          ? "confirm-vehicle"
          : "vehicle",
    status: "started",
    failureReason: undefined,
  });
  return toBookingUi(patched ?? record);
}

export async function lookupBookingVehicle(input: {
  registration: string;
}): Promise<BookingUiState | { error: string }> {
  const invalid = registrationError(input.registration);
  if (invalid) {
    return { error: invalid };
  }

  const record = await getOrCreateBookingSession("aftersales");
  const result = lookupAftersalesVehicle(input.registration);
  const registration = normaliseRegistration(input.registration);

  if (!result.ok) {
    const patched = patchBookingRecord(record.id, {
      registration,
      step: "vehicle",
    });
    return {
      ...toBookingUi(patched ?? record),
      error: result.reason,
    };
  }

  const patched = patchBookingRecord(record.id, {
    registration,
    vehicle: result.vehicle,
    step: "confirm-vehicle",
  });
  return toBookingUi(patched ?? record);
}

export async function confirmBookingVehicle(): Promise<BookingUiState | { error: string }> {
  const record = await getBookingSession();
  if (!record) {
    return { error: "session" };
  }
  const nextStep: BookingStep = record.serviceType ? "location" : "service";
  const patched = patchBookingRecord(record.id, { step: nextStep });
  return toBookingUi(patched ?? record);
}

export async function saveBookingManualVehicle(input: {
  year: string;
  make: string;
  model: string;
  variant?: string;
  fuelType: string;
  transmission: string;
}): Promise<BookingUiState | { error: string }> {
  const invalid = vehicleDetailsError(input);
  if (invalid) {
    return { error: invalid };
  }
  const record = await getOrCreateBookingSession("aftersales");
  const vehicle = toManualVehicle(input);
  const nextStep: BookingStep = record.serviceType ? "location" : "service";
  const patched = patchBookingRecord(record.id, {
    vehicle,
    step: nextStep,
  });
  return toBookingUi(patched ?? record);
}

export async function saveBookingServiceType(input: {
  serviceType: AftersalesBookingType;
}): Promise<BookingUiState | { error: string }> {
  const invalid = serviceTypeError(input.serviceType);
  if (invalid) {
    return { error: invalid };
  }
  const record = await getOrCreateBookingSession("aftersales");
  const patched = patchBookingRecord(record.id, {
    serviceType: input.serviceType,
    step: "location",
  });
  return toBookingUi(patched ?? record);
}

export async function saveBookingLocation(input: {
  locationSlug: string;
}): Promise<BookingUiState | { error: string }> {
  const invalid = locationError(input.locationSlug);
  if (invalid) {
    return { error: invalid };
  }
  if (!getShowroom(input.locationSlug)) {
    return { error: "Choose Bury or Chorley." };
  }
  const record = await getOrCreateBookingSession("aftersales");
  const patched = patchBookingRecord(record.id, {
    locationSlug: input.locationSlug,
    step: "slot",
  });
  return toBookingUi(patched ?? record);
}

export async function refreshBookingAvailability(): Promise<BookingUiState | { error: string }> {
  const record = await getBookingSession();
  if (!record) {
    return { error: "session" };
  }
  return toBookingUi(record);
}

export async function saveBookingPreference(input: {
  date?: string;
  timeWindow?: BookingTimeWindow;
  selectedSlotId?: string;
}): Promise<BookingUiState | { error: string }> {
  const invalid = input.selectedSlotId
    ? undefined
    : preferredDateError(input.date) ?? timeWindowError(input.timeWindow);
  if (invalid) {
    return { error: invalid };
  }
  if (input.selectedSlotId && !input.date) {
    return { error: "Choose an appointment." };
  }
  const record = await getOrCreateBookingSession("aftersales");
  const patched = patchBookingRecord(record.id, {
    preference: {
      date: input.date,
      timeWindow: input.timeWindow ?? (input.selectedSlotId ? "any" : undefined),
      selectedSlotId: input.selectedSlotId,
    },
    step: "details",
  });
  return toBookingUi(patched ?? record);
}

export async function saveBookingDetails(input: {
  name: string;
  telephone: string;
  email: string;
}): Promise<BookingUiState | { error: string }> {
  const invalid = contactError(input);
  if (invalid) {
    return { error: invalid };
  }
  const record = await getOrCreateBookingSession("aftersales");
  const patched = patchBookingRecord(record.id, {
    contact: sanitiseContact(input),
    step: "review",
  });
  return toBookingUi(patched ?? record);
}

export async function submitBookingRequest(): Promise<BookingUiState | { error: string }> {
  const record = await getBookingSession();
  if (!record) {
    return { error: "session" };
  }

  const slotOk = Boolean(record.preference.selectedSlotId && record.preference.date);
  const missing =
    serviceTypeError(record.serviceType) ??
    locationError(record.locationSlug) ??
    (slotOk
      ? undefined
      : preferredDateError(record.preference.date) ??
        timeWindowError(record.preference.timeWindow)) ??
    (record.contact ? contactError(record.contact) : "Enter your contact details.") ??
    (!record.vehicle && !record.registration ? "Tell us about the vehicle." : undefined);

  if (missing) {
    return { error: missing };
  }

  patchBookingRecord(record.id, { step: "submitting" });

  if (record.contact?.email.startsWith("fail@")) {
    const failed = patchBookingRecord(record.id, {
      step: "failed",
      status: "failed",
      failureReason: "submit",
    });
    return toBookingUi(failed ?? record);
  }

  const reference = record.reference ?? formatBookingReference(record.id, "BOOK");
  const patched = patchBookingRecord(record.id, {
    step: "confirmation",
    status: "requested",
    reference,
    failureReason: undefined,
  });
  return toBookingUi(patched ?? record);
}

export async function retryBookingSubmit(): Promise<BookingUiState | { error: string }> {
  const record = await getBookingSession();
  if (!record) {
    return { error: "session" };
  }
  const patched = patchBookingRecord(record.id, {
    step: "review",
    status: "started",
    failureReason: undefined,
  });
  return toBookingUi(patched ?? record);
}

export async function goToBookingStep(
  step: BookingStep,
): Promise<BookingUiState | { error: string }> {
  const record = await getBookingSession();
  if (!record) {
    return { error: "session" };
  }
  const patched = patchBookingRecord(record.id, { step });
  return toBookingUi(patched ?? record);
}

export async function restartBooking(source: AftersalesBookingSource): Promise<BookingUiState> {
  const id = createAftersalesOpaqueId();
  const record = createBookingRecord(id, source);
  await writeBookingCookie(id);
  return toBookingUi(record);
}

export async function getClaimUiState(): Promise<ClaimUiState | { empty: true }> {
  const record = await getClaimSession();
  if (!record) {
    return { empty: true };
  }
  return toClaimUi(record);
}

export async function startClaimSession(input?: {
  registration?: string;
  vehicle?: AftersalesVehicle;
}): Promise<ClaimUiState> {
  const record = await getOrCreateClaimSession();
  const vehicle = input?.vehicle ?? record.vehicle;
  const patched = patchClaimRecord(record.id, {
    registration: input?.registration ?? record.registration,
    vehicle,
    step: vehicle ? "confirm-vehicle" : "vehicle",
    status: "started",
  });
  return toClaimUi(patched ?? record);
}

export async function lookupClaimVehicle(input: {
  registration: string;
}): Promise<ClaimUiState | { error: string }> {
  const invalid = registrationError(input.registration);
  if (invalid) {
    return { error: invalid };
  }
  const record = await getOrCreateClaimSession();
  const result = lookupAftersalesVehicle(input.registration);
  const registration = normaliseRegistration(input.registration);
  if (!result.ok) {
    const patched = patchClaimRecord(record.id, { registration, step: "vehicle" });
    return { ...toClaimUi(patched ?? record), error: result.reason };
  }
  const patched = patchClaimRecord(record.id, {
    registration,
    vehicle: result.vehicle,
    step: "confirm-vehicle",
  });
  return toClaimUi(patched ?? record);
}

export async function confirmClaimVehicle(): Promise<ClaimUiState | { error: string }> {
  const record = await getClaimSession();
  if (!record) {
    return { error: "session" };
  }
  const patched = patchClaimRecord(record.id, { step: "issue" });
  return toClaimUi(patched ?? record);
}

export async function saveClaimManualVehicle(input: {
  year: string;
  make: string;
  model: string;
  variant?: string;
  fuelType: string;
  transmission: string;
}): Promise<ClaimUiState | { error: string }> {
  const invalid = vehicleDetailsError(input);
  if (invalid) {
    return { error: invalid };
  }
  const record = await getOrCreateClaimSession();
  const patched = patchClaimRecord(record.id, {
    vehicle: toManualVehicle(input),
    step: "issue",
  });
  return toClaimUi(patched ?? record);
}

export async function saveClaimIssue(input: {
  issue: string;
}): Promise<ClaimUiState | { error: string }> {
  const invalid = issueError(input.issue);
  if (invalid) {
    return { error: invalid };
  }
  const record = await getOrCreateClaimSession();
  const patched = patchClaimRecord(record.id, {
    issue: input.issue.trim(),
    step: "location",
  });
  return toClaimUi(patched ?? record);
}

export async function saveClaimLocation(input: {
  locationSlug: string;
}): Promise<ClaimUiState | { error: string }> {
  const invalid = locationError(input.locationSlug);
  if (invalid) {
    return { error: invalid };
  }
  const record = await getOrCreateClaimSession();
  const patched = patchClaimRecord(record.id, {
    locationSlug: input.locationSlug,
    step: "details",
  });
  return toClaimUi(patched ?? record);
}

export async function submitClaimRequest(input: {
  name: string;
  telephone: string;
  email: string;
}): Promise<ClaimUiState | { error: string }> {
  const invalid = contactError(input);
  if (invalid) {
    return { error: invalid };
  }
  const record = await getOrCreateClaimSession();
  if (!record.vehicle && !record.registration) {
    return { error: "Tell us about the vehicle." };
  }
  const issueInvalid = issueError(record.issue);
  if (issueInvalid) {
    return { error: issueInvalid };
  }

  patchClaimRecord(record.id, {
    contact: sanitiseContact(input),
    step: "submitting",
  });

  if (input.email.trim().toLowerCase().startsWith("fail@")) {
    const failed = patchClaimRecord(record.id, {
      step: "failed",
      status: "failed",
    });
    return toClaimUi(failed ?? record);
  }

  const reference = record.reference ?? formatBookingReference(record.id, "CLAIM");
  const patched = patchClaimRecord(record.id, {
    contact: sanitiseContact(input),
    step: "success",
    status: "submitted",
    reference,
  });
  return toClaimUi(patched ?? record);
}

export async function retryClaimSubmit(): Promise<ClaimUiState | { error: string }> {
  const record = await getClaimSession();
  if (!record) {
    return { error: "session" };
  }
  const patched = patchClaimRecord(record.id, {
    step: "details",
    status: "started",
  });
  return toClaimUi(patched ?? record);
}

export async function goToClaimStep(
  step: WarrantyClaimStep,
): Promise<ClaimUiState | { error: string }> {
  const record = await getClaimSession();
  if (!record) {
    return { error: "session" };
  }
  const patched = patchClaimRecord(record.id, { step });
  return toClaimUi(patched ?? record);
}

export async function submitCallbackEnquiry(input: {
  name: string;
  telephone: string;
  email: string;
  message: string;
  locationSlug?: string;
  registration?: string;
}): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  const invalid = contactError(input);
  if (invalid) {
    return { ok: false, error: invalid };
  }
  if (!input.message.trim()) {
    return { ok: false, error: "Tell us how we can help." };
  }
  if (input.locationSlug) {
    const locInvalid = locationError(input.locationSlug);
    if (locInvalid) {
      return { ok: false, error: locInvalid };
    }
  }
  const record = createEnquiryRecord({
    name: input.name.trim(),
    telephone: input.telephone.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
    locationSlug: input.locationSlug,
    registration: input.registration
      ? normaliseRegistration(input.registration)
      : undefined,
  });
  return { ok: true, reference: record.reference };
}

export async function abandonBooking(): Promise<void> {
  const record = await getBookingSession();
  if (!record || record.status === "requested") {
    return;
  }
  patchBookingRecord(record.id, { status: "abandoned" });
}

export async function abandonClaim(): Promise<void> {
  const record = await getClaimSession();
  if (!record || record.status === "submitted") {
    return;
  }
  patchClaimRecord(record.id, { status: "abandoned" });
}
