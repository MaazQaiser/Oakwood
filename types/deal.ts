import type { FinanceProductType } from "./finance";
import type { Vehicle, VehicleAvailability } from "./vehicle";
import type { DealProviderConfig } from "@/lib/deal/provider-config";

export type DealState =
  | "draft"
  | "configured"
  | "application"
  | "decision"
  | "confirmation"
  | "abandoned";

export type DealBuilderPhase =
  | "INITIAL"
  | "LOADING"
  | "READY"
  | "RECALCULATING"
  | "INVALID"
  | "VEHICLE_UNAVAILABLE"
  | "FINANCE_EXPIRED"
  | "CALCULATION_ERROR"
  | "SAVED"
  | "READY_FOR_APPLICATION";

export type DealConstraintCode =
  | "min_deposit"
  | "max_deposit"
  | "min_advance"
  | "max_advance"
  | "term_unavailable"
  | "mileage_unavailable"
  | "vehicle_age"
  | "vehicle_mileage"
  | "ltv"
  | "negative_equity"
  | "product_eligibility"
  | "nothing_to_finance";

export type DealConstraintAction =
  | "add_deposit"
  | "choose_vehicle"
  | "change_term"
  | "change_mileage"
  | "remove_product"
  | "contact";

export interface DealConstraintMessage {
  code: DealConstraintCode;
  title: string;
  body: string;
  action?: DealConstraintAction;
  depositGap?: number;
}

export interface DealProduct {
  id: string;
  name: string;
  type: "warranty" | "paint-fabric" | "service-plan" | "mot-bundle" | "other";
  price: number;
  selected: boolean;
}

/** @deprecated Use DealProduct. */
export type Product = DealProduct;

export interface DealProductDefinition {
  id: string;
  name: string;
  type: DealProduct["type"];
  summary: string;
  details: string;
  price: number;
  /**
   * Whether the product can be added to the amount financed.
   * Mock until the lender confirms product financeability.
   */
  financeable: boolean;
}

export interface PartExchange {
  id: string;
  registration?: string;
  mileage?: number;
  valuation?: number;
  settlement?: number;
  equity?: number;
}

export interface DealPartExchangeVehicle {
  year: number;
  make: string;
  model: string;
  variant?: string;
  fuelType: string;
  transmission: string;
}

export interface DealPartExchangeInput {
  registration: string;
  mileage: number;
  value: number;
  settlement?: number;
  vehicle?: DealPartExchangeVehicle;
  financeOutstanding?: boolean;
  valuationDate?: string;
}

export interface Deal {
  id: string;
  vehicleStockId: string;
  customerId?: string;
  financeType: FinanceProductType;
  deposit: number;
  termMonths: number;
  annualMileage?: number;
  monthlyFigure?: number;
  totalPayable?: number;
  partExchange?: PartExchange;
  products: DealProduct[];
  state: DealState;
}

export interface DealDraft {
  financeType: FinanceProductType;
  cashDeposit: number;
  term: number;
  annualMileage?: number;
  px?: DealPartExchangeInput;
  productIds: string[];
}

export interface DealFinanceProfileInput {
  apr: number;
  maximumAdvance: number;
  maximumTerm: number;
  productType: FinanceProductType;
  expiresAt: string;
}

export interface DealVehicleSummary {
  stockId: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  derivative?: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  locationName: string;
  cashPrice: number;
  representativeMonthly: number;
  imageSrc: string;
  imageAlt: string;
  availability: VehicleAvailability;
}

export interface DealFinanceContext {
  hasProfile: boolean;
  expired: boolean;
  profile?: DealFinanceProfileInput;
}

export interface DealPageModel {
  status: "ready" | "not_found" | "expired";
  dealId: string;
  vehicle?: DealVehicleSummary;
  similar: Vehicle[];
  draft?: DealDraft;
  finance: DealFinanceContext;
  products: DealProductDefinition[];
  config: DealProviderConfig;
  contact: {
    telephone?: string;
    enquiryHref: string;
  };
}

export interface DealShareSnapshot {
  vehicle: {
    year: number;
    make: string;
    model: string;
    derivative?: string;
    cashPrice: number;
    locationName: string;
  };
  configuration: {
    financeType: FinanceProductType;
    term: number;
    annualMileage?: number;
    cashDeposit: number;
    productNames: string[];
  };
}

export interface DealCalculationInput {
  vehiclePrice: number;
  vehicleYear: number;
  vehicleMileage: number;
  /** Calendar year for OD3 age-at-term-end. Omit until the lender rule exists. */
  asOfYear?: number;
  representativeMonthly: number;
  cashDeposit: number;
  pxValue?: number;
  pxSettlement?: number;
  financeType: FinanceProductType;
  term: number;
  annualMileage?: number;
  productIds: string[];
}

export interface DealCalculation {
  cashDeposit: number;
  pxEquity: number;
  pxNegativeEquity: number;
  totalDeposit: number;
  productsTotal: number;
  financedProducts: number;
  cashProducts: number;
  amountFinanced: number;
  requiredAdvance: number;
  monthlyPayment: number;
  totalPayable: number;
  finalPayment?: number;
  valid: boolean;
  eligibility: "ok" | "advance_gap" | "constraint";
  advanceGap?: number;
  maximumAdvance?: number;
  constraints: DealConstraintMessage[];
  source: "mock";
}
