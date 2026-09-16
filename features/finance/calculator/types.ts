import type { DealProviderConfig } from "@/lib/deal/provider-config";
import type { FinanceCalculatorConfig } from "@/lib/finance/calculator-config";
import type {
  DealCalculation,
  DealConstraintMessage,
  DealFinanceProfileInput,
  DealPartExchangeInput,
} from "@/types/deal";
import type { FinanceProductType } from "@/types/finance";
import type { VehicleAvailability } from "@/types/vehicle";

export type CalculatorField =
  | "vehiclePrice"
  | "deposit"
  | "term"
  | "mileage"
  | "vehicle"
  | "profile";

export interface CalculatorFieldError {
  field: CalculatorField;
  message: string;
}

export interface CalculatorVehicle {
  stockId: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  derivative?: string;
  mileage: number;
  cashPrice: number;
  representativeMonthly: number;
  imageSrc: string;
  imageAlt: string;
  availability: VehicleAvailability;
  financeable: boolean;
}

export interface CalculatorFinanceContext {
  hasProfile: boolean;
  expired: boolean;
  unavailable: boolean;
  suggestedDeposit?: number;
  profile?: DealFinanceProfileInput;
}

export interface CalculatorPageModel {
  vehicle?: CalculatorVehicle;
  exampleVehicle?: CalculatorVehicle;
  px?: DealPartExchangeInput;
  finance: CalculatorFinanceContext;
  config: FinanceCalculatorConfig;
}

export interface FinanceCalculatorRequest {
  vehiclePrice: number;
  cashDeposit: number;
  financeType: FinanceProductType;
  term: number;
  annualMileage?: number;
  vehicle?: CalculatorVehicle;
  exampleVehicle?: CalculatorVehicle;
  px?: DealPartExchangeInput;
  profile?: DealFinanceProfileInput;
  config: DealProviderConfig;
}

export type FinanceCalculatorStatus =
  | "ok"
  | "invalid"
  | "constraint"
  | "unavailable"
  | "not_financeable";

export interface FinanceCalculatorResult {
  status: FinanceCalculatorStatus;
  calculation?: DealCalculation;
  constraints: DealConstraintMessage[];
  fieldErrors: CalculatorFieldError[];
}

export interface CalculatorDraft {
  vehiclePrice: number;
  cashDeposit: number;
  financeType: FinanceProductType;
  term: number;
  annualMileage: number;
  px?: DealPartExchangeInput;
}
