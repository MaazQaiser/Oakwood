import { reservationConfig } from "@/config/reservation";
import type { MockPaymentOutcome } from "@/types/reservation";

/**
 * Stripe integration boundary.
 * No secret keys live here. Card data is never collected by Oakwood UI.
 * Replace MockStripeAdapter with the live Stripe PaymentIntent + webhook flow.
 */
export interface CreatePaymentIntentInput {
  reservationId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
  metadata: {
    stockId: string;
    location?: string;
    registration?: string;
    leadId?: string;
  };
  outcome: MockPaymentOutcome;
}

export interface PaymentIntentResult {
  paymentIntentId: string;
  /** Mock client secret. Never a Stripe secret key. */
  clientSecret: string;
  status: "requires_confirmation" | "processing" | "succeeded" | "failed";
  source: "mock";
}

export interface StripeWebhookEvent {
  type: "payment_intent.succeeded" | "payment_intent.payment_failed";
  paymentIntentId: string;
  reservationId: string;
}

export function createStripeAdapter() {
  return {
    provider: "stripe" as const,
    wallets: ["apple_pay", "google_pay", "card"] as const,
    sca: true,
    webhookIsSourceOfTruth: true,
    connected: false,
    amount: reservationConfig.amount,
    currency: reservationConfig.currency,
    immediateCapture: reservationConfig.immediateCapture,
  };
}

export function mockPaymentIntent(
  input: CreatePaymentIntentInput,
): PaymentIntentResult {
  const paymentIntentId = `pi_mock_${input.idempotencyKey.slice(0, 16)}`;
  if (input.outcome === "fail") {
    return {
      paymentIntentId,
      clientSecret: `cs_test_mock_${input.reservationId}`,
      status: "failed",
      source: "mock",
    };
  }
  return {
    paymentIntentId,
    clientSecret: `cs_test_mock_${input.reservationId}`,
    status:
      input.outcome === "pending" ? "processing" : "requires_confirmation",
    source: "mock",
  };
}
