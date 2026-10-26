"use client";

import { reservationCopy } from "@/lib/reservation/copy";

export function StripePaymentElement({
  wallets,
  connected,
  busy,
  onWallet,
}: {
  wallets: readonly string[];
  connected: boolean;
  busy?: boolean;
  onWallet: (wallet: "apple_pay" | "google_pay") => void;
}) {
  const apple = wallets.includes("apple_pay");
  const google = wallets.includes("google_pay");

  return (
    <div role="group" aria-label="Payment method" className="space-y-3">
      {apple ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onWallet("apple_pay")}
          className="flex min-h-14 w-full items-center justify-center rounded-[14px] bg-black px-4 text-body-sm font-semibold! text-white disabled:opacity-60"
        >
          Apple Pay
        </button>
      ) : null}
      {google ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => onWallet("google_pay")}
          className="flex min-h-14 w-full items-center justify-center rounded-[14px] border border-border bg-white px-4 text-body-sm font-semibold! text-ink disabled:opacity-60"
        >
          Google Pay
        </button>
      ) : null}
      <p className="text-center text-caption text-muted">Or pay by card</p>
      <div className="rounded-xl border border-dashed border-border-strong bg-page px-4 py-6 text-center">
        <p className="text-label text-navy">Card payment</p>
        <p className="mt-2 text-body-sm text-muted">
          {connected
            ? "Stripe Payment Element"
            : reservationCopy.cardFallback}
        </p>
      </div>
    </div>
  );
}
