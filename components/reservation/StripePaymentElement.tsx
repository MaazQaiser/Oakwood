"use client";

import { cn } from "@/lib/cn";

export function StripePaymentElement({
  wallets,
  connected,
}: {
  wallets: readonly string[];
  connected: boolean;
}) {
  const apple = wallets.includes("apple_pay");
  const google = wallets.includes("google_pay");

  return (
    <div
      className="rounded-lg border border-border bg-page p-4"
      role="group"
      aria-label="Payment method"
    >
      <p className="text-label">Pay by card</p>
      <p className="mt-1 text-body-sm text-muted">
        Card details are entered in Stripe&apos;s secure payment field. Oakwood
        never collects or stores card numbers.
      </p>
      <div
        className={cn(
          "mt-4 rounded-md border border-dashed border-border-strong bg-surface px-3 py-6 text-center text-body-sm text-muted",
        )}
      >
        {connected
          ? "Stripe Payment Element"
          : "Stripe Payment Element (mock). Live card fields appear when Stripe is connected."}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {apple ? (
          <span className="rounded-full border border-border px-3 py-2 text-caption text-muted">
            Apple Pay{connected ? "" : " — available when Stripe is connected"}
          </span>
        ) : null}
        {google ? (
          <span className="rounded-full border border-border px-3 py-2 text-caption text-muted">
            Google Pay{connected ? "" : " — available when Stripe is connected"}
          </span>
        ) : null}
      </div>
    </div>
  );
}
