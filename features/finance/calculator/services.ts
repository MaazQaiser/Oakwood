import { calculateDeal } from "@/lib/deal/calculate";
import { formatPounds } from "@/lib/format/money";
import {
  CALCULATOR_COMBINATION_UNAVAILABLE,
  CALCULATOR_DEPOSIT_TOO_HIGH,
  CALCULATOR_DEPOSIT_TOO_LOW,
  CALCULATOR_INVALID_DEPOSIT,
  CALCULATOR_INVALID_MILEAGE,
  CALCULATOR_INVALID_PRICE,
  CALCULATOR_INVALID_TERM,
  CALCULATOR_VEHICLE_NOT_FINANCEABLE,
} from "@/lib/finance/calculator-copy";
import type {
  CalculatorFieldError,
  CalculatorVehicle,
  FinanceCalculatorRequest,
  FinanceCalculatorResult,
} from "@/features/finance/calculator/types";
import type { DealCalculationInput, DealConstraintMessage } from "@/types/deal";

function roundPounds(value: number): number {
  return Math.round(value);
}

function scaleRepresentativeMonthly(
  basis: CalculatorVehicle,
  vehiclePrice: number,
): number {
  const scale = vehiclePrice / Math.max(1, basis.cashPrice);
  return Math.max(1, roundPounds(basis.representativeMonthly * scale));
}

function toEngineInput(request: FinanceCalculatorRequest): DealCalculationInput | undefined {
  const basis = request.vehicle ?? request.exampleVehicle;
  if (!basis) {
    return undefined;
  }

  return {
    vehiclePrice: request.vehiclePrice,
    vehicleYear: basis.year,
    vehicleMileage: basis.mileage,
    representativeMonthly: scaleRepresentativeMonthly(basis, request.vehiclePrice),
    cashDeposit: request.cashDeposit,
    pxValue: request.px?.value,
    pxSettlement: request.px?.settlement,
    financeType: request.financeType,
    term: request.term,
    annualMileage:
      request.financeType === "pcp" ? request.annualMileage : undefined,
    productIds: [],
  };
}

function validateRequest(
  request: FinanceCalculatorRequest,
): CalculatorFieldError[] {
  const errors: CalculatorFieldError[] = [];
  const maxDeposit = Math.min(request.vehiclePrice, request.config.maxDepositCap);

  if (!Number.isFinite(request.vehiclePrice) || request.vehiclePrice < 1) {
    errors.push({ field: "vehiclePrice", message: CALCULATOR_INVALID_PRICE });
  }

  if (!Number.isFinite(request.cashDeposit)) {
    errors.push({ field: "deposit", message: CALCULATOR_INVALID_DEPOSIT });
  } else if (request.cashDeposit < request.config.minDeposit) {
    errors.push({ field: "deposit", message: CALCULATOR_DEPOSIT_TOO_LOW });
  } else if (
    Number.isFinite(request.vehiclePrice) &&
    request.vehiclePrice >= 1 &&
    request.cashDeposit > maxDeposit
  ) {
    errors.push({ field: "deposit", message: CALCULATOR_DEPOSIT_TOO_HIGH });
  }

  if (!request.config.termOptions.includes(request.term)) {
    errors.push({ field: "term", message: CALCULATOR_INVALID_TERM });
  }

  if (request.financeType === "pcp" && request.config.pcpEnabled) {
    if (
      request.annualMileage === undefined ||
      !request.config.pcpMileageOptions.includes(request.annualMileage)
    ) {
      errors.push({ field: "mileage", message: CALCULATOR_INVALID_MILEAGE });
    }
  }

  if (request.vehicle && !request.vehicle.financeable) {
    errors.push({
      field: "vehicle",
      message: CALCULATOR_VEHICLE_NOT_FINANCEABLE,
    });
  }

  return errors;
}

function presentConstraint(message: DealConstraintMessage): DealConstraintMessage {
  if (message.code === "max_advance" && message.depositGap) {
    return {
      ...message,
      title: `Your current deposit is ${formatPounds(message.depositGap)} short of the amount needed for this vehicle.`,
      body: "Increase your deposit, or browse cars within your budget. The term is not changed automatically.",
    };
  }

  if (
    message.code === "term_unavailable" ||
    message.code === "min_advance" ||
    message.code === "vehicle_age"
  ) {
    return {
      ...message,
      title: CALCULATOR_COMBINATION_UNAVAILABLE,
    };
  }

  return message;
}

/**
 * Single calculation boundary for the Finance Calculator.
 * Delegates to `calculateDeal` — do not add a second payment engine.
 */
export function calculateFinanceIllustration(
  request: FinanceCalculatorRequest,
): FinanceCalculatorResult {
  const fieldErrors = validateRequest(request);
  const notFinanceable = fieldErrors.some((error) => error.field === "vehicle");
  if (notFinanceable) {
    return {
      status: "not_financeable",
      constraints: [],
      fieldErrors,
    };
  }

  if (fieldErrors.length > 0) {
    return {
      status: "invalid",
      constraints: [],
      fieldErrors,
    };
  }

  const engineInput = toEngineInput(request);
  if (!engineInput) {
    return {
      status: "unavailable",
      constraints: [],
      fieldErrors: [],
    };
  }

  try {
    const calculation = calculateDeal(
      engineInput,
      request.profile,
      request.config,
    );
    const constraints = calculation.constraints.map(presentConstraint);

    if (!calculation.valid) {
      return {
        status: "constraint",
        calculation: { ...calculation, constraints },
        constraints,
        fieldErrors: [],
      };
    }

    return {
      status: "ok",
      calculation: { ...calculation, constraints },
      constraints,
      fieldErrors: [],
    };
  } catch {
    return {
      status: "unavailable",
      constraints: [],
      fieldErrors: [],
    };
  }
}
