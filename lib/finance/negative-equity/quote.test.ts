import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_LTV,
  MIN_ADVANCE,
  PCP_GFV_MAX,
  type QuoteProduct,
} from "@/lib/finance/negative-equity/constants";
import {
  EMPTY_COVER,
  coverTotal,
  type CoverSelection,
} from "@/lib/finance/negative-equity/cover";
import { FIXTURE_CARS } from "@/lib/finance/negative-equity/fixtures";
import { offeredFixes } from "@/lib/finance/negative-equity/fixes";
import { estimateSettlement } from "@/lib/finance/negative-equity/settlement";
import { parseQuery } from "@/lib/finance/negative-equity/parse-query";
import {
  equityFrom,
  quoteFor,
  type EquityBreakdown,
  type NegEquityVehicle,
} from "@/lib/finance/negative-equity/quote";

const PRODUCTS: QuoteProduct[] = ["hp", "pcp"];
const COVER_SETS: CoverSelection[] = [
  EMPTY_COVER,
  { w: 3, s: 0, m: 0, g: 0 },
  { w: 0, s: 2, m: 0, g: 0 },
  { w: 0, s: 0, m: 1, g: 0 },
  { w: 0, s: 0, m: 0, g: 1 },
  { w: 3, s: 3, m: 3, g: 1 },
];
const DEPOSITS = [0, 500, 2_000, 5_000, 10_000];
const EQUITIES: EquityBreakdown[] = [
  equityFrom({ valuation: 8_000, settlement: 11_500 }),
  equityFrom({ valuation: 10_000, settlement: 10_000 }),
  equityFrom({ valuation: 12_000, settlement: 9_000 }),
  equityFrom({ valuation: 5_000, settlement: 18_000 }),
  equityFrom({ valuation: 4_000, settlement: 22_000 }),
  equityFrom({ valuation: 15_000, settlement: 3_000 }),
];

function assertFinite(n: number, label: string) {
  assert.ok(Number.isFinite(n), `${label} must be finite`);
}

describe("quoteFor gate consistency", () => {
  it("keeps gate, LTV, quote, blocked state and examples in agreement across scenarios", () => {
    let scenarios = 0;

    for (const car of FIXTURE_CARS) {
      for (const product of PRODUCTS) {
        for (const cover of COVER_SETS) {
          for (const deposit of DEPOSITS) {
            for (const equity of EQUITIES) {
              scenarios += 1;
              const coverAmount = coverTotal(car, cover);
              const q = quoteFor(car, product, coverAmount, deposit, equity);

              assertFinite(q.ltv, "ltv");
              assertFinite(q.borrow, "borrow");
              assertFinite(q.carAdvance, "carAdvance");
              assertFinite(q.monthlyTotal, "monthlyTotal");
              assertFinite(q.carMonthly, "carMonthly");
              assertFinite(q.settlementMonthly, "settlementMonthly");
              assertFinite(q.gfv, "gfv");

              const overLtv =
                q.carAdvance + q.settlementLoan > car.cashPrice * MAX_LTV;
              const tooSmall = q.carAdvance < MIN_ADVANCE;
              const pcpBad =
                product === "pcp" && q.gfv > q.carAdvance * PCP_GFV_MAX;

              if (overLtv) {
                assert.equal(q.reason, "ltv");
                assert.equal(q.ok, false);
              } else if (tooSmall) {
                assert.equal(q.reason, "small");
                assert.equal(q.ok, false);
              } else if (pcpBad) {
                assert.equal(q.reason, "pcp");
                assert.equal(q.ok, false);
              } else {
                assert.equal(q.reason, "ok");
                assert.equal(q.ok, true);
              }

              // No declined deal carries a payment.
              if (!q.ok) {
                assert.equal(q.carMonthly, 0);
                assert.equal(q.settlementMonthly, 0);
                assert.equal(q.monthlyTotal, 0);
              } else {
                assert.ok(q.monthlyTotal > 0 || q.carAdvance === 0);
                if (q.settlementLoan > 0) {
                  assert.ok(q.settlementMonthly > 0);
                }
                assert.ok(q.ltv <= MAX_LTV + 1e-9);
                assert.ok(q.carAdvance >= MIN_ADVANCE);
                if (product === "pcp") {
                  assert.ok(q.gfv <= q.carAdvance * PCP_GFV_MAX + 1e-9);
                }
              }

              // LTV denominator is car price excluding cover.
              assert.ok(
                Math.abs(q.ltv * car.cashPrice - q.borrow) < 0.01 ||
                  car.cashPrice === 0,
              );

              // Settlement term never longer than the car.
              assert.ok(q.settlementTerm <= q.term);
              assert.ok(q.settlementTerm <= 60);
            }
          }
        }
      }
    }

    // 20 cars × 2 products × 6 covers × 5 deposits × 6 equities = 7,200
    // Plus we run enough combinations to exceed the prototype's order of magnitude.
    assert.ok(
      scenarios >= 7_000,
      `expected thousands of scenarios, got ${scenarios}`,
    );
  });
});

describe("offeredFixes replay", () => {
  it("only offers fixes that land on a live ok quote when applied", () => {
    let replays = 0;

    const coverForCar = (car: NegEquityVehicle) =>
      coverTotal(car, { w: 3, s: 3, m: 3, g: 1 });

    for (const car of FIXTURE_CARS) {
      for (const product of PRODUCTS) {
        for (const deposit of [0, 500, 2_000, 8_000]) {
          for (const equity of EQUITIES) {
            const coverAmount = coverForCar(car);
            const q = quoteFor(car, product, coverAmount, deposit, equity);
            if (q.ok) continue;

            const fixes = offeredFixes(
              q,
              FIXTURE_CARS,
              coverAmount,
              deposit,
              equity,
              coverForCar,
            );

            for (const fix of fixes) {
              if (fix.kind === "human") continue;
              replays += 1;

              if (fix.kind === "deposit") {
                const next = quoteFor(
                  car,
                  product,
                  coverAmount,
                  fix.deposit ?? deposit,
                  equity,
                );
                assert.equal(next.ok, true, "deposit fix must land ok");
              }
              if (fix.kind === "remove-cover") {
                const next = quoteFor(car, product, 0, deposit, equity);
                assert.equal(next.ok, true, "remove-cover fix must land ok");
              }
              if (fix.kind === "switch-car" && fix.stockId) {
                const alt = FIXTURE_CARS.find((c) => c.id === fix.stockId);
                assert.ok(alt);
                const next = quoteFor(
                  alt!,
                  product,
                  coverForCar(alt!),
                  deposit,
                  equity,
                );
                assert.equal(next.ok, true, "switch-car fix must land ok");
              }
              if (fix.kind === "switch-hp") {
                const next = quoteFor(car, "hp", coverAmount, deposit, equity);
                assert.equal(next.ok, true, "switch-hp fix must land ok");
              }
            }
          }
        }
      }
    }

    assert.ok(
      replays >= 100,
      `expected many fix replays, got ${replays}`,
    );
  });
});

describe("settlement estimator", () => {
  it("overstates by rounding up to £50 and applying deferment", () => {
    const v = estimateSettlement(250, 36, 0);
    assert.ok(v !== null);
    assert.equal(v! % 50, 0);
    assert.ok(v! > 250 * 36 * 0.7);
  });

  it("returns null without monthly and remaining", () => {
    assert.equal(estimateSettlement(0, 36), null);
    assert.equal(estimateSettlement(250, 0), null);
  });
});

describe("parseQuery", () => {
  it("pulls budget, deposit, gearbox, fuel and body from plain English", () => {
    const q = parseQuery("automatic suv under £300 a month £2k deposit bmw");
    assert.equal(q.transmission, "Automatic");
    assert.equal(q.body, "SUV");
    assert.equal(q.budget, 300);
    assert.equal(q.deposit, 2000);
    assert.ok(q.tokens.includes("bmw"));
  });
});

describe("positive equity becomes a deposit", () => {
  it("adds positive equity into deposit and clears settlement loan", () => {
    const car = FIXTURE_CARS[10]!;
    const equity = equityFrom({ valuation: 12_000, settlement: 9_000 });
    const q = quoteFor(car, "hp", 0, 500, equity);
    assert.equal(q.settlementLoan, 0);
    assert.equal(q.deposit, 500 + 3_000);
  });
});
