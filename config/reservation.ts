import type { RefundReasonCode } from "@/types/reservation";

/**
 * Admin/backend reservation commercial configuration.
 * Customer Deal Builder spec (Step 6): £99, 48-hour hold, fully refundable,
 * applied to purchase. Supersedes the Addendum 1 defaults (£49, 7-day hold).
 * Do not copy these literals into product UI — import this config.
 */
export const reservationConfig = {
  amount: 99,
  currency: "GBP",
  /** 2 days = the 48-hour hold; formatHoldPeriod shows short holds in hours. */
  holdDurationDays: 2,
  /**
   * Refund window is admin-configurable. Until an admin value is supplied,
   * it matches the hold duration. Do not treat this as a legal invention.
   */
  refundWindowDays: 2,
  refundable: true,
  appliedToPurchase: true,
  immediateCapture: true,
  /** 1 = one active reservation per vehicle. Raise only when admin enables concurrency. */
  maxConcurrentReservations: 1,
  automaticRefundOnExpiry: true,
  sameDayRefundOnFinanceUnavailable: true,
  sameDayRefundOnVehicleUnavailable: true,
  releaseStockOnRefundRequest: true,
  mockWebhookDelayMs: 900,
  confirmationTimeoutMs: 12000,
} as const;

export const refundReasonOptions: ReadonlyArray<{
  code: RefundReasonCode;
  label: string;
}> = [
  { code: "cheaper_elsewhere", label: "Cheaper elsewhere" },
  { code: "finance_elsewhere", label: "Finance elsewhere" },
  { code: "changed_mind", label: "Changed my mind" },
  { code: "unable_to_attend", label: "Unable to attend" },
  { code: "px_offer_too_low", label: "Part-exchange offer too low" },
  { code: "other", label: "Other" },
];
