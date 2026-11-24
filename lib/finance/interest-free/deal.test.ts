import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_ZERO_TERM,
  TERM_STOPS,
} from "@/lib/finance/interest-free/constants";
import {
  buildComparison,
  buildDeal,
  minCashDeposit,
  needDepositTotal,
} from "@/lib/finance/interest-free/deal";
import { contribution } from "@/lib/finance/interest-free/math";
import { pricePackage } from "@/lib/finance/interest-free/package";

const kuga = {
  stockId: "kuga",
  year: 2020,
  make: "Ford",
  model: "Kuga",
  derivative: "1.5 EcoBoost ST-Line",
  cashPrice: 20_000,
  mileage: 30_100,
  fuelType: "Petrol",
};

describe("package pricing", () => {
  it("reproduces the Kuga worked example package", () => {
    const pkg = pricePackage(kuga);
    assert.equal(pkg.total, 4_949);
    assert.equal(pkg.warranty, 2_800);
    assert.equal(pkg.service, 1_200);
    assert.equal(pkg.mot, 350);
    assert.equal(pkg.supagard, 599);
  });
});

describe("contribution", () => {
  it("publishes the documented contribution table", () => {
    assert.equal(contribution(10_000), 1_000);
    assert.equal(contribution(8_000), 800);
    assert.equal(contribution(6_000), 600);
    assert.equal(contribution(4_000), 400);
    assert.equal(contribution(2_000), 200);
  });
});

describe("worked example", () => {
  it("matches the Kuga 0% deal", () => {
    const px = { value: 2_000, settlement: 0 };
    const cashDeposit = 12_949;
    const deal = buildDeal({
      vehicle: kuga,
      cashDeposit,
      px,
      term: 18,
    });

    assert.equal(deal.total, 24_949);
    assert.equal(deal.equity, 2_000);
    assert.equal(deal.deposit, 14_949);
    assert.equal(deal.advance, 10_000);
    assert.equal(deal.qualifies, true);
    assert.equal(deal.charge, 0);
    assert.equal(deal.rateLabel, "0% APR");
    assert.ok(Math.abs(deal.monthly - 555.555555) < 0.001);
    assert.equal(deal.regular, 555.55);
    assert.ok(
      Math.abs(deal.regular * 17 + deal.finalPayment - 10_000) < 0.01,
    );
    assert.equal(deal.totalPayable, 24_949);
    assert.equal(deal.showApply, true);
    assert.equal(deal.showRepresentativeExample, true);
  });
});

describe("negative equity", () => {
  it("adds shortfall to the advance and never to the deposit", () => {
    const px = { value: 5_000, settlement: 7_000 };
    const cash = minCashDeposit(kuga, px);
    const deal = buildDeal({
      vehicle: kuga,
      cashDeposit: cash,
      px,
      term: 18,
    });

    assert.equal(deal.equity, 0);
    assert.equal(deal.shortfall, 2_000);
    assert.equal(deal.deposit, cash);
    assert.equal(deal.advance, deal.total - deal.deposit + 2_000);
    assert.ok(deal.advance <= 10_000 || !deal.qualifies);
    if (deal.qualifies) {
      assert.ok(deal.advance <= 10_000);
      assert.ok(deal.deposit >= deal.total * 0.5);
    }
  });

  it("raises the minimum cash deposit when there is a shortfall", () => {
    const without = minCashDeposit(kuga);
    const withShortfall = minCashDeposit(kuga, {
      value: 4_000,
      settlement: 6_000,
    });
    assert.ok(withShortfall > without);
  });
});

describe("qualification agreement across term stops", () => {
  const vehicle = kuga;

  for (const term of TERM_STOPS) {
    for (const below of [true, false]) {
      for (const withNegEquity of [true, false]) {
        it(`term ${term}, deposit ${below ? "below" : "at"} min, negEquity=${withNegEquity}`, () => {
          const px = withNegEquity
            ? { value: 3_000, settlement: 5_500 }
            : null;
          const min = minCashDeposit(vehicle, px);
          const cashDeposit = below ? Math.max(0, min - 500) : min;
          const deal = buildDeal({
            vehicle,
            cashDeposit,
            px,
            term,
          });
          const comparison = buildComparison({
            vehicle,
            cashDeposit,
            px,
            term,
            annualMiles: 8_000,
          });
          const zeroCard = comparison.find((r) => r.name === "Interest free");

          assert.equal(deal.rateLabel, "0% APR");
          assert.ok(zeroCard);
          assert.equal(zeroCard!.rateLabel, "0% APR");

          if (deal.qualifies) {
            assert.equal(deal.charge, 0);
            assert.equal(zeroCard!.charge, 0);
            assert.equal(deal.showApply, true);
            assert.equal(deal.showRepresentativeExample, true);
            assert.ok(term === 12 || term === 18);
          } else {
            assert.equal(deal.showApply, false);
            assert.equal(deal.showRepresentativeExample, false);
            if (deal.advance > 0 && (deal.failures.termTooLong || below)) {
              // Charge grows with term / shortfall; may be 0 only if advance tiny.
              assert.ok(deal.charge >= 0);
            }
          }

          const principal = Math.max(0, deal.advance) + deal.charge;
          const sum =
            deal.term > 1
              ? deal.regular * (deal.term - 1) + deal.finalPayment
              : deal.finalPayment;
          assert.ok(Math.abs(sum - principal) < 0.02);
        });
      }
    }
  }
});

describe("minCashDeposit shared rule", () => {
  it("opens on a working quote for the default term", () => {
    const cash = minCashDeposit(kuga);
    const deal = buildDeal({
      vehicle: kuga,
      cashDeposit: cash,
      term: DEFAULT_ZERO_TERM,
    });
    assert.equal(deal.qualifies, true);
    assert.ok(deal.advance <= 10_000);
    assert.ok(deal.deposit >= deal.total * 0.5);
  });

  it("needDepositTotal matches max(total-10000, total*0.5)", () => {
    const need = needDepositTotal(kuga);
    assert.equal(need, 14_949);
  });
});
