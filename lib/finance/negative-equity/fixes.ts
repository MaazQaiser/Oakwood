import {
  MAX_LTV,
  MIN_ADVANCE,
  type QuoteProduct,
} from "@/lib/finance/negative-equity/constants";
import { ceilToNearest } from "@/lib/finance/negative-equity/math";
import { money } from "@/lib/finance/negative-equity/math";
import {
  quoteFor,
  type EquityBreakdown,
  type NegEquityVehicle,
  type QuoteResult,
} from "@/lib/finance/negative-equity/quote";

export type FixKind =
  | "deposit"
  | "remove-cover"
  | "switch-car"
  | "switch-hp"
  | "human";

export interface SuggestedFix {
  kind: FixKind;
  label: string;
  hint: string;
  /** Absolute deposit to apply when kind is deposit. */
  deposit?: number;
  /** Target stock id when kind is switch-car. */
  stockId?: string;
}

/**
 * A fix is only offered once it has been run through quoteFor and come back
 * ok. No button promises an outcome the quote will not produce.
 */
export function offeredFixes(
  quote: QuoteResult,
  cars: NegEquityVehicle[],
  coverTotal: number,
  cashDeposit: number,
  equity: EquityBreakdown,
  coverForCar: (car: NegEquityVehicle) => number,
): SuggestedFix[] {
  if (quote.ok) return [];

  const fixes: SuggestedFix[] = [];
  const vehicle = quote.vehicle;
  const product = quote.product;

  function offer(ok: boolean, fix: SuggestedFix) {
    if (ok) fixes.push(fix);
  }

  if (quote.reason === "ltv") {
    const need = ceilToNearest(quote.borrow - vehicle.cashPrice * MAX_LTV, 50);
    const nextDeposit = cashDeposit + need;
    offer(
      need > 0 &&
        nextDeposit <= quote.total &&
        quoteFor(vehicle, product, coverTotal, nextDeposit, equity).ok,
      {
        kind: "deposit",
        label: `Put in ${money(need)} more deposit`,
        hint: "brings it inside 150%",
        deposit: nextDeposit,
      },
    );
    offer(
      coverTotal > 0 &&
        quoteFor(vehicle, product, 0, cashDeposit, equity).ok,
      {
        kind: "remove-cover",
        label: "Take the cover off",
        hint: money(coverTotal),
      },
    );
    const alt = bestAlt(vehicle, product, cashDeposit, equity, cars, coverForCar);
    if (alt) {
      offer(true, {
        kind: "switch-car",
        label: `Try the ${alt.make} ${alt.model} instead`,
        hint: money(alt.cashPrice),
        stockId: alt.id,
      });
    }
  }

  if (quote.reason === "small") {
    const cut = ceilToNearest(MIN_ADVANCE - quote.carAdvance, 50);
    const nextDeposit = Math.max(0, cashDeposit - cut);
    offer(
      cut > 0 &&
        cashDeposit >= cut &&
        quoteFor(vehicle, product, coverTotal, nextDeposit, equity).ok,
      {
        kind: "deposit",
        label: `Keep ${money(cut)} of your deposit back`,
        hint: "makes it financeable",
        deposit: nextDeposit,
      },
    );
    const up = bestAlt(vehicle, product, cashDeposit, equity, cars, coverForCar);
    if (up) {
      offer(true, {
        kind: "switch-car",
        label: `Look at the ${up.make} ${up.model}`,
        hint: money(up.cashPrice),
        stockId: up.id,
      });
    }
  }

  if (quote.reason === "pcp") {
    offer(quoteFor(vehicle, "hp", coverTotal, cashDeposit, equity).ok, {
      kind: "switch-hp",
      label: "Switch to Hire Purchase",
      hint: `${quote.term} months`,
    });
  }

  fixes.push({
    kind: "human",
    label: "Ask us to look at it anyway",
    hint: "no credit search",
  });

  return fixes;
}

export function bestAlt(
  current: NegEquityVehicle,
  product: QuoteProduct,
  cashDeposit: number,
  equity: EquityBreakdown,
  cars: NegEquityVehicle[],
  coverForCar: (car: NegEquityVehicle) => number,
): NegEquityVehicle | null {
  let best: NegEquityVehicle | null = null;
  let bestDelta = Infinity;
  for (const candidate of cars) {
    if (candidate.id === current.id) continue;
    if (
      !quoteFor(
        candidate,
        product,
        coverForCar(candidate),
        cashDeposit,
        equity,
      ).ok
    ) {
      continue;
    }
    const delta = Math.abs(candidate.cashPrice - current.cashPrice);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = candidate;
    }
  }
  return best;
}

export function blockedBody(quote: QuoteResult): string[] {
  const paragraphs: string[] = [];
  const { vehicle: c, equity: e } = quote;

  if (quote.reason === "ltv") {
    paragraphs.push(
      `Together the two agreements come to ${money(quote.borrow)} against a ${money(c.cashPrice)} car, which is ${(quote.ltv * 100).toFixed(0)}% of its value. We can usually go to 150%.`,
    );
    if (quote.settlementLoan > c.cashPrice * MAX_LTV) {
      paragraphs.push(
        `Your ${money(quote.settlementLoan)} is already more than 150% of this car on its own, so no deposit will fix it. A dearer car can actually help here, because the limit is a share of what the car is worth.`,
      );
    }
  }

  if (quote.reason === "small") {
    paragraphs.push(
      `Your deposit${e.positive > 0 ? " and equity" : ""} covers all but ${money(quote.carAdvance)} of the car. Lenders will not write an agreement that small.`,
    );
    paragraphs.push(
      quote.settlementLoan > 0
        ? "Put less in, so there is something to finance, or pay the car outright and take the settlement loan on its own."
        : "Pay the balance and the car is yours. There is nothing here worth paying interest on.",
    );
  }

  if (quote.reason === "pcp") {
    paragraphs.push(
      `On PCP part of the car is deferred to a final payment. Here that would be ${money(quote.gfv)} against a ${money(quote.carAdvance)} advance, which leaves almost nothing to spread. Hire Purchase is the cheaper product for you on this deal.`,
    );
  }

  return paragraphs;
}
