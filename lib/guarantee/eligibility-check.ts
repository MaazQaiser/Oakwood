import { guaranteeConfig } from "@/config/guarantee";
import {
  findHandoverByRegistration,
  normaliseRegistration,
} from "@/lib/guarantee/handovers";
import type { GuaranteeEligibilityResult } from "@/types/guarantee";

function daysSince(isoDate: string, now = Date.now()): number {
  const stamp = Date.parse(`${isoDate}T12:00:00`);
  if (!Number.isFinite(stamp)) {
    return Number.POSITIVE_INFINITY;
  }
  return Math.floor((now - stamp) / (24 * 60 * 60 * 1000));
}

export function checkGuaranteeEligibility(
  registration: string,
  now = Date.now(),
): GuaranteeEligibilityResult {
  const sale = findHandoverByRegistration(registration);
  if (!sale) {
    return {
      ok: false,
      reason: "unknown_registration",
      message:
        "We could not match that registration to an Oakwood sale. Check the plate, or ask your sales advisor to complete the form with you.",
    };
  }

  if (sale.saleType === "trade" || !sale.guaranteeEligible) {
    if (sale.saleType === "sold_as_seen") {
      return {
        ok: false,
        reason: "sold_as_seen",
        message:
          "This car was sold as seen, so the 30 Day Guarantee does not apply. Your statutory rights still stand.",
        sale,
      };
    }
    return {
      ok: false,
      reason: "trade",
      message:
        "This was a trade sale, so the 30 Day Guarantee does not apply. Your statutory rights still stand.",
      sale,
    };
  }

  const elapsed = daysSince(sale.handoverDateIso, now);
  if (elapsed > guaranteeConfig.periodDays) {
    return {
      ok: false,
      reason: "outside_period",
      message: `The guarantee period ended ${elapsed - guaranteeConfig.periodDays} day(s) ago. Handover was on ${sale.handoverDateIso}. Statutory rights still apply if the car has a fault.`,
      sale,
    };
  }

  let refundBlockedByPriorRefund = false;
  if (sale.previousGuaranteeRefundAtIso) {
    const sinceRefund = daysSince(sale.previousGuaranteeRefundAtIso, now);
    if (sinceRefund < guaranteeConfig.refundsPerCustomerMonths * 30) {
      refundBlockedByPriorRefund = true;
    }
  }

  return {
    ok: true,
    message: `Matched ${sale.year} ${sale.make} ${sale.model}, handed over ${sale.handoverDateIso} at ${sale.sellingSiteName}.`,
    sale,
    refundBlockedByPriorRefund,
  };
}

export { normaliseRegistration };
