import {
  CAR_APR,
  MAX_LTV,
  MIN_ADVANCE,
  PCP_ANNUAL_MILES,
  PCP_GFV_MAX,
  SETTLEMENT_APR,
  SETTLEMENT_TERM_CAP,
  type QuoteProduct,
  type QuoteReason,
} from "@/lib/finance/negative-equity/constants";
import {
  carPayment,
  guaranteedFutureValue,
  hpPayment,
  maxTermMonths,
} from "@/lib/finance/negative-equity/math";

export interface NegEquityVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  derivative?: string;
  cashPrice: number;
  mileage: number;
  fuelType: string;
  transmission?: string;
  bodyStyle?: string;
  locationName?: string;
  image?: string;
  slug?: string;
}

export interface EquityInput {
  valuation: number;
  settlement: number;
}

export interface EquityBreakdown {
  valuation: number;
  settlement: number;
  negative: number;
  positive: number;
  known: boolean;
}

export function equityFrom(input: EquityInput | null | undefined): EquityBreakdown {
  if (!input || !(input.settlement > 0) || !(input.valuation >= 0)) {
    return {
      valuation: 0,
      settlement: 0,
      negative: 0,
      positive: 0,
      known: false,
    };
  }
  return {
    valuation: input.valuation,
    settlement: input.settlement,
    negative: Math.max(0, input.settlement - input.valuation),
    positive: Math.max(0, input.valuation - input.settlement),
    known: true,
  };
}

export interface QuoteResult {
  vehicle: NegEquityVehicle;
  equity: EquityBreakdown;
  cover: number;
  total: number;
  deposit: number;
  carAdvance: number;
  settlementLoan: number;
  term: number;
  settlementTerm: number;
  gfv: number;
  carMonthly: number;
  settlementMonthly: number;
  monthlyTotal: number;
  borrow: number;
  ltv: number;
  reason: QuoteReason;
  ok: boolean;
  product: QuoteProduct;
}

/**
 * One gate. Every component reads `reason` rather than deciding for itself,
 * so the bar, the quote, the blocked state and both examples cannot disagree.
 */
export function quoteFor(
  vehicle: NegEquityVehicle,
  product: QuoteProduct,
  cover: number,
  cashDeposit: number,
  equity: EquityBreakdown,
): QuoteResult {
  const total = vehicle.cashPrice + cover;
  const deposit = Math.max(0, cashDeposit) + equity.positive;
  const carAdvance = Math.max(0, total - deposit);
  const settlementLoan = equity.negative;
  const term =
    product === "pcp"
      ? Math.min(60, maxTermMonths(vehicle))
      : maxTermMonths(vehicle);
  const settlementTerm = Math.min(SETTLEMENT_TERM_CAP, term);
  const gfv =
    product === "pcp"
      ? guaranteedFutureValue(vehicle, term, PCP_ANNUAL_MILES)
      : 0;

  let reason: QuoteReason = "ok";
  if (carAdvance + settlementLoan > vehicle.cashPrice * MAX_LTV) {
    reason = "ltv";
  } else if (carAdvance < MIN_ADVANCE) {
    reason = "small";
  } else if (product === "pcp" && gfv > carAdvance * PCP_GFV_MAX) {
    reason = "pcp";
  }

  const ok = reason === "ok";
  const carMonthly = ok
    ? carPayment(product, carAdvance, term, gfv, CAR_APR)
    : 0;
  const settlementMonthly =
    ok && settlementLoan > 0
      ? hpPayment(settlementLoan, settlementTerm, SETTLEMENT_APR)
      : 0;
  const borrow = carAdvance + settlementLoan;
  const ltv = vehicle.cashPrice ? borrow / vehicle.cashPrice : 0;

  return {
    vehicle,
    equity,
    cover,
    total,
    deposit,
    carAdvance,
    settlementLoan,
    term,
    settlementTerm,
    gfv,
    carMonthly,
    settlementMonthly,
    monthlyTotal: carMonthly + settlementMonthly,
    borrow,
    ltv,
    reason,
    ok,
    product,
  };
}

export function countFittingCars(
  cars: NegEquityVehicle[],
  product: QuoteProduct,
  coverForCar: (car: NegEquityVehicle) => number,
  cashDeposit: number,
  equity: EquityBreakdown,
): number {
  if (!equity.known || equity.negative <= 0) return 0;
  let n = 0;
  for (const car of cars) {
    if (quoteFor(car, product, coverForCar(car), cashDeposit, equity).ok) {
      n += 1;
    }
  }
  return n;
}
