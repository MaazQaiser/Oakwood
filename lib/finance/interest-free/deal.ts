import {
  isZeroTerm,
  MAX_ADVANCE,
  MIN_DEPOSIT_RATIO,
  REPRESENTATIVE_APR,
  TERM_STOPS,
  type TermStop,
} from "@/lib/finance/interest-free/constants";
import {
  ceilToNearest,
  contribution,
  guaranteedFutureValue,
  hpPayment,
  hpTerm,
  pcpPayment,
  pcpTerm,
  splitPayments,
} from "@/lib/finance/interest-free/math";
import {
  pricePackage,
  type InterestFreePackage,
} from "@/lib/finance/interest-free/package";
import { calculatePxEquity } from "@/lib/part-exchange/equity";

export interface InterestFreeVehicleInput {
  stockId: string;
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
  colour?: string;
  image?: string;
}

export interface InterestFreePxInput {
  value: number;
  settlement: number;
}

export interface DealFailures {
  overCap: number;
  underHalf: number;
  termTooLong: boolean;
}

export interface InterestFreeDeal {
  vehicle: InterestFreeVehicleInput;
  pkg: InterestFreePackage;
  total: number;
  cashDeposit: number;
  equity: number;
  shortfall: number;
  deposit: number;
  advance: number;
  term: number;
  qualifies: boolean;
  failures: DealFailures;
  /** Always labelled 0% APR on the interest free quote. */
  rateLabel: "0% APR";
  /** £0 when qualifies; otherwise HP charge net of Oakwood contribution. */
  charge: number;
  contribution: number;
  monthly: number;
  regular: number;
  finalPayment: number;
  totalPayable: number;
  showRepresentativeExample: boolean;
  showApply: boolean;
}

export interface ComparisonProduct {
  name: "Interest free" | "Hire Purchase" | "PCP";
  monthly: number;
  deposit: number;
  contribution: number;
  term: number;
  rateLabel: string;
  charge: number;
  totalPayable: number;
  packageIncluded: boolean;
  packageTotal: number;
  withoutPackage?: { monthly: number; totalPayable: number };
  gfv?: number;
  termCapped: boolean;
  best: boolean;
}

function totalsFor(
  vehicle: InterestFreeVehicleInput,
  cashDeposit: number,
  px?: InterestFreePxInput | null,
) {
  const pkg = pricePackage(vehicle);
  const total = vehicle.cashPrice + pkg.total;
  const { equity, shortfall } = calculatePxEquity(
    px?.value ?? 0,
    px?.settlement ?? 0,
  );
  const deposit = Math.max(0, cashDeposit) + equity;
  const advance = total - deposit + shortfall;
  return { pkg, total, equity, shortfall, deposit, advance };
}

/**
 * Minimum cash deposit for a car so the deal can qualify at a zero term.
 * Shared by the calculator, picker badges and qualifying stock list.
 */
export function minCashDeposit(
  vehicle: InterestFreeVehicleInput,
  px?: InterestFreePxInput | null,
): number {
  const { total, equity, shortfall } = totalsFor(vehicle, 0, px);
  const needed = Math.max(total + shortfall - MAX_ADVANCE, total * MIN_DEPOSIT_RATIO);
  return Math.max(0, ceilToNearest(needed - equity, 50));
}

export function needDepositTotal(vehicle: InterestFreeVehicleInput): number {
  const pkg = pricePackage(vehicle);
  const total = vehicle.cashPrice + pkg.total;
  return Math.max(total - MAX_ADVANCE, total * MIN_DEPOSIT_RATIO);
}

function netChargeForAdvance(
  advance: number,
  term: number,
  vehicle: InterestFreeVehicleInput,
): { charge: number; contribution: number; cappedTerm: number } {
  const contrib = contribution(advance);
  if (advance <= 0) {
    return { charge: 0, contribution: contrib, cappedTerm: term };
  }
  const cappedTerm = Math.min(term, hpTerm(vehicle));
  const credit = Math.max(0, advance);
  const monthly = hpPayment(credit, cappedTerm);
  const grossCharge = monthly * cappedTerm - credit;
  const charge = Math.max(0, grossCharge - contrib);
  return { charge, contribution: contrib, cappedTerm };
}

export function buildDeal({
  vehicle,
  cashDeposit,
  px,
  term,
}: {
  vehicle: InterestFreeVehicleInput;
  cashDeposit: number;
  px?: InterestFreePxInput | null;
  term: number;
}): InterestFreeDeal {
  const safeTerm = (TERM_STOPS as readonly number[]).includes(term)
    ? term
    : 18;
  const { pkg, total, equity, shortfall, deposit, advance } = totalsFor(
    vehicle,
    cashDeposit,
    px,
  );

  const overCap = Math.max(0, advance - MAX_ADVANCE);
  const underHalf = Math.max(0, total * MIN_DEPOSIT_RATIO - deposit);
  const termTooLong = !isZeroTerm(safeTerm);
  const qualifies =
    advance <= MAX_ADVANCE &&
    deposit >= total * MIN_DEPOSIT_RATIO &&
    advance > 0 &&
    isZeroTerm(safeTerm);

  const failures: DealFailures = { overCap, underHalf, termTooLong };

  let charge = 0;
  let contrib = contribution(advance);
  if (!qualifies && advance > 0) {
    const net = netChargeForAdvance(advance, safeTerm, vehicle);
    charge = net.charge;
    contrib = net.contribution;
  } else if (advance <= 0) {
    charge = 0;
  }

  const principal = Math.max(0, advance) + charge;
  const { regular, finalPayment, monthly } = splitPayments(
    principal,
    safeTerm,
  );

  return {
    vehicle,
    pkg,
    total,
    cashDeposit: Math.max(0, cashDeposit),
    equity,
    shortfall,
    deposit,
    advance,
    term: safeTerm,
    qualifies,
    failures,
    rateLabel: "0% APR",
    charge,
    contribution: contrib,
    monthly,
    regular,
    finalPayment,
    totalPayable: deposit + principal,
    showRepresentativeExample: qualifies,
    showApply: qualifies,
  };
}

export function buildComparison({
  vehicle,
  cashDeposit,
  px,
  term,
  annualMiles,
}: {
  vehicle: InterestFreeVehicleInput;
  cashDeposit: number;
  px?: InterestFreePxInput | null;
  term: number;
  annualMiles: number;
}): ComparisonProduct[] {
  const deal = buildDeal({ vehicle, cashDeposit, px, term });
  const rows: ComparisonProduct[] = [];

  rows.push({
    name: "Interest free",
    monthly: deal.monthly,
    deposit: deal.deposit,
    contribution: 0,
    term: deal.term,
    rateLabel: "0% APR",
    charge: deal.charge,
    totalPayable: deal.totalPayable,
    packageIncluded: true,
    packageTotal: deal.pkg.total,
    best: deal.qualifies,
    termCapped: false,
  });

  const contrib = contribution(deal.advance);
  const effDep = deal.deposit + contrib;
  const hpN = hpTerm(vehicle);
  const hpCredit = Math.max(500, deal.total - effDep);
  const hpM = hpPayment(hpCredit, hpN);
  const hpNoPkgCredit = Math.max(500, vehicle.cashPrice - effDep);
  const hpNoPkgM = hpPayment(hpNoPkgCredit, hpN);

  rows.push({
    name: "Hire Purchase",
    monthly: hpM,
    deposit: deal.deposit,
    contribution: contrib,
    term: hpN,
    rateLabel: `${(REPRESENTATIVE_APR * 100).toFixed(1)}% APR`,
    charge: hpM * hpN + deal.deposit - deal.total,
    totalPayable: hpM * hpN + deal.deposit,
    packageIncluded: true,
    packageTotal: deal.pkg.total,
    withoutPackage: {
      monthly: hpNoPkgM,
      totalPayable: hpNoPkgM * hpN + deal.deposit,
    },
    termCapped: hpN < 84,
    best: false,
  });

  const pN = pcpTerm(vehicle);
  const gfv = guaranteedFutureValue(vehicle, pN, annualMiles);
  const pM = pcpPayment(hpCredit, pN, gfv);
  const pNoPkgM = pcpPayment(hpNoPkgCredit, pN, gfv);

  rows.push({
    name: "PCP",
    monthly: pM,
    deposit: deal.deposit,
    contribution: contrib,
    term: pN,
    rateLabel: `${(REPRESENTATIVE_APR * 100).toFixed(1)}% APR`,
    charge: pM * pN + deal.deposit + gfv - deal.total,
    totalPayable: pM * pN + deal.deposit + gfv,
    packageIncluded: true,
    packageTotal: deal.pkg.total,
    withoutPackage: {
      monthly: pNoPkgM,
      totalPayable: pNoPkgM * pN + deal.deposit + gfv,
    },
    gfv,
    termCapped: pN < 60,
    best: false,
  });

  return rows;
}

export function monthlyForVehicle(
  vehicle: InterestFreeVehicleInput,
  cashDeposit: number,
  px: InterestFreePxInput | null | undefined,
  term: number,
): { monthly: number; qualifies: boolean; term: number; charge: number } {
  const deal = buildDeal({ vehicle, cashDeposit, px, term });
  return {
    monthly: deal.monthly,
    qualifies: deal.qualifies,
    term: deal.term,
    charge: deal.charge,
  };
}

export function qualifiesAtDeposit(
  vehicle: InterestFreeVehicleInput,
  totalDeposit: number,
): boolean {
  const need = needDepositTotal(vehicle);
  return totalDeposit >= need;
}

export type { TermStop };
