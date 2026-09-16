import {
  PX_LOOKUP_FAILED,
  PX_NOT_ELIGIBLE,
  PX_VALUATION_UNAVAILABLE,
} from "@/lib/part-exchange/copy";
import { normaliseRegistration } from "@/lib/part-exchange/validation";
import type {
  PxIdentifiedVehicle,
  PxLookupResult,
} from "@/types/part-exchange";

/**
 * Mock registration lookup. The live vehicle-lookup-api integration is not
 * connected (see lib/api/integrations.ts).
 */
const KNOWN: Record<string, Omit<PxIdentifiedVehicle, "source">> = {
  AB21CDE: {
    year: 2019,
    make: "Audi",
    model: "A3",
    variant: "1.5 TFSI Sport",
    fuelType: "Petrol",
    transmission: "Automatic",
  },
  OLD99AA: {
    year: 2004,
    make: "Ford",
    model: "Ka",
    variant: "1.3 Collection",
    fuelType: "Petrol",
    transmission: "Manual",
  },
};

const CATALOGUE: Omit<PxIdentifiedVehicle, "source">[] = [
  {
    year: 2018,
    make: "Ford",
    model: "Focus",
    variant: "1.0 EcoBoost Zetec",
    fuelType: "Petrol",
    transmission: "Manual",
  },
  {
    year: 2020,
    make: "Volkswagen",
    model: "Golf",
    variant: "1.5 TSI Match",
    fuelType: "Petrol",
    transmission: "Automatic",
  },
  {
    year: 2017,
    make: "BMW",
    model: "1 Series",
    variant: "118d Sport",
    fuelType: "Diesel",
    transmission: "Automatic",
  },
  {
    year: 2021,
    make: "Toyota",
    model: "Yaris",
    variant: "1.5 Hybrid Design",
    fuelType: "Hybrid",
    transmission: "Automatic",
  },
  {
    year: 2019,
    make: "Nissan",
    model: "Qashqai",
    variant: "1.3 DIG-T Acenta",
    fuelType: "Petrol",
    transmission: "Manual",
  },
];

function hashRegistration(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 997;
  }
  return hash;
}

export function lookupPartExchangeVehicle(registration: string): PxLookupResult {
  const cleaned = normaliseRegistration(registration);

  if (cleaned === "FAIL" || cleaned === "UNKNOWN" || cleaned === "TIMEOUT") {
    return {
      ok: false,
      reason: "unavailable",
      message: PX_VALUATION_UNAVAILABLE,
    };
  }

  if (cleaned === "ZZ99ZZZ" || cleaned === "NOTFOUND") {
    return {
      ok: false,
      reason: "not_found",
      message: PX_LOOKUP_FAILED,
    };
  }

  if (cleaned === "OLD99AA") {
    return {
      ok: false,
      reason: "ineligible",
      message: PX_NOT_ELIGIBLE,
    };
  }

  const known = KNOWN[cleaned];
  if (known) {
    return { ok: true, vehicle: { ...known, source: "lookup" } };
  }

  const sample = CATALOGUE[hashRegistration(cleaned) % CATALOGUE.length];
  return {
    ok: true,
    vehicle: { ...sample, source: "lookup" },
  };
}
