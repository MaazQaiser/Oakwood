import { getMockValuation } from "@/lib/mock/vehicle-detail";
import { lookupPartExchangeVehicle } from "@/lib/part-exchange/lookup";
import { normaliseRegistration } from "@/lib/part-exchange/validation";
import type {
  DealPxCondition,
  DealPxExtraId,
  DealPxServiceHistory,
} from "@/types/deal";
import type { PxIdentifiedVehicle, PxLookupResult } from "@/types/part-exchange";

export type VeMockDeduction = { label: string; amount: number };

export type VeMockValuation = {
  estimatedValue: number;
  baseValue: number;
  deductions: VeMockDeduction[];
  valuationDate: string;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function mockLookupRegistration(
  registration: string,
): Promise<PxLookupResult> {
  await delay(900);
  return lookupPartExchangeVehicle(registration);
}

export function buildMockValuation(input: {
  registration: string;
  mileage: number;
  condition?: DealPxCondition;
  serviceHistory?: DealPxServiceHistory;
  extras?: DealPxExtraId[];
}): VeMockValuation {
  const cleaned = normaliseRegistration(input.registration);
  const baseValue = getMockValuation(cleaned, input.mileage);
  const deductions: VeMockDeduction[] = [];

  if (input.condition === "needs-work") {
    deductions.push({ label: "Condition adjustment", amount: -650 });
  } else if (input.condition === "average") {
    deductions.push({ label: "Condition adjustment", amount: -250 });
  } else if (input.condition === "excellent") {
    deductions.push({ label: "Immaculate condition", amount: 150 });
  }

  if (input.serviceHistory === "none") {
    deductions.push({ label: "No service history", amount: -400 });
  } else if (input.serviceHistory === "partial") {
    deductions.push({ label: "Partial service history", amount: -150 });
  }

  if (input.extras?.includes("known-damage")) {
    deductions.push({ label: "Known damage", amount: -500 });
  }
  if (input.extras?.includes("non-standard-modifications")) {
    deductions.push({ label: "Non-standard modifications", amount: -200 });
  }
  if (input.extras?.includes("full-service-history")) {
    deductions.push({ label: "Full service history confirmed", amount: 100 });
  }

  const adjustment = deductions.reduce((sum, row) => sum + row.amount, 0);
  const estimatedValue = Math.max(500, baseValue + adjustment);

  return {
    estimatedValue,
    baseValue,
    deductions,
    valuationDate: new Date().toISOString().slice(0, 10),
  };
}

export async function mockCalculateValuation(input: {
  registration: string;
  mileage: number;
  condition?: DealPxCondition;
  serviceHistory?: DealPxServiceHistory;
  extras?: DealPxExtraId[];
}): Promise<VeMockValuation> {
  await delay(1100);
  return buildMockValuation(input);
}

export function vehicleToDealVehicle(vehicle: PxIdentifiedVehicle) {
  return {
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    variant: vehicle.variant,
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
  };
}
