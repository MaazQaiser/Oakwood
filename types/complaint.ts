import type { Lead, LeadIdentity, LeadSource } from "@/types/lead";
import type { SupportComplaintCategory } from "@/types/support";

export interface SupportComplaintInput {
  name: string;
  email: string;
  telephone: string;
  category: SupportComplaintCategory;
  description: string;
  locationSlug?: string;
  existingReference?: string;
  source?: string;
}

export interface SupportComplaintRecord {
  id: string;
  createdAt: number;
  reference: string;
  name: string;
  email: string;
  telephone: string;
  category: SupportComplaintCategory;
  description: string;
  locationSlug?: string;
  existingReference?: string;
  source: string;
  crmPayload: Lead;
}

export interface SupportComplaintLeadContext {
  identity: LeadIdentity;
  source: LeadSource;
  requestedAction: "complaint";
  category: SupportComplaintCategory;
  locationSlug?: string;
  existingReference?: string;
  message: string;
  journeyStage: "complaint";
}
