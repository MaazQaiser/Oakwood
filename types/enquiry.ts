import type { Lead, LeadIdentity, LeadSource } from "@/types/lead";
import type { SupportEnquiryType } from "@/types/support";

export interface SupportEnquiryInput {
  name: string;
  email: string;
  telephone: string;
  enquiryType: SupportEnquiryType;
  message: string;
  locationSlug?: string;
  registration?: string;
  stockId?: string;
  marketingConsent: boolean;
  source?: string;
}

export interface MarketingConsentRecord {
  granted: boolean;
  timestamp: string;
  method: "contact_form";
  wording: string;
}

export interface SupportEnquiryRecord {
  id: string;
  createdAt: number;
  reference: string;
  name: string;
  email: string;
  telephone: string;
  enquiryType: SupportEnquiryType;
  message: string;
  locationSlug?: string;
  registration?: string;
  stockId?: string;
  marketingConsent: boolean;
  marketingConsentRecord: MarketingConsentRecord;
  source: string;
  crmPayload: Lead;
}

export interface SupportEnquiryLeadContext {
  identity: LeadIdentity;
  source: LeadSource;
  vehicleStockId?: string;
  requestedAction: SupportEnquiryType;
  locationSlug?: string;
  registration?: string;
  message: string;
  marketingConsent: boolean;
  journeyStage: "support";
}
