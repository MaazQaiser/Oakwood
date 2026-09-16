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
  createSupportComplaint,
  createSupportEnquiry,
} from "@/features/support/store";
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
