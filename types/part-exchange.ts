export type PxEquityType = "positive" | "negative" | "none" | "unknown";

export type PxValuationStatus =
  | "idle"
  | "loading"
  | "valued"
  | "unavailable"
  | "not_found"
  | "ineligible"
  | "expired";

export type PxJourneyStatus =
  | "started"
  | "identified"
  | "valued"
  | "settlement"
  | "ready"
  | "applied"
  | "abandoned";

export type PxSource = "standalone" | "deal" | "vdp";

export type PxLookupFailureReason = "not_found" | "unavailable" | "ineligible";

export type PxValuationFailureReason = "unavailable" | "ineligible";

export interface PxIdentifiedVehicle {
  year: number;
  make: string;
  model: string;
  variant?: string;
  fuelType: string;
  transmission: string;
  source: "lookup" | "manual";
}

export interface PxValuationDeduction {
  label: string;
  amount: number;
}

export interface PxValuation {
  estimatedValue: number;
  valuationStatus: Extract<PxValuationStatus, "valued">;
  valuationDate: string;
  valuationExpiry?: string;
  deductions?: PxValuationDeduction[];
  source: "mock";
}

export interface PartExchange {
  registration?: string;
  vehicle?: PxIdentifiedVehicle;
  mileage?: number;
  estimatedValue?: number;
  valuationStatus: PxValuationStatus;
  settlementFigure?: number;
  financeOutstanding?: boolean;
  equity?: number;
  shortfall?: number;
  equityType: PxEquityType;
  valuationDate?: string;
  valuationExpiry?: string;
  deductions?: PxValuationDeduction[];
  source: PxSource;
  status: PxJourneyStatus;
}

export interface PxLookupSuccess {
  ok: true;
  vehicle: PxIdentifiedVehicle;
}

export interface PxLookupFailure {
  ok: false;
  reason: PxLookupFailureReason;
  message: string;
}

export type PxLookupResult = PxLookupSuccess | PxLookupFailure;

export interface PxValuationSuccess {
  ok: true;
  valuation: PxValuation;
}

export interface PxValuationFailure {
  ok: false;
  reason: PxValuationFailureReason;
  message: string;
}

export type PxValueResult = PxValuationSuccess | PxValuationFailure;

export type PxStep =
  | "intro"
  | "registration"
  | "lookup"
  | "vehicle"
  | "manual"
  | "mileage"
  | "valuing"
  | "valuation"
  | "finance"
  | "settlement"
  | "result";

export type PxErrorKind =
  | "invalid_registration"
  | "not_found"
  | "lookup_unavailable"
  | "valuation_unavailable"
  | "not_eligible"
  | "invalid_mileage"
  | "invalid_settlement"
  | "session_expired";
