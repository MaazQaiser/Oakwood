"use server";

import { findVehicleByStockId } from "@/lib/vehicles";
import {
  complaintCategoryError,
  contactError,
  enquiryTypeError,
  isComplaintCategory,
  isEnquiryType,
  locationError,
  messageError,
  normaliseRegistration,
} from "@/lib/support/validation";
import {
  createCallbackLead,
  createSupportComplaint,
  createSupportEnquiry,
} from "@/features/support/store";
import { nameError, telephoneError } from "@/lib/aftersales/validation";
import { getShowroomProfile } from "@/config/locations";
import {
  getMockShowroomOpenStatus,
  getNextOpenDays,
  getSalesTimeSlots,
} from "@/lib/deal/opening-status";
import type { SupportComplaintInput } from "@/types/complaint";
import type { SupportEnquiryInput } from "@/types/enquiry";

export async function submitSupportEnquiry(
  input: SupportEnquiryInput,
): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  try {
    const invalidContact = contactError(input);
    if (invalidContact) {
      return { ok: false, error: invalidContact };
    }
    const typeInvalid = enquiryTypeError(input.enquiryType);
    if (typeInvalid) {
      return { ok: false, error: typeInvalid };
    }
    const messageInvalid = messageError(input.message);
    if (messageInvalid) {
      return { ok: false, error: messageInvalid };
    }
    if (input.locationSlug) {
      const locInvalid = locationError(input.locationSlug);
      if (locInvalid) {
        return { ok: false, error: locInvalid };
      }
    }
    const knownVehicle = input.stockId
      ? findVehicleByStockId(input.stockId)
      : undefined;

    const record = createSupportEnquiry({
      ...input,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      telephone: input.telephone.trim(),
      message: input.message.trim(),
      stockId: knownVehicle?.stockId,
      registration: input.registration
        ? normaliseRegistration(input.registration)
        : undefined,
      marketingConsent: Boolean(input.marketingConsent),
      source: input.source ?? "contact",
    });

    return { ok: true, reference: record.reference };
  } catch {
    return { ok: false, error: "We couldn't send your message." };
  }
}

export async function submitSupportComplaint(
  input: SupportComplaintInput,
): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  try {
    const invalidContact = contactError(input);
    if (invalidContact) {
      return { ok: false, error: invalidContact };
    }
    const categoryInvalid = complaintCategoryError(input.category);
    if (categoryInvalid) {
      return { ok: false, error: categoryInvalid };
    }
    const descriptionInvalid = messageError(input.description, "description");
    if (descriptionInvalid) {
      return { ok: false, error: descriptionInvalid };
    }
    if (input.locationSlug) {
      const locInvalid = locationError(input.locationSlug);
      if (locInvalid) {
        return { ok: false, error: locInvalid };
      }
    }

    const record = createSupportComplaint({
      ...input,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      telephone: input.telephone.trim(),
      description: input.description.trim(),
      existingReference: input.existingReference?.trim() || undefined,
      source: input.source ?? "complaints",
    });

    return { ok: true, reference: record.reference };
  } catch {
    return { ok: false, error: "We couldn't submit your complaint." };
  }
}

export async function submitCallbackRequest(input: {
  name: string;
  telephone: string;
  locationSlug: string;
  dateYmd: string;
  time: string;
  whenLabel: string;
  stockId?: string;
  dealId?: string;
}): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  try {
    const invalidName = nameError(input.name);
    if (invalidName || input.name.trim().split(/\s+/).length < 2) {
      return { ok: false, error: invalidName ?? "Enter your first and last name." };
    }
    const invalidPhone = telephoneError(input.telephone);
    if (invalidPhone) {
      return { ok: false, error: invalidPhone };
    }
    const invalidLocation = locationError(input.locationSlug);
    if (invalidLocation) {
      return { ok: false, error: invalidLocation };
    }

    const status = getMockShowroomOpenStatus(input.locationSlug);
    if (status.open || input.dateYmd !== status.nextOpenDate) {
      return {
        ok: false,
        error: "That time isn't available. Please choose another slot.",
      };
    }
    const slot = getSalesTimeSlots(input.dateYmd).find(
      (item) => item.time === input.time && item.available,
    );
    if (!slot) {
      return {
        ok: false,
        error: "That time isn't available. Please choose another slot.",
      };
    }

    const knownVehicle = input.stockId
      ? findVehicleByStockId(input.stockId)
      : undefined;
    const saved = createCallbackLead({
      name: input.name.trim(),
      telephone: input.telephone.trim(),
      locationSlug: input.locationSlug,
      stockId: knownVehicle?.stockId,
      dealId: input.dealId,
      whenLabel: input.whenLabel,
    });
    return { ok: true, reference: saved.reference };
  } catch {
    return { ok: false, error: "We couldn't book your callback." };
  }
}

export async function submitPriorityCallbackRequest(input: {
  name: string;
  telephone: string;
  locationSlug: string;
  dateYmd: string;
  time: string;
  whenLabel: string;
  vehicleLabel: string;
  stockId: string;
  dealId: string;
}): Promise<{ ok: true; reference: string } | { ok: false; error: string }> {
  try {
    const invalidName = nameError(input.name);
    if (invalidName || input.name.trim().split(/\s+/).length < 2) {
      return { ok: false, error: invalidName ?? "Enter your first and last name." };
    }
    const invalidPhone = telephoneError(input.telephone);
    if (invalidPhone) {
      return { ok: false, error: invalidPhone };
    }
    const invalidLocation = locationError(input.locationSlug);
    if (invalidLocation) {
      return { ok: false, error: invalidLocation };
    }
    const profile = getShowroomProfile(input.locationSlug);
    if (!profile || profile.hoursStatus !== "published") {
      return {
        ok: false,
        error: "That time isn't available. Please choose another slot.",
      };
    }
    const openDay = getNextOpenDays(4).some((day) => day.ymd === input.dateYmd);
    const slot = getSalesTimeSlots(input.dateYmd).find(
      (item) => item.time === input.time && item.available,
    );
    if (!openDay || !slot) {
      return {
        ok: false,
        error: "That time isn't available. Please choose another slot.",
      };
    }
    const knownVehicle = findVehicleByStockId(input.stockId);
    if (!knownVehicle) {
      return { ok: false, error: "We couldn't book your callback." };
    }
    const saved = createCallbackLead({
      name: input.name.trim(),
      telephone: input.telephone.trim(),
      locationSlug: input.locationSlug,
      stockId: knownVehicle.stockId,
      dealId: input.dealId,
      whenLabel: input.whenLabel,
      vehicleLabel: input.vehicleLabel,
      priority: true,
      source: "deal-call-me-back",
    });
    return { ok: true, reference: saved.reference };
  } catch {
    return { ok: false, error: "We couldn't book your callback." };
  }
}

export async function parseEnquiryType(value?: string) {
  if (!value) {
    return undefined;
  }
  return isEnquiryType(value) ? value : undefined;
}

export async function parseComplaintCategory(value?: string) {
  if (!value) {
    return undefined;
  }
  return isComplaintCategory(value) ? value : undefined;
}
