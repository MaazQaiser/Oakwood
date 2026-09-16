export interface LeadIdentity {
  name?: string;
  telephone?: string;
  email?: string;
  postcode?: string;
}

export interface LeadSource {
  source?: string;
  medium?: string;
  campaign?: string;
  landingPage?: string;
  referrer?: string;
  device?: string;
  sessionIdentifier?: string;
}

export interface Lead {
  id: string;
  identity: LeadIdentity;
  source: LeadSource;
  vehicleStockId?: string;
  dealId?: string;
  requestedAction?: string;
}
