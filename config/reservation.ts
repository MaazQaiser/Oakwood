/**
 * Admin/backend reservation commercial configuration.
 * 21 November 2026 spec: £49 card authorisation (never captured), 5-day hold.
 * Supersedes the prior £99 refundable capture / 48-hour hold model.
 * Do not copy these literals into product UI — import this config.
 */
export const reservationConfig = {
  amount: 49,
  currency: "GBP",
  holdDurationDays: 5,
  appliedToPurchase: true,
  immediateCapture: false,
  captureMode: "authorisation" as const,
  /** 1 = one active reservation per vehicle. Raise only when admin enables concurrency. */
  maxConcurrentReservations: 1,
  autoReleaseOnExpiry: true,
  mockWebhookDelayMs: 900,
  confirmationTimeoutMs: 12000,
} as const;