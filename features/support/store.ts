import { randomBytes } from "crypto";
import { eskimoIntegration } from "@/lib/api/integrations";
import type { Lead } from "@/types/lead";
import type { SupportComplaintInput, SupportComplaintRecord } from "@/types/complaint";
import type { SupportEnquiryInput, SupportEnquiryRecord } from "@/types/enquiry";
import { MARKETING_CONSENT_WORDING } from "@/lib/eligibility/copy";

const enquiries = new Map<string, SupportEnquiryRecord>();
const complaints = new Map<string, SupportComplaintRecord>();

function opaqueId(): string {
  return randomBytes(16).toString("hex");
}

function reference(id: string, prefix: "ENQ" | "CMP"): string {
  return `OAK-${prefix}-${id.slice(0, 8).toUpperCase()}`;
}

function toLead(input: {
  name: string;
  email: string;
  telephone: string;
  source: string;
  stockId?: string;
  requestedAction: string;
}): Lead {
  return {
    id: opaqueId(),
    identity: {
      name: input.name,
      email: input.email,
      telephone: input.telephone,
    },
    source: {
      source: input.source,
      landingPage: input.source,
    },
    vehicleStockId: input.stockId,
    requestedAction: input.requestedAction,
  };
}

export function createSupportEnquiry(
  input: SupportEnquiryInput,
): SupportEnquiryRecord {
  const id = opaqueId();
  const record: SupportEnquiryRecord = {
    id,
    createdAt: Date.now(),
    reference: reference(id, "ENQ"),
    name: input.name,
    email: input.email,
    telephone: input.telephone,
    enquiryType: input.enquiryType,
    message: input.message,
    locationSlug: input.locationSlug,
    registration: input.registration,
    stockId: input.stockId,
    marketingConsent: input.marketingConsent,
    marketingConsentRecord: {
      granted: Boolean(input.marketingConsent),
      timestamp: new Date().toISOString(),
      method: "contact_form",
      wording: MARKETING_CONSENT_WORDING,
    },
    source: input.source ?? "contact",
    crmPayload: toLead({
      name: input.name,
      email: input.email,
      telephone: input.telephone,
      source: input.source ?? "contact",
      stockId: input.stockId,
      requestedAction: input.enquiryType,
    }),
  };
  enquiries.set(id, record);
  void eskimoIntegration.implemented;
  return record;
}

export function createSupportComplaint(
  input: SupportComplaintInput,
): SupportComplaintRecord {
  const id = opaqueId();
  const record: SupportComplaintRecord = {
    id,
    createdAt: Date.now(),
    reference: reference(id, "CMP"),
    name: input.name,
    email: input.email,
    telephone: input.telephone,
    category: input.category,
    description: input.description,
    locationSlug: input.locationSlug,
    existingReference: input.existingReference,
    source: input.source ?? "complaints",
    crmPayload: toLead({
      name: input.name,
      email: input.email,
      telephone: input.telephone,
      source: input.source ?? "complaints",
      requestedAction: "complaint",
    }),
  };
  complaints.set(id, record);
  void eskimoIntegration.implemented;
  return record;
}
